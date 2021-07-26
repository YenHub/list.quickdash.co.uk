import { List } from '../models/listModel';

// CREATE
export const createList = async (list: JSON) => List.create({ list });

// READ
export const getList = async (id: string) => List.findByPk(id);

// UPDATE
export const updateList = async (listId: string, list: JSON) => List.update({ list }, { where: { id: listId } });

// DELETE
export const deleteList = async (id: string) => List.destroy({ where: { id } });
