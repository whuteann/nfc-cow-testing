import { Variant } from '@/types/Mui';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface inputProps {
  name: string,
  value?: any,
  placeholder?: string,
  label?: string,
  onChangeText?: (text: any) => void,
  variant?: Variant,
  editable?: boolean,
  password?: boolean,
  number?: boolean,
  hasError?: boolean,
  errorMessage?: string,
}

const PasswordField = ({
  name,
  value,
  label = '',
  placeholder = '',
  onChangeText = () => null,
  variant = 'outlined',
  editable = true,
  hasError = false,
  errorMessage = '',
}: inputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box>
      <TextField
        name={name}
        value={value}
        label={label}
        placeholder={placeholder}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          onChangeText(event.target.value);
        }}
        type={ showPassword ? 'text' : 'password' }
        variant={variant}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
        // { ...!editable ? 'disabled' : '' }
        error={hasError}
        helperText={hasError ? errorMessage : ''}
        margin="normal"
        fullWidth
      />
    </Box>
  );
}

export default PasswordField;