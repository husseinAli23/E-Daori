const mongoose = require('mongoose');

const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, "First name must be more then 3 characters"],
        maxLength: [99, "This is too much man.... Chillll..."]
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [3, "Your password is too weak... Khalaaas"],
    },
    image:{
      type: String,
        
    },
    isAdmin: Boolean
    ,
    favoriteTeams:[{teamId:Number,name: String,logo:String}]
    ,

    voteMatchs:[{
        match:{
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Match'
    },
    vote:String
    }]
},
{
// means createdAt and updatedAt
    timestamps: true 
});

// VerifyPassword
userSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
} 

const User = mongoose.model("User", userSchema);
module.exports = User;