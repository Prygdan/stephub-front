"use client";

import React from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { InputError } from "./input-error";

interface Option {
  label: string;
  value: string;
}

interface InputSelectMultipleProps {
  label: string;
  name: string;
  options: Option[];
  value?: string[];
  defaultValue?: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
  text?: string;
  required?: boolean;
  errors?: string[];
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const InputSelectMultiple: React.FC<InputSelectMultipleProps> = ({
  label,
  name,
  options,
  value = [],
  onValueChange,
  placeholder,
  text,
  required = false,
  errors = [],
  className,
  labelClassName,
  inputClassName,
}) => {
  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleChange = (selected: MultiValue<Option>) => {
    onValueChange(selected.map((opt) => opt.value));
  };

  const customStyles: StylesConfig<Option, true> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "hsl(var(--background))",
      borderColor: state.isFocused
        ? "hsl(var(--ring))"
        : errors.length > 0
        ? "hsl(var(--destructive))"
        : "#e3e3e3", /* Border Color */
      boxShadow: state.isFocused
        ? "0 0 0 2px hsl(var(--ring) / 0.2)"
        : "none",
      minHeight: "40px",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      "&:hover": {
        borderColor: "hsl(var(--ring))",
      },
      zIndex: 10000,
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "2px 8px",
      zIndex: 10000,
    }),

    placeholder: (base) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
      zIndex: 10000,
    }),

    singleValue: (base) => ({
      ...base,
      color: "hsl(var(--foreground))",
      zIndex: 10000,
    }),

    multiValue: (base) => ({
      ...base,
      backgroundColor: "hsl(var(--muted))",
      borderRadius: "0.375rem",
      zIndex: 10000,
    }),

    multiValueLabel: (base) => ({
      ...base,
      color: "hsl(var(--foreground))",
      fontSize: "0.75rem",
      padding: "2px 6px",
      zIndex: 10000,
    }),

    multiValueRemove: (base) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      ":hover": {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
      zIndex: 10000,
    }),

    menu: (base) => ({
      ...base,
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "0.5rem",
      boxShadow:
        "0px 4px 6px -1px rgb(0 0 0 / 0.1), 0px 2px 4px -2px rgb(0 0 0 / 0.1)",
      zIndex: 10000,
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "hsl(var(--accent))"
        : state.isFocused
        ? "#F0F0F0" /* Hover On Option */
        : "#FFF", /* Bg All Options */
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      cursor: "pointer",
      zIndex: 10000,
    }),

    indicatorSeparator: () => ({
      display: "none",
      zIndex: 10000,
    }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      ":hover": {
        color: "hsl(var(--foreground))",
      },
      zIndex: 10000,
    }),
  };


  const [isCmdPressed, setIsCmdPressed] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) setIsCmdPressed(true);
    };
    const handleKeyUp = () => setIsCmdPressed(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className={cn("my-2", className)}>
      <Label htmlFor={name} className={labelClassName}>
        {required && (
          <span className="text-red-500 font-extrabold text-sm pr-1">*</span>
        )}
        {label}
        {text && <span className="text-[9px] px-2">({text})</span>}
      </Label>

      <Select
        inputId={name}
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder ?? "Оберіть..."}
        styles={customStyles}
        className={cn(
          "react-select-container",
          inputClassName,
          errors.length > 0 && "border border-rose-500 rounded-md"
        )}
        classNamePrefix="react-select"
        closeMenuOnSelect={!isCmdPressed} 
      />

      {errors.length > 0 && (
        <div className="mt-2">
          <InputError messages={errors} />
        </div>
      )}
    </div>
  );
};
