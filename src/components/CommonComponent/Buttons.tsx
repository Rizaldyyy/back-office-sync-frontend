import { Button } from 'react-bootstrap';
interface buttonsProps {
    name: string;
    color: string;
    classes: string;
    fn?: any;
}

const Buttons = ({ name, color, classes, fn} : buttonsProps) => {
    return (
        <Button variant={color} className={classes} onClick={fn}>
            { name }
        </Button>
    );
};

export default Buttons;
