import React, { useState, useEffect, useRef } from 'react';
import Column from '../Column/Column';
import './BoardContent.scss';
import _ from 'lodash';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import { applyDrag } from '../../utilities/dragDrop';
import {
    fetchBoardDetails,
    createNewColumn,
    createNewCard,
    updateBoard,
    updateColumn,
    updateCard
} from '../../actions/APICall';

function BoardContent () {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([]);
    const [openAddNewColumn, setOpenAddNewColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const addNewColumnInput = useRef();

    useEffect(() => {
        fetchBoardDetails('638998c89280894f3f470306').then(board => {
            setBoard(board);
            //sort column
            setColumns(mapOrder(board.columns, board.columnOrder, '_id'));
        });
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
        if (dropResult.removedIndex !== dropResult.addedIndex) {
            let newColumns = _.cloneDeep(columns);

            newColumns = applyDrag(newColumns, dropResult);
            let newBoard = _.cloneDeep(board);
            newBoard.columnOrder = newColumns.map(c => c._id);
            newBoard.columns = newColumns;

            setBoard(newBoard);
            setColumns(newColumns);
            updateBoard(newBoard._id, newBoard).catch(e => {
                console.log(e.message);
                setBoard(board);
                setColumns(columns);
            });
        }
    }

    const onCardDrop = (column, dropResult) => {
        if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
            console.log('on drop card', dropResult);
            const newColumn = _.cloneDeep(column);
            newColumn.cards = applyDrag(newColumn.cards, dropResult);
            newColumn.cardOrder = newColumn.cards.map(c => c._id);
            setColumns(columns => {
                let newColumns = _.cloneDeep(columns);
                newColumns = newColumns.map(c => {
                    if (c._id === newColumn._id) { return newColumn; }
                    return c;
                })
                let newBoard = _.cloneDeep(board);
                newBoard.columns = newColumns;
                setBoard(newBoard);
                return newColumns;
            });

            if (dropResult.removedIndex != null && dropResult.addedIndex != null) {
                if (dropResult.removedIndex !== dropResult.addedIndex)
                    updateColumn(newColumn._id, newColumn).catch(e => { setColumns(columns); console.log('something is wrong', e.message); });
            } else {
                updateColumn(newColumn._id, newColumn).catch(e => { setColumns(columns); console.log('something is wrong', e.message); });
                if (dropResult.addedIndex !== null) {
                    const currentCard = _.cloneDeep(dropResult.payload);
                    currentCard.columnId = newColumn._id;
                    updateCard(currentCard._id, currentCard);
                }
            }
        }
    }
    // const onCardDrop = (column, dropResult) => {
    //     if (dropResult.removedIndex != null || dropResult.addedIndex != null) {
    //         console.log('on drop card', dropResult);
    //         const newColumn = { ...column };
    //         newColumn.cards = applyDrag(newColumn.cards, dropResult);
    //         newColumn.cardOrder = newColumn.cards.map(c => c._id);
    //         let newColumns = _.cloneDeep(columns);
    //         console.log('before columns: ', newColumns);
    //         newColumns = newColumns.map(c => {
    //             if (c._id === newColumn._id) { return newColumn; }
    //             return c;
    //         })
    //         console.log('after columns: ', newColumns);
    //         let newBoard = _.cloneDeep(board);
    //         newBoard.columns = newColumns;
    //         setColumns(newColumns);
    //         setBoard(newBoard);

    //         if (dropResult.removedIndex != null && dropResult.addedIndex != null) {
    //             if (dropResult.removedIndex !== dropResult.addedIndex)
    //                 updateColumn(newColumn._id, newColumn).catch(e => { setColumns(columns); console.log('something is wrong', e.message); });
    //         } else {
    //             updateColumn(newColumn._id, newColumn).catch(e => { setColumns(columns); console.log('something is wrong', e.message); });
    //             if (dropResult.addedIndex !== null) {
    //                 const currentCard = _.cloneDeep(dropResult.payload);
    //                 currentCard.columnId = newColumn._id;
    //                 updateCard(currentCard._id, currentCard);
    //             }
    //         }
    //     }
    // }

    const toggleOpenAddNewColumn = () => {
        setOpenAddNewColumn(!openAddNewColumn);
    }

    const addNewColumn = async () => {
        if (newColumnName) {
            let newColumns = [...columns];
            let newColumn = {
                boardId: board._id,
                title: newColumnName
            }
            console.log(newColumn);
            await createNewColumn(newColumn).then(column => {
                newColumns.push(column);
                const newBoard = { ...board };
                newBoard.columnOrder.push(column._id);
                newBoard.columns = newColumns;
                setBoard(newBoard);
                setColumns(newColumns);
                setNewColumnName('');
                toggleOpenAddNewColumn();
            })
        } else {
            addNewColumnInput.current.focus();
        }
    }

    const saveColumnTitle = (column) => {
        let newColumns = [...columns];
        newColumns = newColumns.map(c => {
            if (c._id === column._id) return column;
            return c;
        });
        let newBoard = { ...board };
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
    }

    const removeColumn = (column) => {
        let newColumns = [...columns];
        newColumns = newColumns.filter(c => {
            return c._id !== column._id
        });
        updateColumn(column._id, {
            ...column,
            _destroy: true,
        })
        let newBoard = { ...board };
        newBoard.columns = newColumns;
        setBoard(newBoard);
        setColumns(newColumns);
    }

    const addNewCard = (column, cardContent) => {
        const newCard = {
            columnId: column._id,
            boardId: column.boardId,
            title: cardContent
        }
        createNewCard(newCard).then(card => {
            const newColumn = { ...column, cards: [...column.cards, card], cardOrder: [...column.cardOrder, card._id] }
            let newColumns = [...columns];
            newColumns = newColumns.map(c => {
                if (c._id === column._id)
                    return newColumn;
                return c;
            })
            let newBoard = { ...board };
            newBoard.columns = newColumns;
            setBoard(newBoard);
            setColumns(newColumns);
        })
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
                    <Draggable key={ column._id }>
                        <Column
                            key={ column._id }
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
