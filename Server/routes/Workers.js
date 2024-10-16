const express = require('express');
const router = express.Router();

const { Workers, Tasks, Requests, Meetings, Messages } = require('../models');

// Add a row to the table
router.post('/', async (req, res) => {
    try {
        post = req.body;
        await Workers.create(post);
        res.status(200).json("Worker Added");
    } catch (err) {
        res.status(500).json("Unable to add Worker");
    }
});

// Get all of the rows in the table
router.get('/', async (req, res) => {
    if (req.user.position == 'Manager') {
        try {
            const listOfWorkers = await Workers.findAll({
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });
            res.status(200).json(listOfWorkers);
        } catch (err) {
            res.status(500).json("Couldn't Retrieve Workers");
        }
    } else {
        res.status(403).json("Unauthorized Access: Couldn't Retrieve");
    }
});

// Get one of the rows in the table
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const worker = await Workers.findOne({ where: { id: id } });
        if (!worker) {
            return res.status(404).json(`Worker with id: ${id} not found`);
        }

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

        const fullWorker = await Workers.findOne({
            where: { id: id },
            include: includeOptions,
        });

        res.status(200).json(fullWorker);
    } catch (err) {
        res.status(500).json(`Couldn't retrieve Worker with id: ${id}`);
    }
});

// Delete one of the rows in the table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const worker = await Workers.findOne({ where: { id: id } });
        if (!worker) {
            return res.status(404).json(`Worker with id: ${id} not found`);
        }

        await Workers.destroy({ where: { id: id } });
        const listOfWorkers = await Workers.findAll();
        res.status(200).json(listOfWorkers);
    } catch (err) {
        res.status(500).json(`Couldn't destroy Worker with id: ${id}`);
    }
});

// Edit one of the rows in the table
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const worker = await Workers.findOne({ where: { id: id } });
        if (!worker) {
            return res.status(404).json(`Worker with id: ${id} not found`);
        }

        await Workers.update(updatedData, { where: { id: id } });
        const listOfWorkers = await Workers.findAll();
        res.status(200).json(listOfWorkers);
    } catch (err) {
        res.status(500).json(`Couldn't update Worker with id: ${id}`);
    }
});

module.exports = router;