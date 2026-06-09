import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  /**
   * Exporta datos a formato Excel (.xlsx) o CSV
   */
  exportToExcel(data: any[], fileName: string, sheetName: string = 'Datos'): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  exportToCSV(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const csvOutput: string = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /**
   * Genera un reporte textual tipo Word (.doc)
   * Usa una técnica de Blob con HTML que Word interpreta correctamente
   */
  exportToWord(content: string, fileName: string): void {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Reporte Ambiental</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `${fileName}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  }
}
