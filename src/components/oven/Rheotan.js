import { useCallback, useEffect, useState } from "react";

import './Rheotan.css';

let initialLoad = true;

const Rheotan = ({ovenState, preheating, onDegChange, regulator, shutDown}) => {
    const [deg, setDeg] = useState(0);

    const getDeg = useCallback(() => {
        if (preheating) {
            return 50;
        }

        if (shutDown) {
            return -15;
        }

        if (regulator) {
            return -5
        } 
        
        if (!regulator && deg >= 220) {
            return 5;
        }

        return 0;
    }, [preheating, shutDown, regulator, deg])

    useEffect(() => {
        if(!ovenState || initialLoad) {
            initialLoad = false;
            return;
        }

        setRheotanColor(deg);

        const timeOut = setTimeout(() => {
            setDeg(prevVal => {
                const val = prevVal + getDeg();
                return val <= 0 ? 0 : val > 240 ? 240 : val;
            });
        }, 1000)
        
        onDegChange(deg);
        return () => clearTimeout(timeOut);
    }, [deg, ovenState, getDeg])
    

    const setRheotanColor = (color) => {
        document.documentElement.style.setProperty('--rheotan-color', `rgba(230, 23, 19, ${(deg / 1000 * 2)})`);
    }
    return (<>
            <div className='rheotan'></div>
    </>)
}

export default Rheotan;