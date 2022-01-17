type Machine = {
  initialState: string;
  transitions: {
    [key: string]: string[];
  };
};

const performTransition = (
  state: string,
  transition: string | undefined,
  transitions: Machine["transitions"]
) => {
  // If no transition found, move to first entry
  if (typeof transition === "undefined") {
    return transitions[state][0];
  }

  // If transition is found, move to it
  const currentTransition = transitions[state];
  if (currentTransition.includes(transition)) {
    return transition;
  }

  // If nothing guards transition, move to it
  const guards = Object.values(transitions).flat();
  if (!guards.includes(transition)) {
    return transition;
  }
  return state;
};

export const FSMachine = (machine: Machine) => {
  const { transitions, initialState } = machine;
  let state = initialState;
  let logging = false;
  let verboseLogging = false;

  return {
    transition: (transition?: string, msg = "") => {
      const nextState = performTransition(state, transition, transitions);
      if (logging && nextState !== state) {
        console.log("transitioned to:", nextState + msg);
      }
      if (verboseLogging && nextState === state) {
        console.log(
          "Skipped transition to:",
          nextState + (msg ? " " + msg : "")
        );
      }
      state = nextState;
      return state;
    },
    enableLogging(verbose?: boolean) {
      if (!logging) {
        console.log("initial state:", state);
      }
      if (verbose) {
        verboseLogging = true;
      }
      logging = true;
    },
    disableLogging() {
      logging = verboseLogging = false;
    },
    log(pre?: string) {
      if (typeof pre !== "undefined") console.log(pre, state);
      else console.log(state);
    },
    reset() {
      state = initialState;
      if (logging) console.log("reset to:", state);
      return state;
    },
    get state() {
      return state;
    }
  };
};

export const mappedKeys = <T extends string>(arr: readonly T[]) => {
  return arr.reduce(
    (o, s, i) => ({
      ...o,
      [s]: s
    }),
    {} as Record<T, T[number]>
  );
};
