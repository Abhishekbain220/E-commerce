let mongoose=require("mongoose")
let productSchema=mongoose.Schema({
    title:String,
    productImage:String,
    price:Number,
    user:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
})
module.exports=mongoose.model("product",productSchema)