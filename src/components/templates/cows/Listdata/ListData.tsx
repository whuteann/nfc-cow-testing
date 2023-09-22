import {
  ChangeEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect
} from 'react';

import {
  Avatar,
  Box,
  Card,
  Slide,
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
  Button,
  Typography,
  Dialog,
  styled,
} from '@mui/material';

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';
import { paginate } from '@/services/cow/CowServices';
import _ from 'lodash';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import Loading from '@/components/atoms/Loading/Loading';
import Cow from './Cow';


const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface listDataProps {
  type?: 'View' | 'Approval' | 'Rejected',
  permissions?: string[]
}

const ListData = ({
  type = 'View',
  permissions = []
}: listDataProps) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const displayName = t('cow');

  //View List Data
  const [cows, setCows] = useState<Prisma.CowCreateInput[]>([]);
  const [search, setSearch] = useState<string>('');

  //Pagination
  const [status, setStatus] = useState<any>(getStatus());
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setTotalCount] = useState<number>(0);
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);

  //Delete Handling
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteID, setDeleteID] = useState('');
  const [cow, setCow] = useState<Prisma.CowCreateInput>();

  const dropdownStatus = [
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Dispersed",
      value: "Dispersed",
    },
    {
      label: "In Farm",
      value: "In Farm",
    },
    {
      label: "Sold",
      value: "Sold",
    },
    
    {
      label: "All",
      value: "All",
    }
  ];

  function getStatus() {
    let convertedStatus = "All";

    switch(type) {
      case 'View':
        convertedStatus = "All";
        break;

      case 'Approval':
        convertedStatus = 'Completed';
        break;

      default:
        convertedStatus = "All";
    }    

    return convertedStatus;
  }
  
  // Status Change Function
  function handleStatusChange(status: any): void {
    if(status == null || undefined ){
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
    } else if (cows.length === 0 && !loading) {
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
          {t("We couldn't find any cows matching your search criteria")}
        </Typography>
      )
    } else {
      return (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Secondary ID')}</TableCell>
                  <TableCell>{t('NFC ID')}</TableCell>
                  <TableCell>{t('Family')}</TableCell>
                  <TableCell>{t('Location')}</TableCell>
                  <TableCell>{t('Gender')}</TableCell>
                  <TableCell>{t('Weight')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell>{t('Price')}</TableCell>
                  <TableCell align="center">{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cows.map((cow, index) => {
                  return (
                    <Cow
                      key={index}
                      cow={cow}
                      deleteFunc={() => handleConfirmDelete(cow)}
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
    getPaginatedData(status, newPage, limit, search);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  // Paginate Function
  const getPaginatedData = async(status: String, localPage: number, localLimit: number, localSearch: string) => {
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
      filterFarm: true,
      includeDispersalCows: true
    }
    
    await paginate(query, (result: any) => {
      const cows = _.map(result.pageEdges, function(cow) { return cow.node; });
      setCows(cows || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });
  }

  // Delete Function
  const handleConfirmDelete = (cow: any) => {
    setOpenConfirmDelete(true);
    setCow(cow);
    setDeleteID(cow?.id);
  };
  
  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    // await deleteCow(deleteID, () => {
    //   enqueueSnackbar(t("The")+` ${displayName} `+t("has been deleted successfully"), {
    //     variant: 'success',
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right'
    //     }
    //   });
    // }, (error: any) => {
    //   enqueueSnackbar(error.data, {
    //     variant: 'error',
    //     anchorOrigin: {
    //       vertical: 'top',
    //       horizontal: 'right'
    //     }
    //   });
    // });

    setPage(0);
    setPageCursor('');
    getPaginatedData(status, page, limit, search);
    setOpenConfirmDelete(false);
  };

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
            placeholder={t('Search by nfc ID...')}
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

        <Divider />

        { displayContent() }
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Are you sure you want to permanently delete this cow')}
            ?
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
}

export default ListData;