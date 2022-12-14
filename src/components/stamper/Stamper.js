import { useEffect, useState } from "react"

import './Stamper.css';

let initialLoad = true;

const Stamper = ({switchValState, machinePulse, ovenHeated, setStamper, releaseStamper}) => {

    useEffect(() => {
        if(initialLoad) {
            initialLoad = false;
            return;
        }

        /**
         * If we hit pause we do not send stamp signals to the machine.
         */
        if (!ovenHeated || (!switchValState.value || switchValState.value === 'pause')) {
            return;
        }

        /**
         * Tells the machine when to stamp the biscuit.
         */
        setStamper(true);
    }, [switchValState, ovenHeated, setStamper, machinePulse]);

    return (
        <StamperSVG ovenHeated={ovenHeated} switchValState={switchValState} releaseStamper={releaseStamper}></StamperSVG>
    )
}

export default Stamper;

const StamperSVG = ({ovenHeated, switchValState, releaseStamper}) => {
    const [stampDistance, setStampDistance] = useState(18);
    const [pulse, setPulse] = useState(0);

    useEffect(() => {

        if(!switchValState.value) {
            return;
        }

        /**
         * We hold the stamp up between on/off/pause switches. 
         * Otherwise it runs right after we change the switch value
         * over a biscuit it looks like the stamp goes over the 
         * biscuit without stamping it. Like a flicker.
         */
        if(!releaseStamper || switchValState.value === 'pause' || switchValState.changed) {
            setStampDistance(18);
            return;
        }

        /**
         *  When the oven is shut down we turn the stamp up.
         */ 
        if (!ovenHeated) {
            setStampDistance(18);
            return;
        }

        setStampDistance(prev => {
            return prev === 18 ? 0 : 18
        });

        const timeout = setTimeout(() => {
            setPulse((prev) => prev + 1);
        }, 1000)

        return () => clearTimeout(timeout);
    }, [pulse, ovenHeated, switchValState, releaseStamper]);

    const animate = `#stamp { 
        transform: translateY(-${stampDistance}px);
    }`; 
    return (
        <svg className="stamper-machine" width="59" height="94" viewBox="0 0 59 88" fill="none">
            <style>
                {animate}
            </style>
            <g id="stamper">
                <g id="stamp">
                    <g id="Rectangle 2">
                        <mask id="path-1-inside-1_14_27" fill="white">
                            <path d="M27.6 61H32.6V79H27.6V61Z" />
                        </mask>
                        <path d="M27.6 61H32.6V79H27.6V61Z" fill="#D9D9D9" />
                        <path d="M31.6 61V79H33.6V61H31.6ZM28.6 79V61H26.6V79H28.6Z" fill="#9B7F7F" mask="url(#path-1-inside-1_14_27)" />
                    </g>
                    <path id="Vector 5" d="M13 91.5L22.5 79H38L48.5 91.5H13Z" fill="#D9D9D9" stroke="#9B7F7F" />
                </g>
                <g id="body">
                    <path id="Vector 2" d="M16.5455 54.8636L1 1H58L42.4545 54.8636H16.5455Z" fill="#D9D9D9" stroke="#9B7F7F" />
                    <path id="Vector 3" d="M26.1364 61L21.5 55H38.5L33.8636 61H26.1364Z" fill="#D9D9D9" stroke="#9B7F7F" />
                </g>
            </g>
        </svg>
    )
}