import { forwardRef } from "react";

export type InputProps = {
  id: string;
  placeholder?: string;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, placeholder, required = false }, ref) => (
    <input
      className="text-black p-2 rounded-lg outline outline-2 focus:outline-blue-500"
      id={id}
      name={id}
      placeholder={placeholder}
      ref={ref}
      required={required}
    />
  ),
);

Input.displayName = "Input";
