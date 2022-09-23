import { useEffect } from "react"

import './Extruder.css';
const ExtruderSvg = process.env.PUBLIC_URL + '/svg/extruder.svg';

let initialLoad = true;

const Extruder = ({power, pulse, ovenHeated, sprayingDough}) => {

    useEffect(() => {
        if(initialLoad) {
            initialLoad = false;
            return;
        }

        if (!ovenHeated || (!power || power === 'pause')) {
            return;
        }

        /**
         * Tells the machine when to spit the dough.
         */
        sprayingDough();
    }, [power, pulse, ovenHeated, sprayingDough]);

    return (
        <div className="Extruder">
            <object data={ExtruderSvg} width="70" height="60"> </object>
        </div>
    )
}

export default Extruder;