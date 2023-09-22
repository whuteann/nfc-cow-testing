import {
  ChangeEvent,
  useState,
  useEffect
} from 'react';
import {
  Box,
  Card,
  Table,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Typography,
  TableBody
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { paginate } from '@/services/log/LogServices';
import Log from './Log';
import _ from 'lodash';
import { setLoading } from '@/store/reducers/Loading';

function ListData({ id }: any) {
  const { t }: { t: any } = useTranslation();

  //View UserDatas
  const [logs, setLogs] = useState<any[]>([]);

  //Pagination
  const [pageCursor, setPageCursor] = useState<any>(null);
  const [count, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const handlePageChange = (_event: any, newPage: any): void => {
    getPaginatedData(newPage, limit);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  // Paginate Function
  const getPaginatedData = async (localPage: number, localLimit: number) => {
    let cursor = {
      cursor: ''
    }

    if (localPage > 0) {
      cursor = _.find(pageCursor?.around, (item: any) => {
        return item.page == localPage + 1;
      });
    }

    const query = {
      cursor: cursor?.cursor || '',
      page: localPage,
      limit: localLimit,
    }

    await paginate(id, query, (result) => {
      const logs = _.map(result.pageEdges, function (log) { return log.node; });

      setLogs(logs || []);
      setPageCursor(result.pageCursors);
      setPage(localPage);
      setTotalCount(result.totalCount);
      setLoading(false);
    }, (error) => {
      console.error('err', error);
    });
  }

  // Handle limit and search change
  useEffect(() => {
    if (!id) {
      return
    }
    setPage(0);
    getPaginatedData(0, limit);
  }, [limit, id]);

  return (
    <>
      <Card>
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography component="span" variant="subtitle1">
              {t('Showing')}:
            </Typography>{' '}
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Message')}</TableCell>
                <TableCell>{t('Created At')}</TableCell>
                <TableCell>{t('Action')}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.map((log: any) => (
                <Log
                  key={log.id.toString()}
                  log={log}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {logs.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t(
              `We couldn't find any logs matching your search criteria`
            )}
          </Typography>
        ) : (
          <></>
        )}

        <Box p={2}>
          <TablePagination
            component="div"
            count={count}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
            labelRowsPerPage={t('Rows per page:')}
          />
        </Box>
      </Card>
    </>
  );
};

export default ListData;