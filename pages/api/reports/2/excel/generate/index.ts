import { NextApiRequest, NextApiResponse } from "next";
import ExcelJS from 'exceljs';
import { getData } from "../../index"

export default async function handler(req: any, res: any) {

  // switch the methods
  switch (req.method) {
    case "GET":
      return generateExcel(req, res);

    default:
      res.status(405).send({ message: 'Invalid Method.' })
      return;
  }
}

const generateExcel = async (req: NextApiRequest, res: NextApiResponse) => {
  try {


    const { coordinatorId } = req.query;
    console.log(coordinatorId);

    const data = await getData({ req: req, coordinatorId: (coordinatorId as string) });

    console.log(data);

    // return res.status(200).json({ message: "success" });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report 2');

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: '', key: 'col1', width: 20 },
      { header: '', key: 'col2', width: 30 },
      { header: '', key: 'col3', width: 15 },
      { header: '', key: 'col4', width: 30 },
      { header: '', key: 'col5', width: 35 }
    ];

    // Add data to the worksheet
    const content = [
      { col1: 'Details', col2: '', col3: '', col4: 'Number of Visits', col5: '' },
      { col1: 'Total cows', col2: 'Total families', col3: 'Current month', col4: 'Last month', col5: 'Month before last month' },
      {
        col1: data.cowCount?._count?._all,
        col2: data.familyCount?._count?._all,
        col3: data.visitationCount?.currentMonth,
        col4: data.visitationCount?.lastMonth,
        col5: data.visitationCount?.monthBeforeLastMonth
      },
      // Add more data rows as needed
    ];

    // Add rows to the worksheet
    content.forEach((row, index) => {
      const worksheetRow = worksheet.addRow(row);

      if (index === 0) {
        worksheetRow.eachCell((cell, index) => {
          if (index == 0 || index == 4) {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
            };
          } else if (index == 5) {
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          } else {
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' }
            };
          }

        });
      } else if (index === 1) {
        worksheetRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      } else if (index === 2) {
        worksheetRow.eachCell((cell, index) => {
          if(index == 3)
          cell.border = {
            right: { style: 'thin' }
          };
        });
      }
    });

    // Set the response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=example.xlsx');

    // Send the Excel file as a response
    const buffer = await workbook.xlsx.writeBuffer();
    return res.end(buffer);

  } catch (error) {
    return res.status(500).send({ message: `Error occurred ${error}` });
  }
}