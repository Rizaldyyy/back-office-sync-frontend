import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalsProps {
    name: string;
    fn?: any;
}

const Modals = ({ name, fn } : ModalsProps) => {
    const [show, setShow] = useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="button-list">
                <Button variant="primary" className="btn-sm" onClick={handleShow}>
                    {name}
                </Button>
            </div>

            {/* standard modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header onHide={handleClose} closeButton>
                    <Modal.Title as="h5">{name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Close
                    </Button>{' '}
                    <Button variant="primary" onClick={fn}>
                        Save changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Modals;