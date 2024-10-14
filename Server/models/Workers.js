module.exports = (sequelize, DataTypes) => {
    const Workers = sequelize.define("Workers", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateHired: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Workers.associate = (models) => {
        // Requests associations
        Workers.hasMany(models.Requests, {
            foreignKey: 'requestTo',
            as: 'requestsReceived'
        });
        Workers.hasMany(models.Requests, {
            foreignKey: 'requestBy',
            as: 'requestsSent'
        });

        // Tasks associations
        Workers.hasMany(models.Tasks, {
            foreignKey: 'assignedBy',
            as: 'tasksCreated'
        });
        Workers.hasMany(models.Tasks, {
            foreignKey: 'assignedTo',
            as: 'tasksAssigned'
        });

        // Meetings (Many-to-Many)
        Workers.belongsToMany(models.Meetings, {
            through: 'MeetingParticipants',
            foreignKey: 'workerId',
            as: 'meetings'
        });

        // Messages associations
        Workers.hasMany(models.Messages, {
            foreignKey: 'createdBy',
            as: 'messagesSent'
        });
        Workers.hasMany(models.Messages, {
            foreignKey: 'sentTo',
            as: 'messagesReceived' 
        });
    };
    return Workers;
};
