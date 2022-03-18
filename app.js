const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors');

const diagnosis = require('./routes/diagnosis')

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ['http://localhost:3000']
}));

app.use('/diagnosis', diagnosis)

app.listen(5000, () => {
    console.log('Server is listening on port 5000 . . .')
})


