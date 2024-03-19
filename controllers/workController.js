// controllers/workDataController.js
const WorkData = require("../models/Work");

// Controller to render the add work data form
exports.renderAddWorkDataForm = (req, res) => {
  console.log("request in worktable ", req.cookies)
  res.render("workpage", { formData: {}, errors: {} });
};

// Controller to handle the form submission
exports.addWorkData = async (req, res) => {
  let errors = {};
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
    console.log(req.body);

    const workData = new WorkData({
      jobName,
      companyName,
      domain,
      salaryRange,
      officeType,
      jobType,
      jobDescription,
    });
    await workData.save();
    res.redirect("/dashboard"); // Redirect to the work data list page
  } catch (error) {
    console.log("errors ", error.message);
    console.log(errors);
    // Pass the entered values and error message to the form
    res.status(400).render("workpage", { formData: req.body, errors: errors });
  }
};

exports.getWorkTable = async (req, res) => {
  console.log("rquest body and cookies is ", Object.keys(req))
  try {
    const formData = await WorkData.find();
    console.log("workData is ", formData);
    res.render("worktable", { formData });
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
  res.render("workedit", { formData, errors: {} });
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
      res.redirect("/worktable")
    }
    else {
      res.render("workedit", { formData: req.body, errors: { finalError: "unable to update work details" } });
    }
  } catch (e) {
    res.render("workedit", { formData: req.body, errors: { finalError: "Some Thing Went Wrong" } });
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
  res.redirect("/worktable")
}
