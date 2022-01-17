import React from "react";
import { css } from "@emotion/css";

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

const ButtonContainer = ({
  id,
  text,
  operation = false,
  wide = false,
  location,
}: ButtonContainerType) => {
  return (
    <Button
      key={id}
      onClick={() => {
        location.update(prev => ({input: prev.input ? prev.input + text : text }));
      }}
      containerClassName={`${containerClass} ${getContainerWidthClass(wide)}`}
      className={`${buttonClass} ${getButtonColorClass(operation)}`}
    >
      {text}
    </Button>
  );
};

export default ButtonContainer;
