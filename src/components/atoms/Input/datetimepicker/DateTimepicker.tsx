import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/lab';
import { Box } from '@mui/material';
import { useState } from 'react';

interface datetimepickerProps {
  value?: Date | null,
  placeholder?: string,
  label?: string,
  minDate?: any,
  maxDate?: any,
  onChangeDateTime?: (date: Date | null) => void,
  disabled?: boolean,
  hasError?: boolean,
  errorMessage?: any,
}

const DateTimepicker = ({
  value = null,
  label = '',
  placeholder = '',
  onChangeDateTime = (dateTime: Date | null) => null,
  minDate = null,
  maxDate = null,
  disabled = false,
  hasError = false,
  errorMessage = '',
}: datetimepickerProps) => {  
  const [dateTimeValue, setDateTimeValue] = useState<Date | null>(value);

  const handleChange = (dateTime: Date | null) => {
    setDateTimeValue(dateTime);
    onChangeDateTime(dateTime);
  };

  return (
    <Box>
      <DateTimePicker
        label={label}
        toolbarPlaceholder={placeholder}
        value={dateTimeValue}
        inputFormat="dd/MM/yyyy HH:mm"
        onChange={handleChange}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} error={hasError} helperText={errorMessage} />}
        minDate={minDate}
        maxDate={maxDate}
      />
    </Box>
  );
}

export default DateTimepicker;