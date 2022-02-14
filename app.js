const express = require('express')
const app = express()

const diagnosis = require('./routes/diagnosis')

app.use('/api/diagnosis', diagnosis)

app.listen(5000, () => {
    console.log('Server is listening on port 5000 . . .')
})