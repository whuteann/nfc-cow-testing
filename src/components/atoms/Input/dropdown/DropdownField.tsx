import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Box, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import _ from 'lodash';
import { ThreeCircles } from 'react-loader-spinner';

interface inputProps { 
  placeholder?: string, 
  items: any[], 
  onChangeValue?: (item: any) => void,
  value?: any,
  label: string,
  customLabel?: any | string | string[],
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean
}

const DropdownField = ({
  placeholder = 'Select',
  onChangeValue = () => null,
  value,
  items,
  label,
  customLabel = 'name',
  hasError = false,
  errorMessage = 'Error',
  disabled = false
}: inputProps) => {
  const theme = useTheme();
  const [dropdownItems, setDropdownItems] = useState<any[]>(undefined);

  const onSelect = (event: SelectChangeEvent) => {
    const selectedItem = items.find((item: any) => item.id === event.target.value);

    if(!selectedItem) {
      return;
    }
    
    onChangeValue(selectedItem);
  }

  useEffect(() => {
    let temp = [] as any;

    if(items != undefined) {
      items.map((item) => {
        // If customLabel is array, merge all the customLabels to one label.
        if(Array.isArray(customLabel)){
          let fullLabel = '';
          customLabel.forEach((cLabel: any)=> {
            fullLabel = `${fullLabel} ${item[cLabel]}`;
          })
          temp.push({ 
            label: fullLabel,
            value: item.id
          })
        }
        else{
          temp.push({ 
            label: item[customLabel] ? item[customLabel] : item.id, 
            value: item.id
          })
        }
      })
    }

    setDropdownItems(temp);
  }, [items]);

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
    <Box>
      <FormControl margin="normal" fullWidth variant="outlined" disabled={disabled} error={hasError}>
        <InputLabel htmlFor="dropdown_label">{label}</InputLabel>
        <Select
          value={value?.id && dropdownItems.length > 0 ? value?.id : ''}
          placeholder={placeholder}
          label={label}
          renderValue={(selected: any) => {
            if (selected.length == 0) {
              return <em>{ placeholder }</em>;
            }

            const result = _.find(dropdownItems, (item) => {
              return item.value == selected;
            });

            return result?.label;
          }}
          onChange={(event: SelectChangeEvent) => { onSelect(event) }}
        >
          <MenuItem disabled value="">
            <em>{ placeholder }</em>
          </MenuItem>

          {
            dropdownItems.map((dropdownItem, index) => {
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

export default DropdownField;