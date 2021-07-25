const express = require('express');

const router = express.Router();


// HTTP GET - ROOT ROUTE OF OUR APPLICATION
router.get('/home', (req, res) => {
     res.redirect("/home/current");
 });




module.exports = router;