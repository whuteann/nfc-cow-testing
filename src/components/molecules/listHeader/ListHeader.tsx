import {
  Grid,
  Typography,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

interface listProps {
  title: string,
  description?: string
  showButton?: boolean,
  buttonText?: string,
  showIcon?: boolean,
  onClick?: () => void,
}

function ListHeader({
  title,
  description = '',
  showButton = true,
  showIcon= true,
  buttonText = 'Create',
  onClick
}: listProps) {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="subtitle2">
            {description}
          </Typography>
        </Grid>
        <Grid item>
          {
            showButton
            ?
              <Button
                sx={{
                  mt: { xs: 2, sm: 0 }
                }}
                onClick={onClick}
                variant="contained"
                startIcon={showIcon && <AddTwoToneIcon fontSize="small" />}
              >
                {buttonText}
              </Button>
            :
              <></>
          }
        </Grid>
      </Grid>
    </>
  );
}

export default ListHeader;
