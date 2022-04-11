const defaultdb = require('./models/defaultdb')

defaultdb.query('SELECT * FROM Graph_Everything', (err, result) => {
    // console.log(result)
    const allNodeDescription = {}
    const allDiagnosis = {}
    const allParent = {}

    for (const row of result) {
        if (row.Yes_Path != row.Step_No) allParent[row.Yes_Path] = row.Step_No
        if (row.No_Path != row.Step_No) allParent[row.No_Path] = row.Step_No

        if ('YN'.includes(row.Step_No[row.Step_No.length - 1])) {
            if (allDiagnosis[row.Step_No] === undefined) {
                allDiagnosis[row.Step_No] = {
                    possible_diagnosis: [],
                    symptoms: []
                }
            }
            allDiagnosis[row.Step_No].possible_diagnosis.push(row.Description)
        } else {
            if (allNodeDescription[row.Step_No] === undefined) {
                allNodeDescription[row.Step_No] = {
                    joinType: row.Join_Type,
                    symptoms: []
                }
            }
            allNodeDescription[row.Step_No].symptoms.push(row.Description)
        }
    }

    for (const diagnosis of Object.keys(allDiagnosis)) {
        let currentNode = allParent[diagnosis]
        while (currentNode !== undefined) {
            allDiagnosis[diagnosis].symptoms.push(currentNode)
            currentNode = allParent[currentNode]
        }
    }

    console.log(allNodeDescription)
})