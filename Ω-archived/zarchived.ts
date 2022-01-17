// import { Machine } from "xstate";

// type StringObj = {
//   [key: string]: string;
// };

// interface NestedStringObj {
//   [key: string]: StringObj;
// }

// const createKeyedObject = (...args: string[] | string[][]): WeakObj => {
//   const arr = (args.length === 1 && Array.isArray(args)
//     ? args[0]
//     : args) as string[];
//   return arr.reduce((o: WeakObj, key: string) => ({ ...o, [key]: key }), {});
// };

// import "./styles.css";
// import { useState } from "react";

// import { calculator, transitions } from "./calculator-machine";
// import { useFSMachine } from "./FSMachine";

// export function getKeys<O>(o: O) {
//   return Object.keys(o) as (keyof O)[];
// }

// // function useForceUpdate() {
// //   const [, setValue] = useState(0);
// //   return () => setValue((value) => value + 1);
// // }

// export default function App() {
//   const keys = getKeys(transitions);
//   // const [state, setState] = useState(calculator.state);

//   // TODO: replace useState with useFSMachine hook
//   const [state, transition] = useFSMachine(calculator);

//   return (
//     <div className="App">
//       {keys.map((key) => (
//         <button
//           onClick={() => {
//             // calculator.transition(transitions[key]);
//             // setState(calculator.state);
//             transition(transitions[key]);
//           }}
//           key={key}
//         >
//           {key}
//         </button>
//       ))}
//       <br />
//       <br />
//       {state}
//     </div>
//   );
// }

// export const useFSMachine = (machine: ReturnType<typeof FSMachine>) => {
//   const [state, setState] = useState(machine.state);

//   const transition = (transition: Transition) => {
//     machine.transition(transition);
//     if (state !== machine.state) {
//       setState(machine.state);
//     }
//     return machine.state;
//   };

//   return [machine.state, transition] as const;
// };
