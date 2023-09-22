import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';

interface dropdownProps { 
  label: string,
  value: string
}
interface inputProps { 
  placeholder?: string, 
  items: Array<dropdownProps> 
  onChangeValue?: (text: any) => void,
  value?: string,
  label: string,
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean,
  disabledMessage?: string,
  required?: boolean,
  requiredMessage?: string
}

const DropdownStringField = ({
  placeholder = 'Select',
  onChangeValue = () => null,
  value,
  items,
  label,
  hasError = false,
  errorMessage = 'Error',
  disabled = false,
  required = false,
}: inputProps) => {
  return (
    <Box>
      <FormControl margin="normal" fullWidth variant="outlined" disabled={disabled} error={hasError} required={required}>
        <InputLabel htmlFor="dropdown_label">{label}</InputLabel>
        <Select
          value={value}
          placeholder={placeholder}
          label={label}
          renderValue={(selected: any) => {
            if (selected.length === 0) {
              return <em>{ placeholder }</em>;
            }

            return selected;
          }}
          onChange={(event: SelectChangeEvent) => { onChangeValue(event.target.value as string) }}
        >
          <MenuItem disabled value="">
            <em>{ placeholder }</em>
          </MenuItem>

          {
            items?.map((dropdownItem, index) => {
              return (
                <MenuItem
                  key={index}
                  value={dropdownItem?.value}
                >
                  {dropdownItem?.label}
                </MenuItem>
              )
            })
          }
        </Select>
        
        {
          hasError
            ?
            <FormHelperText>{errorMessage}</FormHelperText>
            :
            <></>
        }
      </FormControl>
    </Box>
  )
}

export default DropdownStringField;