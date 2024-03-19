const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const formController = require("./controllers/formController");
const jwt = require('jsonwebtoken');

var cors = require("cors");
const { addWorkData, renderAddWorkDataForm, getWorkTable, editWork, updateEditWork, sendWorkDataToFrontEnd,deleteWork } = require("./controllers/workController");
const { login, authenticate, logout } = require("./controllers/authController");

const secretKey = 'mysecretkey_goalstreet';

function authenticationMiddleware(req, res, next) {
  console.log('request path ', req.path)
  if (req.path === '/' && req.method === 'POST') {
    console.log('request came ', req.method)
    next();
  }else if(req.path==='/frontendWorkData' || req.path==='/submit'){
    next();
  } else {
    const authtoken = req.query.authtoken;
    console.log(req.query);
    console.log("params ", authtoken);

    if (authtoken !== null && authtoken !== undefined) {
      console.log("type of authtoken ", typeof (authtoken))
      try {
        const verified = jwt.verify(authtoken, secretKey);
        // If token is verified, proceed to the next middleware or controller
        if (req.path === '/' && req.method === 'GET') {
          res.redirect("/dashboard")
          return;
        }
        next();
      } catch (error) {
        // If token is not verified, render login page
        console.log("verification jwt   failed", error);
        res.render("LoginPage.ejs", { loginData: {}, errors: {} });
      }
    } else {
      // If authtoken is not present, render login page
      res.render("LoginPage.ejs", { loginData: {}, errors: {} });
    }
  }
}



const app = express();


app.use(cors());
// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authenticationMiddleware)

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
app.post("/workdata/add", addWorkData)
app.get("/workdata/add", renderAddWorkDataForm)
app.get("/worktable", getWorkTable)
app.get("/works/edit/:id", editWork)
app.post("/works/edit/:id", updateEditWork)
app.get("/frontendWorkData", sendWorkDataToFrontEnd)
app.get("/", login)
app.post('/', authenticate)
app.get('/logout', logout)
app.get("/works/delete/:id",deleteWork)

// const url = "mongodb://localhost/mydatabase";
// mongoose.connect(url);
const port = 3000;
const start = async () => {
  try {
    await mongoose
      .connect(url)
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  } catch (err) {
    console.log("error", err);
  }
};

start();
