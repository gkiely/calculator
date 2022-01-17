import { FSMachine, mappedKeys } from "../utils/FSMachine";

export const states = mappedKeys(["cleared", "inputting", "calculated"]);

export const calculator = FSMachine({
  initialState: states.cleared,
  context: {
    input: "",
    result: "",
  },
  // update: ({text: string}) => {
    
  // },
  transitions: {
    [states.cleared]: [states.inputting],
    [states.inputting]: [states.cleared, states.calculated],
    [states.calculated]: [states.cleared, states.inputting]
  }
});
