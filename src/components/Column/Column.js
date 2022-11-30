import React, { useEffect, useState, useRef } from 'react';
import './Column.scss';
import 'font-awesome/css/font-awesome.min.css';
import Card from '../Card/Card';
import ConfirmModal from '../Common/ConfirmModal';
import { Dropdown, Form } from 'react-bootstrap';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';

function Column (props) {
    const { column, onCardDrop, saveColumnTitle, removeColumn } = props;
    const [columnTitle, setColumnTitle] = useState('');
    const [modalConfirm, setModalConfirm] = useState(false);
    const cards = mapOrder(column.cards, column.cardOrder, 'id');
    let changeTitleInput = useRef();

    const changeTitleColumn = (e) => {
        setColumnTitle(e.target.value);
    }

    useEffect(() => {
        setColumnTitle(column.title);
    }, [column.title])

    const saveColumnByPressEnter = (e) => {
        if (columnTitle) {
            if (e.key === 'Enter') {
                e.target.blur();
                saveColumnTitle({
                    ...column,
                    title: columnTitle
                })
            }
        } else {
            e.target.blur();
            setColumnTitle(column.title);
        }
    }

    const saveColumnByBlur = () => {
        if (columnTitle) {
            saveColumnTitle({
                ...column,
                title: columnTitle
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

    const toggleConfirmModal = () => {
        setModalConfirm(!modalConfirm);
    }

    const handleRemoveColumn = () => {
        removeColumn(column.id);
        toggleConfirmModal();
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
                    //     console.log('drag enter:', column.id);
                    // } }
                    // onDragLeave={ () => {
                    //     console.log('drag leave:', column.id);
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
                        <Draggable key={ card.id }>
                            <Card key={ card.id } card={ card } />
                        </Draggable>
                    )) }
                </Container>
            </div>
            <footer>
                <div className="add-new-task-container">
                    <i className="fa fa-plus icon"></i><span>Add another task</span>
                </div>
            </footer>
        </div >
    )
}

export default Column;
