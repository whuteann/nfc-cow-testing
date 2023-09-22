import TextField from '@mui/material/TextField';

import TimePicker from '@mui/lab/TimePicker';
import { Box } from '@mui/system';
import { useState } from 'react';

interface timepickerProps {
  value?: Date | null,
  placeholder?: string,
  label?: string,
  onChangeTime?: (time: Date | null) => void,
  disabled?: boolean,
  hasError?: boolean,
  errorMessage?: any,
}

export default function Timepicker({
  value = null,
  label = '',
  placeholder = '',
  onChangeTime = (time: Date | null) => null,
  disabled = false,
  hasError = false,
  errorMessage = '',
}: timepickerProps) {
  const [timeValue, setTimeValue] = useState<Date | null>(value);

  const handleChange = (date: Date | null) => {
    setTimeValue(date);
    onChangeTime(date);
  };

  return (
    <Box>
      <TimePicker
        label={label}
        toolbarPlaceholder={placeholder}
        value={timeValue}
        inputFormat="HH:mm"
        onChange={handleChange}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} error={hasError} helperText={errorMessage} />}
      />
    </Box>
  );
}