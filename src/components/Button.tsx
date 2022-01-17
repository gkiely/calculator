import React from "react";
import { css } from "@emotion/css";
import { useHistory, useLocation } from "react-router-dom";

import { calculator, states } from "../machines/calculator";
import { Location } from '../App';
import { WeakObj } from '../routes';

const buttonClass = css`
  border: 0;
  font-size: 3.7rem;
  border-right: 1px solid #858694;
  border-top: 1px solid #858694;
  flex: 1;
`;

const getButtonColorClass = (operation: boolean) => css`
  ${operation
    ? `background-color: #f5923e; color: white;`
    : `background-color: #e0e0e0; color: black;`}
`;

const getContainerWidthClass = (wide: boolean) => css`
  ${wide ? `width: 75%;` : `width: 25%;`}
`;

const containerClass = css`
  height: 100%;
  display: inline-flex;
`;

interface ButtonContainerType {
  id: string;
  text: string;
  operation?: boolean;
  operator?: boolean;
  wide?: boolean;
  result: number;
  input: string;
  location: Location;
}

interface ButtonType {
  containerClassName: string;
  className: string;
  key: string;
  onClick?: Function;
  children?: React.ReactChild;
}

export const Button = ({
  containerClassName,
  className,
  key,
  onClick,
  children
}: ButtonType) => (
  <div className={containerClassName}>
    <button key={key} onClick={(e) => onClick?.(e)} className={className}>
      {children}
    </button>
  </div>
);

const handleTransition = (text: string) => {
  if (text === "=") {
    return calculator.transition(states.calculated);
  }
  if (text === "AC") {
    return calculator.transition(states.cleared);
  }
  return calculator.transition(states.inputting);
};

const getInput = (
  text: string,
  lastState: typeof calculator.state,
  state: ReturnType<typeof handleTransition>,
  input: string,
  result: number,
  operator: boolean,
) => {
  const lastChar = input.slice(-1);
  if(state === "cleared"){
    return '';
  }

  // Prevent double =
  if(state === "calculated" && lastState === "calculated") {
    return;
  }
  
  // Prevent double operators
  if((state === "inputting" || state === "calculated") && lastState !== "calculated" && Number.isNaN(+lastChar) && operator){
    return;
  }

  // Allow calculating from a previous result
  if(lastState === "calculated" && state === "inputting"){
    return result + text;
  }
  return input ? input + text : text;

}

const ButtonContainer = ({
  id,
  text,
  operation = false,
  operator = false,
  wide = false,
  result,
  input,
  location,
}: ButtonContainerType) => {
  // let history = useHistory();
  // let { pathname } = useLocation();
  // const lastEntry = pathname.substr(-1);
  // const entry = Number(text);

  calculator.enableLogging(true);

  return (
    <Button
      key={id}
      // onClick={() => transition(transitions[key])}
      // }}
      onClick={() => {

        // Next
        // We should just be sending events/transitions to the machine
        // Context should be stored updated, not in our own app state, and then passed to the route

        const lastState = calculator.state;
        const state = handleTransition(text);
        const lastChar = input?.slice(-1);
        
        // This is what I want
        // Calculate calls a lot of the same things that route does
        // Returns the input and, we call location.update
        // const nextInput = calculator.send({text, routeState});
        // if(nextInput){
        //   location.update({input: nextInput});
        // }

        

        // Prevent double =
        if(state === "calculated" && lastState === "calculated") {
          return;
        }
        
        // Prevent double operators
        if((state === "inputting" || state === "calculated") && lastState !== "calculated" && Number.isNaN(+lastChar) && operator){
          return;
        }

        // Allow calculating from a previous result
        if(lastState === "calculated" && state === "inputting"){
          return location.update({input: result + text});
        }

        return location.update({input: input ? input + text : text});
      }}
      containerClassName={`${containerClass} ${getContainerWidthClass(wide)}`}
      className={`${buttonClass} ${getButtonColorClass(operation)}`}
    >
      {text}
    </Button>
  );
};

export default ButtonContainer;
