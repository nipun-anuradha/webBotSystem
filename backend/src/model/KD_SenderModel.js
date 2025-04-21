const { DataTypes } = require('sequelize');
const sequelize = require('../db/KD_DBConnection');

const Sender = sequelize.define('Sender', {
    tell: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selected_language: {
        type: DataTypes.STRING,
        allowNull: true
    },
    last_replymsg_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_replymsg_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_answered_service: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_answered_method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_answered_location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_answered_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    timeout_reactive_status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, {
    tableName: 'sender',
    timestamps: true,
    updatedAt: true,
    createdAt: true,
    hooks: {
        beforeUpdate: (instance) => {
            instance.updatedAt = new Date();
        }
    }
});

module.exports = Sender; 