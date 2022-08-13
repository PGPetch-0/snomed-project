const XLSX = require('xlsx')
const workbook = XLSX.readFile('./excel/snomed_map.xlsx')
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

// Insert Original
// let sheet = 'Graph 40 (Original)'
// console.log(sheet, '--------------------')
// const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
// for (const row of xlData) {
//     let join_type = ((typeof row['JOIN TYPE']) == 'undefined')? null: row['JOIN TYPE']
//     let step_type = ((typeof row['STEP TYPE']) == 'undefined')? null: row['STEP TYPE']
//     let intv_type = ((typeof row['INTV TYPE']) == 'undefined')? null: row['INTV TYPE']
//     let yes_path = ((typeof row['YES']) == 'undefined')? null: row['YES']
//     let no_path = ((typeof row['NO']) == 'undefined')? null: row['NO']
//     qryarray = [row['STEP NO.'], row['DESCRIPTION'], join_type, step_type, intv_type, yes_path, no_path]
//     if(qryarray.indexOf('?') > -1 ) throw `Detect ? with array ${qryarray}`
//     qrystr = "INSERT INTO Graph_Description (Step_No, Description, Join_Type, Step_Type, Intervention_Type, Yes_Path, No_Path) VALUES (?,?,?,?,?,?,?)"
//     connection.query(qrystr, qryarray, (err, res) =>{
//         if(err) console.log(err)
//     })
//     // console.log(row)   
// }

// Insert Snomed breakdown
// let sheet = 'Graph 40 (Code)'
// console.log(sheet, '--------------------')
// const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
// for (let row of xlData) {
//     let step_no = ((typeof row['step']) == 'undefined')? null: row['step']
//     let description = ((typeof row['name']) == 'undefined')? null: row['name']
//     let breakdown = ((typeof row['breakdown']) == 'undefined')? null: row['breakdown']
//     let snomed_term = ((typeof row['snomed term']) == 'undefined')? null: row['snomed term']
//     let snomed_id = ((typeof row['snomed id']) == 'undefined')? null: row['snomed id']
//     let top_level_concept = ((typeof row['top level concept']) == 'undefined')? null: row['top level concept']
//     refqry = "SELECT Auto_Number from Graph_Description WHERE Step_No = ? AND Description = ?"
//     connection.query(refqry, [step_no, description], (err,res)=>{
//         if(err) console.log(err)
//         // console.log(`${res}, ${step_no}, ${description}, ${res[0]['Auto_Number']}`)
//         qrystr = "INSERT INTO Graph_Desc_Snomed (Reference, Step_No, Description, Breakdown, Snomed_Description, Snomed_No, Snomed_Top_Level_Concept) VALUES (?,?,?,?,?,?,?)"
//         qryarray = [res[0]['Auto_Number'], step_no, description, breakdown, snomed_term, snomed_id, top_level_concept]
//         connection.query(qrystr, qryarray, (err,res)=>{
//             if(err) console.log(err)
//         })
//     })
// }
// console.log('Done')