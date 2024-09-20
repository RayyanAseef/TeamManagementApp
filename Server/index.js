// Creating app
const express = require('express');
const app = express();

// Allowing the use of json tool
app.use(express.json());

// Retriving router information from routes folder
// Giving the app the router information

const workerRouter = require('./routes/Workers.js')
app.use('/api/workers', workerRouter)

const taskRouter = require('./routes/Tasks.js');
app.use('/api/tasks', taskRouter);

const requestRouter = require('./routes/Request.js');
app.use('/api/requests', requestRouter);

const meetingRouter = require('./routes/Meetings.js');
app.use('/api/meetings', meetingRouter);

const messageRouter = require('./routes/Messages.js');
app.use('/api/messages', messageRouter);

// Retriving all the tables created in the models file
const db = require('./models')

// Synchronizing the tables in node.js and mysql
db.sequelize.sync().then( () => {
    // setting a specific port for the server
    app.listen(3001, () => {
        console.log("Server is running on port 3001.")
    });
});