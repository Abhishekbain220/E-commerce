var express = require('express');
var router = express.Router();
let User = require("../models/userSchema")
let passport = require("passport")
let LocalStrategy = require("passport-local")
passport.use(new LocalStrategy(User.authenticate()))

/* GET users listing. */
router.get('/', function (req, res, next) {
  user:req.user

});
router.get('/register', function (req, res, next) {
  res.render("register", {
    user:req.user

  })
});
router.post('/register', async function (req, res, next) {
  let { username, email,address, role, password } = req.body
  let newUser = await User.register({
    username,
    email,
    address,
    role,
  }, password)
  await newUser.save()
  res.redirect("/user/login")
});
router.get('/login', async function (req, res, next) {
  res.render("login", {
    user:req.user

  })
});
router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/user/login"
}), async function (req, res, next) {

});
router.get('/logout', async function (req, res, next) {
  req.logOut(() => {
    res.redirect("/user/login")
  })
});
router.get('/forgetEmail', async function (req, res, next) {
  res.render("forgetEmail",{
    user:req.user

  })
});
router.post('/forgetEmail', async function (req, res, next) {
  let user = await User.findOne({
    email: req.body.email
  })
  if (user) {
    res.redirect(`/user/forgetPassword/${user._id}`)
  }
  else {
    res.redirect("/user/forgetEmail")
  }
});
router.get('/forgetPassword/:uid', async function (req, res, next) {
  res.render("forgetPassword",{
    userId:req.params.uid,
    user:req.user

  })
});
router.post('/forgetPassword/:uid', async function (req, res, next) {
    let user=await User.findById(req.params.uid)
    await user.setPassword(req.body.newPassword)
    await user.save()
    res.redirect("/user/login")
});



module.exports = router;
