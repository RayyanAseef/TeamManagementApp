const express = require('express');
const app = express();

app.use(express.json());


const db = require('./models');

// Routers
const employeesRouter = require('./routes/Employees.js');
app.use('/employees', employeesRouter)

db.sequelize.sync().then( () => {
    app.listen(3001, () => {
        console.log("Server is running on port 3001.")
    });
});