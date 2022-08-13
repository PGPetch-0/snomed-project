const defaultdb = require('../models/defaultdb')
const mockDiagnosis = require('../mockData/mockDiagnosis')


const getAllKeywords = (req, res) => {
    function buildquery(arr){
        let ret_string = "SELECT DISTINCT D.Description, D.Step_No FROM Graph_Description as D" 
        + " INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference"
        + " WHERE S.Description in (";
        for(item of arr) ret_string += "?,"
        ret_string = ret_string.slice(0,-1)
        ret_string += ")AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N' UNION SELECT DISTINCT D.Description, D.Step_No FROM Graph_Description as D INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference WHERE S.Breakdown in (";
        for(item of arr) ret_string += "?,"
        ret_string = ret_string.slice(0,-1)
        ret_string += ")AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N'"
        return ret_string
    }
    const symptoms = req.query.symptoms.split(",").map(item => item.trim())
    let query = buildquery(symptoms)
    let arr = []
    for(symptom of symptoms) arr.push(symptom)
    for(symptom of symptoms) arr.push(symptom)
    defaultdb.query(query, arr,(err, result) => {
        if(err) console.log(err)
        let keywords = []
        for(const row of result){
            keywords.push(row.Description)
        }
        res.status(200).send({ success: true, keywords: keywords })
    })
}

const getDiagnosisResult = (req, res) => {
    // get resources for analysis
    defaultdb.query('SELECT * FROM Graph_Description', (err, result) => {
        if(err) console.log(err)
        const allNodeDescription = {}
        const allDiagnosis = {}
        const allParent = []
        for (const row of result) {
            if ((row.Yes_Path != row.Step_No) && (row.Yes_Path != null)) {
                let obj = []
                obj.push(row.Yes_Path)
                obj.push(row.Step_No)
                obj.push("yes")
                allParent.push(obj)
            }
            if ((row.No_Path != row.Step_No) && (row.No_Path != null)){
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
                        symptoms: [],
                        support: [],
                        contradict: [],
                        missing: [],
                        rawscore: 0,
                        finalscore: 0
                    }
                }
                allDiagnosis[row.Step_No].possible_diagnosis.push(row.Description)
            } else {
            //create symptoms JSON
                if (allNodeDescription[row.Step_No] === undefined) {
                    allNodeDescription[row.Step_No] = {
                        joinType: row.Join_Type,
                        symptoms: [],
                        support: [],
                        contradict: [],
                        missing: [],
                        result: null
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
                    if(row[0]==finding){
                        found = true
                        finding = row[1]
                        allDiagnosis[diagnosis].symptoms.push(row.slice(1))
                        break
                    }
                }
                if(!found) break
            }
        }
        //query to get rows of the selected keywords
        function buildquery(arr){
            let ret_string = "SELECT DISTINCT D.Step_No, D.Description FROM Graph_Description as D" 
            + " INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference"
            + " WHERE S.Description in (";
            for(item of arr) ret_string += "?,"
            ret_string = ret_string.slice(0,-1)
            ret_string += ")AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N'"
            return ret_string
        }
        let arr = []
        for(const node of req.query.selected_keywords) arr.push(node)
        let query = buildquery(arr)
        defaultdb.query(query, arr,(err2, result2) => {
            if(err2) console.log(err2)
            //get "Yes", "No", or "Indecisive" for each node
            for(const step of Object.keys(allNodeDescription)){
                switch(allNodeDescription[step].joinType){
                    case null:
                        if(result2.some(row => row.Step_No === step)){
                            // console.log(step)
                            allNodeDescription[step].result = "Yes"
                            allNodeDescription[step].support.push(allNodeDescription[step].symptoms[0])
                        } else {
                            allNodeDescription[step].result = "Indecisive"
                            allNodeDescription[step].missing.push(allNodeDescription[step].symptoms[0])
                        }
                        break;
                    case 'OR':
                        for(const symptom of allNodeDescription[step].symptoms){
                            if(result2.some(row => row.Description === symptom)){
                                allNodeDescription[step].result = "Yes"
                                allNodeDescription[step].support.push(symptom)
                            }
                            else{
                                allNodeDescription[step].missing.push(symptom)
                            }
                            if(allNodeDescription[step].result === null) allNodeDescription[step].result = "Indecisive"
                        }
                        break;
                    case 'AND':
                        for(const symptom of allNodeDescription[step].symptoms){
                            if(result2.some(row => row.Description === symptom)){
                                allNodeDescription[step].support.push(symptom)
                            }
                            else allNodeDescription[step].missing.push(symptom)
                        }
                        if(allNodeDescription[step].symptoms.length == allNodeDescription[step].support.length) allNodeDescription[step].result = "Yes"
                        else if(allNodeDescription[step].contradict.length>0) allNodeDescription[step].result = "No"
                        else allNodeDescription[step].result = "Indecisive"
                        break;
                }
            }
            // console.log(allNodeDescription)
            // calculate score for each diagnosis
            for(const finalstep of Object.keys(allDiagnosis)){
                // allDiagnosis[finalstep].symptoms --> 2D array
                for(criteria of allDiagnosis[finalstep].symptoms){
                    //criteria[0] --> step ระหว่างทาง
                    //criteria[1] --> yes / no
                    switch(criteria[1]){
                        case 'yes':
                            // console.log(allNodeDescription[criteria[0]].result)
                            if(allNodeDescription[criteria[0]].result == 'Yes'){
                                allDiagnosis[finalstep].rawscore ++
                                for(support of allNodeDescription[criteria[0]].support) allDiagnosis[finalstep].support.push(support)
                                for(contradict of allNodeDescription[criteria[0]].contradict) allDiagnosis[finalstep].contradict.push(contradict)
                                for(missing of allNodeDescription[criteria[0]].missing) allDiagnosis[finalstep].missing.push(missing)
                            }else if(allNodeDescription[criteria[0]].result == 'No'){
                                for(support of allNodeDescription[criteria[0]].support) allDiagnosis[finalstep].contradict.push(support) // take note that they are currently swapped (support of node -> contradict the diagnosis)
                                for(contradict of allNodeDescription[criteria[0]].contradict) allDiagnosis[finalstep].support.push(contradict)
                                for(missing of allNodeDescription[criteria[0]].missing) allDiagnosis[finalstep].missing.push(missing)
                            }else{
                                for(support of allNodeDescription[criteria[0]].support) allDiagnosis[finalstep].support.push(support)
                                for(contradict of allNodeDescription[criteria[0]].contradict) allDiagnosis[finalstep].contradict.push(contradict)
                                for(missing of allNodeDescription[criteria[0]].missing) allDiagnosis[finalstep].missing.push(missing)
                            }
                            break;
                        case 'no':
                            if(allNodeDescription[criteria[0]].result == 'Yes'){
                                for(support of allNodeDescription[criteria[0]].support) allDiagnosis[finalstep].contradict.push(support) // take note that they are currently swapped (support of node -> contradict the diagnosis)
                                for(contradict of allNodeDescription[criteria[0]].contradict) allDiagnosis[finalstep].support.push(contradict)
                                for(missing of allNodeDescription[criteria[0]].missing) allDiagnosis[finalstep].missing.push(missing)
                            }else if(allNodeDescription[criteria[0]].result == 'No'){
                                allDiagnosis[finalstep].rawscore ++
                                for(support of allNodeDescription[criteria[0]].support) allDiagnosis[finalstep].support.push(support)
                                for(contradict of allNodeDescription[criteria[0]].contradict) allDiagnosis[finalstep].contradict.push(contradict)
                                for(missing of allNodeDescription[criteria[0]].missing) allDiagnosis[finalstep].missing.push(missing)
                            }else{
                                for(support of allNodeDescription[criteria[0]].support) allDiagnosis[finalstep].contradict.push(support)
                                for(contradict of allNodeDescription[criteria[0]].contradict) allDiagnosis[finalstep].support.push(contradict)
                                for(missing of allNodeDescription[criteria[0]].missing) allDiagnosis[finalstep].missing.push(missing)
                            }
                            break;
                    }
                    allDiagnosis[finalstep].finalscore = allDiagnosis[finalstep].rawscore / allDiagnosis[finalstep].symptoms.length
                }
            }
            //construct response for frontend
            let response = []
            for(const finalstep of Object.keys(allDiagnosis)){
                //let diagnosis = allDiagnosis[finalstep].possible_diagnosis.join('/')
                response.push({
                    diagnosis: allDiagnosis[finalstep].possible_diagnosis.join('/'),
                    probability: allDiagnosis[finalstep].finalscore * 100,
                    keyword: {
                        สนับสนุน: allDiagnosis[finalstep].support,
                        คัดค้าน:allDiagnosis[finalstep].contradict,
                        ไม่พบ:allDiagnosis[finalstep].missing,
                    }
                })

            }
            // console.log(allDiagnosis)
            // console.log(allNodeDescription)
            // console.log(allParent)
            // probability-sorting function
            function compare( a, b ) {
                if ( a.probability < b.probability ){
                  return 1;
                }
                if ( a.probability > b.probability ){
                  return -1;
                }
                return 0;
            }
            response.sort(compare);
            res.status(200).send({ success: true, diagnosis_result: response })
        })
    })
}

module.exports = {
    getAllKeywords,
    getDiagnosisResult,

}