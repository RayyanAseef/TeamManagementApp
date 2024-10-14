module.exports = (sequelize, DataTypes) => {
    const Requests = sequelize.define("Requests", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        dateSubmitted: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        requestTo: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        },
        requestBy: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        }
    });

    // Associations
    Requests.associate = (models) => {
        Requests.belongsTo(models.Workers, {
            foreignKey: 'requestTo',
            as: 'requested'
        });
        Requests.belongsTo(models.Workers, {
            foreignKey: 'requestBy',
            as: 'requestee'
        });
    };

    return Requests;
};
