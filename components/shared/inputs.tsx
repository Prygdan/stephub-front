import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { MultiSelect } from '../ui/multi-select';
import { InputError } from './input-error';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '../ui/button';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/lib/utils';
import { Loading } from './loading';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';

interface InputPops {
  label: string
  name: string
  errors: string[]
  placeholder?: string
  required?: boolean
  text?: string
  className?: string
  labelClassName?: string
}

interface InputTextProps extends InputPops {
  type?: string
  inputClassName?: string
  value: string | number | readonly string[] | undefined | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface InputSelectProps<T> extends InputPops {
  value: string | undefined
  onChange: (value: string) => void;
  selectItems: Array<T>
  labelClassName?: string
  classNameTriger?: string
  disabled?: boolean
  loading?: boolean
}

interface InputSelectMultipleProps<T> extends InputPops {
  options: any,
  onValueChange: any
  defaultValue: string[]
  labelClassName?: string
  value?: string[]
}

interface InputFileProps extends InputPops {
  value: string | undefined | File;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
}

interface TeaxtAreaProps extends InputPops {
  value: string | number | readonly string[] | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

interface InputComboboxItems {
  label: string;
  value: string;
}

interface InputCheckboxProps extends InputPops {
  onChange: (value: string | boolean) => void
  value: boolean
}

interface InputComboboxProps extends InputPops {
  items: InputComboboxItems[];
  defaultValue?: string
  loading?: boolean;
  onSelect: (value: string, label: string) => void;
  changedValue?: string;
}

export const InputText: React.FC<InputTextProps> = ({ type='text', label, labelClassName, name, text, value, onChange, errors = [], placeholder, required = false, className, inputClassName }) => {
  return (
    <div className={className}>
      {label != '' && <Label htmlFor={name} className={cn('mb-1 block', labelClassName)}>
        {required && 
          <span className='text-red-500 font-extrabold pr-1'>*</span>
        }
        {label}
        {text && <span className='text-[9px] px-2'>({text})</span>}
      </Label>}
      <Input type={type} id={name} placeholder={placeholder ?? ''} value={value ?? ''} onChange={onChange} required={required} className={cn(inputClassName, errors.length > 0 ? 'border border-red-500' : '')} />
      <div className='mt-[-5px]'>
        {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
      </div>
    </div>
  );
};

export const InputFile: React.FC<InputFileProps> = ({ label, name, onChange, text, required=false, accept='image/*', errors = [], className }) => {
  return (
    <div className={cn(className)}>
      <Label htmlFor={name}>
        {required && 
          <span className='text-red-500 font-extrabold text-sm pr-1'>*</span>
        }
        {label}
        {text && <span className='text-[9px] px-2'>({text})</span>}
      </Label>
      <Input type='file' accept={accept} id={name} onChange={onChange} required={required} className={cn('cursor-pointer', errors.length > 0 ? 'border border-red-500' : '')} />
      <div className='mt-[-5px]'>
        {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
      </div>
    </div>
  );
};

export const InputSelect = <T extends {id: number | string; name: string | React.ReactNode; disabled?: boolean}>({ 
  label, 
  labelClassName, 
  name, 
  text, 
  required=false, 
  placeholder, 
  value, 
  onChange, 
  disabled=false,
  errors=[], 
  selectItems, 
  classNameTriger,
  loading,
  className 
}: InputSelectProps<T>) => {
  return (
    <div className={cn("w-full", className)}> {/* Додано w-full */}
      <Label htmlFor={name} className={labelClassName}>
        {required && 
          <span className='text-red-500 font-extrabold text-sm pr-1'>*</span>
        }
        {label}
        {text && <span className='text-[9px] px-2'>({text})</span>}
      </Label>
      <Select disabled={disabled} value={value?.toString()} onValueChange={onChange} required={required}>
        <SelectTrigger className={cn(
          'w-full',
          classNameTriger,
          errors.length > 0 ? 'border border-red-500' : ''
        )}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {loading && <Loading className='absolute bg-white z-50 w-full h-full' width={30} height={30} />}
          {selectItems.map((item) => (
            <SelectItem key={item.id.toString()} value={item.id.toString()} disabled={item.disabled}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className='mt-[-5px]'>
        {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
      </div>
    </div>
  )
}

export const InputSelectMultiple = <T, >({ label, labelClassName, name, options, text, onValueChange, required=false, value, defaultValue, placeholder, errors = [], className }: InputSelectMultipleProps<T>) => {
  return (
    <div className={cn('my-2', className)}>
      <Label htmlFor={name} className={labelClassName}>
        {required && 
          <span className='text-red-500 font-extrabold text-sm pr-1'>*</span>
        }
        {label}
        {text && <span className={'text-[9px] px-2'}>({text})</span>}
      </Label>
      <MultiSelect
        options={options}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        value={value}
        variant='default'
        animation={1}
        maxCount={100}
        className={errors.length > 0 ? 'border border-red-500' : ''}
      />
    <div className='mt-[-5px]'>
      {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
    </div>
  </div>
  )
} 

export const TextArea: React.FC<TeaxtAreaProps> = ({ label, name, value = '', labelClassName, onChange, placeholder, errors = [], required=false, className }) => {
  return <div className={cn(className)}>
    <Label htmlFor={name} className={labelClassName}>{required && <span className='text-red-500 font-extrabold text-sm pr-1'>*</span>}{label}</Label>
    <Textarea value={value ? value : ''} onChange={onChange} placeholder={placeholder} required={required} className={errors.length > 0 ? 'border border-red-500' : ''} />
    <div className='mt-[-5px]'>
      {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
    </div>
  </div>
}

export const InputCheckbox: React.FC<InputCheckboxProps> = ({
  label, name, className, errors=[], onChange, value
}) => {
  return <div className={cn(className)}>
    <div className='flex gap-2 items-center'>
      <Checkbox
        id="in_popular"
        checked={value || false}
        onCheckedChange={(checked) => onChange(checked)}
        className='cursor-pointer'
      />
      <Label htmlFor={name}>
        {label}
      </Label>
    </div>
    <div className='mt-[2px]'>
      {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
    </div>
  </div>
}

export const InputCombobox: React.FC<InputComboboxProps> = ({
  items,
  defaultValue,
  labelClassName,
  loading,
  onSelect,
  label,
  name,
  required = false,
  text,
  errors = [],
  placeholder,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    defaultValue && setValue(defaultValue);
  }, [defaultValue]);

  const selectedItem = items.find((item) => item.value === value);

  return (
    <div className={cn(className, "w-full")}>
      <Label htmlFor={name} className={cn(labelClassName, "w-full block")}>
        {required && <span className="text-red-500 font-extrabold text-sm pr-1">*</span>}
        {label}
        {text && <span className="text-[9px] px-2">({text})</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full overflow-hidden">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`font-normal justify-between w-full ${errors.length > 0 ? "border border-red-500" : ""}`}
          >
            {selectedItem?.label || <span className="text-muted-foreground">{placeholder}</span>}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        {loading ? (
          <PopoverContent>
            <Loading className="min-h-0 min-w-[180px] p-2" width={30} height={30} />
          </PopoverContent>
        ) : (
          <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
            <Command>
              <CommandInput className="h-9 w-full" />
              <CommandList>
                <CommandEmpty>{label} - не знайдено!</CommandEmpty>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      className="font-light"
                      key={item.value}
                      value={item.label ?? ""}
                      onSelect={() => {
                        setValue(item.value);
                        onSelect(item.value, item.label);
                        setOpen(false);
                      }}
                    >
                      {item.label}
                      <Check
                        className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
      <div className="mt-[-5px]">
        {errors.length > 0 && <InputError messages={errors} className="mt-2" />}
      </div>
    </div>
  );
};