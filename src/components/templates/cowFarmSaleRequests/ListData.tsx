import {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Card,
  Divider,
  Table,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Typography,
  TableBody,
  Grid,
  TextField,
  InputAdornment,
  fabClasses,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { paginate } from '@/services/cow_farm_sales/CowFarmSalesServices';
import Request from './partials/Request';
import { useRouter } from 'next/router';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Prisma } from '@prisma/client';
import _ from 'lodash';
import Loading from '@/components/atoms/Loading/Loading';

interface listDataProps {
  type?: 'View' | 'Approval' | 'Rejected',
  permissions?: string[]
}

const ListData = ({
  type = 'View',
  permissions = []
}: listDataProps) => {
  const { t }: { t: any } = useTranslation();
  
  //View Requests
  const [cowFarmSaleRequests, setCowFarmSaleRequests] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');

  //Pagination
  const [status, setStatus] = useState<any>(getStatus());
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setTotalCount] = useState<number>(0);
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);

  const dropdownStatus = [
    {
      label: "Approved",
      value: "Approved",
    },
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Pending",
      value: "Pending",
    },
    {
      label: "Rejected",
      value: "Rejected",
    }
  ];

  function getStatus() {
    let convertedStatus = 'Pending';

    switch (type) {
      case 'View':
        convertedStatus = 'Approved';
        break;

      case 'Approval':
        convertedStatus = 'Pending';
        break;

      case 'Rejected':
        convertedStatus = 'Rejected';
        break;

      default:
        convertedStatus = 'Pending';
    }

    return convertedStatus;
  }

  // Status Change Function
  function handleStatusChange(status: any): void {
    if (status == null || undefined) {
      return
    }
    setStatus(status)
    getPaginatedData(status, page, limit, search);
  };

  const displayContent= () => {
    if (loading) {
      return (
        <Loading />
      );
    } else if (cowFarmSaleRequests.length === 0 && !loading) {
      return (
        <Typography
          sx={{
            py: 10
          }}
          variant="h3"
          fontWeight="normal"
          color="text.secondary"
          align="center"
        >
          {t("We couldn't find any farm sale requests matching your search criteria")}
      </Typography>
      )
    } else {
      return (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                  </TableCell>
                  <TableCell>{t('ID')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell>{t('Farm Name')}</TableCell>
                  <TableCell>{t('Quantity')}</TableCell>

                  {
                    type == 'Rejected'
                      ?
                      <TableCell align="center">{t('Rejected Reason')}</TableCell>
                      :
                      <></>
                  }

                  <TableCell align="center">{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cowFarmSaleRequests.map((request) => (
                  <Request
                    key={request.id}
                    type={type}
                    request={request}
                    permissions={permissions}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box p={2}>
            <TablePagination
              component="div"
              count={count}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleLimitChange}
              page={page || 0}
              rowsPerPage={limit}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          </Box>
        </>
      )
    }
  }

  const handlePageChange = (_event: any, newPage: any): void => {
    getPaginatedData(status, newPage, limit, search);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  // Paginate Function
  const getPaginatedData = async (status: string, localPage: number, localLimit: number, localSearch: string) => {
    let cursor = {
      cursor: ''
    }
    
    if(localPage > 0) {
      cursor = _.find(pageCursor?.around, (item: any) => {
        return item.page == localPage + 1;
      });
    }

    const query = {
      status: status == 'All' ? '' : status,
      cursor: cursor?.cursor || '',
      limit: localLimit,
      search: localSearch,
      filterFarm: true
    }

    await paginate(query, (result: any) => {
      const cowFarmSaleRequests = _.map(result.pageEdges, function(cowFarmSaleRequest) { return cowFarmSaleRequest.node; });

      setCowFarmSaleRequests(cowFarmSaleRequests || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      console.error('err', error);
      setLoading(false)
    });
  }

  // Handle limit and search change
  useEffect(() => {
    setPage(0);
    getPaginatedData(status, null, limit, search);
  }, [limit, search]);

  // const onPaginate = async (newPage: number) => {
  //   setPage(newPage);
  //   getPaginatedData(status, newPage + 1, limit, search);
  // };

  return (
    <>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
                placeholder={t('Search by farm name...')}
                fullWidth
                variant="outlined"
              />
              {
                type == 'View'
                  ?
                  <DropdownStringField
                    items={dropdownStatus}
                    value={status}
                    label={t("Status")}
                    onChangeValue={(value) => handleStatusChange(value)}
                  />
                  :
                  <></>
              }
            </Box>
          </Grid>
        </Grid>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              {t("Showing") + ` ${status} ` + t("Requests")}:
            </Typography>{' '}
          </Box>
        </Box>
        <Divider />

        { displayContent() }
      </Card>
    </>
  );
}

export default ListData;