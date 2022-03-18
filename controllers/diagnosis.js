const defaultdb = require('../models/defaultdb')
const mockDiagnosis = require('../mockData/mockDiagnosis')

const getAllKeywords = (req, res) => {
    // defaultdb.query('SELECT * FROM Graph_Everything', (err, result) => {
    //     res.json({ success: true, data: { result: result } })
    // })
    console.log(req.query)
    res.status(200).send({ success: true, keywords: mockDiagnosis.keywords })
}

const getDiagnosisResult = (req, res) => {
    // res.status(200).send({ success: true, data: 'getDiagnosisResult' })
    console.log(req.query)
    res.status(200).send({ success: true, diagnosis_result: mockDiagnosis.diagnosisResult })
}

module.exports = {
    getAllKeywords,
    getDiagnosisResult,
}