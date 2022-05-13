const PORT = 8000;

const express = require("express");
const app = express();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const indexRouter = require('./controllers');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));


app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });