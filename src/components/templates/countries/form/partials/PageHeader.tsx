import { Box, Grid, Typography, Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import Link from 'src/components/atoms/Link';
import { type } from 'os';

const RootWrapper = styled(Box)(
  () => `
    flex: 1;
`
);

interface headerProps {
  type: string
}

function PageHeader({type} : headerProps) {
  const { t }: { t: any } = useTranslation();

  return (
    <RootWrapper>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h3" component="h3" gutterBottom>
                {type == "create"
                  ? t("Create a new country")
                  : t("Edit a country")
                }
              </Typography>
              <Typography variant="subtitle2">
                {type == "create"
                  ? t("Fill in the fields below to create a country")
                  : t("Fill in the fields below to edit a country")
                }
                
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            component={Link}
            startIcon={<ArrowBackTwoToneIcon />}
            href="/dashboard/countries"
            variant="contained"
          >
            {t('Go back to all countries')}
          </Button>
        </Grid>
      </Grid>
    </RootWrapper>
  );
}

export default PageHeader;
