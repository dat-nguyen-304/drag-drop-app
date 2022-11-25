import React from 'react';
import './Column.scss';
import 'font-awesome/css/font-awesome.min.css';
import Card from '../Card/Card';
import { mapOrder } from '../../utilities/sorts';
import { Container, Draggable } from 'react-smooth-dnd';


function Column (props) {
    const { column, onCardDrop } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    return (
        <div className="column">
            <header className="column-drag-handle">{ column.title }</header>
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
                        <Draggable key={ index }>
                            <Card card={ card } />
                        </Draggable>
                    )) }
                </Container>
            </div>
            <footer><i className="fa fa-plus icon"></i>Add another task</footer>
        </div>
    )
}

export default Column;
