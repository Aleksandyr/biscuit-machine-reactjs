import './Switch.css';

const Switch = (props) => {

    return (
        <fieldset className="machine-switch" onChange={props.onValueChange}>
            <label htmlFor="on">On</label>
            <input type="radio" name="switch" id="on" value="on" />
            <label htmlFor="pause">Pause</label>
            <input type="radio" name="switch" id="pause" value="pause" />
            <label htmlFor="off">Off</label>
            <input type="radio" name="switch" id="off" value="off" />
        </fieldset>
    )
}

export default Switch;