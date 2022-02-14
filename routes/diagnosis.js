const express = require('express')
const router = express.Router()

const {
    sendSymptoms,
    getAllKeywords,
    sendSelectedKeywords,
    getDiagnosisResult,
} = require('../controllers/diagnosis')

router.get('/symptoms', sendSymptoms)
router.get('/keywords', getAllKeywords)
router.post('/keywords', sendSelectedKeywords)
router.get('/result', getDiagnosisResult)

module.exports = router
