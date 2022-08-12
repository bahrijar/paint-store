'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Customer.belongsToMany(models.Paint, { through: models.Order });
        }
    }
    Customer.init(
        {
            name: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Name cannot be empty'
                    },
                    notNull: {
                        msg: 'Name cannot be null'
                    }
                }
            },
            phoneNumber: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Phone number cannot be empty'
                    }
                }
            },
            city: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'City cannot be empty'
                    }
                }
            },
            district: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'District cannot be empty'
                    }
                }
            },
            address: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Address cannot be empty'
                    }
                }
            }
        },
        {
            sequelize,
            paranoid: true,
            modelName: 'Customer'
        }
    );
    return Customer;
};
