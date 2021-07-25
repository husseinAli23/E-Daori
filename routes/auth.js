const express = require('express');

const router = express.Router();
const bcrypt = require("bcrypt");
const salt =10; //Math.random();
const multer = require('multer');
const path = require('path');


const isAdmin = require("../helper/isAdmin");
let passport = require("../helper/ppConfig")

const User = require("../models/User");


const storage = multer.diskStorage({
  destination: './public/images/user/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
})




// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.get('/auth/signup', (req, res) => {
    res.render("user/signup")
})

// HTTP GET - ROOT ROUTE OF OUR APPLICATION
router.post('/auth/signup',upload.single('image') ,(req, res) => {
  
  let newUser = new User(req.body);
  

  let hash = bcrypt.hashSync(req.body.password, salt);
  newUser.password = hash;
  if(req.file == null || req.file == undefined || req.file == ""){
    newUser.image = "images/user/default.jpg";
  }else{
    newUser.image = "images/user/"+req.file.filename;
  }
  
  
  newUser.save().then(user=>{
      res.redirect("/auth/signin");
  }).catch(err=>{
res.redirect("/auth/signin");  })
  });

router.get('/auth/signin', (req, res) => {
    res.render("user/signin")
})

router.post("/auth/signin",
    passport.authenticate("local", {
      successRedirect: "/home/current",
      failureRedirect: "/auth/signin"
    })
  );
  


router.get("/auth/logout", (req, res) => {
    req.logout();
    // req.flash("error", "You are logged out successfully.");
    res.redirect("/auth/signin");
  });



module.exports = router;