import React from 'react';
import './Card.scss';

function Card (props) {
    const { card } = props;
    console.log(card.id);
    return (
        <li className="card-item">
            { (card && card.cover) &&
                <img src={ card.cover } className="card-cover" alt="" />
            }
            Title Dat Nguyen
        </li>

    )
}

export default Card;
