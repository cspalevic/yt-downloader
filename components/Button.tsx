import { MouseEventHandler } from "react";

export type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
};

export const Button = ({ onClick, text }: ButtonProps) => (
  <button className="bg-primary-blue px-10 py-3 rounded-lg" onClick={onClick}>
    {text}
  </button>
);
