module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        createdBy: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        },
        sentTo: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        }
    });

    Messages.associate = (models) => {
        Messages.belongsTo(models.Workers, {
            foreignKey: 'createdBy',
            as: 'from'
        });
        Messages.belongsTo(models.Workers, {
            foreignKey: 'sentTo',
            as: 'to'
        });
    };

    return Messages;
};
