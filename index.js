const express = require("express");
require('@prisma/client');
const app = express();
require('dotenv').config();
const cors = require('cors')
const PORT = process.env.PORT || 8000;

const indexRouter = require('./controllers');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});