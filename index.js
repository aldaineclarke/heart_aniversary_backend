require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const APIVERSION1 = require("./api/v1/api.routes");
const mongoose = require("mongoose");
const { NAME, CORS} = process.env

const APP_NAME = NAME || 'Express API'

// const { swaggerDocs: V1SwaggerDocs} = require( "./swagger")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// View Engine
app.set('views', 'templates')
app.set('view engine', 'ejs')

app.all("",(req, res) => {
	return res.redirect("/api/v1");
});

app.use("/api/v1", APIVERSION1);

mongoose.connect(process.env.DB_URI, {}, () => {
   console.log("database connection established");
});

app.listen(PORT, () => {
   console.log("listening on port ", PORT);
//    V1SwaggerDocs( app, PORT)
});
