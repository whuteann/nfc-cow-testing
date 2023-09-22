import Head from "next/head";
import { useRouter } from "next/router";
import { Grid } from "@mui/material";
import Master from "@/layouts/BaseLayout/master";
import PageTitleWrapper from "@/components/atoms/PageTitleWrapper";
import ListHeader from "@/components/molecules/listHeader/ListHeader";
import ListData from "@/components/templates/logs/ListData";
import { useTranslation } from "next-i18next";
import { useAppDispatch } from "@/store";
import { setLoading } from "@/store/reducers/Loading";
import { useEffect, useState } from "react";

function UserLogs() {
  const { t }: { t: any } = useTranslation();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const[logID, setLogID] = useState()

  useEffect(() => {
    dispatch(setLoading(true));
    if(router.isReady) {
      const {id}:any = router.query;
      setLogID(id)
      dispatch(setLoading(false))
    };
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Cows - User log</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t("User Log")}
          description={t("List of logs")}
          showButton = {true}
          showIcon = {false}
          buttonText = 'Go Back'
          onClick={() => router.push("/dashboard/users/")}
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <ListData id = {logID}/>
        </Grid>
      </Grid>
      
    </>
  );
}

UserLogs.getLayout = (page: any) => <Master>{page}</Master>;

export default UserLogs;
