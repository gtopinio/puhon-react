const authController = require("./auth-controller");

module.exports = (app) => {

    app.post("/sign-up", authController.signUp);
    app.post("/log-in", authController.login);
    app.post("/checkifloggedin", authController.checkIfLoggedIn);
    app.post("/user-post", authController.userPost);
    app.post("/get-posts", authController.getPosts);
    app.post("/delete-post", authController.deletePost);
    app.post("/edit-post", authController.editPost);
    app.post("/search-user", authController.searchUser);
    app.post("/find-user-by-id", authController.findUserId);
    app.post("/add-friend", authController.addFriend);
    app.post("/remove-request", authController.removeRequest);
    app.post("/friend-requests", authController.getFriendRequests);
    app.post("/get-friend-requests", authController.getRequestsById);
    app.post("/confirm-friend", authController.confirmFriend);
    app.post("/fetch-friends", authController.fetchFriends);
}