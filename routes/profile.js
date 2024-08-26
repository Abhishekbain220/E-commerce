var express = require('express');
var router = express.Router();
let {isLoggedIn}=require("../utils/auth")
let upload=require("../utils/multer")
let User=require("../models/userSchema")
let Product=require("../models/productSchema")
/* GET home page. */
function verifyUser(req,res,next){
  if(req.user.role == "seller"){
    next()
  }
  else{
    res.send("Only buyer can Access this")
  }
}
function verifyBuyerUser(req,res,next){
  if(req.user.role == "buyer"){
    next()
  }
  else{
    res.redirect("/profile")
  }
}
router.get('/', isLoggedIn,async function(req, res, next) {
  let product=await Product.find().populate("user")
  
  res.render('profile',{
    product,
    user:req.user
  } );
});
router.get('/payment', isLoggedIn,async function(req, res, next) {
  req.user.cart = req.user.cart.filter((elem)=>{
    return(
       elem === "hello"
    )
  })
  await req.user.save()
  res.redirect("/profile/thanks")
  
});
router.get('/updateUser', isLoggedIn, function(req, res, next) {
  res.render('updateUser', {
    user:req.user
  });
});
router.post('/updateUser/:uid', isLoggedIn,async function(req, res, next) {
  let user=await User.findByIdAndUpdate(req.params.uid,req.body)
  res.redirect("/profile")
});
router.get('/resetPassword', isLoggedIn,async function(req, res, next) {
  res.render("resetPassword",{
    user:req.user
  })
});
router.post('/resetPassword/:uid', isLoggedIn,async function(req, res, next) {
  let user=await User.findById(req.params.uid)
  await user.changePassword(req.body.oldPassword,req.body.newPassword)
  await user.save()
  res.redirect("/profile")
});
router.post('/resetPassword/:uid', isLoggedIn,async function(req, res, next) {
  let user=await User.findById(req.params.uid)
  await user.changePassword(req.body.oldPassword,req.body.newPassword)
  await user.save()
  res.redirect("/profile")
});
router.get('/createProduct', isLoggedIn,verifyUser,async function(req, res, next) {
  res.render("createProduct",{
    user:req.user
    
  })
});
router.post('/createProduct',upload.single("productImage"), isLoggedIn,async function(req, res, next) {
  let newproduct=await Product.create({
    title:req.body.title,
    productImage:req.file.filename,
    price:req.body.price,
    user:req.user._id
  })
  await req.user.product.push(newproduct)
  await req.user.save()
  await newproduct.save()
  res.redirect("/profile")
});
router.get('/selectProduct/:mid',verifyBuyerUser,upload.single("productImage"), isLoggedIn,async function(req, res, next) {
  let product=await Product.findById(req.params.mid).populate("user")
  res.render("selectProduct",{
    user:req.user,
    product
  })
});

router.get('/thanks', isLoggedIn,async function(req, res, next) {
  res.render("thanks",{
    user:req.user
  })
});



module.exports = router;
