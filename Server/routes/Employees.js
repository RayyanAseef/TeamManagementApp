// This file is created when we want to do post and get requests for certain links.
//  Usually for when you need to get or add to a database table.

// Creating a router
const express = require('express');
const router = express.Router();

// Retrieving the table we want to access
const { Employees } = require('../models');

// Handles get requests at specified link
router.get('/', async (req, res)=> {
    const listOfEmplyees = await Employees.findAll();
    res.json(listOfEmplyees);
});

// Handles post requests at specified link
router.post('/', async (req, res)=> {
    post = req.body;
    await Employees.create(post);
    res.json(post);
});

module.exports = router;