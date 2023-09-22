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


    const { fromDate, toDate } = req.query;
    console.log(fromDate, toDate);

    const data = await getData({ req: req, fromDate: fromDate, toDate: toDate });

    console.log(data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report 3');

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: '', key: 'col1', width: 20 },
      { header: '', key: 'col2', width: 30 },
      { header: '', key: 'col3', width: 30 },
      { header: '', key: 'col4', width: 40 },
      { header: '', key: 'col5', width: 45 }
    ];

    // Add data to the worksheet
    const content = [
      { col1: 'Coordinator', col2: '', col3: '', col4: 'Number of Family with active dispersal', col5: 'Number of Visits for family with active dispersal' }
    ];

    data.forEach((coordinator: any) => {
      content.push({ col1: coordinator.name, col2: '', col3: '', col4: coordinator.families?.length, col5: coordinator.count })
      content.push({ col1: "Family name", col2: 'Visits for last month', col3: 'Visits for current month', col4: "", col5: "" })

      coordinator.families.forEach((family: any) => {
        content.push({ col1: family.family.name, col2: family.visitsLastMonth, col3: family.visitsCurrentMonth, col4: "", col5: "" })
      })

      content.push({ col1: '', col2: '', col3: '', col4: '', col5: '' })
    })


    let arrayIndex = 0;
    let columnNumber = 3;

    content.forEach((row, index) => {
      const worksheetRow = worksheet.addRow(row);

      if (index == 0) {
        worksheetRow.eachCell((cell, index) => {
          if (index == 0 || index == 4) {
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
            };
          } else if (index == 5) {
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
            };
          } else {
            cell.border = {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
            };
          }

        });
      }

      if (data) {
       
        if (index == 2) {
          console.log(arrayIndex, columnNumber)
          worksheetRow.eachCell((cell, index) => {
            if (index == 1 || index == 2 || index == 3 ) {
              cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              }
            }
          });
          
          columnNumber = columnNumber + (data[arrayIndex] as any).families.length + 2;
          arrayIndex = arrayIndex + 1;
        }
        else if(index == columnNumber){
          console.log(arrayIndex, columnNumber, (data[arrayIndex] as any).families.length, columnNumber + (data[arrayIndex] as any).families.length + 2)
          worksheetRow.eachCell((cell, index) => {
            if (index == 1 || index == 2 || index == 3 ) {
              cell.border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' }
              }
            }
          });
          

          if(arrayIndex < data.length ){
            columnNumber = columnNumber + (data[arrayIndex] as any).families.length + 3;
            arrayIndex = arrayIndex + 1;
          }
        }
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