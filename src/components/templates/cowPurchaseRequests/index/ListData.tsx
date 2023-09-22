import {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import {
  Box,
  Card,
  Grid,
  Divider,
  Table,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Typography,
  TableBody,
  InputAdornment,
  TextField,
} from '@mui/material';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useTranslation } from 'react-i18next';
import { paginate } from '@/services/cow_purchases/CowPurchasesServices';
import { useRouter } from 'next/router';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import Loading from '@/components/atoms/Loading/Loading';
import CowPurchaseRequest from './partials/CowPurchaseRequest';
import { Prisma } from '@prisma/client';
import _ from 'lodash';

interface listDataProps {
  type?: 'View' | 'Approval' | 'Rejected'
}

const ListData = ({
  type = 'View'
}: listDataProps) => {
  const router = useRouter();
  const { t }: { t: any } = useTranslation();

  //View Requests
  const [requests, setRequests] = useState<Prisma.CowPurchaseRequestCreateInput[]>([]);

  //Pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<any>(getStatus());
  const [search, setSearch] = useState<string>('');
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [page, setPage] = useState<any>(0);
  const [limit, setLimit] = useState<any>(20);
  const [count, setTotalCount] = useState<any>(0);

  const displayContent = () => {
    if (loading) {
      return (
        <Loading />
      );
    } else if (requests.length === 0 && !loading) {
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
          {t("We couldn't find any cow purchase requests matching your search criteria")}
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
                  <TableCell>{t('Farm Name')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell>{t('Number Of Cows')}</TableCell>
                  <TableCell>{t('Price Per Cow')}</TableCell>
                  <TableCell>{t('Reason For Purchase')}</TableCell>
                  <TableCell>{t('Calculated Purchase Price')}</TableCell>
                  {
                    type=="Rejected"
                    ?
                    <TableCell>{t('Rejection Reasons')}</TableCell>
                    :
                    <></>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request, index) => {
                  return (
                    <CowPurchaseRequest
                      key={index}
                      type={type}
                      request={request}
                    />
                  );
                })}
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
    getPaginatedData(newPage, limit, status, search);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const dropdownStatus = [
    {
      label: "Approved",
      value: "Approved",
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

    setStatus(status);
    getPaginatedData(0, limit, status, search);
  };

  // Paginate Function
  const getPaginatedData = async (localPage: number, localLimit: number, status: string, localSearch: string) => {
    let cursor = {
      cursor: ''
    } 

    if(localPage > 0) {
      cursor = _.find(pageCursor?.around, (item: any) => {
        return item.page == localPage + 1;
      });
    }

    const query = {
      cursor: cursor?.cursor || '',
      limit: localLimit,
      search: localSearch,
      status: status,
      filterFarm: true,
      filterDispersalFarm: false
    }

    await paginate(query, (result: any) => {
      const requests = _.map(result.pageEdges, function(request){ return request.node});
      
      setRequests(requests || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      console.error('err', error);
    });
  }

  // Handle limit and search change
  useEffect(() => {
    setPage(0);
    getPaginatedData(null, limit, status, search);
  }, [limit, search]);

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
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
      </Card>

      <Card>
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

        {
          displayContent()
        }
      </Card>
    </>
  );
}

export default ListData;