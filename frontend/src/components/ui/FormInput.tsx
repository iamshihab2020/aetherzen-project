// src/components/ui/FormInput.tsx
import React from "react";
import { Input } from "./input";
import { Label } from "./label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      <Label className="block mb-2">{label}</Label>
      <Input className={`${error ? "border-red-500" : ""}`} {...props} />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;
