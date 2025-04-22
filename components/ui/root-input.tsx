import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input as NextUIInput } from '@heroui/react';

interface SearchInputProps {
  label: string;
  name: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  variant?: 'flat' | 'faded' | 'bordered' | 'underlined';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  isUrl?: boolean;
}

const RootInput: React.FC<SearchInputProps> = ({
  label,
  name,
  placeholder,
  className,
  required = false,
  startContent,
  endContent,
  variant,
  isUrl = false,
}) => {
  const { control, setValue } = useFormContext();

  // Asegura https:// si no existe
  const ensureHttps = (url: string): string => {
    if (!url) return url;
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        required: required && 'This field is required',
        validate: (value) => {
          if (!value && !required) return true;
          const withHttps = ensureHttps(value);
          const urlRegex = /^(https?:\/\/)?([^\s.]+\.[^\s]{2,})(\/\S*)?$/i;
          return (
            !isUrl || 
            urlRegex.test(withHttps) ||
            'Please enter a valid URL. Example: https://example.com'
          );
        },
      }}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          onChange(inputValue);
          if (isUrl && inputValue) {
            // Aseguramos https:// sin validar aún
            setValue(name, ensureHttps(inputValue), { shouldValidate: false });
          }
        };

        return (
          <div className="relative w-full" style={{ height: "80px" }}>
            <label className="sr-only">{label}</label>
            <div className="absolute top-5 left-0 w-full">
              <NextUIInput
                type="text"
                inputMode={isUrl ? 'url' : undefined}
                id={name}
                className={className}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                variant={variant ?? 'bordered'}
                onBlur={onBlur}
                startContent={startContent}
                endContent={endContent}
                isInvalid={!!error}
              />
            </div>
            <div className="absolute top-16 left-12 w-full">
              {error && (
                <p className="text-red-500 text-sm">
                  {error.message}
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default RootInput;