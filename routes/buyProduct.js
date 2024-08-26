var express = require('express');
var router = express.Router();
let {isLoggedIn}=require("../utils/auth")
let upload=require("../utils/multer")
let User=require("../models/userSchema")
let Product=require("../models/productSchema")
let BuyProduct=require("../models/buyProductSchema")
/* GET home page. */

router.get('/:mid', isLoggedIn,async function(req, res, next) {
  let product=await Product.findById(req.params.mid)
  
  res.render('buyProduct',{
    user:req.user,
    mid:req.params.mid,
    product
  } );
});
router.post('/:mid', isLoggedIn,async function(req, res, next) {
  let product=await Product.findById(req.params.mid)
  let newBill=await BuyProduct.create({
    quantity:req.body.quantity,
    productPrice:product.price*req.body.quantity,
    product:product._id
  })
  
  await newBill.save()
  res.redirect(`/buyProduct/billing/${newBill._id}`)
});
router.get('/billing/:bill_id', isLoggedIn,async function(req, res, next) {
  let bill=await BuyProduct.findById(req.params.bill_id).populate("product")
  res.render("billing",{
    bill,
    user:req.user
  })
});






module.exports = router;
