
const express = require('express');

const router = express.Router();

const axios = require("axios");
const User = require('../models/User');


const isLoggedIn = require("../helper/isLoggedIn");


// display detalis and check favo
router.get("/team/details",isLoggedIn, (req, res) => {
  let flag = true

   const options = {
     method: 'GET',
     url: 'http://www.json-generator.com/api/json/get/cfzvjdcvdu?indent=2'
   }
  // const options = {
  //   method: 'GET',
  //   url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
  //   params: {league: '307', season: '2020', team: req.query.teamID},
  //   headers: {
  //     'x-rapidapi-key': process.env.APIKey,
  //     'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  //   }
  // };
  axios.request(options).then(function (team) {
    // res.render("team/details" , {team : team.data });


     const options2 = {
       method: 'GET',
       url: 'http://www.json-generator.com/api/json/get/bVGcPdYhQi?indent=2'
     };
    // const options2 = {
    //   method: 'GET',
    //   url: 'https://api-football-v1.p.rapidapi.com/v3/players',
    //   params: {team: req.query.teamID, league: '307', season: '2020'},
    //   headers: {
    //     'x-rapidapi-key': process.env.APIKey,
    //     'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    //   }
    // };
    
    axios.request(options2).then(function (player) {
      console.log(req.query.teamID)
      
      User.findById(req.user.id).then(result => {
       
        result.favoriteTeams.forEach(element => {
          if (flag && element.teamId == req.query.teamID) {
            flag = false;
            res.render('team/details', { team: team.data, player: player.data, favorite:"t" })
            /*res.json({response : response.data})  */
          }
        });
        if (flag) {
          res.render("team/details", { team: team.data, player: player.data, favorite:"f" });
        }

      }).catch(err => console.log(err))

      // res.render("team/details" , {team : team.data , player:player.data});
    }).catch(function (error) {
      console.error(error);
    });
  }).catch(function (error) {
    console.error(error);
  });

})



router.post("/team/favorite",isLoggedIn, (req, res) => {
  User.findOneAndUpdate(req.user.id, { $push: { favoriteTeams:  [{name: req.body.teamName,logo:req.body.img}] }})

 // User.findByIdAndUpdate(req.user.id, { $push: { favoriteTeams:  [{teamId: req.body.teamId,name: req.body.teamName,logo:req.body.img}] }})
 //master
    .then(user => {
      console.log("User in fav"+user)
      res.redirect("/team/details?teamID=" + req.query.teamID)
      /* res.render('team/favoDetails', {response : response.data}) */
    })
    .catch(err => { res.redirect("/auth/signin");})
})




router.get("/player/statstics",isLoggedIn, (req, res) => {

  //=====================================
  // by TEAM ID
  //http://www.json-generator.com/api/json/get/bUrDbgmusy?indent=2
  //=====================================

  // const options = {
  //   method: 'GET',
  //   url: 'http://www.json-generator.com/api/json/get/bUrDbgmusy?indent=2'
  // };

  // axios.request(options).then(function (response) {

  //   res.render("team/details", { response: response.data });

  // })
  //   .catch(function (error) {
  //     console.error(error);
  //   });

})


//================================
//http://www.json-generator.com/api/json/get/cfzvjdcvdu?indent=2
//================================
router.get("/team/statstics",isLoggedIn, (req, res) => {


  // const options = {
  //     method: 'GET',
  //     url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
  //     params: {league: '307', season: '2020', team: '2939'},
  //     headers: {
  //       'x-rapidapi-key': process.env.APIKey,
  //       'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  //     }
  //   };

  const options = {
    method: 'GET',
    url: 'http://http://www.json-generator.com/api/json/get/cffaPzJwoi?indent=2'
  };


  axios.request(options).then(function (response) {
    res.json(response.data)
  }).catch(function (error) {
    console.error(error);
  });

})

//================================
//http://www.json-generator.com/api/json/get/coVfiUkhrC?indent=2
//================================
router.get("/player/trophies",isLoggedIn, (req, res) => {


  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/trophies',
    params: { player: '276' },
    headers: {
      'x-rapidapi-key': process.env.APIKey,
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });

})


//================================
//http://www.json-generator.com/api/json/get/bVetRIyAgO?indent=2
//================================
router.get("/top/scorers",isLoggedIn, (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers',
    params: { league: '307', season: '2020' },
    headers: {
      'x-rapidapi-key': process.env.APIKey,
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    }
  };

  axios.request(options).then(function (response) {
    res.json(response.data);
  }).catch(function (error) {
    console.error(error);
  });
})
module.exports = router;