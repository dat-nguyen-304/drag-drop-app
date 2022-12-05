import React, { useEffect, useState, useRef } from 'react';
import './Column.scss';
import 'font-awesome/css/font-awesome.min.css';
import Card from '../Card/Card';
import ConfirmModal from '../Common/ConfirmModal';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';
import { updateColumn } from '../../actions/APICall/index';

function Column (props) {
    const { column, onCardDrop, saveColumnTitle, removeColumn, addNewCard } = props;
    const [columnTitle, setColumnTitle] = useState('');
    const [newCardContent, setNewCardContent] = useState('');

    const [modalConfirm, setModalConfirm] = useState(false);
    const toggleConfirmModal = () => {
        setModalConfirm(!modalConfirm);
    };

    const [openAddNewCard, setOpenAddNewCard] = useState(false);
    const toggleOpenAddNewCard = () => {
        setOpenAddNewCard(!openAddNewCard);
        console.log(addNewCardArea.current);
    };

    const cards = mapOrder(column.cards, column.cardOrder, '_id');
    let changeTitleInput = useRef();
    let addNewCardArea = useRef();
    const changeTitleColumn = (e) => {
        setColumnTitle(e.target.value);
    }

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title])

    useEffect(() => {
        if (openAddNewCard) {
            if (addNewCardArea.current)
                addNewCardArea.current.focus();
        }
    }, [openAddNewCard])

    const saveColumnByPressEnter = (e) => {
        if (columnTitle) {
            if (e.key === 'Enter') {
                e.target.blur();
                if (columnTitle !== column.title) {
                    const newColumn = {
                        ...column,
                        title: columnTitle
                    }
                    updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                        saveColumnTitle(newColumn);
                    })
                }
            }
        } else {
            e.target.blur();
            setColumnTitle(column.title);
        }
    }

    const saveColumnByBlur = () => {
        if (columnTitle && columnTitle !== column.title) {
            const newColumn = {
                ...column,
                title: columnTitle
            }
            updateColumn(newColumn._id, newColumn).then(updatedColumn => {
                saveColumnTitle(newColumn);
            })
        } else setColumnTitle(column.title);
    }

    const handleClick = (e) => {
        e.target.focus();
    }

    const handleFocus = () => {
        const end = changeTitleInput.current.value.length;
        changeTitleInput.current.setSelectionRange(end, end);
    }

    const handleRemoveColumn = () => {
        removeColumn(column);
        toggleConfirmModal();
    }

    const handleAddNewCard = () => {
        addNewCard(column, newCardContent);
        toggleOpenAddNewCard();
        setNewCardContent('');
    }

    return (
        <div className="column">
            <header className="column-drag-handle">
                <div className="column-header-container">
                    <Form.Control
                        ref={ changeTitleInput }
                        className="column-name-input-editable" size="sm" type="text"
                        placeholder="Column name..."
                        value={ columnTitle }
                        onChange={ changeTitleColumn }
                        onKeyDown={ (e) => saveColumnByPressEnter(e) }
                        onBlur={ saveColumnByBlur }
                        onMouseDown={ e => { e.preventDefault(); e.target.blur(); } }
                        onClick={ e => handleClick(e) }
                        onFocus={ handleFocus }
                    />
                    <Dropdown>
                        <Dropdown.Toggle className="column-header-menu" />

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={ toggleConfirmModal }>Delete Column</Dropdown.Item>
                            <Dropdown.Item onClick={ () => changeTitleInput.current.focus() }>Rename</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                        </Dropdown.Menu>
                        <ConfirmModal
                            showModal={ modalConfirm }
                            toggleConfirmModal={ toggleConfirmModal }
                            confirm={ () => handleRemoveColumn() }
                            title="Confirm delete column"
                            content={ `Are you sure you want to remove <strong>${columnTitle}</strong>. </br>
                            All related card will be also deleted.`}
                        />
                    </Dropdown>
                </div>
            </header >
            <div className="card-list">
                <Container
                    orientation="vertical"
                    groupName="dat-nguyen"
                    // onDragStart={ e => console.log('drag started', e) }
                    // onDragEnd={ () => { } }
                    onDrop={ dropResult => onCardDrop(column, dropResult) }
                    getChildPayload={ index => cards[index] }
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    // onDragEnter={ () => {
                    //     console.log('drag enter:', column._id);
                    // } }
                    // onDragLeave={ () => {
                    //     console.log('drag leave:', column._id);
                    // } }
                    // onDropReady={ p => console.log('Drop ready: ', p) }
                    dropPlaceholder={ {
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'card-drop-preview'
                    } }
                    dropPlaceholderAnimationDuration={ 200 }
                >
                    { cards.map((card, index) => (
                        <Draggable key={ card._id }>
                            <Card key={ card._id } card={ card } />
                        </Draggable>
                    )) }
                    { openAddNewCard &&
                        <Form.Control
                            className="new-task-area" size="sm" as="textarea"
                            placeholder="Column name..."
                            value={ newCardContent }
                            ref={ addNewCardArea }
                            onChange={ e => { setNewCardContent(e.target.value) } }
                        />
                    }
                </Container>
            </div>
            <footer>
                { !openAddNewCard ?
                    <div className="open-add-new-card-button" onClick={ toggleOpenAddNewCard }>
                        <i className="fa fa-plus icon"></i><span>Add another task</span>
                    </div>
                    :
                    <div className="add-new-card-action">
                        <Button variant="success" size="sm"
                            onClick={ handleAddNewCard }
                        >
                            Add task
                        </Button>
                        <i className="fa fa-trash cancel-icon" onClick={ toggleOpenAddNewCard }></i>
                    </div>
                }
            </footer>
        </div >
    )
}

export default Column;
