import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/DBClient';

export class List extends Model { }

List.init({
    // Model attributes are defined here
    list: {
        type: DataTypes.JSON,
        allowNull: false,
    },
}, { // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'List', // We need to choose the model name
});

sequelize.sync();

// the defined model is the class itself
// console.log(List === sequelize.models.List);
