const { DataTypes } = require('sequelize');
const sequelize = require('../db/KD_DBConnection');

const Service = sequelize.define('Service', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    service_name_sinhala: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    service_name_english: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'service',
    timestamps: true,
});


module.exports = Service;
