import {
  TextField,
  Autocomplete,
  FormHelperText,
  Box,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Dropdown } from '@/types/Common';
import { ThreeCircles } from 'react-loader-spinner';

interface inputProps { //props that will be accepted by the atom
  items: Array<any> //?:kinda like a class
  label?: string,
  customLabel?: string,
  value?: any, //?:only Accept Objects
  onChangeValue?: (value: any) => void,
  onCallData?: (value: string) => void,
  onOpen?: (value: any) => void,
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean,
  disabledMessage?: string,
  required?: boolean,
  requiredMessage?: string
}

const DropdownInputField = ({
  items,
  label,
  customLabel = 'name',
  value = null,
  onChangeValue = () => null,
  onCallData = () => null,
  onOpen = () => null,
  hasError = false,
  errorMessage = 'Error',
  disabled = false,
  disabledMessage = '',
  required = false,
  requiredMessage = 'Required'
}: inputProps) => {

  const theme = useTheme();
  
  const [dropdownItems, setDropdownItems] = useState<any>(undefined);
  const [dropdownValue, setdropdownValue] = useState<any | null>(value);

  const onChangeEvent = ( event: any, value: any ) => {
    setdropdownValue(value);
    if (value == null ) {
      onChangeValue(null)
    } else {
      const chosenObject = items.find(obj => {return obj.id === value.value})
      onChangeValue(chosenObject)
    }
  }

  async function convertObjectsToItems ( objects : any ) {
    let tempItems: any = [];
    await objects.forEach((object: any) => {
      tempItems.push({
        label: object[customLabel] ? object[customLabel] : object.id,
        value: object.id, 
      })
    });
    setDropdownItems(tempItems)
  }

  async function convertValueToItem ( value : any ) {
    if (value == null || undefined || "" ){
      return
    }

    let convertedValue: any;
    if (!value.id || !value[customLabel]){
      convertedValue = null
    }
    else {
      convertedValue = {
        value: value.id,
        label: value[customLabel],
      }
    }
    setdropdownValue(convertedValue)
  }

  useEffect(() => {
    convertObjectsToItems(items)
  }, [items])

  useEffect(() => {
    convertValueToItem(value)
  }, [value])

  if(dropdownItems == undefined) {
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
      fullWidth variant="outlined" 
      error={hasError} 
      required={required}
    >
      <Autocomplete
        sx={{
          m: 0
        }}
        options={dropdownItems}
        value={dropdownValue}
        onChange={(event: any, value: any) => onChangeEvent(event, value)}
        disabled={disabled}
        isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
        renderInput={(params) => (
          <TextField  
            {...params}
            label={label}
            error={hasError} 
            required={required}
            autoComplete='off'
          />
        )}
        onInputChange={(event: any, newInputValue: any) => {
          onCallData(newInputValue);
        }}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          );
        }}
        onOpen={(event) => onOpen(event)}
      />

      {
        hasError
          ?
          <FormHelperText>{errorMessage}</FormHelperText>
          :
          <></>
      } 
    </FormControl>
  )
}

export default DropdownInputField