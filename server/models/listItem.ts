/* eslint-disable brace-style */
import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../database/DBClient.js'
import { List } from './list.js'

interface ListItemAttributes {
  id: string
  listId: string
  clientId: string
  title?: string
  body?: string
  deleted: boolean
  index: number
  createdAt: ReturnType<Date['toISOString']>
  updatedAt: ReturnType<Date['toISOString']>
}

export type ListInput = Optional<ListItemAttributes, 'title' | 'body'>
export type ListOutput = Required<ListItemAttributes>

export class ListItem
  extends Model<ListItemAttributes, ListInput>
  implements ListItemAttributes
{
  public id!: string
  public listId!: string
  public clientId!: string
  public title!: string
  public body!: string
  public deleted!: boolean
  public index!: number
  public createdAt!: ReturnType<Date['toISOString']>
  public updatedAt!: ReturnType<Date['toISOString']>
}

const listItemAttributes = {
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

ListItem.init(listItemAttributes, options)

// The defined model is equal to the class created
// console.log(List === sequelize.models.List);
