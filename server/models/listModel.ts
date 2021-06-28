import { UUID, UUIDV4, DataTypes, Model } from 'sequelize';
import sequelize from '../database/DBClient';

export class List extends Model { }

const modelAttributes = {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    list: {
        type: DataTypes.JSON,
        allowNull: false,
    },
};

const options = {
    sequelize, // We need to pass the connection instance
    modelName: 'List', // We need to choose the model name
};

List.init(modelAttributes, options);

sequelize.sync();
// sequelize.sync({force: true});

// The defined model is equal to the class created
// console.log(List === sequelize.models.List);
