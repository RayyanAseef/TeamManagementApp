// Creating app
const express = require('express');
const app = express();
const { Op } = require('sequelize');

const {Tasks, Requests, Meetings, Workers, Messages, UserIdentification} = require('./models')

const models = {
    "Tasks": Tasks,
    "Requests": Requests,
    "Meetings": Meetings,
    "Workers": Workers,
    "Messages": Messages,
    "UserIdetification":UserIdentification
}

const getModelFields = (model, workers) => {
    const attributes = model.rawAttributes;
    const associations = model.associations; 
    const obj = {};
  
    Object.keys(attributes).forEach((key) => {
      let isObj = false
      if (key !== 'updatedAt' && key !== 'createdAt') {
        let fieldKey = key;
  
        for (const associationName in associations) {
          const association = associations[associationName];
          
          if (association.foreignKey === key) {
            fieldKey = association.as;
            isObj = true
          }
        }

        obj[fieldKey] = {
          type: attributes[key].type.key.toLowerCase(),
          allowNull: attributes[key].allowNull,
        };

        if (fieldKey == 'status') { obj[fieldKey].options = [ {id: false, value:'Ongoing'}, {id: true, value: 'Done'}] }
        if (fieldKey == 'importance') { obj[fieldKey].options = [ {id: 'High', value: 'High'}, {id: 'Medium', value:'Medium'}, {id: 'Low', value: 'Low'} ] }
        if (isObj) {
          obj[fieldKey].options = workers.map((worker, index) => option = {id: worker.id, value: worker.name});
          obj[fieldKey].fieldKey = key
      }      
      }
    });
  
    return obj;
};
  

app.use('/api/models/:modelName', async (req, res)=> {
    const {modelName} = req.params;
    const model = models[modelName];
    let workers;
    if (modelName == 'Requests') {
      workers = await Workers.findAll({where: {position: 'Manager'}});
    } else if (modelName == 'Tasks') {
      workers = await Workers.findAll({where: {position: { [Op.ne]: 'Manager'}}});
    } else {
      workers = await Workers.findAll();
    }
    if (model) {
        res.json(getModelFields(model, workers))
    } else {
        res.json(modelName)
    }
})

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

const userIdentificationRouter = require('./routes/UserIdentification.js');
app.use('/api/useridentification', userIdentificationRouter);

// Retriving all the tables created in the models file
const db = require('./models')

// Synchronizing the tables in node.js and mysql
db.sequelize.sync().then( () => {
    // setting a specific port for the server
    app.listen(3001, () => {
        console.log("Server is running on port 3001.")
    });
});