const express = require('express');
const router = express.Router();

const { Messages } = require('../models');

// Add a row to the table
router.post('/', async (req, res)=> {
    try {
        post = req.body
        await Messages.create(post)
        res.json("Messages Added")
    } catch(err) {
        res.json("Unable to add Messages")
    }
})

// Get all of the rows in the table
router.get('/', async (req, res)=> {
    try {
        const listOfMessages = await Messages.findAll();
        res.json(listOfMessages)
    } catch(err) {
        res.json("Couldn't Retrieve Messages")
    }
})

// Get one of the rows in the table
router.get('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        const Message = await Messages.findOne({where: { id: id }});
        res.json(Message)
    } catch(err) {
        res.json(`Couldn't Find Message with the id: ${id}`)
    }
})

// Delete one of the rows in the table
router.delete('/:id', async (req, res)=> {
    const {id} = req.params;
    try {
        await Messages.destroy({where: { id: id }});
        const listOfMessages = await Messages.findAll();
        res.json(listOfMessages)
    } catch(err) {
        res.json(`Couldn't Destroy Message with the id: ${id}`)
    }
})

// Edit one of the rows in the table
router.put('/:id', async (req, res)=> {
    const {id} = req.params;
    const updatedData = req.body;
    try {
        await Messages.update(updatedData, {where: { id: id }});
        const listOfMessages = await Messages.findAll();
        res.json(listOfMessages)
    } catch(err) {
        res.json(`Couldn't Update Message with the id: ${id}`)
    }
})

module.exports = router