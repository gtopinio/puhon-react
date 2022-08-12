// This file contains the data model for a User.
// A User has a first name, last name, an email, a password, a list of friends, and a list of friend requests

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email : {type: String, required: true},
    password : {type: String, required: true},
    friends : {type: [String], required: true},
    friendRequests: {type: [String], required: true}
});

UserSchema.pre("save", function(next){
    const user = this;
    
    if(!user.isModified("password")) return next();

    // The return statement returns a modified user document, assuming there are no errors.
    // In this modified user document, the value of the password field is salted and hashed. 
    // It is the version of the document that will be saved in the document because this function is triggered before the save operation happens
    return bcrypt.genSalt((saltError, salt ) => {
        if(saltError){ return next(saltError); }
        
        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if(hashError) {return next(hashError);}

            user.password = hash;
            return next();
        });
    });
});

// Custom method to compare password using Bcrypt's built-in compare method to do password comparison
UserSchema.methods.comparePassword = function(password, callback){
    bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model("User", UserSchema);