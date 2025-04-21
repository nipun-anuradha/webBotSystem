const { DataTypes } = require('sequelize');
const sequelize = require('../db/KD_DBConnection');

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    service_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'item',
    timestamps: true, // Automatically add createdAt and updatedAt fields
});


module.exports = Item;
