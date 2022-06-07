const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
console.log("1")
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");
console.log("2")
const app = express();
console.log("3")
app.use(cors());
app.use(express.json());
console.log(4)
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);
console.log(5)
app.use(notFound);
app.use(errorHandler);
console.log(6)
module.exports = app;
