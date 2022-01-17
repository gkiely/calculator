import { FSMachine, mappedKeys } from "../utils/FSMachine";

// Updated syntax
export const states = mappedKeys(["red", "yellow", "green", "flashingYellow"]);

export const lightMachine = FSMachine({
  initialState: states.red,
  transitions: {
    [states.red]: [states.green],
    [states.yellow]: [states.red],
    [states.green]: [states.yellow],
    [states.flashingYellow]: [states.red]
  }
});

// Example usage
// lightMachine.log();
// lightMachine.transition(states.yellow); // does nothing, this transition is not supported
// lightMachine.log();
// lightMachine.transition(states.green); // "green"
// lightMachine.log();
// lightMachine.transition(); //  "yellow"
// lightMachine.log();
// lightMachine.transition(states.flashingYellow); // jumps to "flashingYellow"
// lightMachine.log();
// lightMachine.reset(); // Resets back to red
// lightMachine.log();

// This is much better than determining a bunch of if-checks:
// https://zohaib.me/leverage-union-types-in-typescript-to-avoid-invalid-state/
// https://gist.github.com/zabirauf/abb8f16ad409c109556d708d79a529ea#file-traffic-light-with-no-invalid-states-ts
// Then we just determine how our UI displays based off that single state
