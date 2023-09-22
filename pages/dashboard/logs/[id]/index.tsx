import Head from "next/head";
import { useRouter } from "next/router";
import { Grid, Accordion, AccordionSummary, Typography, AccordionDetails, Hidden } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Master from "@/layouts/BaseLayout/master";
import PageTitleWrapper from "@/components/atoms/PageTitleWrapper";
import ListHeader from "@/components/molecules/listHeader/ListHeader";
import { useTranslation } from "next-i18next";
import { getOne as getLog } from "../../../api/logs/[id]/index";
import { useEffect, useState } from "react";
import { formatField, renderDetails } from "@/helpers/LogDisplayHelper";
import { log } from "console";


function LogsDetails({ log }: any) {
  const { t }: { t: any } = useTranslation();
  const [detailRows, setDetailRows] = useState([]);

  const router = useRouter();

  const ignoreFields = ['password', 'permissions', 'contractFormFilename', 'applicationFormFilename', 'cowsSnapshot', 'changedPassword']

  useEffect(() => {
    const createElements = async () => {
      let details = []
      
      const elementsPromises = log.editedFields.map(async (editedField) => {

        if (!ignoreFields.includes(editedField) && !ignoreFields.includes(editedField.field)) {
          let el;
          let fieldEdited = editedField.field ? editedField.field : editedField

          if (Array.isArray(log.oldObject)) {
            let oldValue = log.oldObject.find(i => i["field"] == fieldEdited)
            let newValue = log.editedObject.find(i => i["field"] == fieldEdited)
            el = await renderDetails(oldValue? oldValue.value : "", newValue? newValue.value : "", fieldEdited);
          } else {
            el = await renderDetails(log.oldObject[fieldEdited], log.editedObject[fieldEdited], fieldEdited);
          }


          return el;
        } else {
          return null;
        }
      });

      const elements = await Promise.all(elementsPromises);

      details = elements.filter((el) => el !== undefined);

      return details;
    }

    createElements().then(elements => {
      setDetailRows(elements);
    })
  }, []);

  return (
    <>
      <Head>
        <title>Log Details</title>
      </Head>

      <PageTitleWrapper>
        <ListHeader
          title={t("Log Details")}
          description={t(`Log from ${log.collectionName.replace("_", " ").toLowerCase()}`)}
          showButton={true}
          showIcon={false}
          buttonText='Go Back'
          onClick={() => router.back()}
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
          {
            log.editedFields.map((editedField, index) => {

              if (ignoreFields.includes(editedField)) return
              if (ignoreFields.includes(editedField.field)) return

              return (
                <div key={index}>
                  <Accordion className="border border-gray-600">
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{editedField.field ? formatField(editedField.field) : formatField(editedField)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {detailRows[index]}
                    </AccordionDetails>
                  </Accordion>
                </div>
              )
            })
          }
        </Grid>
      </Grid>

    </>
  );
}

LogsDetails.getLayout = (page: any) => <Master>{page}</Master>;

export default LogsDetails;

export async function getServerSideProps(context: any) {
  const { id } = context.query;

  const log = await getLog({ id: id })

  return {
    props: {
      log: JSON.parse(JSON.stringify(log)),
    }
  }
}
