// Creating app
const express = require('express');
const app = express();

// Allowing the use of json tool
app.use(express.json());

// Retriving router information from routes folder
// Giving the app the router information
const employeesRouter = require('./routes/Employees.js');
app.use('/api/employees', employeesRouter)

// Retriving all the tables created in the models file
const db = require('./models')

// Synchronizing the tables in node.js and mysql
db.sequelize.sync().then( () => {
    // setting a specific port for the server
    app.listen(3001, () => {
        console.log("Server is running on port 3001.")
    });
});