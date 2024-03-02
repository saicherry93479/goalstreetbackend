const mongoose = require('mongoose');

const WorkDataSchema = new mongoose.Schema({
    jobName: String,
    companyName: String,
    postedDate: {type:Date,default:Date.now},
    jobDescription: String,
    domain: String,
    salaryRange: String,
    officeType: { type: String }, // Enum for office type
    jobType: String
});

module.exports = mongoose.model('WorkData', WorkDataSchema);
