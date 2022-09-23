import { useCallback, useEffect, useState } from 'react';

import Oven from '../oven/Oven';
import Switch from '../switch/Switch';
import Stamper from '../stamper/Stamper';
import Extruder from '../extruder/Extruder';

import './Machine.css';

let isInitialLoad = true;

const Machine = () => {
    const [switchValue, setSwitchValue] = useState(undefined);
    const [ovenHeated, setOvenHeated] = useState(false);

    const [pulse, setPusle] = useState(0);
    const [stopMachine, setStopMachine] = useState(false);

    const [releaseStamper, setReleaseStamper] = useState(false);
    
    const [biscuits, setBuiscuits] = useState([]);
    const [biscuitId, setBiscuitId] = useState(1);
    const [biscuitsCounter, setBuiscitsCounter] = useState(0);
    const [biscuitsBurned, setBiscuitsBurned] = useState(0);

        /**
     * Dictates the lane temp and moves it forward.
     * Sets if the biscuit is burned.
     */
        useEffect(() => {
        if (isInitialLoad) {
            isInitialLoad = false;
            return;
        }

        if (stopMachine) {
            return;
        }

        // TODO: Refactor
        let callback = () => {};
        if(switchValue === 'off') {
            callback = moveLaneForward;
        } else if (switchValue === 'on') {
            callback = initializeBiscuit;
        } else if(switchValue === 'pause'){
            callback = biscuitBurn;
            /**
             * We hold the stamper on the pause. 
             * Prevent stamp flickering when changing between on/off. 
             */
            setReleaseStamper(false);
        } else {
            return;
        }

        const interval = setInterval(() => {
            /**
             * Release the stamper if we were paused.
             */
            setReleaseStamper(true);
            setPusle((prev) => prev + 1);
            callback();
        }, 2000);

        return () => clearInterval(interval);
    }, [switchValue, biscuitId, ovenHeated, releaseStamper])

    /**
     * Moves the biscuit in the oven.
     * Determines if the biscuit is burned or not.
     * Stops the machine if there is not biscuit on the lane.
     */
    useEffect(() => {
        if (biscuits.length < 4) {
            return;
        }

        switch(biscuits.length) {
            case 4: 
                changeBiscuitPhase(3);
                break;
            // TODO: Refactor
            case 5:
                const biscuit = biscuits[4];
                if (biscuit.phase === -1) {
                    setReleaseStamper(false);
                    setBuiscuits([]);
                    setStopMachine(true);
                    return;
                }

                if (!biscuit.burned) {
                    setBuiscitsCounter(prev => prev + 1);
                } else {
                    setBiscuitsBurned(prev => prev + 1);
                }

                setBuiscuits(prev => {
                    const newState = [...prev];
                    newState.splice(newState.length - 1, 1);
                    return newState;
                })

                break;
            default:
                return;
        }

        
    }, [biscuits])

    const onSwitchChange = (evt) => {
        const val = evt.target.value;
        if  (val === 'on') {
            setStopMachine(false);
        }

        setSwitchValue(val);
    }

    const ovenheatedNotification = (heated) => {
        setOvenHeated(heated);
    }

    /**
     * Move the biscuit when the dough is spitted.
     */
    const sprayingDough = useCallback(() => {
        if (biscuits.length < 2) {
            return;
        }

       changeBiscuitPhase(1);

    }, [biscuits]);

    /**
     * Move the biscuit when the dough is stamped 
     */
    const stampTheDough = useCallback(() => {
        if (biscuits.length < 3) {
            return;
        }

        changeBiscuitPhase(2);

    }, [biscuits]);

    /**
     * Moves the lane forward when git off.
     */
    const moveLaneForward = () => {
        setBuiscuits(prev => {
            return [{phase: -1, id: biscuitId}, ...prev];
        });

        setBiscuitId(prev => prev + 1);
    }

    /**
     * Prepare a new biscuit in the extruder.
     */
    const initializeBiscuit = useCallback(() => {
        if (!ovenHeated) {
            return;
        }

        setBuiscuits(prev => {
            return [{phase: 0, burned: false, id: biscuitId}, ...prev];
        });
        setBiscuitId(prev => prev + 1);
    }, [biscuitId, ovenHeated])

    /**
     * If we hit pause and there is a biscuit in the oven,
     * we burn it.
     */
    const biscuitBurn = useCallback(() => {
        if (biscuits.length < 4) {
            return;
        }

        setBuiscuits(prev => {
            const newState = [...prev];
            if(newState[3].phase === 3) {
                newState[3].burned = true;
                return newState;
            }

            return prev;
        })
    }, [biscuitId])

    /**
     * Sets biscuit classes for animations.
     */
    const getBiscuitPhase = (item) => {
        switch(item.phase) {
            case -1: 
                return 'no-biscuit';
            case 0:
                return 'biscuit extruder';
            case 1: 
                return 'biscuit spitted';
            case 2: 
                return 'biscuit stamper';
            case 3: 
                return 'biscuit oven';
            default:
            break;
        }
    }

    /**
     * Helper method for setting the next phase of the biscuit.
     */
    const changeBiscuitPhase = useCallback((phase) => {
        setBuiscuits(prev => {
            const newState = [...prev];
            if (newState[phase] && newState[phase].phase === phase - 1) {
                newState[phase].phase = phase;
                return newState;
            }
            
            return prev;
        });
    }, [biscuits])

    // TODO: Refactor
    return (
        <div className='machine'>
            <Switch onValueChange={onSwitchChange}></Switch>
            <div>Biscuits: {biscuitsCounter}</div>
            <div>Burned Biscuits: {biscuitsBurned}</div>
            <Oven ovenHeated={ovenheatedNotification} power={switchValue}></Oven>
            
            <div className='temporary-test'>
                <Extruder className='extruder' 
                    power={switchValue} 
                    pulse={pulse} 
                    ovenHeated={ovenHeated} 
                    sprayingDough={sprayingDough} />
                <Stamper className='stamper' 
                    power={switchValue} 
                    machinePulse={pulse} 
                    ovenHeated={ovenHeated} 
                    stampTheDough={stampTheDough}
                    releaseStamper={releaseStamper} />
                
                <div className='biscuits'>
                    {biscuits.map((item) => (
                        <div key={item.id} 
                            className={getBiscuitPhase(item)}>
                            <div className={item.phase === 3 ? "biscuit-item stamped" : 'biscuit-item'}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Machine;