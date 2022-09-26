# biscuit-machine-reactjs

## What might have been done better:
1. To use typescript for better typization, interfaces, enums, etc.
2. Didn't use redux as it was only max 2 levels nest of components.

### Important info about the project:
1. Biscuit metadata: {phase, burned, id}
    a. Phases:
        1. In extruder
        2. On the lane
        3. Stamped
        4. In the oven
        5. In the basket
4. Warnings:
    1. If a biscuit remains more than 2 secs in the oven it burns.
    2. It's not possible to hit pause after we have hit off. We have to wait for the oven to get cold or to turn it on again.    

5. Components:
  1. Machine - the engine and the controll center.
  2. Stamper
  3. Extruder
  4. Switch
  5. Oven
    a. Rheotan
