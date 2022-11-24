import React from 'react';
import './Column.scss';
import Task from '../Task/Task';
function Column () {
    return (
        <div className="column">
            <header>Brainstorm</header>
            <ul className="task-list">
                <Task />
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>
                <li className="task-item">Add what you want</li>

            </ul>
            <footer>Add another card</footer>
        </div>
    )
}

export default Column;
