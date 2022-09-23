import { useCallback, useEffect, useState } from "react";
import Rheotan from "./Rheotan";

const Oven = (props) => {
    const [preheating, setPreheating] = useState(false);
    const [heated, setHeated] = useState(false);
    const [regulator, setRegulator] = useState(false);
    const [shutDown, setShutDown] = useState(false);

    /**
     * Start preheating or shutdown
     */ 
    useEffect(() => {
        if(props.power === 'on') {
            setPreheating(true);
            setShutDown(false);
        }

        if(props.power === 'off') {
            setShutDown(true);
            setRegulator(false);
        }

    }, [props.power])

    // Enables regulator and stops preheating
    const onDegChange = useCallback((deg) => {
        /**
         * Once the oven is heated to 240 deg
         * Turn on the regulator and set heated state
         */
        if (preheating && deg >= 240) {
            setPreheating(false);
            setHeated(true);
            props.ovenHeated(true);
        }

        if (heated && deg >= 240) {
            setRegulator(true);
        }

        if (heated && deg <= 220) {
            setRegulator(false);
        }

        if (heated && deg <= 100) {
            setHeated(false);
            props.ovenHeated(false);
        }
        /**
         * Shut down the oven and set heated to false.
         */
        if (deg <= 0 && shutDown) {
            setShutDown(false);
        }
    }, [heated, preheating, shutDown])

    return (
        <div>
            <Rheotan ovenState={props.power} 
                preheating={preheating} 
                onDegChange={onDegChange} 
                regulator={regulator} 
                shutDown={shutDown}></Rheotan>
        </div>
    )
}

export default Oven;