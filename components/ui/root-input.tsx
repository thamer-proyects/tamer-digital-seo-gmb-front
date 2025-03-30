import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input as NextUIInput } from '@heroui/react';

interface SearchInputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const RootInput: React.FC<SearchInputProps> = ({
  label,
  name,
  placeholder,
  className,
  type,
  variant,
  color,
  required = false,
  startContent,
  endContent,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <div className="relative w-full">
          <label className="sr-only">{label}</label>
          <div className="flex items-center">
            <NextUIInput
              type={type ?? 'text'}
              id={name}
              className={className}
              color={color ?? 'default'}
              variant={variant ?? 'bordered'}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              required={required}
              startContent={startContent}
              endContent={endContent}
              errorMessage={error ? error.message : undefined}
            />
          </div>
        </div>
      )}
    />
  );
};

export default RootInput;
