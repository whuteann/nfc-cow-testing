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
    const data = await getData({ req: req, deletedAt: true });

    console.log(data.dispersals.villages);

    // return res.status(200).json({message: "success"});

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report 1');

    // Add data to the worksheet
    worksheet.columns = [
      { header: '', key: 'field', width: 50 },
      { header: '', key: 'value', width: 50 },
    ];

    const content = [];

    content.push({
      field: "Farm name",
      value: "Number of cows"
    });

    data.farms.forEach((farm) => {
      content.push({
        field: (farm as any).name,
        value: (farm as any).count
      });
    })

    content.push({
      field: "",
      value: ""
    });

    content.push({
      field: "Coordinator name",
      value: "Number of cows"
    });

    data.dispersals.coordinators.forEach((coordinator) => {
      content.push({
        field: (coordinator as any).name,
        value: (coordinator as any).count
      });
    })

    content.push({
      field: "",
      value: ""
    });

    content.push({
      field: "Village name",
      value: "Number of cows"
    });

    data.dispersals.villages.forEach((village) => {
      content.push({
        field: (village as any).name,
        value: (village as any).count
      });
    })

    content.push({
      field: "",
      value: ""
    });


    content.forEach((row, index) => {
      const worksheetRow = worksheet.addRow(row);

      // Check if it's the first row (excluding the header row)
      if (index === 0 || index === data.farms.length + 2 || index === (data.farms.length + 2 + data.dispersals.coordinators.length + 2) ) {
        worksheetRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
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