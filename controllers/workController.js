// controllers/workDataController.js
const WorkData = require("../models/Work");

// Controller to render the add work data form
exports.renderAddWorkDataForm = (req, res) => {

  console.log("authtoken came in add work data ", req.query.authtoken)
  res.render("workpage", { formData: {}, errors: {}, authToken: req.query.authtoken });
};

// Controller to handle the form submission
exports.addWorkData = async (req, res) => {
  let errors = {};
  console.log("came to addinhg work data post ");


  try {
    const {
      jobName,
      jobDescription,
      companyName,
      domain,
      salaryRange,
      officeType,
      jobType,
    } = req.body;

    // Validate request body
    if (
      !jobName ||
      !jobDescription ||
      !companyName ||
      !domain ||
      !salaryRange ||
      !officeType ||
      !jobType ||
      !req.user.hrUserId
    ) {
      throw new Error("All fields are required");
    }
    console.log("in adding work")
    let addedBy = '';
    if (req.user) {
      if (req.user.role === "HR") {
        addedBy = req.user.hrUserId;
      }
    }
    console.log("came here ")
    const workData = new WorkData({
      jobName,
      companyName,
      domain,
      salaryRange,
      officeType,
      jobType,
      jobDescription,
      addedBy: addedBy

    });
    await workData.save();
    res.redirect(`/worktable?authtoken=${req.query.authtoken}`); // Redirect to the work data list page
  } catch (error) {
    console.log("errors ", error.message);
    console.log(errors);
    // Pass the entered values and error message to the form
    res.status(400).render("workpage", { formData: req.body, errors: errors, authToken: req.query.authtoken });
  }
};

exports.getWorkTable = async (req, res) => {
  console.log("in adding work")
  // console.log("rquest body and cookies is ", Object.keys(req))
  try {
    let formData;
    if (req.user) {
      if (req.user.role === "HR") {

        formData = await WorkData.find({ addedBy: req.user.hrUserId })
      } else {
        formData = await WorkData.find()
      }


      console.log("workData is ", formData);
      res.render("worktable", { formData, authToken: req.query.authtoken });

    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error fetching form data" });
  }


};

exports.editWork = async (req, res) => {
  const productId = req.params.id;
  // Retrieve product data for the given ID from the database
  const formData = await WorkData.findById(productId); // You need to implement this function
  console.log("data got from db is ", formData);

  // Render the product edit page and pass the product data
  res.render("workedit", { formData, errors: {}, authToken: req.query.authtoken });
};

exports.updateEditWork = async (req, res) => {
  let errors = {};
  const productId = req.params.id;
  console.log("came here ", productId)
  console.log("came");
  try {
    const {
      jobName,
      jobDescription,
      companyName,
      domain,
      salaryRange,
      officeType,
      jobType,
    } = req.body;

    // Validate request body
    if (
      !jobName ||
      !jobDescription ||
      !companyName ||
      !domain ||
      !salaryRange ||
      !officeType ||
      !jobType
    ) {
      throw new Error("All fields are required");
    }
    const updateProduct = await WorkData.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );
    if (updateProduct) {
      res.redirect(`/worktable?authtoken=${req.query.authtoken}`); // Redirect to the work data list page

    }
    else {
      res.render("workedit", { formData: req.body, errors: { finalError: "unable to update work details" }, authToken: req.query.authtoken });
    }
  } catch (e) {
    res.render("workedit", { formData: req.body, errors: { finalError: "Some Thing Went Wrong" }, authToken: req.query.authtoken });
  }
};

exports.sendWorkDataToFrontEnd = async (req, res) => {
  const data = await WorkData.find()
  res.send({ data: data })
}

exports.deleteWork = async (req, res) => {
  const productId = req.params.id;
  try {
    await WorkData.deleteOne({ _id: productId })

  } catch (e) {
    console.log("unable to delete work")
  }
  res.redirect(`/worktable?authtoken=${req.query.authtoken}`)
}
