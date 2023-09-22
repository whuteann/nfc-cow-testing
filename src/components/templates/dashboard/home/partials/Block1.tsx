import {
  Box,
  Avatar,
  Card,
  Grid,
  useTheme,
  styled,
  Typography
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import SupportTwoToneIcon from '@mui/icons-material/SupportTwoTone';
import YardTwoToneIcon from '@mui/icons-material/YardTwoTone';
import SnowmobileTwoToneIcon from '@mui/icons-material/SnowmobileTwoTone';
import { ICow } from '@/models/Cow';
import { getCountDashboard, index as getCount } from '@/services/cow/CowServices';
import { useRef, useState, useEffect } from 'react';
import { Prisma } from '@prisma/client';
import _ from 'lodash';
import cows from 'pages/api/cows';
import { useRouter } from 'next/router';
import { COW_INFARM, COW_DISPERSED, COW_SOLD, COW_PENDING, COW_DEAD } from '@/types/Status';
import Block1Display from '../templates/Block1Display';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      color:  ${theme.colors.alpha.trueWhite[100]};
      width: ${theme.spacing(5.5)};
      height: ${theme.spacing(5.5)};
`
);

const Block1 = () => {
  const router = useRouter();
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  // const ref = useRef(null);
  // const [cows, setCows] = useState<any>([]);
  const [stats, setStats] = useState<JSX.Element>(<div></div>);

  useEffect(() => {

    if (router.isReady) {
      getCountDashboard((data) => {
        const display = (
          <div>
            {
              data.map((item) => {

                let totalCows = 0;
                let farmCows = 0;
                let dispersedCows = 0;
                let soldCows = 0;

                item.data.map((i) => {
                  switch (i.status) {
                    case COW_INFARM:
                      farmCows = i._count._all
                      totalCows += i?._count?._all || 0;
                      break;
                    case COW_DISPERSED:
                      dispersedCows = i._count._all;
                      totalCows += i?._count?._all || 0;
                      break;
                    case COW_SOLD:
                      soldCows = i._count._all
                      totalCows += i?._count?._all || 0;
                      break;
                    case COW_PENDING:
                      break;
                    case COW_DEAD:
                      break;
                    default:
                      console.error("unexpected status: ", data.status)
                      break;
                  }
                });

                return (
                  <div key={item.country}>
                    {
                      data.length == 1
                        ?
                        <></>
                        :
                        <Typography variant="h3">{t(item.country)}</Typography>

                    }
                    <div className='mb-2' />
                    <Block1Display
                      theme={theme}
                      t={t}
                      totalCows={totalCows}
                      farmCows={farmCows}
                      dispersedCows={dispersedCows}
                      soldCows={soldCows}
                    />
                    <div className='mb-4' />
                  </div>
                )
              })
            }
          </div>
        )

        setStats(display)

        // setStats(<Typography variant="h3">Family business by the Maxwell Family</Typography>);
      });
    }
  }, [router.isReady]);


  return (
    <div>
      {stats}
    </div>
  );
}

export default Block1;
