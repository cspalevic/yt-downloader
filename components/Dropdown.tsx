import { forwardRef } from "react";

export type Option = {
  label: string;
  value: string;
};

export type DropdownProps = {
  id: string;
  options: Option[];
};

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ id, options }, ref) => (
    <select
      className="text-black p-2 rounded-lg outline outline-2 focus:outline-blue-500"
      id={id}
      name={id}
      ref={ref}
    >
      {options.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </select>
  ),
);

Dropdown.displayName = "Dropdown";
