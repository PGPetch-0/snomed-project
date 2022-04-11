const defaultdb = require('./models/defaultdb')

defaultdb.query('SELECT * FROM Graph_Everything', (err, result) => {
    const allNodeDescription = {}
    const allDiagnosis = {}
    const allParent = {}
    let currentStepNo = result[0].Step_No
    for (let i = 0; i < result.length; i++) {
        // console.log(result[i])
        // if (currentStepNo !== result[i].Step_No && result[i].Yes_Path !== undefined) {
        allParent[result[i].Yes_Path] = result[i].Step_No
        allParent[result[i].No_Path] = result[i].Step_No
        //     currentStepNo = result[i].Step_No
        // }
        if ('YN'.includes(result[i].Step_No[result[i].Step_No.length - 1])) {
            if (allDiagnosis[result[i].Step_No] === undefined) {
                allDiagnosis[result[i].Step_No] = {
                    possible_diagnosis: [],
                    symptoms: []
                }
            }
            allDiagnosis[result[i].Step_No].possible_diagnosis.push(result[i].Description)
        } else {
            if (allNodeDescription[result[i].Step_No] === undefined) {
                allNodeDescription[result[i].Step_No] = []
            }
            allNodeDescription[result[i].Step_No].push(result[i].Description)
        }
    }

    let i = 0
    for (const diagnosis of Object.keys(allDiagnosis)) {
        i++
        if (i > 20) break
        console.log(diagnosis)
        let currentNode = diagnosis
        while (currentNode !== undefined) {
            i++
            if (i > 20) break
            allDiagnosis[diagnosis].symptoms.push(allParent[currentNode])
            currentNode = allParent[currentNode]
            console.log(currentNode)
        }
    }

    console.log(allDiagnosis)
})