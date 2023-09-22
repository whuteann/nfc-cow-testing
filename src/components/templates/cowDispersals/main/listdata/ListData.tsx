import {
  ChangeEvent,
  useState,
  useEffect
} from 'react';

import {
  Box,
  Card,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { Prisma } from '@prisma/client';
import _ from 'lodash';
import Loading from '@/components/atoms/Loading/Loading';
import { paginate } from '@/services/cowdispersal/CowDispersalServices';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import CowDispersals from './CowDispersals';
import { status } from 'nprogress';

interface listDataProps {
  type?: 'View' | 'Approval' | 'Rejected' | 'Completed' | 'Assign Cows',
  permissions?: string[],
}

const ListData = ({
  type = 'View',
  permissions = []
}: listDataProps) => {
  const { t }: { t: any } = useTranslation();
  
  //View List Data
  const [cowDispersals, setCowDispersals] = useState<Prisma.CowDispersalCreateInput[]>([]);
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

      case 'Completed':
        convertedStatus = 'Completed';
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

  const displayContent = () => {
    if(loading) {
      return (
        <Loading />
      );
    } else if (cowDispersals.length === 0 && !loading) {
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
          {t("We couldn't find any cow dispersals matching your search criteria")}
        </Typography>
      )
    } else {
      return (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{t('ID')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell>{t('Family Name')}</TableCell>
                  <TableCell>{t('No of Cows')}</TableCell>
                  
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
                <CowDispersals 
                  cowDispersals={cowDispersals} 
                  type={type}
                  permissions={permissions}
                />
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
  const getPaginatedData = async(localStatus: string, localPage: number, localLimit: number, localSearch: string) => {
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
      status: type == 'Assign Cows' ? '' : localStatus,
      statuses: type == 'Assign Cows' ? ['Approved', 'Sub-Completed'] : '',
      limit: localLimit,
      search: localSearch,
      filterFamily: true
    }
    
    console.error(query);

    await paginate(query, (result: any) => {
      const cowDispersals = _.map(result.pageEdges, function(cowDispersal) { return cowDispersal.node; });
      setCowDispersals(cowDispersals || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });
  }

  // Handle limit and search change
  useEffect(() => {
    setPage(0);
    getPaginatedData(status, null, limit, search);
  }, [limit, search]);

  return (
    <>
      <Card>
        <Box p={2}>
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
            placeholder={t('Search by name...')}
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

        <Divider />

        { displayContent() }
      </Card>
    </>
  );
};

export default ListData;