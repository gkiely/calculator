import React from 'react';
import type { Location } from '../utils/types';
import { buttonClass, getButtonColorClass, getContainerWidthClass, containerClass } from '../styles';
import { Path, RouteAction, RouteState } from '../routes/types';

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
  action?: RouteAction;
  id: string;
  text: string;
  routeParam?: string;
  operation?: boolean;
  wide?: boolean;
  location: Location<'Button'>;
  to?: Path;
  update?: Partial<RouteState>;
}

const ButtonContainer = ({
  action = '',
  update,
  id,
  text,
  operation = false,
  wide = false,
  location,
  to,
}: ButtonProps) => {
  return (
    <Button
      key={id}
      onClick={() => {
        if (to) {
          location.to(to);
        } else if (update) {
          /// TODO: figure out how to do a generic type that accepts either a function or an object
          location.update(() => update);
        } else {
          location.update(({ input = '' }) => ({
            input: input + text,
            action,
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
