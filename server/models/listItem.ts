import { DataTypes, Model } from 'sequelize'
import sequelize from '../database/DBClient.js'
import { List } from './list.js'

export class ListItem extends Model {}

const modelAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  listId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: List,
      key: 'id',
    },
  },
  clientId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  index: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}

const options = {
  sequelize, // We need to pass the connection instance
  modelName: 'ListItem', // We need to choose the model name
  indexes: [
    {
      unique: false,
      fields: ['listId'],
    },
  ],
}

ListItem.init(modelAttributes, options)

// The defined model is equal to the class created
// console.log(List === sequelize.models.List);
