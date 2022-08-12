'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Paint extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Paint.belongsTo(models.Category);
            Paint.belongsToMany(models.Customer, { through: models.Order });
        }
    }
    Paint.init(
        {
            name: DataTypes.STRING,
            image: DataTypes.STRING,
            price: DataTypes.BIGINT,
            stock: DataTypes.INTEGER,
            CategoryId: {
                allowNull: false,
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: 'Category cannot be empty'
                    },
                    notNull: {
                        msg: 'Category cannot be null'
                    }
                }
            }
        },
        {
            sequelize,
            paranoid: true,
            modelName: 'Paint'
        }
    );
    return Paint;
};
