let mongoose=require("mongoose")
let plm=require("passport-local-mongoose")
let userSchema=mongoose.Schema({
    username:String,
    email:String,
    
    address:String,

    role:{
        type:String,
        enum:["seller","buyer"]
    },
    password:String,
    product:[{type:mongoose.Schema.Types.ObjectId,ref:"product"}],
    cart:[{type:mongoose.Schema.Types.ObjectId,ref:"product"}]
})
userSchema.plugin(plm)
module.exports=mongoose.model("user",userSchema)