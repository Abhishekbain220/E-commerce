var express = require('express');
var router = express.Router();
let { isLoggedIn } = require("../utils/auth")
let upload = require("../utils/multer")
let User = require("../models/userSchema")
let Product = require("../models/productSchema")
let BuyProduct = require("../models/buyProductSchema")
/* GET home page. */

router.get('/', isLoggedIn, async function (req, res, next) {
  let products=await User.findById(req.user._id).populate("cart")
  let basePrice=0
  await products.cart.forEach((elem)=>{
    basePrice+=elem.price
  })
  res.render("addToCart",{
    user:req.user,
    totalPrice:basePrice,
    products:products.cart
  })


});


router.get('/:pid', isLoggedIn, async function (req, res, next) {
  if (req.user.cart.includes(req.params.pid)) {
    req.user.cart = req.user.cart.filter((elem) => {
      return (
        elem != req.params.pid
      )
    })
    req.user.cart.push(req.params.pid)


  }
  else {
    req.user.cart.push(req.params.pid)

  }
  await req.user.save()
  res.redirect("/profile")


});






module.exports = router;
