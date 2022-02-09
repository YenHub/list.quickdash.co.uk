import { DataTypes, Model } from 'sequelize'

import sequelize from '../database/DBClient.js'

interface ListAttributes {
  id: string
  darkMode: boolean
  previewMode: boolean
  mdMode: boolean
  colours: {
    primary: string
    secondary: string
  }
  createdAt: ReturnType<Date['toISOString']>
  updatedAt: ReturnType<Date['toISOString']>
  deleted: boolean
  syncSequence: number
  version: number
}

export type ListInput = Required<ListAttributes>
export type ListOutput = Required<ListAttributes>

export class List extends Model<ListAttributes, ListInput> implements ListAttributes {
  public id!: string
  public darkMode!: boolean
  public previewMode!: boolean
  public mdMode!: boolean
  public colours!: {
    primary: string
    secondary: string
  }
  public createdAt!: ReturnType<Date['toISOString']>
  public updatedAt!: ReturnType<Date['toISOString']>
  public deleted!: boolean
  public syncSequence!: number
  public version!: number
}

const listAttributes = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  darkMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  previewMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  mdMode: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  colours: {
    type: DataTypes.JSON,
    defaultValue: { primary: '#08d2ff', secondary: '#ff0000' },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  syncSequence: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}

const options = {
  sequelize, // We need to pass the connection instance
  modelName: 'List', // We need to choose the model name
  indexes: [
    {
      fields: ['updatedAt'],
    },
    {
      fields: ['createdAt'],
    },
    {
      name: 'not_deleted_by_id',
      fields: ['id', 'deleted'],
      where: {
        deleted: false,
      },
    },
  ],
}

List.init(listAttributes, options)

// The defined model is equal to the class created
// console.log(List === sequelize.models.List);
