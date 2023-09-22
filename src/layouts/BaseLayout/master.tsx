import Status500 from 'pages/dashboard/500';
import { loadingSelector } from '@/store/reducers/Loading';
import { LayoutProps } from '@/types/Common';
import { Box, Grid, useTheme } from '@mui/material';
import { ThreeCircles } from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import ExtendedSidebarLayout from '../ExtendedSidebarLayout';
import Meta from '../MetaLayout/Meta';

const Master = (props: LayoutProps) => {
  const theme = useTheme();
  const { status } = useSelector(loadingSelector);

  return  (
    <ExtendedSidebarLayout>
      <Meta
        title={props.metaProps?.title || ''}
        description={props.metaProps?.description || ''}
        canonical={props.metaProps?.canonical || ''}
      />
  
      <div className="content text-xl">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '100vh' }}
          sx={{ display: !status ? 'none' : 'flex' }}
        >
          <Grid item xs={3}>
            <Box m={1}>
              <ThreeCircles
                color={theme.palette.primary.main}
                height={80}
                width={80}
                ariaLabel="three-circles-rotating"
              />
            </Box>
          </Grid>   
        </Grid> 
    
        <Box sx={{ display: status ? 'none' : 'block' }}>
          {
            status != undefined
            ?
              props.children
            :
              <Status500></Status500>
          }
        </Box>
      </div>
      
    </ExtendedSidebarLayout>
  ); 
}

export default Master;