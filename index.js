const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const formController = require("./controllers/formController");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

var cors = require("cors");
const { addWorkData, renderAddWorkDataForm, getWorkTable, editWork, updateEditWork, sendWorkDataToFrontEnd, deleteWork } = require("./controllers/workController");
const { login, authenticate, logout } = require("./controllers/authController");
const { submitHrForm, getHrFormData } = require("./controllers/hrFormController");
const { sendAccessEmail } = require("./controllers/emailController");
const { notFoundPage } = require("./controllers/utilController");
const { collegeSubmitForm } = require("./controllers/collegeFormController");


const secretKey = 'mysecretkey_goalstreet';

async function authenticationMiddleware(req, res, next) {
  let authtoken = req.query.authtoken;
  console.log("in authenticate middleware ")
  console.log("request is ", req.path, " - method is ", req.method)
  console.log("params is ", req.query)
  console.log("authtoken is ", authtoken)
  if (req.path === '/' ) {
    next();
    return;
  }
  if(req.path==='/frontendWorkData' || req.path==='/submit' || req.path==='/submitHrForm' || req.path==="/submitCollegeForm"){
    next();
    return;
  } 
  

  if (authtoken === null || authtoken === undefined) {
    console.log("req.cokkies is ",req.cookies)
    if (req.cookies && req.cookies.auth) {
        authtoken = req.cookies.auth;
        console.log("autoken presnets ",authtoken)
    }
    else {
      res.redirect("/")
      return;
    }
  }
  try {

    const verified = jwt.verify(authtoken, secretKey);
    req.user = verified;
    console.log("verified is ", verified)
    if (verified.role === 'HR') {
      if (req.path === '/workdata/add' || req.path === '/worktable' || req.path === '/works/edit/:id' || req.path === '/works/delete/:id' || req.path === '/pageNotFound') {
        next();
        return;
      } else {
        res.redirect(`/pageNotFound?authtoken=${authtoken}`)
        return
      }
    } else if (verified.role === 'admin') {
      console.log("it is admin")
      next();
      return;
    }

  } catch (e) {
    console.log("error is ", e)
    res.redirect("/")
  }

}


const app = express();


app.use(cors());
// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
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
app.get("/works/delete/:id", deleteWork)
app.post("/submitHrForm", submitHrForm)
app.get("/hrFormPage", getHrFormData)
app.get("/sendAccessEmail", sendAccessEmail);
app.get("/pageNotFound", notFoundPage)
app.post("/submitCollegeForm",collegeSubmitForm)

// const url = "mongodb://localhost/mydatabase";
// mongoose.connect(url);
const port = 3000;
const start = async () => {
  try {
    await mongoose
      .connect(url)
    console.log("connected");
    app.listen(port, () => {
      console.log("server is running on port", port);
    });
  } catch (err) {
    console.log("error", err);
  }
};

start();
