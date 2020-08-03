const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/database');

const userRoutes = require('./routes/user');
const articleRoutes = require('./routes/article');

db.connect(function(err){
  if (err) throw err;
  console.log("Connected to MySQL!");
});

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/article', articleRoutes);

module.exports = app;