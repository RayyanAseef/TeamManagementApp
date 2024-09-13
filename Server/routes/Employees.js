// This file is created when we want to do post and get requests for certain links.
//  Usually for when you need to get or add to a database table.

// Creating a router
const express = require('express');
const router = express.Router();

// Retrieving the table we want to access
const { Employees } = require('../models');

// Handles get requests at specified link
router.get('/', async (req, res)=> {
  try {
    const listOfEmplyees = await Employees.findAll();
    res.json(listOfEmplyees);
  } catch (err) {
    console.log("Error, Employees GET Request not working.", err)
  }
});

router.get('/:id', async (req, res)=> {
  const { id } = req.params;
  try {
    const employee = await Employees.findOne({ where: { id: id }});
    res.json(employee);
  } catch (err) {
    console.log(`Error, Employees GET Request for Specific ID ${id} is not working.`, err)
  }
});

// Handles post requests at specified link
router.post('/', async (req, res)=> {
  const post = req.body;
  try {
    await Employees.create(post);
    res.json(post);
  } catch (err) {
    console.error(`Error, Employees POST Request for "${post}" is not working.`)
  }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params; // Get the id from the URL params
    const updatedData = req.body; // Get the updated data from the request body
  
    try {
      // Update the employee with the new data
      const [updatedRowsCount] = await Employees.update(updatedData, {
        where: { id: id } // Find the employee by id
      });
  
      if (updatedRowsCount === 0) {
        // If no rows were updated, return a 404 Not Found
        return res.status(404).json({ message: "Employee not found" });
      }
  
      // Respond with a success message or the updated data
      res.json({ message: "Employee updated successfully", updatedData });
    } catch (error) {
      // Handle any errors that occur
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Error updating employee" });
    }
  });
  

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Employees.destroy({where:{id:id}});
    const listOfEmplyees = await Employees.findAll();
    res.json(listOfEmplyees);
});

module.exports = router;