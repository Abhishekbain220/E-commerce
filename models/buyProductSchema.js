let mongoose=require("mongoose")
let buyProductSchema=mongoose.Schema({
    quantity:Number,
    productPrice:Number,
    
    product:{type:mongoose.Schema.Types.ObjectId,ref:"product"}
})
module.exports=mongoose.model("buyproduct",buyProductSchema)