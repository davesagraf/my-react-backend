const express = require("express");
require('@prisma/client');
const app = express();
require('dotenv').config();
const session = require("express-session");
const cors = require('cors')
const store = new session.MemoryStore();
const PORT = process.env.PORT || 8000;

const indexRouter = require('./controllers');
const bodyParser = require('body-parser');
const auth = require("./middlewares/auth");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// redirect to routes/index.js
app.use('/', indexRouter);
app.use(cors())

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});