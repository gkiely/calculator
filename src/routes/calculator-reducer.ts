import { doMath, isValidInput } from '../utils';
import { Route } from '../utils/types';
import { emitter, State } from './third';

// ------ Reducer ------
export const reducer: Route<State>['reducer'] = (state, action) => {
  const { type, payload } = action;
  const input = state.input + payload;
  const prevChar: string = input[input.length - 2];
  const currentChar: string = input[input.length - 1];

  switch (type) {
    case 'input':
      if (prevChar === '=') {
        const result = doMath(input.substring(0, input.length - 1));
        return {
          ...state,
          input: result + currentChar,
          result: '',
        };
      }
      if (isValidInput(input)) {
        return {
          ...state,
          input,
        };
      }
      return state;
    case 'clear':
      return {
        buttonText: 3,
        input: '',
        result: '',
      };
    case 'calculate':
      if (isValidInput(input)) {
        return {
          ...state,
          result: doMath(input),
          input,
        };
      }
      return state;
    default:
      return state;
  }
};

// ------ Effects ------
export const effects: Route<State>['effects'] = async (state, { type, payload }, requests) => {
  switch (type) {
    case 'fetch':
      if (typeof payload === 'string') {
        const data = await requests.get(payload);
        emitter.emit('update', {
          buttonText: data.id,
        });
      }
    default:
      return;
  }
};