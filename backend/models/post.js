// This file contains the database model for a Post.
// A Post has an author id, author's first name, author's last name, and a content

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    authorId: {type: String, required: true},
    authorFirstName: {type: String, required: true},
    authorLastName: {type: String, required: true},
    content : {type: String, required: true},
}, {
    timestamps: true
});


module.exports = mongoose.model("Post", PostSchema);