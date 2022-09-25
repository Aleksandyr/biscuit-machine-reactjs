import { useCallback, useEffect, useState } from 'react';

import Oven from '../oven/Oven';
import Switch from '../switch/Switch';
import Stamper from '../stamper/Stamper';
import Extruder from '../extruder/Extruder';

import './Machine.css';

let isInitialLoad = true;

const Machine = () => {
    const [switchState, setSwitchState] = useState({value: undefined, changed: false});
    const [ovenHeated, setOvenHeated] = useState(false);

    const [pulse, setPusle] = useState(0);
    const [stopMachine, setStopMachine] = useState(false);
    const [machineMessage, setMachineMessage] = useState('');

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

        /**
         * We track when the switch changed becase we
         * want to prevent the stamper from flickering
         * the stamp on every rerender once the switch 
         * value is changed.
         */
        if(switchState.changed) {
            setReleaseStamper(false);
            setSwitchState((prev) => {
                return {...prev, changed: false};
            });
        }

        shutdownTheMachine();

        if (stopMachine) {
            return;
        }

        // TODO: Refactor
        let callback = () => {};
        if(switchState.value === 'off') {
            callback = moveLaneForward;
        } else if (switchState.value === 'on') {
            callback = initializeBiscuit;
        } else if(switchState.value === 'pause'){
            callback = burnBiscuit;
            /**
             * Prevent stamping the biscuit when hit pause. 
             */
            setReleaseStamper(false);
        } else {
            return;
        }

        const timeout = setTimeout(() => {
            /**
             * Release the stamper if we were paused.
             */
            setReleaseStamper(true);
            setPusle((prev) => prev + 1);
            callback();
        }, 2000);

        return () => clearTimeout(timeout);
    }, [switchState.value, biscuitId, ovenHeated])

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
        setMachineMessage('');
        if  (val === 'on') {
            setStopMachine(false);
        }

        setSwitchState({value: val, changed: true});
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
    const initializeBiscuit = () => {
        if (!ovenHeated) {
            return;
        }

        setBuiscuits(prev => {
            return [{phase: 0, burned: false, id: biscuitId}, ...prev];
        });
        setBiscuitId(prev => prev + 1);
    }

    /**
     * If we hit pause and there is a biscuit in the oven,
     * we burn it.
     */
    const burnBiscuit = () => {
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
        });

        setMachineMessage('A biscuit has burned!')
    }

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

    const shutdownTheMachine = () => {
        const ifThereAreBiscuits = biscuits.findIndex(e => e.phase !== -1) >= 0;
        if (!ifThereAreBiscuits &&
            switchState.value === 'off') {
                setReleaseStamper(false);
                setBuiscuits([]);
                setStopMachine(true);
        }
    }

    const onPauseMessage = (msg) => {
        setMachineMessage(msg);
    }

    // TODO: Refactor
    return (
        <div className='machine'>
            <div className='message-box'>
                {machineMessage}
            </div>
            
            <div className='temporary-test'>
                <Extruder className='extruder' 
                    power={switchState.value} 
                    pulse={pulse} 
                    ovenHeated={ovenHeated} 
                    sprayingDough={sprayingDough} />
                <Stamper className='stamper' 
                    switchValState={switchState} 
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
                <Oven ovenHeated={ovenheatedNotification} power={switchState.value}></Oven>
            </div>
            <div className='lane'></div>

            <Switch onValueChange={onSwitchChange} onPauseMessageSend={onPauseMessage}></Switch>
            <div>Biscuits: {biscuitsCounter}</div>
            <div>Burned Biscuits: {biscuitsBurned}</div>
        </div>
    )
}

export default Machine;