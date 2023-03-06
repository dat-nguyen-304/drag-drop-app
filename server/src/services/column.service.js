import { ColumnModel } from "~/models/column.model";
import { BoardModel } from "~/models/board.model";
import { CardModel } from "../models/card.model";

const createNew = async (data) => {
    try {
        const createdColumn = await ColumnModel.createNew(data);
        const newColumn = await ColumnModel.findOneById(createdColumn.insertedId.toString());
        const boardId = newColumn.boardId.toString();
        const newColumnId = newColumn._id.toString();
        await BoardModel.pushColumnOrder(boardId, newColumnId);
        newColumn.cards = [];
        return newColumn;
    } catch (error) {
        throw new Error(error);
    }
}

const update = async (id, data) => {
    try {
        const updateData = {
            ...data,
            updatedAt: Date.now()
        }
        if (updateData._id) delete updateData._id;
        if (updateData.cards) delete updateData.cards;

        const result = await ColumnModel.update(id, updateData);
        if (updateData._destroy) {
            CardModel.deleteByColumn(updateData.cardOrder);
        }
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

export const ColumnService = { createNew, update }