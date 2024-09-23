const express = require('express');
const router = express.Router();

const { Tasks } = require('../models');
const { Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res)=> {
    try {
        post = req.body
        await Tasks.create(post)
        res.json("Task Added")
    } catch(err) {
        res.json("Unable to add Task")
    }
})

// Get all of the rows in the table
router.get('/', async (req, res)=> {
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
        res.json(listOfTasks)
    } catch(err) {
        res.json("Couldn't Retrieve Tasks")
    }
})

// Get one of the rows in the table
router.get('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        const task = await Tasks.findOne({where: { id: id }});
        res.json(task)
    } catch(err) {
        res.json(`Couldn't Find Task with the id: ${id}`)
    }
})

// Delete one of the rows in the table
router.delete('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        await Tasks.destroy({where: { id: id }});
        const listOfTasks = await Tasks.findAll();
        res.json(listOfTasks)
    } catch(err) {
        res.json(`Couldn't Destroy Task with the id: ${id}`)
    }
})

// Edit one of the rows in the table
router.put('/:id', async (req, res)=> {
    const {id} = req.params;
    const updatedData = req.body;
    try {
        await Tasks.update(updatedData, {where: { id: id }});
        const listOfTasks = await Tasks.findAll();
        res.json(listOfTasks)
    } catch(err) {
        res.json(`Couldn't Update Task with the id: ${id}`)
    }
})

module.exports = router