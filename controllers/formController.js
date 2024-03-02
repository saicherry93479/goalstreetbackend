const FormData = require('../models/Form');
const ExcelJS = require('exceljs');

exports.submitForm = async (req, res) => {
    const { email, phoneNumber, name, college, passOut, domain ,secondDomain} = req.body;
    console.log(req.body)

    // Check if all required fields are present in the request body
    if (!email || !phoneNumber || !name || !college || !passOut || !domain || !secondDomain) {
        res.status(200).send({status:false,message:'Missing required fields'});
        return
    }


    try {
        const existingData = await FormData.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingData) {
             res.status(200).send({status:false,message:'Email or phone number already exists'});
             return
        }

        const formData = new FormData(req.body);

        // Save the form data
        await formData.save();
        res.status(200).send({status:true,message:'Form data saved successfully!'});
    } catch (err) {
        console.error(err);
        res.status(200).send({status:false,message:'Error saving form data'});
    }
};

exports.getFormData = async (req, res) => {
    try {
        const formData = await FormData.find();
        console.log('formadata is ',formData)
        res.render('dashboard', { formData });
    } catch (err) {
        console.error(err);
        res.status(500).send({message:'Error fetching form data'});
    }
};

exports.downloadExcel = async (req, res) => {
    try {
        const formData = await FormData.find();

        // Create a new Excel workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Form Data');

        // Add headers
        worksheet.addRow(['Name', 'Email', 'PhoneNumber','College','Passout','Domain','Second Domain']);

        // Add data
        formData.forEach(data => {
            worksheet.addRow([data.name, data.email, data.phoneNumber,data.college,data.passOut,data.domain,data.secondDomain]);
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=dashboard.xlsx');

        // Send the workbook as a response
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating Excel file');
    }
};
