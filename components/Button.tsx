import { MouseEventHandler, ReactNode } from "react";

export type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
};

export const Button = ({ onClick, children }: ButtonProps) => (
  <button className="bg-primary-blue px-10 py-3 rounded-lg" onClick={onClick}>
    {children}
  </button>
);
