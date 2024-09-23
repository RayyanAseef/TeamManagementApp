const express = require('express');
const router = express.Router();

const { Requests } = require('../models');
const { Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res)=> {
    try {
        post = req.body
        await Requests.create(post)
        res.json("Request Added")
    } catch(err) {
        res.json("Unable to add Request")
    }
})

// Get all of the rows in the table
router.get('/', async (req, res)=> {
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
        res.json(listOfRequests)
    } catch(err) {
        res.json("Couldn't Retrieve Requests")
    }
})

// Get one of the rows in the table
router.get('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        const Request = await Requests.findOne({where: { id: id }});
        res.json(Request)
    } catch(err) {
        res.json(`Couldn't Find Request with the id: ${id}`)
    }
})

// Delete one of the rows in the table
router.delete('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        await Requests.destroy({where: { id: id }});
        const listOfRequests = await Requests.findAll();
        res.json(listOfRequests)
    } catch(err) {
        res.json(`Couldn't Destroy Request with the id: ${id}`)
    }
})

// Edit one of the rows in the table
router.put('/:id', async (req, res)=> {
    const {id} = req.params;
    const updatedData = req.body;
    try {
        await Requests.update(updatedData, {where: { id: id }});
        const listOfRequests = await Requests.findAll();
        res.json(listOfRequests)
    } catch(err) {
        res.json(`Couldn't Update Request with the id: ${id}`)
    }
})

module.exports = router