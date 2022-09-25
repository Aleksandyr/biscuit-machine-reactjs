import { useState } from 'react';

import './Switch.css';

const Switch = ({onValueChange, onPauseMessageSend}) => {
    const [disablePause, setDisablePause] = useState(false);

    const onSwitchChange = (evt) => {
        if(disablePause) {
            setDisablePause(false);
        }

        if (evt.target.value === 'off') {
            setDisablePause(true);
        } 

        onValueChange(evt);
    }

    const onPauseClick = () => {
        if(disablePause) {
            onPauseMessageSend('You can\'t pause the machine while it is turnning down.')
        }
    }

    return (
        <fieldset className="machine-switch" onChange={onSwitchChange}>
            <label htmlFor="on">On</label>
            <input type="radio" name="switch" id="on" value="on" />
            <label htmlFor="pause">Pause</label>
            <input type="radio" name="switch" id="pause" value="pause" 
                onPointerDown={onPauseClick} disabled={disablePause} />
            <label htmlFor="off">Off</label>
            <input type="radio" name="switch" id="off" value="off" />
        </fieldset>
    )
}

export default Switch;