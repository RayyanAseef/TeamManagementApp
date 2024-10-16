const express = require('express');
const router = express.Router();

const { Requests, Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res) => {
    try {
        const post = req.body;
        await Requests.create(post);
        res.status(200).json("Request Added");
    } catch (err) {
        res.status(500).json("Unable to add Request");
    }
});

// Get all of the rows in the table
router.get('/', async (req, res) => {
    try {
        const listOfRequests = await Requests.findAll({
            attributes: {
                exclude: ['requestTo', 'requestBy', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Workers,
                    as: 'requestee',
                    attributes: ['id', 'name']
                },
                {
                    model: Workers,
                    as: 'requested',
                    attributes: ['id', 'name']
                }
            ]
        });
        res.status(200).json(listOfRequests);
    } catch (err) {
        res.status(500).json("Couldn't Retrieve Requests");
    }
});

// Get one of the rows in the table
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Requests.findOne({ where: { id: id } });
        if (!request) {
            return res.status(404).json(`Request with id: ${id} not found`);
        }
        res.status(200).json(request);
    } catch (err) {
        res.status(500).json(`Couldn't Retrieve Request with id: ${id}`);
    }
});

// Delete one of the rows in the table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Requests.findOne({ where: { id: id } });
        if (!request) {
            return res.status(404).json(`Request with id: ${id} not found`);
        }

        await Requests.destroy({ where: { id: id } });
        const listOfRequests = await Requests.findAll();
        res.status(200).json(listOfRequests);
    } catch (err) {
        res.status(500).json(`Couldn't Destroy Request with id: ${id}`);
    }
});

// Edit one of the rows in the table
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const request = await Requests.findOne({ where: { id: id } });
        if (!request) {
            return res.status(404).json(`Request with id: ${id} not found`);
        }

        await Requests.update(updatedData, { where: { id: id } });
        const listOfRequests = await Requests.findAll();
        res.status(200).json(listOfRequests);
    } catch (err) {
        res.status(500).json(`Couldn't Update Request with id: ${id}`);
    }
});

module.exports = router;
