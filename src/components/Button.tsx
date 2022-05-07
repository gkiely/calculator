import React from 'react';
import type { Location } from '../utils/types';
import { buttonClass, getButtonColorClass, getContainerWidthClass, containerClass } from '../styles';
import { Path } from '../routes/types';

interface ComponentProps {
  containerClassName?: string;
  className?: string;
  key: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children?: React.ReactChild;
}

export const Button = ({ containerClassName, className, key, onClick, children }: ComponentProps) => {
  return (
    <div className={containerClassName}>
      <button key={key} onClick={(e) => onClick(e)} className={className}>
        {children}
      </button>
    </div>
  );
};

export interface ButtonProps {
  id: string;
  text: string;
  routeParam?: string;
  operation?: boolean;
  wide?: boolean;
  location: Location<'Button'>;
  to?: Path;
}

const ButtonContainer = ({ id, text, operation = false, wide = false, location, to }: ButtonProps) => {
  return (
    <Button
      key={id}
      onClick={() => {
        if (to) {
          location.to(to);
        } else {
          location.update(({ input = '' }) => ({
            input: input + text,
          }));
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
