import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

export interface FilterChecboxProps {
  text: string;
  value: string;
  endAdornment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  name?: string;
  disabled?: boolean;
}

export const FilterCheckbox: React.FC<FilterChecboxProps> = ({
  text,
  value,
  endAdornment,
  onCheckedChange,
  checked,
  name,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        onCheckedChange={disabled ? undefined : onCheckedChange}
        checked={checked}
        value={value}
        className={`rounded-[8px] w-6 h-6 ${disabled ? 'border-dashed border-2 border-gray-400' : ''}`}
        id={`checkbox-${String(name)}-${String(value)}`}
      />
      <label
        htmlFor={`checkbox-${String(name)}-${String(value)}`}
        className={`text-[14px] font-medium leading-none flex-1 cursor-${disabled ? ' opacity-90 text-[#919191]' : 'pointer'}`}>
        {text}
      </label>
      {endAdornment}
    </div>
  );
};
