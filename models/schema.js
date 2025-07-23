import mongoose from "mongoose";

const user =new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwd: {
        type: String,
        required: true
    },
followers:{
    type:[mongoose.Schema.ObjectId],
    default:[]
},
following:{
    type:[mongoose.Schema.ObjectId],
    default:[]

},
bio:{
    type:String,
    default:""
},
post:{
     type:[mongoose.Schema.ObjectId],
    default:[],
    ref:'Post'
}
})

const post=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },
    content:{
        type:String,
        required:true
    },
    likes:{
        type:[mongoose.Schema.ObjectId],
        default:[],
        ref:"User"
    },
    dislikes:{
        type:[mongoose.Schema.ObjectId],
        default:[],
        ref:"User"
    },
    comments:{
        type:[mongoose.Schema.ObjectId],
        default:[]
    }
})

const comm=new mongoose.Schema({
    content:{
        type:String,
        require:true
    },
    author:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'

    },
    post:{
        type:mongoose.Schema.ObjectId,
        ref:"Post"
    }
})

export const User=mongoose.model("User",user)
export const Post=mongoose.model("Post",post)
export const Comment=mongoose.model("Comment",comm)