import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
const ExcelExport = ({data}) => {
  const createDownLoadData = () => {
    handleExport().then((url) => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "CostCenters_report.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };
    const wbout = XLSX.write(workbook, wopts);
    const blob = new Blob([s2ab(wbout)], {
      type: "application/octet-stream",
    });
    return blob;
  };
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }
    return buf;
  };

  const handleExport = () => {
    const title = [{ A: "Cost Centers" }, {}];

    let table= [
      {
        A: "Parent",
        B: "Arabic Name",
        C: "English Name",
      },
    ];

    console.log(data)
    data.forEach((row) => {
    const costcenter= row;
      table.push({
        A:costcenter.parent,
        B: costcenter.ArabicName,
        C: costcenter.EnglishName,
      });
    });
    
   

    const finalData = [...title, ...table];
    const wb = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(wb, sheet, "CostCenters_report");
    const workbookBlob = workbook2blob(wb);
    const headerIndexes = finalData.reduce((indexes, data, index) =>
    data["A"] === "Parent" ? indexes.concat(index) : indexes, []);
    
    const totalRecords = data.length;
    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:C2",
      tbodyRange: `A3:C${finalData.length}`,
      theadRange:
        headerIndexes.length >= 1
          ? `A${headerIndexes[0] + 1}:C${headerIndexes[0] + 1}`
          : null,

          

      tFirstColumnRange:
        headerIndexes.length >= 1
          ? `A${headerIndexes[0] + 1}:A${totalRecords + headerIndexes[0] + 1}`
          : null,
     
    };

    return addStyle(workbookBlob, dataInfo);
  };

  const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Arial",
          verticalAlignment: "center",
          borderStyle: "thin", // Add border style
        });
  

        sheet.column("A").width(30);
        sheet.column("B").width(30);
        sheet.column("C").width(30);
        sheet.column("E").width(30);
        sheet.column("G").width(30);
        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          fill: "C5D9F1",
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });



        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            horizontalAlignment: "center",
          });
        }
  

        sheet.range(dataInfo.theadRange).style({
          fill: "FFFD04",
          bold: true,
          horizontalAlignment: "center",
        });
  
        if (dataInfo.tFirstColumnRange) {
          sheet.range(dataInfo.tFirstColumnRange).style({
          });
        }
  
    
      });
  
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };
  

  return (
        createDownLoadData()
  );
};

export { ExcelExport };
