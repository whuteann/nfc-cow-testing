import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/lab";
import { Box, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { FormControl } from "@mui/material";
import { ThreeCircles } from "react-loader-spinner";

interface datepickerProps {
  value?: Date | null;
  placeholder?: string;
  views?: any;
  label?: string;
  minDate?: any;
  maxDate?: any;
  onChangeDate?: (date: Date | null) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorMessage?: any;
  inputFormat?: string;
}

const Datepicker = ({
  value = null,
  label = "",
  views = ['day', 'month', 'year'],
  placeholder = "",
  onChangeDate = (date: Date | null) => null,
  minDate = null,
  maxDate = null,
  disabled = false,
  hasError = false,
  errorMessage = "",
  inputFormat = "dd-MMM-yyyy"
}: datepickerProps) => {
  const theme = useTheme();
  const [dateValue, setDateValue] = useState<Date | null>(undefined);

  useEffect(() => {
    if(value) {
      const convertedDate = new Date(value);
      setDateValue(convertedDate);
    } else {
      setDateValue(null);
    }
  }, [value]);

  const handleChange = (date: Date | null) => {
    setDateValue(date);
    onChangeDate(date);
  };

  if(dateValue === undefined) {
    return (
      <ThreeCircles
        color={theme.palette.primary.main}
        height={80}
        width={80}
        ariaLabel="three-circles-rotating"
      />
    );
  }

  return (
    <FormControl
      margin="normal"
      fullWidth
      variant="outlined"
      disabled={disabled}
      error={hasError}
    >
      <DatePicker
        label={label}
        toolbarPlaceholder={placeholder}
        value={dateValue}
        views={views}
        inputFormat={inputFormat}
        onChange={handleChange}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            error={hasError}
            helperText={hasError ? errorMessage : ""}
          />
        )}
        minDate={minDate}
        maxDate={maxDate}
        mask={''}
      />
  </FormControl>
  );
};
export default Datepicker;