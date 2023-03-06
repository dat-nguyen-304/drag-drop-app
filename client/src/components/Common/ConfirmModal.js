import React, { useState, useEffect } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import HTMLReactParser from 'html-react-parser';
import { Modal, Button } from 'react-bootstrap';

function ConfirmModal ({ showModal, toggleConfirmModal, title, content, confirm }) {
    return (
        <Modal show={ showModal } onHide={ toggleConfirmModal } backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{ title }</Modal.Title>
            </Modal.Header>
            <Modal.Body>{ HTMLReactParser(DOMPurify.sanitize(content)) }</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={ toggleConfirmModal }>
                    Close
                </Button>
                <Button variant="danger" onClick={ confirm }>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal;