module.exports = (sequelize, DataTypes) => {
    const UserIdentification = sequelize.define("UserIdentification", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING
        },
        worker: {
            type: DataTypes.INTEGER,  // Foreign key field definition
            allowNull: false
        }
    });

    // Associations
    UserIdentification.associate = (models) => {
        UserIdentification.belongsTo(models.Workers, {
            foreignKey: 'worker',
            as: 'workerIdentification',
            onDelete: 'CASCADE'  // Automatically delete UserIdentification when the worker is deleted
        });
    };

    return UserIdentification;
};