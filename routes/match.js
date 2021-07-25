  
const express = require('express');

const router = express.Router();
const axios = require("axios");

const User = require("../models/User");
const Match = require("../models/Match");


const isLoggedIn = require("../helper/isLoggedIn");


// HTTP GET - display details a specific match by id
// for prodaction
 /*
router.get('/match/details',isLoggedIn, (req, res) => {
 
  
  axios.request(options).then(response => {
    console.log(response.data);
   //res.json({response : response.data});
    res.render("match/details" , {response : response.data}); 
  }).catch(error=> {
    console.error(error);
  });
  
  res.redirect("/testing/match/details")
});
*/

// ###############################only for test
// ###############################only for test
router.get('/match/details', (req, res) => {

let flag = true;
let arr;
let teamOne=0,teamTwo=0,tie=0;

  const options = {
    method: 'GET',
    url: 'http://www.json-generator.com/api/json/get/cgsmbUXZki?indent=2',
  };

  
  // const options = {
  //   method: 'GET',
  //   url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  //   params: {id: req.query.matchID},
  //   headers: {
  //     'x-rapidapi-key': process.env.APIKey,
  //     'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  //   }
  // };

  axios.request(options).then(function (response) {
    
    User.findById(req.user.id).then(user=>{
      Match.findOne({fixtureID:req.query.matchID}).then(match=>{
        
        user.voteMatchs.forEach(elem=>{
        
        if(flag && elem.match == match.id){
          flag = false;

          match.votes.forEach(eleme =>{ //localeCompare
            if(eleme.vote === "tie"){
            tie++
            }
            else if(eleme.vote === "teamOne"){
              teamOne++
            }
            else{
              teamTwo++
            }
          })

           arr=[
            (Math.round(((teamOne/match.votes.length)*100))),
            (Math.round(((teamTwo/match.votes.length)*100))),
            (Math.round(((tie/match.votes.length)*100)))
          ]
          console.log(arr);
          console.log(arr.length);

          res.render("match/detailsAfterVote", { response: response.data, votedCount: arr , numVote: arr.length});
          
        }
  
        })
        if (flag){

          res.render("match/details", { response: response.data});
        }
      }).catch(err =>{
  res.redirect("/auth/signin");      })
    })
  .catch(err =>{
    console.log(err)
  })
   
  }).catch(function (error) {
    console.error(error);
  });
}) 

router.post("/match/vote", isLoggedIn,(req, res) => {

  User.findById(req.user.id)
    .then(user => {
    
      Match.findOneAndUpdate({ fixtureID: req.query.matchID }, { $push: { votes: [{ user: user, vote: req.body.vote }] } })
        .then(update => {
          User.findByIdAndUpdate(req.user.id, { $push: { voteMatchs: [{ match: update, vote: req.body.vote }] } })
          .then(result => {
            res.redirect("/match/details?matchID="+req.query.matchID)
          })
            .catch(err => {
        res.redirect("/auth/signin");            })
            .catch(err => {
        res.redirect("/auth/signin");            })

        }).catch(err => {
    res.redirect("/auth/signin");        })

    })
  
  })

  module.exports = router;