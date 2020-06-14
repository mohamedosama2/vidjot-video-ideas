const localStratigy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const User=require('../models/user');
const bcrypt=require('bcryptjs')


module.exports=function(passport){
passport.use(new localStratigy({usernameField:'email'},(email,password,done)=>{
    User.findOne({
        email:email
    })
    .then(user=>{
        if(!user){
            return done(null,false,{message:"there is not such an email"})
        }
        bcrypt.compare(password,user.password,(err,isMatch)=>{
            if(err){throw err};
            if(isMatch) {return done(null,user)}
            else{
                return done(null,false,{message:"password is not correct"})
            }
        })
    })
}))

passport.serializeUser(function(user,done){
    done(null,user.id)
})

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
         done(err,user)
    })
})
}