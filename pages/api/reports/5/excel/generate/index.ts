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
    const {
      countryId,
      farmId,
      villageTownId,
      teamLeadId,
      supervisorId,
      coordinatorId,
      familyId,
      fromDate,
      toDate,
     } = req.query;

    const data = await getData({ 
      countryId: countryId.toString(),
      farmId: farmId.toString(),
      villageTownId: villageTownId.toString(),
      teamLeadId: teamLeadId.toString(),
      supervisorId: supervisorId.toString(),
      coordinatorId: coordinatorId.toString(),
      familyId: familyId.toString(),
      fromDate: fromDate,
      toDate: toDate,
     });


    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report 3');

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: '', key: 'col1', width: 35 },
      { header: '', key: 'col2', width: 30 },
      { header: '', key: 'col3', width: 30 },
      { header: '', key: 'col4', width: 30 },
    ];

    // Add data to the worksheet
    const content = [
      { col1: 'Name', col2: 'Date sold', col3: 'Quantity', col4: 'Price' },
    ];

    data.map(item => {
      content.push({ col1: item.name, col2: item.dateSold, col3: item.quantity, col4: item.price })
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