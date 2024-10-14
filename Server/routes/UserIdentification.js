const express = require('express');
const router = express.Router();

const { UserIdentification } = require('../models');
const { Workers } = require('../models');

// Add a row to the table
router.post('/', async (req, res) => {
    try {
        const post = req.body;
        await UserIdentification.create(post); // Singular model name
        res.json("User Identification Added");
    } catch (err) {
        res.json({ message: "Unable to add User Identification", error: err.message });
    }
});

// Delete one of the rows in the table
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await UserIdentification.destroy({ where: { id: id } }); // Singular model name
        const listOfUserIdentifications = await UserIdentification.findAll(); // Singular model name
        res.json(listOfUserIdentifications);
    } catch (err) {
        res.json({ message: `Couldn't Destroy User Identification with the id: ${id}`, error: err.message });
    }
});

// Get all of the rows in the table
// router.get('/', async (req, res) => {
//     try {
//         const listOfUserIdentifications = await UserIdentification.findAll({
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
//         res.json(listOfUserIdentifications);
//     } catch (err) {
//         res.json({ message: "Couldn't Retrieve User Identifications", error: err.message });
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
