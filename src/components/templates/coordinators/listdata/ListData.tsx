import {
  ChangeEvent,
  useState,
  useEffect
} from 'react';

import {
  Avatar,
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
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';
import _ from 'lodash';
import Loading from '@/components/atoms/Loading/Loading';
import { paginate } from '@/services/family/FamilyServices';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import Coordinators from './Coordinators';

interface listDataProps {
  type?: 'View' | 'Approval' | 'Rejected' | 'Replacement',
  permissions?: string[],
}

const ListData = ({
  type = 'View',
  permissions = []
}: listDataProps) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const displayName = t('coordinator');

  //View List Data
  const [coordinators, setCoordinators] = useState<Prisma.FamilyCreateInput[]>([]);
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
      label: "Pending",
      value: "Pending",
    },
    {
      label: "Rejected",
      value: "Rejected",
    },
    {
      label: "Inactive",
      value: "Inactive"
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

      case 'Replacement':
        convertedStatus = 'Approved';
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
    } else if (coordinators.length === 0 && !loading) {
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
          {t("We couldn't find any coordinators matching your search criteria")}
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
                  <TableCell>{t('Coordinator Name')}</TableCell>
                  <TableCell>{t('Town/Village Name')}</TableCell>
                  <TableCell>{t('Coordinator Type')}</TableCell>
                  <TableCell>{t('National ID')}</TableCell>

                  {type == 'Replacement' && <TableCell>{t('NFC ID')}</TableCell>}

                  {type == 'Rejected' && <TableCell align="center">{t('Rejected Reason')}</TableCell>}

                  <TableCell align="center">{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Coordinators
                  coordinators={coordinators}
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
      hasNfcID: type === 'Replacement' ? true : false,
      // hasNfcID: true,
      cursor: cursor?.cursor || '',
      status: localStatus,
      limit: localLimit,
      search: localSearch,
      type: 'Coordinator',
      filterCountry: true,
      filterFamily: true
    }
    
    await paginate(query, (result: any) => {
      const coordinators = _.map(result.pageEdges, function(coordinator) { return coordinator.node; });
      setCoordinators(coordinators || []);
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