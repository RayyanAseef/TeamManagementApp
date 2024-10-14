const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const { UserIdentification } = require('../models');
const { Workers } = require('../models');
const { where } = require('sequelize');

// Attempting to Login
router.post('/login', async (req, res) => {
    try {
        const post = req.body;
        
        // Find the user by username
        const user = await UserIdentification.findOne({ where: { username: post.Username }});
        
        // Check if the user exists
        if (!user) {
            // If user is not found, return the same error to prevent username guessing
            return res.json({ message: "Incorrect Username or Password" });
        }

        const match = await bcrypt.compare(post.Password, user.password)

        // Check if the password matches
        if (match) {
            return res.json({ message: "Logged In" });
        } else {
            return res.json({ message: "Incorrect Username or Password" });
        }
        
    } catch (err) {
        res.json({ message: "Unable to Login", error: err.message });
    }
});

// Attempting to Register
router.post('/register', async (req, res) => {
    // To make the creation of worker and user identification at the same time
    const transaction = await sequelize.transaction();  

    try {
        const post = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(post.Password, 10);

        // Create the worker first
        const worker = await Workers.create({
            name: post.Name,
            position: post.Position,
            dateHired: post["Date Hired"]
        }, { transaction });  // Use transaction

        // If the worker is created, proceed to create the UserIdentification
        await UserIdentification.create({
            username: post.Username,
            password: hashedPassword,
            worker: worker.id // Associate with the worker's ID
        }, { transaction });  // Use transaction

        // Commit the transaction if everything is successful
        await transaction.commit();

        res.json({ message: "User registered successfully" });
    } catch (err) {
        // Undo any thing done if any part of the transaction fails
        await transaction.rollback();
        res.json({ message: "Unable to register", error: err.message });
    }
});

// Get all of the rows in the table
router.get('/', async (req, res) => {
    try {
        const listOfUserIdentifications = await UserIdentification.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'worker']
            },
            include: [
                {
                    model: Workers,
                    as: "workerIdentification",
                    attributes: ['id', 'name']
                }
            ]
        }); // Singular model name
        res.json(listOfUserIdentifications);
    } catch (err) {
        res.json({ message: "Couldn't Retrieve User Identifications", error: err.message });
    }
});

// Add a row to the table
// router.post('/', async (req, res) => {
//     try {
//         const post = req.body;
//         const hashedPassword = await bcrypt.hash(post.Password, 10)
//         await UserIdentification.create({username: post.Username, password: hashedPassword, worker: post.Worker}); // Singular model name
//         res.json("User Identification Added");
//     } catch (err) {
//         res.json({ message: "Unable to add User Identification", error: err.message });
//     }
// });

// Delete one of the rows in the table
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         await UserIdentification.destroy({ where: { id: id } }); // Singular model name
//         const listOfUserIdentifications = await UserIdentification.findAll(); // Singular model name
//         res.json(listOfUserIdentifications);
//     } catch (err) {
//         res.json({ message: `Couldn't Destroy User Identification with the id: ${id}`, error: err.message });
//     }
// });

// Get one of the rows in the table
// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const userIdentification = await UserIdentification.findOne({ 
//             where: { id: id },
//             attributes: {
//                 exclude: ['createdAt', 'updatedAt', 'worker']
//             },
//             include: [
//                 {
//                     model: Workers,
//                     as: "workerIdentification",
//                     attributes: ['id', 'name']
//                 }
//             ]
//         }); // Singular model name
//         res.json(userIdentification);
//     } catch (err) {
//         res.json({ message: `Couldn't Find User Identification with the id: ${id}`, error: err.message });
//     }
// });

// Edit one of the rows in the table
// router.put('/:id', async (req, res) => {
//     const { id } = req.params;
//     const updatedData = req.body;
//     try {
//         await UserIdentification.update(updatedData, { where: { id: id } }); // Singular model name
//         const listOfUserIdentifications = await UserIdentification.findAll(); // Singular model name
//         res.json(listOfUserIdentifications);
//     } catch (err) {
//         res.json({ message: `Couldn't Update User Identification with the id: ${id}`, error: err.message });
//     }
// });

module.exports = router;
