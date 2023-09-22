import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { Grid, Typography } from '@mui/material';
import TextInputField from '@/components/atoms/Input/text/inputField/TextInputField';

function CowDispersalFamilyApprovalComponent({ 
  familyCoordinator, 
}: any) {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Typography component="span" variant="subtitle1">
        {t('Family / Coordinator')}
      </Typography>

      <Grid container alignItems="center" gap={1} wrap="nowrap" >
        <Grid xs={4} item={true}>
          <TextInputField 
            name='Family'
            label={t('Family/Coordinator')}
            value={familyCoordinator?.family?.name || ''}
            disabled={true}
          />
        </Grid>
        <Grid xs={4} item={true}>
          <TextInputField 
            name='No. Animals Allocated'
            label={t('No. Animals Allocated')}
            value={familyCoordinator?.family?.noAnimalsAllocated || ''}
            disabled={true}
          />
        </Grid>
        <Grid xs={4} item={true}>
          <TextInputField 
            name="No of Cows"
            type="number"
            label={t('No of Cows')}
            value={familyCoordinator?.noOfCows || ''}
            disabled={true}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default CowDispersalFamilyApprovalComponent;