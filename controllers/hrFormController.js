const HrForm = require("../models/HrForm");

exports.submitHrForm = async (req, res) => {
    const { hrName, hrEmail, hrNumber, company, industry, companySize } = req.body;
    console.log(req.body)

    // Check if all required fields are present in the request body
    if (!hrName || !hrEmail || !hrNumber || !company || !industry  || !companySize) {
        res.status(200).send({status:false,message:'Missing required fields'});
        return
    }


    try {
        const existingData = await HrForm.findOne({ $or: [{ hrEmail }, { hrNumber }] });
        if (existingData) {
             res.status(200).send({status:false,message:'Email or phone number already exists'});
             return
        }

        const HrformData = new HrForm(req.body);

        // Save the form data
        await HrformData.save();
        res.status(200).send({status:true,message:'Data saved successfully!'});
    } catch (err) {
        console.error(err);
        res.status(200).send({status:false,message:'Error saving form data'});
    }
};

exports.getHrFormData = async (req, res) => {
    try {
        const formData = await HrForm.find();
        console.log('formadata is ',formData)
        res.render('HrDataPage', { formData ,authToken:req.query.authtoken});
    } catch (err) {
        console.error(err);
        res.status(500).send({message:'Error fetching form data'});
    }
};
