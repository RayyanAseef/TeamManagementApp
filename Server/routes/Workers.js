const express = require('express');
const router = express.Router();

const { Workers, Tasks, Requests, Meetings, Messages } = require('../models');

// Add a row to the table
router.post('/', async (req, res)=> {
    try {
        post = req.body
        await Workers.create(post)
        res.json("Worker Added")
    } catch(err) {
        res.json("Unable to add Worker")
    }
})

// Get all of the rows in the table
router.get('/', async (req, res)=> {
    try {
        const listOfWorkers = await Workers.findAll();
        res.json(listOfWorkers)
    } catch(err) {
        res.json("Couldn't Retrieve Workers")
    }
})

// Get one of the rows in the table
router.get('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        const worker = await Workers.findOne({ where: { id: id } });
        const includeOptions = [
            {
                model: Tasks,
                as: (worker.position == "Manager") ? 'tasksCreated' : 'tasksAssigned',
            },
            {
                model: Requests,
                as: (worker.position == "Manager") ? 'requestsReceived' : 'requestsSent',
            },
            {
                model: Meetings,
                as: "meetings",
                foreignKey: "workerId",
            },
            {
                model: Messages,
                as: "messagesSent",
            },
            {
                model: Messages,
                as: "messagesReceived",
            },
        ];

        // Fetch the full worker data with associations
        const fullWorker = await Workers.findOne({
            where: { id: id },
            include: includeOptions,
        });

        res.json(fullWorker)
    } catch(err) {
        res.json(`Couldn't Find Worker with the id: ${id}`)
    }
})

// Delete one of the rows in the table
router.delete('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        await Workers.destroy({where: { id: id }});
        const listOfWorkers = await Workers.findAll();
        res.json(listOfWorkers)
    } catch(err) {
        res.json(`Couldn't Destroy Worker with the id: ${id}`)
    }
})

// Edit one of the rows in the table
router.put('/:id', async (req, res)=> {
    const {id} = req.params;
    const updatedData = req.body;
    try {
        await Workers.update(updatedData, {where: { id: id }});
        const listOfWorkers = await Workers.findAll();
        res.json(listOfWorkers)
    } catch(err) {
        res.json(`Couldn't Update Worker with the id: ${id}`)
    }
})

module.exports = router