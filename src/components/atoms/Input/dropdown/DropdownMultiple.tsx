import { Dropdown } from '@/types/Common';
import { Autocomplete, Box, FormControl, FormHelperText, TextField, useTheme } from '@mui/material';
import _ from 'lodash';
import { SyntheticEvent, useEffect, useState } from 'react';
import { ThreeCircles } from 'react-loader-spinner';
import {v4 as uuidv4} from 'uuid';

interface inputProps { 
  placeholder?: string, 
  items: any[], 
  onChangeValue?: (values: any[]) => void,
  values?: any[],
  label: string,
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean
}

export default function DropdownMultiple({
  placeholder = 'Select',
  onChangeValue = () => null,
  values,
  items,
  label,
  hasError = false,
  errorMessage = 'Error',
  disabled = false
}: inputProps) {
  const theme = useTheme();
  const [dropdownValues, setDropdownValues] = useState<any[]>([]);
  const [dropdownItems, setDropdownItems] = useState<any[]>([]);

  const onSelect = (values: (string | Dropdown)[]) => {
    const selectedItems: any[] = [];

    items.forEach((item) => {
      (values as Dropdown[]).forEach((value) => {
        if(item.id == value.value) {
          selectedItems.push(item);
        }
      })
    });
    
    onChangeValue(selectedItems);
  }

  // To handle the general list data
  useEffect(() => {
    let temp = [] as any;

    if(items != undefined) {
      items.map((item) => {
        temp.push({ 
          label: item.name ? item.name : item.id, 
          value: item.id
        })
      })
    }

    setDropdownItems(temp);
  }, [items]);

  // To handle the list date tied to the object
  useEffect(() => {
    let temp = [] as any;

    if(values != undefined) {
      values.map((item) => {
        temp.push({ 
          label: item.name ? item.name : item.id, 
          value: item.id
        })
      })
    }
    
    setDropdownValues(temp);
  }, [values]);
 
  if(dropdownItems.length == 0 && (values.length > 0 && dropdownValues.length == 0)) {
    return (
      <Box m={1}>
        <ThreeCircles
          color={theme.palette.primary.main}
          height={30}
          width={30}
          ariaLabel="three-circles-rotating"
        />
      </Box>
    );
  }

  return (
    <FormControl 
      margin="normal" 
      fullWidth 
      variant="outlined" 
      error={hasError}>

      <Autocomplete
        multiple
        options={dropdownItems}
        getOptionLabel={(option: any) => option.label}
        value={dropdownValues}
        filterSelectedOptions
        isOptionEqualToValue={(option: any, value: any) => {
          return option.value === value.value;
        }}
        disabled={disabled}
        onChange={(event: SyntheticEvent<Element, Event>, values: (string | Dropdown)[]) => onSelect(values)}
        renderOption={(props, option) => {
          return (
            <li {...props} key={uuidv4()}>
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            { ...params }
            label={label}
            error={hasError} 
            placeholder={placeholder}
          />
        )}
      />

      {
        hasError
          ?
          <FormHelperText>{errorMessage}</FormHelperText>
          :
          <></>
      }
    </FormControl>
  
  );
}