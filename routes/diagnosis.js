const express = require('express')
const router = express.Router()

const {
    sendSymptoms,
    getAllKeywords,
    sendSelectedKeywords,
    getDiagnosisResult,
} = require('../controllers/diagnosis')

router.post('/send_symptoms', sendSymptoms)
router.get('/get_all_keywords', getAllKeywords)
router.post('/send_selected_keywords', sendSelectedKeywords)
router.get('/get_diagnosis_result', getDiagnosisResult)

module.exports = router
