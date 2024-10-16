const express = require('express');
const router = express.Router();

const { Tasks, Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res) => {
    try {
        const post = req.body;
        await Tasks.create(post);
        res.status(200).json("Task Added");
    } catch (err) {
        res.status(500).json("Unable to add Task");
    }
});

// Get all of the rows in the table
router.get('/', async (req, res) => {
    try {
        const listOfTasks = await Tasks.findAll({
            attributes: {
                exclude: ['assignedBy', 'assignedTo', 'createdAt', 'updatedAt']
            },
            include: [
                {
                    model: Workers,
                    as: 'assignee',
                    attributes: ['id', 'name']
                },
                {
                    model: Workers,
                    as: 'assigner',
                    attributes: ['id', 'name']
                }
            ]
        });
        res.status(200).json(listOfTasks);
    } catch (err) {
        res.status(500).json("Couldn't Retrieve Tasks");
    }
});

// Get one of the rows in the table
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Tasks.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).json(`Task with id: ${id} not found`);
        }
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json(`Couldn't Retrieve Task with id: ${id}`);
    }
});

// Delete one of the rows in the table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Tasks.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).json(`Task with id: ${id} not found`);
        }

        await Tasks.destroy({ where: { id: id } });
        const listOfTasks = await Tasks.findAll();
        res.status(200).json(listOfTasks);
    } catch (err) {
        res.status(500).json(`Couldn't Destroy Task with id: ${id}`);
    }
});

// Edit one of the rows in the table
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
        const task = await Tasks.findOne({ where: { id: id } });
        if (!task) {
            return res.status(404).json(`Task with id: ${id} not found`);
        }

        await Tasks.update(updatedData, { where: { id: id } });
        const listOfTasks = await Tasks.findAll();
        res.status(200).json(listOfTasks);
    } catch (err) {
        res.status(500).json(`Couldn't Update Task with id: ${id}`);
    }
});

module.exports = router;
