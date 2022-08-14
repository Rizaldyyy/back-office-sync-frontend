import React from 'react';
import FeatherIcon from 'feather-icons-react';
import { Badge } from 'react-bootstrap';
import classNames from 'classnames';

interface BadgesProps {
    name: string;
    color: string;
    fn: any;
}

const Badges = ({ name, color, fn } : BadgesProps) => {
    return (
        <Badge
            className={classNames(
                'me-1',
                'cursor-pointer',
                'badge bg-' + color,
                color === 'light' ? 'text-dark' : null
            )}
            onClick={fn}
        >
            {name}
        </Badge>
    );
};

export default Badges;
