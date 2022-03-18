const express = require('express')
const router = express.Router()

const {
    getAllKeywords,
    getDiagnosisResult,
} = require('../controllers/diagnosis')

router.get('/get_all_keywords', getAllKeywords)
router.get('/get_diagnosis_result', getDiagnosisResult)

module.exports = router
