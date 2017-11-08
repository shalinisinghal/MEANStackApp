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

router.get('/getBlogs',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
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

router.get('/singleBlog/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    if(!req.params.id){
        res.json({success:false,message:'No Blog ID was provided'});
    }else{
        Blog.findOne({_id:req.params.id},(err,blog)=>{
            if(err){
                res.json({success:false,message:'not a valid blog id'});
            }else{
                if(!blog){
                    res.json({success:false,message:'Blog not found'});
                }else
                    res.json({success:true,blog:blog});
            }
                
        });
    }
});


router.put('/updateBlog',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(!req.body._id){
        res.json({success:false,message:'No Blog ID was provided'});
    }else{
        Blog.findOne({_id:req.body._id},(err,blog)=>{
            if(err){
                res.json({success:false,message:'not a valid blog id'});
            }else{
                if(!blog){
                    res.json({success:false,message:'Blog id was not found'});
                }else{
                    if(!req.user){
                        res.json({success:false,message:'Unable to authenticate User'});
                    }else{
                        if(req.user.name !==blog.createdBy)
                            res.json({success:false,message:'You are not authorized to edit this blog post'});
                        else{
                            blog.title=req.body.title;
                            blog.body=req.body.body;
                            blog.save((err)=>{
                                if(err){
                                    res.json({success:false,message:err});
                                }
                                else{
                                    res.json({success:true,message:"Blog added!"});
                                }
                            });
                        }
                    }        
               }
            }              
        });
    }
});

router.delete('/deleteBlog/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(!req.params.id){
        res.json({success:false,message:'No Blog ID was provided'});
    }else{
        Blog.findOne({_id:req.params.id},(err,blog)=>{
            if(err){
                res.json({success:false,message:'not a valid blog id'});
            }else{
                if(!blog){
                    res.json({success:false,message:'Blog not found'});
                }else{
                    if(!req.user){
                        res.json({success:false,message:'Unable to authenticate User'});
                    }else{
                        if(req.user.name !==blog.createdBy)
                            res.json({success:false,message:'You are not authorized to edit this blog post'});
                        else{
                            blog.remove((err)=>{
                                if(err){
                                    res.json({success:false,message:err});
                                }
                                else{
                                    res.json({success:true,message:"Blog removed!"});
                                }
                            });
                        }
                    }
                }
            }
                
        });
    }
});


router.put('/likeBlog',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(!req.body.id){
        res.json({success:false,message:'No Blog ID was provided'});
    }else{
        Blog.findOne({_id:req.body.id},(err,blog)=>{
            if(err){
                res.json({success:false,message:'not a valid blog id'});
            }else{
                if(!blog){
                    res.json({success:false,message:'Blog not found'});
                }else{
                    if(!req.user){
                        res.json({success:false,message:'Unable to authenticate User'});
                    }else{
                        if(req.user.name !== blog.createdBy)
                            res.json({success:false,message:'You are not authorized to edit this blog post'});
                        else{
                            if(blog.likedBy.includes(req.user.name)){
                                res.json({success:false,message:'you already liked.'});
                            }
                            else {
                                if (blog.dislikedBy.includes(req.user.name)) {
                                    blog.dislikes--; // Reduce the total number of dislikes
                                    const arrayIndex = blog.dislikedBy.indexOf(req.user.name); // Get the index of the username in the array for removal
                                    blog.dislikedBy.splice(arrayIndex, 1); // Remove user from array
                                }
                                blog.likes++; // Incriment likes
                                blog.likedBy.push(req.user.name); // Add liker's username into array of likedBy
                                // Save blog post
                                blog.save((err) => {
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                    } else {
                                        res.json({ success: true, message: 'Blog liked!' }); // Return success message
                                    }
                                });
                            }
                        }
                    }
                }
            }
                
        });
    }
});

router.put('/dislikeBlog',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(!req.body.id){
        res.json({success:false,message:'No Blog ID was provided'});
    }else{
        Blog.findOne({_id:req.body.id},(err,blog)=>{
            if(err){
                res.json({success:false,message:'not a valid blog id'});
            }else{
                if(!blog){
                    res.json({success:false,message:'Blog not found'});
                }else{
                    if(!req.user){
                        res.json({success:false,message:'Unable to authenticate User'});
                    }else{
                        if(req.user.name !==blog.createdBy)
                            res.json({success:false,message:'You are not authorized to edit this blog post'});
                        else{
                            if(blog.dislikedBy.includes(req.user.name)){
                                res.json({success:false,message:'you already disliked.'});
                            }
                            else {
                                if (blog.likedBy.includes(req.user.name)) {
                                    blog.likes--; // Reduce the total number of dislikes
                                    const arrayIndex = blog.likedBy.indexOf(req.user.name); // Get the index of the username in the array for removal
                                    blog.likedBy.splice(arrayIndex, 1); // Remove user from array
                                }
                                blog.dislikes++; // Incriment likes
                                blog.dislikedBy.push(req.user.name); // Add liker's username into array of likedBy
                                // Save blog post
                                blog.save((err) => {
                                    if (err) {
                                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                                    } else {
                                        res.json({ success: true, message: 'Blog Disliked!' }); // Return success message
                                    }
                                });
                            }
                        }
                    }
                }
            }
                
        });
    }
});


router.post('/comment',passport.authenticate('jwt',{session:false}), (req, res) => {
    // Check if comment was provided in request body
    if (!req.body.comment) {
      res.json({ success: false, message: 'No comment provided' }); // Return error message
    } else {
      // Check if id was provided in request body
      if (!req.body.id) {
        res.json({ success: false, message: 'No id was provided' }); // Return error message
      } else {
        // Use id to search for blog post in database
        Blog.findOne({ _id: req.body.id }, (err, blog) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: 'Invalid blog id' }); // Return error message
          } else {
            // Check if id matched the id of any blog post in the database
            if (!blog) {
              res.json({ success: false, message: 'Blog not found.' }); // Return error message
            } else {
                  if (!req.user) {
                    res.json({ success: false, message: 'User not found.' }); // Return error message
                  } else {
                    // Add the new comment to the blog post's array
                    blog.comments.push({
                      comment: req.body.comment, // Comment field
                      commentator: req.user.username // Person who commented
                    });
                    // Save blog post
                    blog.save((err) => {
                      // Check if error was found
                      if (err) {
                        res.json({ success: false, message: 'Something went wrong.' }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Comment saved' }); // Return success message
                      }
                    });
                  }
                }
            }
        });
      }
    }
  });


module.exports=router;