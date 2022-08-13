const defaultdb = require('./models/defaultdb')

// const mockKeywords = ['เจ็บ', 'มีไข้','ปวด']

// // var query = "SELECT DISTINCT D.Description, D.Step_No FROM Graph_Description as D" 
// // + " INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference"
// // + " WHERE S.Description in (?) AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N'"
// // + " UNION"
// // + " SELECT DISTINCT D.Description, D.Step_No FROM Graph_Description as D" 
// // + " INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference"
// // + " WHERE S.Breakdown in (?) AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N'"

// function buildquery(arr){
//     var ret_string = "SELECT DISTINCT D.Description, D.Step_No FROM Graph_Description as D" 
//     + " INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference"
//     + " WHERE S.Description in (";
//     for(item of arr) ret_string += "?,"
//     ret_string = ret_string.slice(0,-1)
//     ret_string += ")AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N' UNION SELECT DISTINCT D.Description, D.Step_No FROM Graph_Description as D INNER JOIN Graph_Desc_Snomed as S ON D.Auto_Number = S.Reference WHERE S.Breakdown in (";
//     for(item of arr) ret_string += "?,"
//     ret_string = ret_string.slice(0,-1)
//     ret_string += ")AND D.Step_No NOT LIKE '%Y' AND D.Step_No NOT LIKE '%N'"
//     return ret_string
// }
// var query = buildquery(mockKeywords)
// var arr = []
// for(keyword of mockKeywords) arr.push(keyword)
// for(keyword of mockKeywords) arr.push(keyword)
// console.log(query)
// console.log(arr)
// defaultdb.query(query, arr,(err, result) => {
//     if(err) console.log(err)
//     console.log(result)
// })

// defaultdb.query("Select * from Graph_Description", (err1,res1)=>{
//     defaultdb.query("Select * from Graph_Desc_Snomed", (err2, res2)=>{
//         console.log(res1[0])
//         console.log(res2[0])
//     })
// })

testArr = [
    {
        Step: '10',
        Desc: 'eiei'
    },
    {
        Step: '10.1',
        Desc: 'oooo'
    }
]

console.log(testArr.some(el => el.Step === '10'))