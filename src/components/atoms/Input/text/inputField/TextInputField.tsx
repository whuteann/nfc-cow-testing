import { Variant } from '@/types/Mui';
import {
  InputAdornment,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface inputProps {
  name: string,
  value?: any,
  placeholder?: string,
  label?: string,
  onChangeText?: (text: any) => void,
  type?: string,
  variant?: Variant,
  hasIcon?: boolean,
  iconPosition?: string,
  icon?: any,
  disabled?: boolean,
  password?: boolean,
  number?: boolean,
  hasError?: boolean,
  errorMessage?: any,
  enableDomainHelper?: boolean,
}

const TextInputField = ({
  name,
  value,
  label = '',
  placeholder = '',
  onChangeText = () => null,
  type = 'text',
  variant = 'outlined',
  hasIcon = false,
  iconPosition = 'left',
  icon = null,
  disabled = false,
  hasError = false,
  errorMessage = '',
  enableDomainHelper = false,
}: inputProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
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
      type={type}
      variant={variant}
      InputProps={
        hasIcon
          ?
          {
            startAdornment: iconPosition == 'left'
              ?
              (
                <InputAdornment position='start'>
                  {icon}
                </InputAdornment>
              )
              :
              <></>
            ,
            endAdornment: iconPosition == 'right'
              ?
              (
                <InputAdornment position='end'>
                  {icon}
                </InputAdornment>
              )
              :
              <></>
          }
          :
          enableDomainHelper
            ?
            { endAdornment: <InputAdornment position='end'>@carechannels.org</InputAdornment> }
            :
            { endAdornment: <></> }
      }
      disabled={disabled}
      error={hasError}
      helperText={hasError ? errorMessage : ''}
      margin="normal"
      fullWidth
    />
  );
}

export default TextInputField;