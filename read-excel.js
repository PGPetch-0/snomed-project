const XLSX = require('xlsx')
const workbook = XLSX.readFile('./excel/file1.xls');
const sheet_name_list = workbook.SheetNames;

for (const sheet of sheet_name_list) {
    console.log(sheet, '--------------------')
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    for (const row of xlData) {
        console.log(row)
    }

    break
}