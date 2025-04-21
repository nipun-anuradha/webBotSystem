const { DataTypes } = require('sequelize');
const sequelize = require('../db/KD_DBConnection');

const Image = sequelize.define('Image', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'images',
    timestamps: true
});

module.exports = Image;