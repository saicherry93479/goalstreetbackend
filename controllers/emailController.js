const nodemailer = require('nodemailer');
const HrForm = require('../models/HrForm');
const jwt = require('jsonwebtoken');

exports.sendAccessEmail = async (req, res) => {
    const secretKey = 'mysecretkey_goalstreet';
    try {
        console.log("url params are ", req.query.userId)
        if (!req.query.userId) {
            res.status(400).send('Missing required fields');
            return;
        }

        try {
            const existingData = await HrForm.findById(req.query.userId);
            if (existingData) {
                const payload = { role: 'HR', hrUserId: req.query.userId };
                const token = jwt.sign(payload, secretKey);
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: '123003253@sastra.ac.in',
                        pass: 'Sai@123.'
                    }
                });
                let mailOptions = {
                    from: '123003253@sastra.ac.in',
                    to: 'cherry.workspace.mail@gmail.com',
                    subject: 'Welcome to Our HR Dashboard',
                    text: `Hello,
        
        This is an automated message to provide you with the access link to our HR Dashboard.
        
        You can access the page at: https://dashboard.goalstreet.in/workdata/add?authtoken=${token}&role=HR
        
        Best regards,
        Your HR Team`,
                    html: `<p>Hello,</p>
                           <p>This is an automated message to provide you with the access link to our HR Dashboard.</p>
                           <p><a href="https://dashboard.goalstreet.in/workdata/add?authtoken=${token}&role=HR">Click here</a> to access the HR Dashboard.</p>
                           <p>Best regards,<br>Your HR Team</p>`
                };
                let info = await transporter.sendMail(mailOptions);
                console.log('Email sent: ' + info.response);

                // Respond to the client
                console.log("sucessfully sent")
                res.status(200).send('Email sent');

            }
        } catch (err) {
            res.status(500).send('Error sending email');
        }






    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
}
