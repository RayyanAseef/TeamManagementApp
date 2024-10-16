const express = require('express');
const router = express.Router();

const { Messages, Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res) => {
    try {
        const post = req.body;
        await Messages.create(post);
        res.status(200).json("Message Added");
    } catch (err) {
        res.status(500).json("Unable to add Message");
    }
});

// Get all of the rows in the table
router.get('/', async (req, res) => {
    try {
        const listOfMessages = await Messages.findAll({
            attributes: {
                exclude: ['createdBy', 'sentTo', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Workers,
                    as: 'from',
                    attributes: ['id', 'name']
                },
                {
                    model: Workers,
                    as: 'to',
                    attributes: ['id', 'name']
                }
            ]
        });
        res.status(200).json(listOfMessages);
    } catch (err) {
        res.status(500).json("Couldn't Retrieve Messages");
    }
});

// Get one of the rows in the table
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Messages.findOne({ where: { id: id } });
        if (!message) {
            return res.status(404).json(`Message with id: ${id} not found`);
        }
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(`Couldn't Retrieve Message with id: ${id}`);
    }
});

// Delete one of the rows in the table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const message = await Messages.findOne({ where: { id: id } });
        if (!message) {
            return res.status(404).json(`Message with id: ${id} not found`);
        }

        await Messages.destroy({ where: { id: id } });
        const listOfMessages = await Messages.findAll();
        res.status(200).json(listOfMessages);
    } catch (err) {
        res.status(500).json(`Couldn't Destroy Message with id: ${id}`);
    }
});

// Edit one of the rows in the table
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const message = await Messages.findOne({ where: { id: id } });
        if (!message) {
            return res.status(404).json(`Message with id: ${id} not found`);
        }

        await Messages.update(updatedData, { where: { id: id } });
        const listOfMessages = await Messages.findAll();
        res.status(200).json(listOfMessages);
    } catch (err) {
        res.status(500).json(`Couldn't Update Message with id: ${id}`);
    }
});

module.exports = router;
