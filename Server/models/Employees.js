// Makes var accessable to other files
module.exports = (sequelize, DataTypes) => {
    // Creating table
    const Employees = sequelize.define("Employees", {
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

    return Employees;
};