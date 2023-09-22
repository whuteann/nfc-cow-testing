import { styled } from "@mui/material";

interface errorProps {
  message: string
}

const ErrorWrapper = styled('p')(
  ({ theme }) => `
    color: ${theme.palette.error.main};
    font-size: 13px;
    margin-right: 8px;
    margin-left: 8px;
    margin-top: 3px;
    font-weight: bold;
  `);

const ErrorMessage = ({
  message
}: errorProps) => {
  return (
    <ErrorWrapper>{message}</ErrorWrapper>
  );
}

export default ErrorMessage;