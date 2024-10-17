const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

const { UserIdentification, Workers } = require('../models');
const authenticateToken = require('../Middleware/authenticateToken');

const SECRET_ACCESS_TOKEN = 'your_access_secret';
const SECRET_REFRESH_TOKEN = 'your_refresh_secret';

// Attempting to Login
router.post('/login', async (req, res) => {
    try {
        const post = req.body;

        // Find the user by username
        const user = await UserIdentification.findOne({ where: { username: post.Username } });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ auth: false, message: "Incorrect Username or Password" });
        }

        const match = await bcrypt.compare(post.Password, user.password);

        // Check if the password matches
        if (!match) {
            return res.status(401).json({ auth: false, message: "Incorrect Username or Password" });
        }

        const worker = user.worker ? await Workers.findOne({ where: { id: user.worker } }) : null;

        if (!worker) {
            return res.status(404).json({ auth: false, message: 'Worker not found for this user', user: user });
        }

        // Create the access token
        const accessToken = jwt.sign(
            { id: worker.id, username: user.username, name: worker.name, position: worker.position, dateHired: worker.dateHired },
            SECRET_ACCESS_TOKEN,
            { expiresIn: '5m' }
        );

        // Create the refresh token
        const refreshToken = jwt.sign(
            { id: worker.id, username: user.username, name: worker.name, position: worker.position, dateHired: worker.dateHired },
            SECRET_REFRESH_TOKEN,
            { expiresIn: '20m' }
        );

        // Set tokens in HTTP-only Cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 20  * 60 * 1000 // 5 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 20 * 60 * 1000 // 20 minutes
        });

        return res.status(200).json({ auth: true, message: 'Login successful' });

    } catch (err) {
        res.status(500).json({ auth: false, message: "Unable to Login", error: err.message });
    }
});

// Attempting to Register
router.post('/register', async (req, res) => {
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
        }, { transaction });

        // Create UserIdentification
        await UserIdentification.create({
            username: post.Username,
            password: hashedPassword,
            worker: worker.id
        }, { transaction });

        // Commit the transaction if everything is successful
        await transaction.commit();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        await transaction.rollback();
        res.status(500).json({ message: "Unable to register", error: err.message });
    }
});

router.post('/logout', async (req, res)=> {
    res.clearCookie('accessToken', { path: '/', httpOnly: true, sameSite: 'Strict'});
    res.clearCookie('refreshToken', { path: '/', httpOnly: true, sameSite: 'Strict'});

    return res.status(200).json({message: "Successfully Logged out"})
})

// Verify token
router.get('/verify-token', async (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or Expired Access Token" });
        }

        return res.status(200).json({ message: "Access Token Valid", user: user });
    });
});

router.get('/refresh', async (req, res)=> {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({message: "No Token Found"})
    }

    jwt.verify(token, SECRET_REFRESH_TOKEN, (err, user)=> {
        if (err) {
            res.status(403).json({message: "Invalid or Expired Token"})
        }

        const accessToken = jwt.sign(
            { id: user.id, username: user.username, name: user.name, position: user.position },
            SECRET_ACCESS_TOKEN,
            {expiresIn: "5m"}
        )

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: true,
            maxAge: 20 * 60 * 1000
        })

        return res.status(200).json({message: "Successfully Refreshed Access Token"})
    })
})

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
        });
        res.status(200).json(listOfUserIdentifications);
    } catch (err) {
        res.status(500).json({ message: "Couldn't Retrieve User Identifications", error: err.message });
    }
});

module.exports = router;
