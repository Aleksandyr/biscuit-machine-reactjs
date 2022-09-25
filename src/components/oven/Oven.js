import { useCallback, useEffect, useState } from "react";
import Rheotan from "./Rheotan";

import "./Oven.css";

const Oven = (props) => {
    const [preheating, setPreheating] = useState(false);
    const [heated, setHeated] = useState(false);
    const [regulator, setRegulator] = useState(false);
    const [shutDown, setShutDown] = useState(false);
    const [rheotanDeg, setRheotanDeg] = useState(0);

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
        setRheotanDeg(deg);
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
        <div className="oven">
            <svg width="141" height="92" viewBox="0 0 141 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="oven" d="M0.5 1V91H14.5V49.8571H126.5V91H140.5V1H0.5Z" stroke="black"/>
            </svg>

            <div className="oven-deg">
                <div className="oven-deg__text">{rheotanDeg}</div>
            </div>
            <Rheotan ovenState={props.power} 
                preheating={preheating} 
                onDegChange={onDegChange} 
                regulator={regulator} 
                shutDown={shutDown}></Rheotan>
        </div>
    )
}

export default Oven;