const express = require('express');
const router = express.Router();
const { Employees } = require('../models');

router.get('/', async (req, res)=> {
    const listOfEmplyees = await Employees.findAll();
    res.json(listOfEmplyees);
});

router.post('/', async (req, res)=> {
    post = req.body;
    await Employees.create(post);
    res.json(post);
});

module.exports = router;