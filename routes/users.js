const express= require('express');
const router = express.Router();
const passport =require('passport');
const jwt=require('jsonwebtoken');
const config=require('../config/database');
const User= require('../models/user');

router.post('/register',(req,res,next)=>{
        let newUser = new User({
            name:req.body.name,
            email:req.body.email,
            username:req.body.username,
            password:req.body.password
        });

        User.addUser(newUser,(err,user)=>{
            if(err){
                if(err.code===11000)
                    res.json({success:false,msg:'Username or Email already exists'});
                else
                    res.json({success:false,msg:'Something went wrong.Failed to register user'});
            }
            else{
                res.json({success:true,msg:'You are now registered and can login in'});
            }
        });
});

router.get('/checkEmail/:email',(req,res)=>{
    if(!req.params.email)
        res.json({success:false,msg:'Email is not provided'});
    else{        
            User.findOne({email:req.params.email},(err,user)=>{
                if(err)
                    res.json({success:false,msg:err});
                else{
                    if(user)
                        res.json({success:false,msg:'Email is already taken'});
                    else
                        res.json({success:true,msg:'Email is available'});    
                }     
            });
    }
});

router.get('/checkUsername/:username',(req,res)=>{
    if(!req.params.username)
        res.json({success:false,msg:'Username is not provided'});
    else{
        User.findOne({username:req.params.username},(err,user)=>{
            if(err)
                res.json({success:false,msg:err});
            else{
                if(user)
                    res.json({success:false,msg:'Username is already taken'});
                else
                    res.json({success:true,msg:'Username is available'});    
            }     
        });
    }
});

router.post('/authenticate',(req,res,next)=>{
    const username=req.body.username;
    const password=req.body.password;

    if(!req.body.username)
        return res.json({success:false,msg:'Username not provided'});
    else if(!req.body.password)
        return res.json({success:false,msg:'Password not provided'});
    else{
        User.getUserByUsername(username,(err,user)=>{
            if(err) throw err;
            if(!user){
                return res.json({success:false,msg:'User does not exist'});
            }

            User.comparePassword(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    const token=jwt.sign({data:user},config.secret,{expiresIn:'24h'}); //token created

                    res.json({                      //send the token and user info to browser
                        success:true,
                        token:'JWT '+token,
                        user:{
                            id:user._id,
                            name:user.name,
                            username:user.username,
                            email:user.email
                        }
                    });
                }else{
                    return res.json({success:false,msg:'Entered password is Wrong'});
                }
            });
        });
    }
});


router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({user:req.user});
});

module.exports=router;