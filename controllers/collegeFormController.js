const CollegeForm = require("../models/CollegeForm");


exports.collegeSubmitForm = async (req, res) => {
    const { pcName, pcEmail, pcPhoneNumber, collegeName} = req.body;
    console.log(req.body)

    // Check if all required fields are present in the request body
    if (!pcName || !pcEmail || !pcPhoneNumber || !collegeName ) {
        res.status(200).send({status:false,message:'Missing required fields'});
        return
    }


    try {
        const existingData = await CollegeForm.findOne({ $or: [{ pcEmail }, { pcPhoneNumber },{collegeName}] });
        if (existingData) {
             res.status(200).send({status:false,message:'Email or phone number already exists'});
             return
        }

        const formData = new CollegeForm(req.body);

        // Save the form data
        await formData.save();
        res.status(200).send({status:true,message:'Form data saved successfully!'});
    } catch (err) {
        console.error(err);
        res.status(200).send({status:false,message:'Error saving form data'});
    }
};
