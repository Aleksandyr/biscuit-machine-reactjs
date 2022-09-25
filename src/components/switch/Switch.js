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
            onPauseMessageSend('You can\'t pause the machine while oven is turnning down!')
        }
    }

    return (
        <fieldset className="machine-switch" onChange={onSwitchChange}>
            <div className='radio-button'>
                <input type="radio" name="switch" id="on" value="on" />
                <label className='radio-label' htmlFor="on">On</label>
            </div>
            <div className="radio-button">
                <input type="radio" name="switch" id="pause" value="pause" 
                    onPointerDown={onPauseClick} disabled={disablePause} />
                <label className='radio-label' htmlFor="pause">Pause</label>
            </div>
            <div className="radio-button">
                <input type="radio" name="switch" id="off" value="off" />
                <label className='radio-label' htmlFor="off">Off</label>
            </div>
        </fieldset>
    )
}

export default Switch;