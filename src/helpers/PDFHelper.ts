import jsPDF from "jspdf";

export const generatePDF = async (html: string, filename?: string) =>{
  const doc = new jsPDF("portrait", "px", [600, 849] );
  
  await doc.html(html
    ,{
    callback: (doc)=>{
      doc.save(`${filename}` || "");
    }
  }
  );
  
}