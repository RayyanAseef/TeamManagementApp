const express = require('express');
const router = express.Router();

const { Meetings, Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res)=> {
    try {
        post = req.body
        await Meetings.create(post)
        res.json("Meeting Added")
    } catch(err) {
        res.json("Unable to add Meeting")
    }
})

// Get all of the rows in the table
router.get('/', async (req, res)=> {
    try {
        const listOfMeetings = await Meetings.findAll({
            attributes: {
                exclude: ['createdBy', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Workers,
                    as: 'creator',
                    attributes: ['id', 'name']
                }
            ]
        });
        res.json(listOfMeetings)
    } catch(err) {
        res.json("Couldn't Retrieve Meetings")
    }
})

// Get one of the rows in the table
router.get('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        const Meeting = await Meetings.findOne({
            where: { id: id },
            include: [
                {
                    model: Workers,
                    as: 'participants'
                }
            ]
        });
        res.json(Meeting)
    } catch(err) {
        res.json(`Couldn't Find Meeting with the id: ${id}`)
    }
})

// Delete one of the rows in the table
router.delete('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        await Meetings.destroy({where: { id: id }});
        const listOfMeetings = await Meetings.findAll();
        res.json(listOfMeetings)
    } catch(err) {
        res.json(`Couldn't Destroy Meeting with the id: ${id}`)
    }
})

// Edit one of the rows in the table
router.put('/:id', async (req, res)=> {
    const {id} = req.params;
    const updatedData = req.body;
    try {
        await Meetings.update(updatedData, {where: { id: id }});
        const listOfMeetings = await Meetings.findAll();
        res.json(listOfMeetings)
    } catch(err) {
        res.json(`Couldn't Update Meeting with the id: ${id}`)
    }
})

module.exports = router