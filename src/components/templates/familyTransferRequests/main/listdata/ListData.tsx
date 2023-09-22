import {
  ChangeEvent,
  useState,
  useEffect
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
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { paginate } from '@/services/family_transfer/FamilyTransferServices';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { useRouter } from 'next/router';
import FamilyTransferRequests from './FamilyTransferRequests';
import _ from 'lodash';

interface listDataProps {
  type?: 'View' | 'Approval' | 'Completed' | 'Rejected',
  permissions?: string[]
}

const ListData = ({
  type = 'View',
  permissions
}: listDataProps) => {
  const router = useRouter();
  const { t }: { t: any } = useTranslation();
  
  const displayName = t('family transfer requests');

  //View familyTransferRequests
  const [familyTransferRequests, setFamilyTransferRequests] = useState<any[]>([]);

  //Pagination
  const [status, setStatus] = useState<any>(getStatus());
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [page, setPage] = useState<any>(0);
  const [limit, setLimit] = useState<any>(20);
  const [totalcount, setTotalCount] = useState<any>(0);
  const [search, setSearch] = useState<string>('');
  
  const dropdownStatus = [
    {
      label: "Approved",
      value: "Approved",
    },
    // {
    //   label: "Cows taken from Current Family",
    //   value: "Cows taken from Family 1",
    // },
    // {
    //   label: "Cows transferred to New Family",
    //   value: "Cows transferred to Family 2",
    // },
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

    switch(type) {
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
    if(status == null || undefined ){
      return
    }
    setStatus(status)
    getPaginatedData(status, 0, limit, search);
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
      status: localStatus,
      limit: localLimit,
      search: localSearch,
      filterFamily: true
    }
    
    await paginate(query, (result:any) => {
      const requests = _.map(result.pageEdges, function(request){ return request.node});
      
      setFamilyTransferRequests(requests || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
    }, (error) => {
      console.error('err', error);
    });
  }

  const onPaginate = async (newPage: number) => {
    setPage(newPage);
    getPaginatedData(status, newPage, limit, search);
  };

  // Handle limit and search change
  useEffect(() => {
    setPage(0);
    getPaginatedData(status, 0, limit, search);
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
                placeholder={t('Search by ID...')}
                fullWidth
                variant="outlined"
              />
              {
                type == 'View'
                  ?
                    <DropdownStringField
                      items= {dropdownStatus}
                      value= {status}
                      label= {t("Status")}
                      onChangeValue={(value)=> handleStatusChange(value)}
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
              {t("Showing")+` ${displayName}`}:
            </Typography>{' '}
          </Box>
          </Box>
        <Divider />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{t('ID')}</TableCell>
                <TableCell>{t('Status')}</TableCell>
                <TableCell>{t('Current Family')}</TableCell>
                <TableCell>{t('New Family')}</TableCell>
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

            <FamilyTransferRequests 
              familyTransferRequests={familyTransferRequests} 
              type={type}
              permissions={permissions}
            />
          </Table>
        </TableContainer>

        {familyTransferRequests.length == 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t("We couldn't find any") + ` ${displayName} ` + t("matching your search criteria")}
          </Typography>
        ) : (
          <>
          </>
        )}
        
        <Box p={2}>
          <TablePagination
            component="div"
            count={totalcount}
            onPageChange={(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => { onPaginate(newPage) }}
            onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => { setPage(0); setLimit(parseInt(event.target.value))}}
            page = {page || 0}
            rowsPerPage = {limit}
            rowsPerPageOptions ={[5, 10, 15, 20]}
            labelRowsPerPage={t("Rows per page")+":"}
          />
        </Box>
      </Card>

    </>
  );
}

export default ListData;