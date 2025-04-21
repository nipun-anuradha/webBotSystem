const { DataTypes } = require("sequelize");
const sequelize = require("../db/KD_DBConnection");

const WCustomer = sequelize.define('WCustomer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    }
},
    {
        tableName: 'wbot_customer',
        timestamps: true,
        updatedAt: true,
        createdAt: true,
        hooks: {
            beforeUpdate: (instance) => {
                instance.updatedAt = new Date();
            }
        }
    }
);

module.exports = WCustomer;