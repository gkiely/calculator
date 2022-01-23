import React from 'react';

import { Location } from '../utils/types';
import { buttonClass, getButtonColorClass, getContainerWidthClass, containerClass } from '../styles';

interface ButtonType {
  containerClassName?: string;
  className?: string;
  key: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactChild;
}

export const Button = ({ containerClassName, className, key, onClick, children }: ButtonType) => {
  return (
    <div className={containerClassName}>
      <button key={key} onClick={(e) => onClick(e)} className={className}>
        {children}
      </button>
    </div>
  );
};

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

const ButtonContainer = ({ id, text, operation = false, wide = false, location }: ButtonContainerType) => {
  return (
    <Button
      key={id}
      onClick={() => {
        location.update((prev) => ({
          input: prev.input ? prev.input + text : text,
        }));
      }}
      containerClassName={`${containerClass} ${getContainerWidthClass(wide)}`}
      className={`${buttonClass} ${getButtonColorClass(operation)}`}
    >
      {text}
    </Button>
  );
};

export default ButtonContainer;
