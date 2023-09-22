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

import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { useSnackbar } from 'notistack';
import { Prisma } from '@prisma/client';
import { deleteFarm, paginate } from '@/services/farm/FarmServices';
import _ from 'lodash';
import Loading from '@/components/atoms/Loading/Loading';
import Farm from './partials/Farm';

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

const ListData: FC = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const displayName = t('farm');

  //View List Data
  const [farms, setFarms] = useState<Prisma.FarmCreateInput[]>([]);
  const [search, setSearch] = useState<string>('');

  //Pagination
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setTotalCount] = useState<number>(0);
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);

  //Delete Handling
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteID, setDeleteID] = useState('');
  const [farm, setFarm] = useState<Prisma.FarmCreateInput>();

  const displayContent = () => {
    if(loading) {
      return (
        <Loading />
      );
    } else if (farms.length === 0 && !loading) {
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
          {t("We couldn't find any farms matching your search criteria")}
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
                  <TableCell>{t('Name')}</TableCell>
                  <TableCell align="center">{t('Actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {farms.map((farm, index) => {
                  return (
                    <Farm
                      key={index}
                      farm={farm}
                      deleteFunc={() => handleConfirmDelete(farm)}
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
    getPaginatedData(newPage, limit, search);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  // Paginate Function
  const getPaginatedData = async(localPage: number, localLimit: number, localSearch: string) => {
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
      page: localPage,
      filterCountry: true,
      filterFarm: false
    }
    
    await paginate(query, (result: any) => {
      const farms = _.map(result.pageEdges, function(farm) { return farm.node; });
      setFarms(farms || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });
  }

  // Delete Function
  const handleConfirmDelete = (farm: any) => {
    setOpenConfirmDelete(true);
    setFarm(farm);
    setDeleteID(farm?.id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    await deleteFarm(deleteID, () => {
      enqueueSnackbar(t("The")+` ${displayName} `+t("has been deleted successfully"), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    }, (error: any) => {
      enqueueSnackbar(error.data, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        }
      });
    });

    setPage(0);
    setPageCursor('');
    getPaginatedData(page, limit, search);
    setOpenConfirmDelete(false);
  };

  // Handle limit and search change
  useEffect(() => {
    setPage(0);
    getPaginatedData(null, limit, search);
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
            {t('Are you sure you want to permanently delete this farm')}
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