var express = require('express');
var router = express.Router();
let { isLoggedIn } = require("../utils/auth")
let upload = require("../utils/multer")
let User = require("../models/userSchema")
let Product = require("../models/productSchema")
let path = require("path")
let global = path.join(__dirname, "../", "public", "images")
let fs = require("fs")
/* GET home page. */
function verifyUser(req, res, next) {
  if (req.user.role == "seller") {
    next()
  }
  else {
    res.send("Only seller can Access this")
  }
}
router.get('/', isLoggedIn,verifyUser, async function (req, res, next) {
  let product = await Product.find().populate("user")
  res.render('myProduct', {
    product,
    user:req.user

  });
});
router.get('/deleteProduct/:mid', isLoggedIn, async function (req, res, next) {
  let product = await Product.findByIdAndDelete(req.params.mid)
  await fs.unlinkSync(path.join(global, product.productImage))


  await res.redirect("/myProduct")
});
router.get('/updateProduct/:mid', isLoggedIn, async function (req, res, next) {
  let product = await Product.findById(req.params.mid)
  res.render("updateProduct", {
    product,
    user:req.user

  })
});
router.post('/updateProduct/:mid', isLoggedIn, upload.single("productImage"), async function (req, res, next) {

  let product = await Product.findByIdAndUpdate(req.params.mid, {
    title: req.body.title,
  })
  if(req.file){
    await fs.unlinkSync(path.join(global,product.productImage))
    product.productImage=req.file.filename
    
  }
  await product.save()
  res.redirect("/myProduct")

});




module.exports = router;
