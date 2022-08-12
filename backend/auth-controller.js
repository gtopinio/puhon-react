const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// get user model registered in Mongoose
const User = mongoose.model("User");
const Post = mongoose.model("Post")

// function for signing up. It creates a new User instance based on the details inputted by the user. The new instance is saved into the database.
exports.signUp = (req, res) => {
    const newUser = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : req.body.password
    });

    console.log("New user:");
    console.log(newUser);

    newUser.save((err) => {
        if(err) { return res.send({ success: false }); }
        else { return res.send({ success: true}); }
    });
}

// function for logging in. It validates the email and password. It also gives a token if all details are validated.
exports.login = (req, res) => {
    const email = req.body.email.trim();
    const password = req.body.password;

    User.findOne({ email }, (err, user) => {
        // check if email exists
        if(err || !user){
            // Scenario 1: FAIL - User doesn't exist
            console.log("User doesn't exist");
            return res.send({ success: false });
        }

        // check if password is correct
        user.comparePassword(password, (err, isMatch) => {
            if(err || !isMatch){
                // Scenario 2: FAIL - Wrong password
                console.log("Wrong password");
                return res.send( {success: false });
            }

            console.log("Successfully logged-in");

            // Scenario 3: SUCCESS - time to create a token
            const tokenPayload = {
                _id: user._id
            }

            const token = jwt.sign(tokenPayload, "THIS_IS_A_SECRET_STRING");

            // return the token to the client
            return res.send({ success: true, token, userFirstName: user.firstName, userLastName: user.lastName});
        })
    });

}

// function to check if there are cookies. It also validates the token embedded with the cookie. It also validates if the user details exist in the database.
exports.checkIfLoggedIn = (req, res) => {

    if(!req.cookies || !req.cookies.authToken){
        // Scenario 1: FAIL - No cookies / no authToken cookie sent
        return res.send({ isLoggedIn: false });
    }

    // Token is present. Validate it
    return jwt.verify(
        req.cookies.authToken,
        "THIS_IS_A_SECRET_STRING",
        (err, tokenPayload) => {
            if(err){
                // Scenario 2: FAIL - Error validating token
                return res.send( {isLoggedIn: false });
            }

            const userId = tokenPayload._id;

            // check if user exists
            return User.findById(userId, (userErr, user) => {
                if(userErr || !user){
                    // Scenario 3: FAIL - Failed to find user based on id inside token payload
                    return res.send( {isLoggedIn: false });
                }

                // Scenario 4: SUCCESS - token and user id are valid
                console.log("User is currently logged in");
                return res.send( {isLoggedIn: true });
            });
        }
    );
}

// function to publish a post. It creates a new Post instance based on the details inputted by the user. The post is saved into the database.
exports.userPost = (req, res) => {
    const newPost = new Post({
        authorId: req.body.userId,
        authorFirstName : req.body.userFirstName,
        authorLastName : req.body.userLastName,
        content : req.body.content,
    });

    console.log("New post:");
    console.log(newPost);

    newPost.save((err) => {
        if(err) { return res.send({ success: false }); }
        else { return res.send({ success: true}); }
    });
}

// function to fetch the logged-in user's posts. It also fetches their friend's posts. It sorts the posts from the latest to the oldest post.
exports.getPosts = (req, res) => {
    Post.find({authorId: {$in : req.body.users}}).sort({'createdAt':-1}).exec((err, posts) => {
        if(!err || posts.count() != 0){
            return res.send({userPosts: posts})
        }
        else{
            return res.send({userPosts: false})
        }
    });
    // Reference on sorting documents by date: https://stackoverflow.com/a/15081087
}

// function to delete the logged-in user's post.
exports.deletePost = (req, res) => {
    Post.deleteOne({_id: req.body.deletePost}, (err) => {
        if(!err) return res.send({success: true})
        else return res.send({success: false})
    })
}

// function to edit the logged-in user's post.
exports.editPost = (req, res) => {
    const filter = {_id: req.body.postId};
    const update = {content: req.body.content}; // new post details

    Post.findByIdAndUpdate(filter, update, {new: true}, function(err){
        if(!err) return res.send({success: true})
        else return res.send({success: false})
    })
}

// function to search a user based on first name and last name. It is case insensitive and uses regex to find the user(s). It returns the found documents if successful.
exports.searchUser = (req, res) => {
    User.find({ $or: [{firstName: {$regex: ".*" + req.body.name + ".*", $options: 'i'}}, {lastName: {$regex: ".*" + req.body.name + ".*", $options: 'i'}}]}, 
    (err, users) => {
        var count = users;
        if(!err || count.length != 0){
            return res.send({userList: users, success: true})
        }
        else{
            return res.send({success: false})
        }
    })
}

// function to search the user based on first name and last name. It returns the user document.
exports.findUserId = (req, res) => {
    User.find({firstName: req.body.firstName, lastName: req.body.lastName}, (err, user) => {
        var count = user;
        if(!err || count.length != 0){
            return res.send({user: user, success: true})
        } else{
            return res.send({success: false})
        }
    })
}

// function to send a friend request to another user. It validates if the request is already send by the logged-in user.
exports.addFriend = (req, res) => {
    User.find({$or: [ {$and: [{friendRequests: req.body.pendingId, _id: req.body.destId}]}, 
        {$and: [{friends: req.body.pendingId, _id: req.body.destId}]} ]}, (err, user) => {
            var count = user.length
            if(!err && count === 0){
                User.updateOne({_id: req.body.destId}, {$push: {friendRequests: req.body.pendingId}}, (err) => {
                    if(!err){
                        return res.send({success: true})
                    }
                    else {
                        return res.send({success: false})
                    }
                })
            }

            else{
                return res.send({success: false})
            }

    })
}

// function that enables the logged-in user to remove a friend request.
exports.removeRequest = (req, res) => {
    User.findOneAndUpdate({_id: req.body.pendingId}, {$pull: {friendRequests: req.body.destId}}, (err) => {
        if(!err){
            return res.send({success: true})
        }
        else {
            return res.send({success: false})
        }
    })
}

// function to fetch the logged-in user document and get their friend requests.
exports.getFriendRequests = (req, res) => {
    User.find({_id: req.body.userId}, (err, user) => {
        var count = user;
        if(!err || count.length != 0){
            return res.send({user: user, success:true})
        }
        else{
            return res.send({success: false})
        }
    })
}

// function to fetch the user documents listed from the friend requests of the logged-in user.
exports.getRequestsById = (req, res) => {
    User.find({_id: { $in: req.body.requestIds}}, (err, users) => {
        const userList = users
        if(!err || userList.length != 0){
            return res.send({friendRequests: users, success: true})
        }
        else {
            return res.send({success: false})
        }
    })
}

// function to confirm a friend request. It pushes the ids of the users mutually to their friends list. It also mutally removes the friend requests from both users.
exports.confirmFriend = (req, res) => {
    User.updateOne({_id: req.body.destId}, {$push: {friends: req.body.pendingId}}, (err) => {
        if(!err){
            User.updateOne({_id: req.body.pendingId}, {$push: {friends: req.body.destId}}, (err) => {
                if(!err){
                    User.findOneAndUpdate({_id: req.body.pendingId}, {$pull: {friendRequests: req.body.destId}}, (err) => {
                        if(!err){
                            User.findOneAndUpdate({_id: req.body.destId}, {$pull: {friendRequests: req.body.pendingId}}).exec()
                            return res.send({success: true})
                        }
                        else{
                            return res.send({success: false})
                        }
                    })
                }
                else {
                    return res.send({success: false})
                }
            })}
        else {
            return res.send({success: false})
        }
    })
}

// function to fetch friends from the logged-in user. It returns the user documents, which are the friends of the logged-in user. 
exports.fetchFriends = (req, res) => {
    User.find().where('_id').in(req.body.friends).exec((err, users) => {
        var count = users;
        if(!err || count.length != 0){
            return res.send({friends: users, success: true})
        }
        else{
            return res.send({success: true})
        }
    })
}