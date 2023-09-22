import { Variant } from '@/types/Mui';
import {
  TextField,
} from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

interface inputProps {
  name: string,
  value?: any,
  placeholder?: string,
  label?: string,
  onChangeText?: (text: any) => void,
  variant?: Variant,
  disabled?: boolean,
  password?: boolean,
  number?: boolean,
  hasError?: boolean,
  errorMessage?: any,
}

const TextareaField = ({
  name,
  value,
  label = '',
  placeholder = '',
  onChangeText = () => null,
  variant = 'outlined',
  disabled = false,
  hasError = false,
  errorMessage = '',
}: inputProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <Box>
      <TextField
        name={name}
        value={localValue}
        label={label}
        placeholder={placeholder}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setLocalValue(event.target.value);
        }}
        onBlur={() => {
          onChangeText(localValue);
        }}
        type='text'
        variant={variant}
        disabled={disabled}
        error={hasError}
        helperText={hasError ? errorMessage : ''}
        margin="normal"
        rows="5"
        multiline
        fullWidth
      />
    </Box>
  );
}

export default TextareaField;