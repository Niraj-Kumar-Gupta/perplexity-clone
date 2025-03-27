const express = require('express');
const { swaggerUi, swaggerSpec } = require('./config/swaggerConfig');
const mongodbConnect = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser")


dotenv.config();
mongodbConnect();

const app = express();
app.use(cookieParser())
app.use(cors({origin:'http://localhost:3001', credentials: true }));
app.use(bodyParser.json());
app.use(express.json())

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', userRoutes);
app.use('/auth',authRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;

