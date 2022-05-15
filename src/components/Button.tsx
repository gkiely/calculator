import React from 'react';
import { buttonClass, getButtonColorClass, getContainerWidthClass, containerClass } from '../styles';
import { Path, RouteAction, RouteLocation } from '../routes/third';
// import { Path, RouteAction, RouteState } from '../routes/types';

interface ComponentProps {
  containerClassName?: string;
  className?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactChild;
}

export const Button = ({ containerClassName, className, onClick, children }: ComponentProps) => {
  return (
    <div className={containerClassName}>
      <button onClick={(e) => onClick(e)} className={className}>
        {children}
      </button>
    </div>
  );
};

export interface ButtonProps {
  action?: RouteAction;
  text: string;
  routeParam?: string;
  operation?: boolean;
  wide?: boolean;
  location: RouteLocation;
  to?: Path;
}

const ButtonContainer = ({ action, text, operation = false, wide = false, location, to }: ButtonProps) => {
  return (
    <Button
      onClick={() => {
        if (to) {
          location.to(to);
        } else if (action) {
          location.update(action);
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
