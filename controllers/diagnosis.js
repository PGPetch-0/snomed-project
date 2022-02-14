const sendSymptoms = (req, res) => {
    res.status(200).send({ success: true, data: 'sendSymptoms' })
}

const getAllKeywords = (req, res) => {
    res.status(200).send({ success: true, data: 'getAllKeywords' })
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