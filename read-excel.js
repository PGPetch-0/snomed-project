const XLSX = require('xlsx')
const workbook = XLSX.readFile('./excel/test_1_4.xlsx')
const sheet_name_list = workbook.SheetNames
const mysql = require('mysql2')

//connection setup goes here

let connection = mysql.createConnection({
    host: "ice-project-db-cluster-do-user-10821051-0.b.db.ondigitalocean.com",
    user: "doadmin",
    password: "K5eyyFk4Ua36lUsq",
    database: "defaultdb",
    port: "25060"
})

for (const sheet of sheet_name_list) {
    console.log(sheet, '--------------------')
    const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    for (const row of xlData) {
        let join_type = ((typeof row['JOIN TYPE']) == 'undefined')? null: row['JOIN TYPE']
        let step_type = ((typeof row['STEP TYPE']) == 'undefined')? null: row['STEP TYPE']
        let intv_type = ((typeof row['INTV TYPE']) == 'undefined')? null: row['INTV TYPE']
        let yes_path = ((typeof row['YES']) == 'undefined')? null: row['YES']
        let no_path = ((typeof row['NO']) == 'undefined')? null: row['NO']
        let Snomed_Description = ((typeof row['SNOMED CLINICAL TERM']) == 'undefined')? null: row['SNOMED CLINICAL TERM']
        let Snomed_No = ((typeof row['SNOMED CODE']) == 'undefined')? null: row['SNOMED CODE']
        qryarray = [row['STEP NO.'], row['DESCRIPTION'], join_type, step_type, intv_type, yes_path, no_path, Snomed_Description, Snomed_No]
        if(qryarray.indexOf('?') > -1 ) throw `Detect ? with array ${qryarray}`
        qrystr = "INSERT INTO Graph_Everything (Step_No, Description, Join_Type, Step_Type, Intervention_Type, Yes_Path, No_Path, Snomed_Description, Snomed_No) VALUES (?,?,?,?,?,?,?,?,?)"
        connection.query(qrystr, qryarray, (err, res) =>{
            if(err) console.log(err)
        })
        // console.log(row)   
    }

    break
}
console.log('Done')