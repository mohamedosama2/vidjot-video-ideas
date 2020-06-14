module.exports=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('erroe_msg',"not authenticated")
    res.redirect('/users/login')
}