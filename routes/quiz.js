const express = require('express');
const router = express.Router();
const axios = require("axios");
//let quizzes = require("../public/quiz.json")
let Quizzes = require("../models/Quizzes")



const isLoggedIn = require("../helper/isLoggedIn");

let quizzQuestions = []
let shuffledQuestions  = []
let score

/* 
router.get("/qizes/requst",(req, res) => {
    Quizzes.find().then(quizzQuestions =>{
          res.redirect("/qizes/index",{question :quizzQuestions})
      }).catch(err =>{
    res.redirect("/auth/signin");      })
   })
 */  


router.get("/quiz/index", isLoggedIn,(req, res) => {
    quizzes = Quizzes.find()
    .then(courses => {

    quizzes=courses

    quizzQuestions = []
    shuffledQuestions  = []
    score=0
    for(let i=0; i<10;i++){quizzQuestions.push(i)}
    shuffledQuestions = quizzQuestions.sort(() => Math.random() - 0.5)
    quizzQuestions =[...shuffledQuestions]

    currentQuestion = shuffledQuestions.pop()
    question = quizzes[currentQuestion].question
    choices = [quizzes[currentQuestion].choose1, quizzes[currentQuestion].choose2, quizzes[currentQuestion].correct]
    shuffled = choices.sort(() => Math.random() - 0.5)
    
   
    res.render("quiz/index", { question, shuffled });})
    .catch(err =>
    res.redirect("/auth/signin"))


})

router.post("/quiz/index", (req, res) => {

    if( req.body.choice == quizzes[quizzQuestions[shuffledQuestions.length]].correct &&shuffledQuestions.length >0){
        score++
    currentQuestion = shuffledQuestions.pop()
    question = quizzes[currentQuestion].question
    choices = [quizzes[currentQuestion].choose1, quizzes[currentQuestion].choose2, quizzes[currentQuestion].correct]
    shuffled = choices.sort(() => Math.random() - 0.5)
    
   
    res.render("quiz/index", { question, shuffled });
    }

    else{
        res.render("quiz/result",{score:score});
    }
    

})



module.exports = router;