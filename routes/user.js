const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../models/user')
const bcrypt=require('bcryptjs');
const passport=require('passport')

router.get('/login',(req,res)=>{
    res.render('users/login')
})



router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
})


router.get('/registered',(req,res)=>{
    res.render('users/register')
})

router.post('/registered',(req,res)=>{
    let errors=[]
    if(req.body.password!=req.body.password2){
         errors.push({text:"passwords don't match"})
    }
    if(req.body.password.length<4){
        errors.push({text:"password is less than 4"})
    }
    if(errors.length>0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        })
    }
    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            req.flash('error_msg','the email already existed')
            res.redirect('/users/registered')
        }
    })
        bcrypt.hash(req.body.password,12)
        .then(hashed=>{
            const user=new User({
                name:req.body.name,
                email:req.body.email,
                password:hashed,
            })
            user.save()
            .then(user=>{
                req.flash('success_msg','registration sucessed')
                res.redirect('/users/login')
        })
    }

)})
router.get('/logout',(req,res)=>{
    req.logOut();
    req.flash('success_msg','loged out successed')
    res.redirect('/users/login')
})


module.exports=router

