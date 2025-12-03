const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Successfully connected to MongoDB!'))
.catch(err => console.error('Connection error', err));

const PORT = process.env.PORT || 4000;
const app = express();

app.use(morgan('dev')); 
app.use(express.json()); 

app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/note', require('./routes/noteRoutes'));

app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});