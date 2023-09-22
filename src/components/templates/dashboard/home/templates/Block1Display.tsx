import {
  Box,
  Avatar,
  Card,
  Grid,
  useTheme,
  styled,
  Typography
} from '@mui/material';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import YardTwoToneIcon from '@mui/icons-material/YardTwoTone';
import SnowmobileTwoToneIcon from '@mui/icons-material/SnowmobileTwoTone';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      color:  ${theme.colors.alpha.trueWhite[100]};
      width: ${theme.spacing(5.5)};
      height: ${theme.spacing(5.5)};
`
);

interface DisplayProps {
  theme: any,
  t: any,
  totalCows: number,
  farmCows: number,
  dispersedCows: number,
  soldCows: number,
}

const Block1Display = ({
  theme,
  t,
  totalCows,
  farmCows,
  dispersedCows,
  soldCows
}: DisplayProps) => {

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              pb: 6,
              pt: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.blue4}`
                }}
              >
                <ReceiptTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Total Number of Cows')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                justifyContent: 'center'
              }}
            >
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {totalCows}

              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              pb: 6,
              pt: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.orange3}`
                }}
              >
                <SupportTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Total Number of Cows In Farm')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                justifyContent: 'center'
              }}
            >
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {farmCows}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              pb: 6,
              pt: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.success.main}`
                }}
              >
                <YardTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Total Number of Dispersed Cows')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                justifyContent: 'center'
              }}
            >
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {dispersedCows}
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card
            sx={{
              px: 3,
              pb: 6,
              pt: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.primary.main}`
                }}
              >
                <SnowmobileTwoToneIcon fontSize="small" />
              </AvatarWrapper>
              <Typography
                sx={{
                  ml: 1.5,
                  fontSize: `${theme.typography.pxToRem(15)}`,
                  fontWeight: 'bold'
                }}
                variant="subtitle2"
                component="div"
              >
                {t('Total Number of Cows Sold')}
              </Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                ml: -2,
                pt: 2,
                justifyContent: 'center'
              }}
            >
              <Typography
                sx={{
                  pl: 1,
                  fontSize: `${theme.typography.pxToRem(35)}`
                }}
                variant="h1"
              >
                {soldCows}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Block1Display;