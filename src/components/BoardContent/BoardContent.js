import React, { useState, useEffect } from 'react';
import Column from '../Column/Column';
import './BoardContent.scss';
import { initialData } from '../../actions/initialData';
import _ from 'lodash';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from '../../utilities/dragDrop';

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

    const onColumnDrop = (dropResult) => {
        // console.log('on drop content', dropResult);
        let newColumns = [...columns];
        console.log(newColumns);
        newColumns = applyDrag(newColumns, dropResult);
        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
    }

    const onCardDrop = (column, dropResult) => {
        if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
            console.log('on drop column', dropResult);
            column.cards = applyDrag(column.cards, dropResult);
            column.cardOrder = column.cards.map(c => c.id);
            let newColumns = [...columns];
            newColumns = newColumns.map(c => {
                if (c.id === column.id) return column;
                return c;
            })
            setColumns(newColumns);
        }
    }

    return (
        <div className="board-content">
            <Container
                orientation="horizontal"
                onDrop={ onColumnDrop }
                getChildPayload={ index => columns[index] }
                dragHandleSelector=".column-drag-handle"
                dropPlaceholder={ {
                    animationDuration: 150,
                    showOnTop: true,
                    className: 'column-drop-preview'
                } }
            >

                { columns.map((column, index) => (
                    <Draggable key={ index }>
                        <Column key={ index } column={ column } onCardDrop={ onCardDrop } />
                    </Draggable>
                )) }
            </Container>
            <div className="add-new-column">
                <i className="fa fa-plus icon"></i>Add new column
            </div>
        </div>
    )
}

export default BoardContent;
