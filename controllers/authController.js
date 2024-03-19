const jwt = require('jsonwebtoken');



exports.logout=async (req,res)=>{
    res.cookie("auth",'')
    res.redirect("/")
}


exports.login = async (req, res) => {
    // const authtoken = req.query.authtoken;
    // console.log(req.query)
    // console.log("params ", authtoken)
    // const secretKey = 'mysecretkey_goalstreet';
    // if (authtoken !== null && authtoken !== undefined) {

    //     try {
    //         const verified = jwt.verify(authtoken, secretKey);
    //         res.redirect('/dashboard')
    //         return
    //     } catch {

    //         res.render("LoginPage.ejs", { loginData: {}, errors: {} })
    //     }

    // } else {
        res.render("LoginPage.ejs", { loginData: {}, errors: {} })
    // }



}

exports.authenticate = async (req, res) => {
    const secretKey = 'mysecretkey_goalstreet';
    console.log("params ", req.params)
    // const verified = jwt.verify(token, secretKey);

    console.log('iudsjdsui')
    console.log("req is ", req.cookie)
    const keys = Object.keys(req);
    console.log(keys);
    const { username, password } = req.body
    if (username.toLowerCase() !== 'admingoalstreet' || password.toLowerCase() !== 'passwordgoalstreet') {
        let errors = {}
        if (username.toLowerCase() !== 'admingoalstreet') {
            errors["username"] = "Invalid Username.";
        }
        if (password.length !== 'passwordgoalstreet') {
            errors["password"] = 'Password Inavlid'
        }
        return res.status(400).render("LoginPage", { loginData: req.body, errors: errors });

    }
    const payload = { username: username, password: password };

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    console.log('new token is ',token)
    res.cookie('auth', token);
    // res.send({ authToken: token })
    res.redirect('/dashboard')

}

