import React from "react";
import { css } from "@emotion/css";
import { useHistory, useLocation } from "react-router-dom";
import { calculator, states } from "../machines/calculator";
import { Location } from '../App';

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
  wide?: boolean;
  result: number;
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

const handleTransition = (text = "") => {
  if (text === "=") {
    return calculator.transition(states.calculated);
  }
  if (text === "AC") {
    return calculator.transition(states.cleared);
  }
  return calculator.transition(states.inputting);
};

const ButtonContainer = ({
  id,
  text,
  operation = false,
  wide = false,
  result,
  location,
}: ButtonContainerType) => {
  let history = useHistory();
  let { pathname } = useLocation();
  const lastEntry = pathname.substr(-1);
  const entry = Number(text);

  calculator.enableLogging(true);

  return (
    <Button
      key={id}
      // onClick={() => transition(transitions[key])}
      // }}
      onClick={() => {
        // console.log(text, result, entry, lastEntry);

        // Pressing an operator on start causes an error
        // if (lastEntry === "/" && isNaN(Number(text))) return;

        // Example of using machine transitions
        // handleTransition(text);

        // TODO: can this be refactored now we have states?
        if (text === "AC") {
          calculator.transition(states.cleared);
          history.push("");
        }
        // Another operation after getting result
        else if (lastEntry === "=" && isNaN(entry)) {
          if (text === "=") {
            calculator.transition(states.calculated);
          } else {
            calculator.transition(states.inputting);
          }
          history.push(result + text);
        } else if (lastEntry === "=") {
          calculator.transition(states.calculated);
          // update(text);
          history.push("/" + text);
        }
        // Prevent operators incorrectly being calculated
        else if (
          pathname.length > 1 &&
          isNaN(Number(lastEntry)) &&
          isNaN(entry)
        ) {
          return;
        } else {
          console.log(location);
          console.log('>>>>>>', text);
          if (text === "=") {
            calculator.transition(states.calculated);
          } else {
            calculator.transition(states.inputting);
          }
          history.push(pathname + text);
        }
      }}
      containerClassName={`${containerClass} ${getContainerWidthClass(wide)}`}
      className={`${buttonClass} ${getButtonColorClass(operation)}`}
    >
      {text}
    </Button>
  );
};

export default ButtonContainer;
