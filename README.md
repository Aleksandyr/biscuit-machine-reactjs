# biscuit-machine-reactjs

## How to start
- npm install
- npm run start

## What might have been done better:
1. To use typescript for better typization, interfaces, enums, etc.
2. Didn't use redux as it was only max 2 levels nest of components.
3. I could have created a biscuit component for better structure and readability.

### Important info about the project:
#### Biscuit metadata: {phase, burned, id}
    Phases:
        1. In extruder
        2. On the lane
        3. Stamped
        4. In the oven
        5. In the basket
#### Warnings:
    1. If a biscuit remains more than 2 secs in the oven it burns.
    2. It's not possible to hit PAUSE after we have hit OFF. We have to wait for the oven 
        to get cold or to turn it on again.    

#### Components:
    1. Machine - the engine and the controll center.
    2. Stamper
    3. Extruder
    4. Switch
    5. Oven
        * Rheotan
