const mongoose = require('mongoose');

const quizzesSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    choose1: {
        type: String,
        required: true,
    },
    choose2: {
        type: String,
        required: true,
    },
    correct: {
        type: String,
        required: true,
    },
    

},
{
// means createdAt and updatedAt
    timestamps: true 
});



const Quiz = mongoose.model("Quiz", quizzesSchema);
module.exports = Quiz;