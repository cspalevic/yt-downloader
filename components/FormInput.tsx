import { ReactNode } from "react";

export type FormInputProps = {
  label: string;
  htmlFor: string;
  children: ReactNode;
  loading?: boolean;
  hidden?: boolean;
  className?: string;
  loadingClassName?: string;
};

export const FormInput = ({
  label,
  htmlFor,
  children,
  loading,
  hidden,
  className,
  loadingClassName,
}: FormInputProps) => {
  if (hidden) return null;
  if (loading)
    return (
      <div className={`flex flex-col ${loadingClassName ?? ""}`}>
        <div className="bg-gray-500 h-5 w-[50px] rounded-lg mb-3" />
        <div className="bg-gray-500 h-10 rounded-lg" />
      </div>
    );
  return (
    <div className={`flex flex-col min-w-0 ${className ?? ""}`}>
      <label className="pb-2" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
};
