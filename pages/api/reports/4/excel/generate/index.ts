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


    const { userId, fromDate, toDate } = req.query;

    const data = await getData({ userId: userId.toString(), fromDate: fromDate.toString(), toDate: toDate.toString() });

    // return res.status(200).json({message: "success"});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report 3');

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: '', key: 'col1', width: 35 },
      { header: '', key: 'col2', width: 30 },
      { header: '', key: 'col3', width: 30 },
      { header: '', key: 'col4', width: 30 },
      { header: '', key: 'col5', width: 30 }
    ];

    // Add data to the worksheet
    const content = [
      { col1: 'Name', col2: 'Total number of cows sold', col3: 'Sale amount', col4: 'CCI profit', col5: 'Total death' }
    ];

    data.forEach((family: any) => {
      content.push({ col1: family.name, col2: family.totalNumberCowsSold, col3: family.salesAmount, col4: family.cciProfit, col5: family.totalDeath })
    })

    content.forEach((row, index) => {
      const worksheetRow = worksheet.addRow(row);

      if (index == 0) {
        worksheetRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: {style: 'thin'}
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