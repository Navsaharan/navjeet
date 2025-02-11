const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/universityDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the University website!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
