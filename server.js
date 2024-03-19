const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const { route } = require("./src/Router/route.js");
const { prisma } = require("./config.js");



const port = process.env.PORT || 3000;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


app.use(route)



app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
