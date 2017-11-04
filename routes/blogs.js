const express= require('express');
const router = express.Router();
const config=require('../config/database');
const User= require('../models/user');
const Blog= require('../models/blog');
const passport =require('passport');
const jwt=require('jsonwebtoken');

router.post('/addBlog',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    if(!req.body.title)
        res.json({success:false,message:"Title is required"});
    else if(!req.body.body)
        res.json({success:false,message:"Blog Body is required"});
    else {
        const newBlog=new Blog({
            title:req.body.title,
            body:req.body.body,
            createdBy:req.user.name
        });
        
        newBlog.save((err,blog)=>{
            if(err){
                if(err.errors){
                    if(err.errors.title)
                        res.json({success:false,message:err.errors.title.message});
                    else    
                        res.json({success:false,message:err.errmsg});
                }else{
                    res.json({success:false,message:err});
                } 
            }else
                res.json({success:true,message:"Blog added!"})         
        });
    }
});

router.get('/getBlogs',(req,res,next)=>{
    Blog.find(function(err,blogs){
        if(err)
            res.json({success:false,message:err});
        else{
            if(!blogs)
                res.json({success:false,message:"No Blog Post found"});
            else
                res.json({success:true,blogs:blogs});
        }
    }).sort({'_id':-1});
});

module.exports=router;