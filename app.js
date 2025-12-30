const express = require('express')
require('dotenv').config()

const userRouter = require('./routes/userRoutes')
const appointmentRoute = require('./routes/appointmentRoute')

const { testConnection } = require('./config/db')

testConnection()

const app = express()
const port = process.env.PORT || 7000

app.use(express.json())
app.use('/api/user', userRouter)
app.use('/api/appointment', appointmentRoute)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
