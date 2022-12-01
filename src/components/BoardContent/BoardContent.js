import React, { useState, useEffect, useRef } from 'react';
import Column from '../Column/Column';
import './BoardContent.scss';
import { initialData } from '../../actions/initialData';
import _ from 'lodash';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { applyDrag } from '../../utilities/dragDrop';

function BoardContent () {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openAddNewColumn, setOpenAddNewColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const addNewColumnInput = useRef();

    useEffect(() => {
        const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
        if (boardFromDB) {
            setBoard(boardFromDB);
            //sort column

            setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
        }
    }, []);

    useEffect(() => {
        if (openAddNewColumn) {
            if (addNewColumnInput && addNewColumnInput.current) {
                addNewColumnInput.current.focus();
                addNewColumnInput.current.select();
            }
        }
    }, [openAddNewColumn])

    if (_.isEmpty(board)) {
        return <div className="not-found">Board not found</div>
    }

    const onColumnDrop = (dropResult) => {
        console.log('on drop column', dropResult);
        let newColumns = [...columns];
        // console.log(newColumns);
        newColumns = applyDrag(newColumns, dropResult);
        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(c => c.id);
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
    }

    const onCardDrop = (column, dropResult) => {
        if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
            console.log('on drop card', dropResult);
            column.cards = applyDrag(column.cards, dropResult);
            column.cardOrder = column.cards.map(c => c.id);
            let newColumns = [...columns];
            newColumns = newColumns.map(c => {
                if (c.id === column.id) return column;
                return c;
            })
            let newBoard = { ...board };
            newBoard.columns = newColumns;
            setBoard(newBoard);
            setColumns(newColumns);
        }
    }

    const toggleOpenAddNewColumn = () => {
        setOpenAddNewColumn(!openAddNewColumn);
    }

    const addNewColumn = () => {
        if (newColumnName) {
            let newColumns = [...columns];
            let newColumn = {
                id: Math.floor(Math.random() * 10),
                boardId: board.id,
                cards: [],
                cardOrder: [],
                title: newColumnName
            }
            newColumns.push(newColumn);
            const newBoard = { ...board };
            newBoard.columnOrder.push(newColumn.id);
            setBoard(newBoard);
            setColumns(newColumns);
            setNewColumnName('');
            toggleOpenAddNewColumn();
        } else {
            addNewColumnInput.current.focus();
        }
    }

    const saveColumnTitle = (column) => {
        let newColumns = [...columns];
        newColumns = newColumns.map(c => {
            if (c.id === column.id) return column;
            return c;
        });
        let newBoard = { ...board };
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
    }

    const removeColumn = (columnId) => {
        let newColumns = [...columns];
        newColumns = newColumns.filter(c => {
            return c.id !== columnId
        });
        let newBoard = { ...board };
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
    }

    const addNewCard = (column, cardContent) => {
        const newCard = {
            id: Math.floor(Math.random() * 1000),
            columnId: column.id,
            boardId: column.boardId,
            cover: null,
            title: cardContent
        }

        const newColumn = { ...column, cards: [...column.cards, newCard], cardOrder: [...column.cardOrder, newCard.id] }
        let newColumns = [...columns];
        newColumns = newColumns.map(c => {
            if (c.id === column.id)
                return newColumn;
            return c;
        })
        console.log(newColumns);

        let newBoard = { ...board };
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
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
                    <Draggable key={ column.id }>
                        <Column
                            key={ column.id }
                            column={ column }
                            onCardDrop={ onCardDrop }
                            saveColumnTitle={ saveColumnTitle }
                            removeColumn={ removeColumn }
                            addNewCard={ addNewCard }
                        />
                    </Draggable>
                )) }
            </Container>
            <BootstrapContainer className="custom-container">
                {
                    !openAddNewColumn ?
                        <Row onClick={ toggleOpenAddNewColumn }>
                            <Col className="add-new-column">
                                <i className="fa fa-plus icon"></i>Add new column
                            </Col>
                        </Row>
                        :
                        <Row>
                            <Col className="new-column-name-input-container" >
                                <Form.Control
                                    className="new-column-name-input" size="sm" type="text"
                                    placeholder="Column name..."
                                    value={ newColumnName }
                                    ref={ addNewColumnInput }
                                    onChange={ e => { setNewColumnName(e.target.value) } }
                                    onKeyDown={ (e) => { if (e.key === 'Enter') addNewColumn() } }
                                />
                                <div className="new-column-name-action">
                                    <Button variant="success" size="sm"
                                        onClick={ addNewColumn }
                                    >
                                        Add column
                                    </Button>
                                    <i className="fa fa-trash cancel-icon" onClick={ toggleOpenAddNewColumn }></i>
                                </div>
                            </Col>
                        </Row>
                }
            </BootstrapContainer>
        </div>
    )
}

export default BoardContent;
