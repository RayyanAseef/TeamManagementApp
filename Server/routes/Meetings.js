const express = require('express');
const router = express.Router();

const authenticateToken = require('../Middleware/authenticateToken.js');
const { Meetings, Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res) => {
    try {
        post = req.body;
        await Meetings.create(post);
        res.status(200).json("Meeting Added");
    } catch (err) {
        res.status(500).json("Unable to add Meeting");
    }
});

// Get all of the rows in the table
router.get('/', async (req, res) => {
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
        res.status(200).json(listOfMeetings);
    } catch (err) {
        res.status(500).json("Couldn't Retrieve Meetings");
    }
});

// Get one of the rows in the table
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const meeting = await Meetings.findOne({
            where: { id: id },
            include: [
                {
                    model: Workers,
                    as: 'participants'
                }
            ]
        });

        if (!meeting) {
            return res.status(404).json(`Meeting with id: ${id} not found`);
        }

        res.status(200).json(meeting);
    } catch (err) {
        res.status(500).json(`Couldn't Retrieve Meeting with id: ${id}`);
    }
});

// Delete one of the rows in the table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const meeting = await Meetings.findOne({ where: { id: id } });
        if (!meeting) {
            return res.status(404).json(`Meeting with id: ${id} not found`);
        }

        await Meetings.destroy({ where: { id: id } });
        const listOfMeetings = await Meetings.findAll();
        res.status(200).json(listOfMeetings);
    } catch (err) {
        res.status(500).json(`Couldn't Destroy Meeting with id: ${id}`);
    }
});

// Edit one of the rows in the table
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const meeting = await Meetings.findOne({ where: { id: id } });
        if (!meeting) {
            return res.status(404).json(`Meeting with id: ${id} not found`);
        }

        await Meetings.update(updatedData, { where: { id: id } });
        const listOfMeetings = await Meetings.findAll();
        res.status(200).json(listOfMeetings);
    } catch (err) {
        res.status(500).json(`Couldn't Update Meeting with id: ${id}`);
    }
});

module.exports = router;
