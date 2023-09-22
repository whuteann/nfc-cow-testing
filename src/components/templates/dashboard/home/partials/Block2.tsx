import { Fragment, useEffect, useState } from 'react';

import {
  Box,
  ListItemText,
  Divider,
  List,
  Card,
  Typography,
  ListItem,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface block2Props {
  totalFarmCows: Array<any>
}

type TotalFarmCowItem = {
  id: string, name: string, district: string, country: string, value: number
}

function Block2({
  totalFarmCows
}: block2Props) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const [items, setItems] = useState<Array<TotalFarmCowItem>>([]);

  useEffect(() => {
    let newArr = [];
    totalFarmCows.map(item => {
      newArr.push({
        id: item.id,
        name: item.farm.name,
        district: item.farm.district.name,
        country: item.farm.district.country.name,
        value: item.totalAmountOfCows
      })
    })

    setItems(newArr);
  }, [])


  return (
    <Card>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          background: `${theme.colors.alpha.black[5]}`
        }}
        p={2}
      >
        <Box>
          <Typography variant="h3">{t('Cows Purchase Bank')}</Typography>
        </Box>
      </Box>
      <List disablePadding>
        {items.map((item) => (
          <Fragment key={item.id}>
            <Divider />
            <ListItem
              sx={{
                justifyContent: 'space-between',
                display: { xs: 'block', sm: 'flex' },
                py: 2,
                px: 2.5
              }}
            >
              <ListItemText
                sx={{
                  flexGrow: 0,
                  maxWidth: '50%',
                  flexBasis: '50%'
                }}
                disableTypography
                primary={
                  <Typography color="text.primary" variant="h4">
                    {item.name}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography noWrap variant="subtitle2">
                      {item.district} {t('in')}{' '}
                      <b>{item.country}</b>
                    </Typography>
                  </>
                }
              />
              <Box flexGrow={1} display={"flex"} flexDirection="column" alignItems="flex-end" pr={3}>
                <Box
                  display="flex"
                  alignItems={"center"}
                >
                  <Typography
                    fontWeight="bold"
                    variant="h3"
                    sx={{
                      pr: 1
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                  >
                    {t('cow(s)')}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          </Fragment>
        ))}
      </List>
    </Card>
  );
}

export default Block2;
