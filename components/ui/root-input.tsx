import React, { useRef } from 'react';
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
  const { control } = useFormContext();
  const lastValueRef = useRef<string>("");
  const isDeletingRef = useRef<boolean>(false);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        required: required && 'This field is required',
        validate: (value) => {
          if (!value && !required) return true;
          if (isUrl && value && value !== "https://") {
            const urlRegex = /^(https?:\/\/)[^\s.]+\.[^\s]{2,}(\/\S*)?$/i;
            return urlRegex.test(value) || 'Please enter a valid URL. Example: https://example.com';
          }
          return true;
        },
      }}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const inputValue = e.target.value;
          const prevValue = lastValueRef.current;
          
          // Check if user is deleting characters
          isDeletingRef.current = inputValue.length < prevValue.length;
          
          let finalValue = inputValue;
          
          if (isUrl) {
            // Handle URL formatting
            if (inputValue === "") {
              // Empty input - just update with empty string
              finalValue = "";
            } else if (inputValue === "https:/" || inputValue === "https:") {
              // User is in the process of deleting the protocol - leave it as is
              finalValue = inputValue;
            } else if (isDeletingRef.current && prevValue.startsWith("https://") && 
                      (inputValue === "https://" || inputValue.length <= 8)) {
              // User deleted everything up to or including the protocol
              finalValue = inputValue;
            } else if (!inputValue.startsWith("https://") && !isDeletingRef.current) {
              // Only add protocol if not already there and user is not deleting
              finalValue = inputValue.startsWith("http://") ? inputValue : `https://${inputValue}`;
            } else {
              // For other cases, keep the value as is
              finalValue = inputValue;
            }
            
            // Fix duplicate protocols that might occur
            finalValue = finalValue.replace(/(https?:\/\/)+/g, '$1');
          }
          
          // Update ref with the current input value before changes
          lastValueRef.current = finalValue;
          
          // Update form value
          onChange(finalValue);
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