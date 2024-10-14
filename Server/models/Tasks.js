module.exports = (sequelize, DataTypes) => {
    const Tasks = sequelize.define("Tasks", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        importance: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        assignedBy: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        },
        assignedTo: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        }
    });

    // Associations
    Tasks.associate = (models) => {
        Tasks.belongsTo(models.Workers, {
            foreignKey: 'assignedBy',
            as: 'assigner'
        });
        Tasks.belongsTo(models.Workers, {
            foreignKey: 'assignedTo',
            as: 'assignee'
        });
    };

    return Tasks;
};
