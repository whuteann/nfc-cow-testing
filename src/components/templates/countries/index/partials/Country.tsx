import { TableBody, TableCell, TableRow, Typography,Tooltip, IconButton } from '@mui/material'
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import React from 'react'
import Router from 'next/router';
import { useTranslation } from 'next-i18next';
import { ICountry } from '@/models/Country';
import HistoryIcon from '@mui/icons-material/History';
import { Prisma } from '@prisma/client';


interface countryProps {
  country: Prisma.CountryCreateInput,
  deleteFunc: (country: any) => void
}

const Country = ({
  country, 
  deleteFunc
}: countryProps) => {

  const router = Router;
  const { t }: { t: any } = useTranslation();

  return (
    <TableRow
      hover
      key={country.id}
      selected={true}
    >
      <TableCell>
        <Typography noWrap variant="h5">
          {`${country.secondaryId}`}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography noWrap variant="h5">
          {country.name}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography noWrap>
          <Tooltip title={t('View')} arrow>
            <IconButton onClick={() => router.push(`/dashboard/countries/${country.id}/edit`)} color="primary">
              <LaunchTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title='Logs' arrow>
            <IconButton 
            onClick={() => router.push(`/dashboard/countries/${country?.id}/logs/`)} 
            color="primary">
              <HistoryIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('Delete')} arrow>
            <IconButton
              onClick={() => deleteFunc(country)}
              color="primary"
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
      </TableCell>
    </TableRow>
  )
}

export default Country