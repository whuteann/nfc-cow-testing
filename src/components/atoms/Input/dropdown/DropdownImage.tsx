import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { Box, Grid,  MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material';
import _ from 'lodash';
import { ThreeCircles } from 'react-loader-spinner';

interface inputProps { 
  placeholder?: string, 
  items: any[], 
  onChangeValue?: (item: any) => void,
  value?: any,
  label: string,
  hasError?: boolean,
  errorMessage?: any,
  disabled?: boolean
}

const truncateString = (str: string, length: number) => {
  if (str) {
    return str.length > length ? str.slice(0, length) + "..." : str
  }
  return "-"
}

const DropdownImage = ({
  placeholder = 'Select',
  onChangeValue = () => null,
  value,
  items,
  label,
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
    if(items != undefined) {
      let temp = [] as any;
      items.map((item) => {
        temp.push({ 
          label: item.cowPhoto ? item.cowPhoto : item.nfcId, 
          value: item.id
        })
      })
      setDropdownItems(temp);
    }
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
          value={value?.id || ''}
          placeholder={placeholder}
          label={label}
          renderValue={(selected: any) => {
            if (selected.length == 0) {
              return <em>{ placeholder }</em>;
            }

            const result = _.find(dropdownItems, (item) => {
              return item.value == selected;
            });

            const imageLink = result ? result?.label.substring(result?.label.indexOf('.') + 21) : "";
            const imageName = imageLink?.substring( 0, imageLink.indexOf('.')).substring( 0, imageLink.indexOf('_'))

            const imageResult = (
              <Grid container alignItems="center" gap={1} wrap="nowrap">
                <Grid xs={2} item={true}>
                <img src = {result ? result?.label : ""} className="border-solid border-2 border-black" style={{ borderRadius: '50%', width : "150px", height: "150px"}} /> 
                </Grid>
                <Grid xs={2} item={true}>
                  <h1 className='text-lg'>{imageName ? truncateString(imageName, 60) : result ? truncateString(result.label, 60) : ""}</h1>
                </Grid>
              </Grid>
            )

            return imageResult;
            
          }}
          onChange={(event: SelectChangeEvent) => { onSelect(event) }}
        >
          <MenuItem disabled value="">
            <em>{ placeholder }</em>
          </MenuItem>

          {
            dropdownItems.map((dropdownItem, index) => {
              const imageLink = dropdownItem.label.substring(dropdownItem.label.indexOf('.') + 21)
              const imageName = imageLink.substring( 0, imageLink.indexOf('.')).substring( 0, imageLink.indexOf('_'))
              return (
                <MenuItem
                  key={index}
                  value={dropdownItem?.value}
                >
                  
                <img src = {dropdownItem?.label} className="border-solid border-2 border-black" style={{ borderRadius: '50%', width : "150px", height: "150px"}} />
                  <div className='pl-5'>
                    <h1 className='text-lg'>{imageName ? imageName : dropdownItem ? dropdownItem.label : ""}</h1>
                  </div>    
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

export default DropdownImage;