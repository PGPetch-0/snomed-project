const defaultdb = require('../models/defaultdb')

const sendSymptoms = (req, res) => {
    res.status(200).send({ success: true, data: 'sendSymptoms' })
}

const getAllKeywords = (req, res) => {
    defaultdb.query('SELECT * FROM Graph_Everything', (err, result) => {
        res.json({ success: true, data: { result: result } })
    })

}

const sendSelectedKeywords = (req, res) => {
    res.status(200).send({ success: true, data: 'sendSelectedKeywords' })
}

const getDiagnosisResult = (req, res) => {
    res.status(200).send({ success: true, data: 'getDiagnosisResult' })
}

module.exports = {
    sendSymptoms,
    getAllKeywords,
    sendSelectedKeywords,
    getDiagnosisResult,
}