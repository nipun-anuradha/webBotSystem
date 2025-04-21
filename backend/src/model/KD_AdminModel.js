const { DataTypes } = require('sequelize');
const sequelize = require('../db/KD_DBConnection');
const bcrypt = require('bcrypt');

const Admin = sequelize.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'admin',
    timestamps: true,
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        }
    }
});

module.exports = Admin; 