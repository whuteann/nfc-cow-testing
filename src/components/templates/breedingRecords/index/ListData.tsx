import {
  FC,
  ChangeEvent,
  SyntheticEvent,
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
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Dialog,
  styled,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { paginate } from '@/services/breeding_record/BreedingRecordsServices';
import CloseIcon from '@mui/icons-material/Close';
import Record from './partials/Record';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import Loading from '@/components/atoms/Loading/Loading';
import DropdownStringField from '@/components/atoms/Input/dropdown/DropdownStringField';
import { Prisma } from '@prisma/client';
import { TransitionProps } from '@mui/material/transitions';
import { type } from 'os';
import { useSnackbar } from 'notistack';
import _ from 'lodash';

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

  const displayName = t('birth record');

  //View List Data
  const [birthRecords, setBirthRecords] = useState<Prisma.BirthRecordCreateInput[]>([]);
  const [search, setSearch] = useState<string>('');

  //status
  const [status, setStatus] = useState<any>(getStatus())

  //Pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setTotalCount] = useState<number>(0);
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);

  //Delete Handling
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteID, setDeleteID] = useState('');
  const [birthRecord, setBirthRecord] = useState<Prisma.DistrictCreateInput>();
 
  const dropdownStatus = [
    {
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Pending",
      value: "Pending",
    }
  ];

  const displayContent = () => {
    if(loading) {
      return (
        <Loading />
      );
    } else if (birthRecords.length === 0 && !loading) {
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
          {t("We couldn't find any birth records matching your search criteria")}
        </Typography>
      )
    } else {
      return (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('ID')}</TableCell>
                  <TableCell>{t('NFC ID')}</TableCell>
                  <TableCell>{t('Date of Birth')}</TableCell>
                  <TableCell>{t('No of Calves Alive')}</TableCell>
                  <TableCell>{t('No of Calves Dead')}</TableCell>
                  <TableCell>{t('Comment')}</TableCell>
                  <TableCell>{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {birthRecords.map((birthRecord, index) => {
                  return (
                    <Record
                      key={index}
                      birthRecord={birthRecord}
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

  function getStatus() {
    let convertedStatus = 'Pending';

    switch(type) {
      case 'View':
        convertedStatus = 'Pending';
        break;

      case 'Approval':
        convertedStatus = 'Completed';
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
    getPaginatedData(status, page, limit, search);
  };
  

  const handlePageChange = (_event: any, newPage: any): void => {
    getPaginatedData(status, newPage, limit, search);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };
  
  // Paginate Function
  const getPaginatedData = async(status: string, localPage: number, localLimit: number, localSearch: string) => {
    let cursor = {
      cursor: ''
    } 

    if(localPage > 0) {
      cursor = _.find(pageCursor?.around, (item: any) => {
        return item.page == localPage + 1;
      });
    }

    const query = {
      status: status,
      cursor: cursor?.cursor || '',
      limit: localLimit,
      search: localSearch,
      filterFarm: true
    }
    
    await paginate(query, (result: any) => {
      const birthRecords = _.map(result.pageEdges, function(birthRecord) { return birthRecord.node; });
      setBirthRecords(birthRecords || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });
  }

  // Delete Function
  const handleConfirmDelete = (birthRecord: any) => {
    setOpenConfirmDelete(true);
    setBirthRecord(birthRecord);
    setDeleteID(birthRecord?.id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };
  
  const handleDeleteCompleted = async () => {
    // await deleteBirthRecord(deleteID, () => {
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
            placeholder={t('Search by cow nfc ID...')}
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
            {t('Are you sure you want to permanently delete this record')}
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
};

export default ListData;