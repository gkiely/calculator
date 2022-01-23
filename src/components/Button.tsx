import React from 'react';

import { Location } from '../utils/types';
import { buttonClass, getButtonColorClass, getContainerWidthClass, containerClass } from '../styles';

interface Props {
  containerClassName?: string;
  className?: string;
  key: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactChild;
}

export const Button = ({ containerClassName, className, key, onClick, children }: Props) => {
  return (
    <div className={containerClassName}>
      <button key={key} onClick={(e) => onClick(e)} className={className}>
        {children}
      </button>
    </div>
  );
};

interface ContainerProps {
  id: string;
  text: string;
  operation?: boolean;
  wide?: boolean;
  location: Location;
}

const ButtonContainer = ({ id, text, operation = false, wide = false, location }: ContainerProps) => {
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
