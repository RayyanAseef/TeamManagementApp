module.exports = (sequelize, DataTypes) => {
    const Meetings = sequelize.define("Meetings", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        meetingDate: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });

    Meetings.associate = (models) => {
        Meetings.belongsToMany(models.Workers, {
            through: 'MeetingParticipants',
            foreignKey: 'meetingId',
            as: 'participants'
        });
    };

    return Meetings;
};
