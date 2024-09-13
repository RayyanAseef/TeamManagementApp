// We make a new file in the models folder everytime we want to add a table to the database

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

    // Employees.associate = (models) => {
    //     Employees.hasMany(models.Something, {
    //         onDelete: 'cascade',
    //     })
    // };

    // Gives the created table to when its trying to be accessed
    return Employees;
};
