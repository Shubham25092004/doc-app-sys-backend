const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors'); 

const userRouter = require('./routes/userRoutes');
const appointmentRoute = require('./routes/appointmentRoute');
const doctorRouts = require('./routes/doctorRouts')

const { testConnection } = require('./config/db');
const { doctor } = require('./middleware/auth');

testConnection();

const app = express();
const port = process.env.PORT || 7000;

// ✅ MIDDLEWARES
app.use(cors({
  origin: "http://localhost:5173", // Vite frontend
  credentials: true,
}));

app.use(express.json());

// ✅ ROUTES
app.use('/api/user', userRouter);
app.use('/api/appointment', appointmentRoute);
app.use('/upload',express.static(path.join(__dirname,'uploads')))

app.use('/api/doc',doctorRouts)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
