import { useState } from 'react';

import './Switch.css';

const Switch = ({onValueChange}) => {
    const [pauseState, setPauseState] = useState(false);

    const onSwitchChange = (evt) => {
        if (evt.target.value === 'off') {
            setPauseState(true);
            return;
            // evt.preventDefault();
        } 

        if(pauseState) {
            setPauseState(false);
        }

        onValueChange(evt);
    }

    return (
        <fieldset className="machine-switch" onChange={onSwitchChange}>
            <label htmlFor="on">On</label>
            <input type="radio" name="switch" id="on" value="on" />
            <label htmlFor="pause">Pause</label>
            <input type="radio" name="switch" id="pause" value="pause" disabled={pauseState} />
            <label htmlFor="off">Off</label>
            <input type="radio" name="switch" id="off" value="off" />
        </fieldset>
    )
}

export default Switch;