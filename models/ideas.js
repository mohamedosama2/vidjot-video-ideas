const mongoose=require('mongoose');
const Schema=mongoose.Schema

const IdeaSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    details:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:'users'
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('ideas',IdeaSchema)