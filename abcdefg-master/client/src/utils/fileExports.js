import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportToExcel = (data, fileName = 'export.xlsx') => {
  // Chuyển dữ liệu thành worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  const colWidths = Object.keys(data[0]).map(key => {
    const maxLength = Math.max(
      key.length,
      ...data.map(row => (row[key] ? row[key].toString().length : 0))
    );
    return { wch: maxLength + 2 }; // +2 cho thoáng
  });

  worksheet['!cols'] = colWidths;


  // Tạo workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Ghi file vào blob
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // Lưu file
  saveAs(dataBlob, fileName);
};
