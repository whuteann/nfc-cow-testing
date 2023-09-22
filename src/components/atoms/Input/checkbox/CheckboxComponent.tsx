import {
  Box,
  Checkbox,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useState } from 'react';
import ErrorMessage from '../../typography/ErrorMessage';

interface checkboxProps {
  title: string,
  onChecked: (checked: boolean) => void,
  checked?: boolean,
  isSwitch?: boolean,
  disabled?: boolean,
  hasError?: boolean,
  errorMessage?: any
}

const CheckboxComponent = ({ 
  title,
  onChecked,
  checked = false,
  isSwitch = false,
  disabled = false,
  hasError = false,
  errorMessage = ''
}: checkboxProps) => {
  const [isChecked, setCheckedState] = useState(checked);
  
  return (
    <Box>
      <FormControlLabel
        label={title}
        control={
          !isSwitch
            ?  
              <Checkbox
                title={title}
                checked={isChecked}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCheckedState(event.target.checked);
                  onChecked(event.target.checked);
                }}
                disabled={disabled}
              />
            :
              <Switch
                title={title}
                checked={isChecked}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCheckedState(event.target.checked);
                  onChecked(event.target.checked);
                }}
                disabled={disabled}
              /> 
        }
      />

      {
        hasError
        ?
          <ErrorMessage message={errorMessage} />
        :
          <></>
      }
    </Box>
  )
}

export default CheckboxComponent;