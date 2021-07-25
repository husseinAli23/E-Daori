const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    fixtureID:Number,
    teamOne: {
        type: String,
        required: true,
    },
    teamTwo: {
        type: String,
        required: true,
    },
    matchTime: {
        type: String,
        required: true,
    },
    votes:[{
        user:{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User'
    },
    vote:String
    }]

},
{
// means createdAt and updatedAt
    timestamps: true 
});


const Match = mongoose.model("Match", matchSchema);

module.exports = Match;