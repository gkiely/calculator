import { FSMachine, mappedKeys } from "../utils/FSMachine";

export const states = mappedKeys(["cleared", "inputting", "calculated"]);

// const handleTransition = (text: string) => {
//   if (text === "=") {
//     return calculator.transition(states.calculated);
//   }
//   if (text === "AC") {
//     return calculator.transition(states.cleared);
//   }
//   return calculator.transition(states.inputting);
// };


export const calculator = FSMachine({
  initialState: states.cleared,
  context: {
    input: "",
    result: "",
  },
  transitions: {
    [states.cleared]: [states.inputting],
    [states.inputting]: [states.cleared, states.calculated],
    [states.calculated]: [states.cleared, states.inputting]
  }
});
