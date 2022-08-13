const defaultdb = require('./models/defaultdb')

defaultdb.query('SELECT * FROM Graph_Description', (err, result) => {
    //console.log(result)
    const allNodeDescription = {}
    const allDiagnosis = {}
    const allParent = []

    for (const row of result) {
        if ((row.Yes_Path != row.Step_No) && (row.Yes_Path != null)) {
            // if(!(row.Yes_Path in allParent))allParent[row.Yes_Path] = {parent: row.Step_No, res: 'yes'}
            let obj = []
            obj.push(row.Yes_Path)
            obj.push(row.Step_No)
            obj.push("yes")
            allParent.push(obj)
        }
        if ((row.No_Path != row.Step_No) && (row.No_Path != null)){
            // if(!(row.No_Path in allParent))allParent[row.No_Path] = {parent: row.Step_No, res: 'no'}
            let obj = []
            obj.push(row.No_Path)
            obj.push(row.Step_No)
            obj.push("no")
            allParent.push(obj)
        }

        //create diagnosis JSON
        if ('YN'.includes(row.Step_No[row.Step_No.length - 1])) {
            if (allDiagnosis[row.Step_No] === undefined) {
                allDiagnosis[row.Step_No] = {
                    possible_diagnosis: [],
                    symptoms: []
                }
            }
            allDiagnosis[row.Step_No].possible_diagnosis.push(row.Description)
        } else {
        //create symptoms JSON
            if (allNodeDescription[row.Step_No] === undefined) {
                allNodeDescription[row.Step_No] = {
                    joinType: row.Join_Type,
                    symptoms: [],
                    breakdown: []
                }
            }
            allNodeDescription[row.Step_No].symptoms.push(row.Description)
        }
    }

    //Insert steps to reach each diagnosis
    for (const diagnosis of Object.keys(allDiagnosis)) {
        let finding = diagnosis
        let found = false
        while(true){
            found = false
            for(const row of allParent){
                // console.log("finding: "+finding)
                if(row[0]==finding){
                    // console.log(row)
                    found = true
                    finding = row[1]
                    allDiagnosis[diagnosis].symptoms.push(row.slice(1))
                    break
                }
            }
            if(!found) break
        }
    }
    // console.log(allNodeDescription)
    // console.log(JSON.stringify(allDiagnosis))
    // console.log(allParent)
})