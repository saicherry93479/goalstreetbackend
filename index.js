const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const formController = require("./controllers/formController");
var cors = require("cors");
const { addWorkData, renderAddWorkDataForm, getWorkTable, editWork, updateEditWork, sendWorkDataToFrontEnd } = require("./controllers/workController");

const app = express();

app.use(cors());
// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url='mongodb+srv://cherryworkspacemail:cherryworkspacemail@cluster0.qqvoel7.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
// mongoose
//   .connect(url)
//   .then(() => {
//     console.log("connected");
//   })
//   .catch((err) => {
//     console.log("error is ", err);
  // });

// connection()
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Set EJS as view engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Routes
app.post("/submit", formController.submitForm);
app.get("/dashboard", formController.getFormData);
app.get("/download-excel", formController.downloadExcel);
app.post("/workdata/add",addWorkData)
app.get("/workdata/add",renderAddWorkDataForm)
app.get("/worktable",getWorkTable)
app.get("/works/edit/:id",editWork)
app.post("/works/edit/:id",updateEditWork)
app.get("/frontendWorkData",sendWorkDataToFrontEnd)

// const url = "mongodb://localhost/mydatabase";
// mongoose.connect(url);
const port = 3000;
const start = async () => {
  try {
   await  mongoose
    .connect(url)
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  } catch (err) {
    console.log("error", err);
  }
};

start();
