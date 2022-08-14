import React, { useState } from 'react';
import { Card, Toast } from 'react-bootstrap';
import classNames from 'classnames';

// images
import logo from '../../assets/images/logo-sm.png';

interface buttonsProps {
    message: string;
    color: string;
}

const Toasts = ({ message, color } : buttonsProps) => {
    const [show, setShow] = useState<boolean>(true);

    return (
        <Toast className="mb-2 position-fixed" style={{bottom: "20px", right: "20px", zIndex: "10"}} onClose={() => setShow(false)} show={show} autohide>
            <Toast.Header>
                <img src={logo} alt="brand-logo" height="18" className="me-1 me-auto" />
            </Toast.Header>
            <Toast.Body className={classNames(
                'text-white',
                'bg-' + color,
            )}>{ message }</Toast.Body>
        </Toast>
    );
};

export default Toasts;
