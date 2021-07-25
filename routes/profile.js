const express = require('express');

const router = express.Router();
const User = require("../models/User");
const Match = require("../models/Match");
const bcrypt = require("bcrypt");
const salt = 10;
const multer = require('multer');
// const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const isLoggedIn = require("../helper/isLoggedIn");
const isAdmin = require("../helper/isAdmin");


const storage = multer.diskStorage({
  destination: './public/images/user/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
})

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


var methodOverride = require('method-override');
router.use(methodOverride('_method'))



router.get("/profile", isLoggedIn, (req, res) => {

  let myvotes = [];

  User.findById(req.user.id).then(result => {
    
    if (result.voteMatchs.length > 0) {
    
      let counter = 0;
      result.voteMatchs.forEach(element => {

        Match.findById(element.match).then(mymatch => {

          temp = { teamOne: mymatch.teamOne, teamTwo: mymatch.teamTwo, elem: element.vote }
          myvotes.push(temp);


          if (result.voteMatchs.length - 1 > counter) {
            counter++
            
          }
          else {
            
            res.render("profile/index", { result, myvotes });
          }
        }).catch(err => console.log(err))


      });

    }
    else{
      res.render("profile/index", { result, myvotes });
    }
  }).catch(err => {
    console.log(err)
    res.redirect("/auth/signin");
  })
})

router.get("/profile/edit", isLoggedIn, (req, res) => {

  User.findById(req.user.id).then(result => {
    res.render("profile/edit", { result });
  }).catch(err => {
    res.redirect("/auth/signin");
  })
})


router.post("/profile/edit", isLoggedIn, upload.single("image"), (req, res) => {
  let userupdate = new User(req.body)



  User.findByIdAndUpdate(req.user.id, { name: req.body.name }).then(result => {

    if (req.file != null && req.file != undefined && req.file == "") {
      userupdate.image = "images/user/" + req.file.filename;
      result.updateOne({ id: result.id }, { $set: { image: "images/user/" + req.file.filename } }).then(() => {
        //result.image= "images/user/"+req.file.filename;
        res.redirect('/profile');
      })


        .catch(err => {
          res.redirect("/auth/signin");
        })
    } else { res.redirect('/profile'); }



  }).catch(err => {
    res.redirect("/auth/signin");
  });
})


router.get("/edit/Password", isLoggedIn, (req, res) => {

  res.render("profile/Password");

})


router.post("/edit/Password", isLoggedIn, (req, res) => {

  if (req.user.verifyPassword(req.body.password_old)) {
    if (req.body.password_new == req.body.password_varify) {


      let hash = bcrypt.hashSync(req.body.password_new, salt);

      


      User.findByIdAndUpdate(req.user.id, { password: hash }).then(result => {
        
        res.redirect("/edit/Password")


      }).catch(err => {
        res.redirect("/auth/signin");
      });
    } else {
      console.log("password mismatch")
      res.render("profile/Password");
    }
  } else {
    console.log("password does not match the old password")
    res.render("profile/Password");
  }
})


router.get("/profile/edit/delete", isLoggedIn, (req, res) => {

  User.findByIdAndUpdate(req.user.id, { $pull: { favoriteTeams: { teamId: req.query.id } } })
    .then(() => {
      res.redirect("/profile/edit")
    })
    .catch(err => {
      console.log(err)
      res.redirect("/auth/signin");
    })
})

router.get("/profile/delete", isLoggedIn, (req, res) => {
  User.findByIdAndDelete(req.user.id)
    .then(() => {
      res.redirect("/auth/signup")
    })
    .catch(err => { console.log(err) })

})


module.exports = router;
