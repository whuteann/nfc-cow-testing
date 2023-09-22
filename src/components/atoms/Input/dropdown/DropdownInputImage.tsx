import {
  TextField,
  Autocomplete,
  FormHelperText,
  Box,
  useTheme,
  createFilterOptions,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Dropdown } from '@/types/Common';
import { Grid, ThreeCircles } from 'react-loader-spinner';
import _, { result } from 'lodash';

interface inputProps { //props that will be accepted by the atom
  items: Array<any> //?:kinda like a class
  label?: string,
  customLabel?: string,
  imageName?: string,

  value?: any, //?:only Accept Objects
  onChangeValue?: (value: Dropdown) => void,
  onCallData?: (value: string) => void,
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean,
  disabledMessage?: string,
  required?: boolean,
  requiredMessage?: string
}

const DropdownInputImage = ({
  items,
  label,
  customLabel = 'name',
  imageName = 'image',
  value = null,
  onChangeValue = () => null,
  onCallData = () => null,
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
  const [selectedObject, setSelectedObject] = useState<any>(undefined);

  const onChangeEvent = ( event: any, value: any ) => {
    setdropdownValue(value);
    
    if (value == null) {
      onChangeValue(null);
      setSelectedObject(null);
    } else {
      setSelectedObject(value);
      onChangeValue(value);
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

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: any) => option[customLabel] || option.id,
  });
  
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
        options={items}
        value={dropdownValue}
        onChange={(event: any, value: any) => onChangeEvent(event, value)}
        disabled={disabled}
        isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
        getOptionLabel={(option) => option[customLabel]}
        filterOptions={filterOptions}
        renderInput={(params) => {
          return ( 
            <TextField  
              {...params}
              InputProps={
                selectedObject
                ?
                  {
                    ...params.InputProps, 
                    startAdornment: <>
                      <img src={selectedObject[imageName] || ''} style={{ height: "150px", width: "150px", marginRight: "10px" }}/>
                      <h1 className='text-lg ml-3'>{selectedObject[customLabel] || selectedObject?.id}</h1>
                    </>
                  }
                :
                {
                  ...params.InputProps 
                }
              }
              label={label}
              error={hasError} 
              required={required}
              autoComplete='off'
            />
          );
        }}
        onInputChange={(event: any, newInputValue: any) => {
          onCallData(newInputValue);
        }}
        renderOption={(props: any, option: any) => {
          const imageLink = option[imageName]?.substring(option[imageName]?.indexOf('.') + 21)
          const imageTitle = imageLink?.substring( 0, imageLink?.indexOf('.')).substring( 0, imageLink?.indexOf('_'))

          return (
            <div { ...props }>                  
              <img src = {option[imageName]} className="border-solid border-2 border-black" style={{ borderRadius: '50%', width : "150px", height: "150px"}} /> 
              
              <h1 className='text-lg ml-3'>{option[customLabel] || imageTitle}</h1>
            </div>
          );
        }}
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

export default DropdownInputImage