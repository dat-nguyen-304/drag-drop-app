import React, { useState, useEffect } from 'react';
import Column from '../Column/Column';
import './BoardContent.scss';
import { initialData } from '../../actions/initialData';
import _ from 'lodash';
import { mapOrder } from '../../utilities/sorts';

function BoardContent () {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
        if (boardFromDB) {
            setBoard(boardFromDB);
            //sort column

            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, [])
    if (_.isEmpty(board)) {
        return <div className="not-found">Board not found</div>
    }
    return (
        <div className="board-content">
            { columns.map((column, index) => <Column key={ index } column={ column } />) }
        </div>
    )
}

export default BoardContent;
