import { forwardRef } from "react";

export type InputProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, required = false }, ref) => (
    <div className="flex flex-col min-w-0">
      <label htmlFor={label} className="pb-2">
        {label}
      </label>
      <input
        className={`text-black p-2 rounded-lg outline outline-2 focus:outline-blue-500`}
        id={label}
        placeholder={placeholder}
        ref={ref}
        required={required}
      />
    </div>
  ),
);

Input.displayName = "Input";
