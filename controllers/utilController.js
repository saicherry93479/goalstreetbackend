exports.notFoundPage=async (req,res)=>{
    console.log('came  in not found controler ')
    res.render("PageNotFound.ejs",{authToken:req.query.authtoken})
}

