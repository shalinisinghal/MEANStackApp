const mongoose=require('mongoose');
const config = require('../config/database');

let titleLengthChecker=(title)=>{
    if(!title)
        return false;
    else{
        if(title.length<5 || title.length>50)
            return false;
        else    
            return true;
    }
};

let alphaNumericTitleChecker=(title)=>{
    if(!title)
        return false;
    else{
        const re=new RegExp(/^[a-zA-Z0-9 ]+$/);
        return re.test(title);
    }
};

const titleValidators=[
    {
       validator:titleLengthChecker,
       message:'Title must be of more than 5 characters' 
    },
    {
        validator:alphaNumericTitleChecker,
        message:'Title must be alphanumeric'
    }
];

const BlogSchema = mongoose.Schema({
    title: {type :String,required:true,validate:titleValidators},
    body: {type :String,required:true},
    createdBy:{type:String},
    createdAt:{type:Date,default:Date.now()},
    likes:{type:Number,default:0},
    likedBy:{type:Array},
    dislikes:{type:Number,default:0},
    dislikedBy:{type:Array},
    comments:[{
        comment:{type:String},
        commentator:{type:String}
    }]
});

const Blog = module.exports =mongoose.model('Blog',BlogSchema);












