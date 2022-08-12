import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

import "./Feed.css"

import FriendsList from './FriendsList';
import PostList from './PostList';
import AdsList from './AdsList';

const Ads = [
  {link: "ad-juice.jpg", id: 1},
  {link: "ad-toothpaste.jpg", id: 2},
  {link: "ad-pizza.jpg", id: 3},
  {link: "ad-juice.jpg", id: 4},
  {link: "ad-toothpaste.jpg", id: 5},
  {link: "ad-pizza.jpg", id: 6}
];

// function to refresh the page after an update
function refreshPage() {
    window.location.reload(false);
}

// This component is for the social media feed of the logged-in user.

export default class Feed extends Component {

    constructor(props){
        super(props);


        this.state = {
            checkIfLoggedIn: false,
            isLoggedIn: null,
            userFirstName: JSON.parse(localStorage.getItem("userFirstName")),
            userLastName: JSON.parse(localStorage.getItem("userLastName")),
            postValue: "",
            postArray: [],
            userId: null,
            friendsArray: []
        }

        this.logout = this.logout.bind(this)
        this.handlePostChange = this.handlePostChange.bind(this)
        this.handlePostSubmit = this.handlePostSubmit.bind(this)
    }

    componentDidMount() {
        // Send POST request to check if user is logged-in
        fetch("http://localhost:3001/checkIfLoggedIn",
        {
            method: "POST",
            credentials: "include"
        })
        .then(response => response.json())
        .then(body => {
            if(body.isLoggedIn){
                this.setState({ checkIfLoggedIn: true, isLoggedIn: true, userFirstName: JSON.parse(localStorage.getItem("userFirstName")), userLastName: JSON.parse(localStorage.getItem("userLastName"))});
            } else {
                this.setState({ checkIfLoggedIn: true, isLoggedIn: false });
            }
            
        })

        const fetchUser = {
            firstName: this.state.userFirstName,
            lastName: this.state.userLastName,
        }

        fetch(
            // send a POST request to localhost: 3001/find-user-by-id to fetch the logged-in user document
            "http://localhost:3001/find-user-by-id",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(fetchUser),
            })
            .then(response => response.json())
            .then(body => {
                if(body.success){
                    const user = body.user
                    this.setState({userId: user[0]['_id']}, function(){
                        const friends = {
                            friends: user[0]['friends']
                        }
                
                        fetch(
                            // send a POST request to localhost: 3001/fetch-friends to fetch friend documents from logged-in user
                            "http://localhost:3001/fetch-friends",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json" 
                                },
                                body: JSON.stringify(friends),
                            })
                            .then(response => response.json())
                            .then(body => {
                                if(body.success){
                                    this.setState({friendsArray: body.friends}, function(){

                                        const userPosts = this.state.friendsArray.map(user => user._id)
                                        userPosts.push(this.state.userId)
                                        const postList = {
                                            users: userPosts
                                        }
                                        // send a POST request to localhost: 3001/get-posts to fetch posts from user and their friends
                                        fetch(
                                            "http://localhost:3001/get-posts",
                                            {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json" 
                                                },
                                                body: JSON.stringify(postList),
                                            })
                                            .then(response => response.json())
                                            .then(body => {
                                                this.setState({postArray: body.userPosts})})
                                    })
                                }
                            });
                    })}})

    }

    logout(e) {
        e.preventDefault();

        // Delete cookie with authToken
        const cookies = new Cookies();
        cookies.remove("authToken");

        // Delete userFirstName and userLastName in local storage
        localStorage.removeItem("userFirstName");
        localStorage.removeItem("userLastName");

        this.setState({ isLoggedIn: false });
    }

    handlePostChange(e){
        this.setState({ postValue: e.target.value })
    }

    handlePostSubmit(event){
        if(this.state.postValue === ""){
            alert("Please enter a non-empty post");
            event.preventDefault();
        }
        else { // If validation is successful, create a Post based on the input details
            event.preventDefault();
            
            const post = {
                userId: this.state.userId,
                userFirstName: this.state.userFirstName,
                userLastName: this.state.userLastName,
                content: this.state.postValue
            }
            
            // send a POST request to localhost: 3001/user-post to save the post
            fetch(
                "http://localhost:3001/user-post",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(post),
                })
                .then(response => response.json())
                .then(body => {
                    if(body.success) { alert("Successfully saved post"); refreshPage()}
                    else { alert("Failed to save post"); }
                });

            this.setState ({
                postValue: ""
            })
        }
    }

    render() {
        if(!this.state.checkIfLoggedIn) {
            //delay redirect/render
            return(<div></div>);
        }

        else {
            if(this.state.isLoggedIn){
                //render the page

                return(
                    <div>
                        <div className="Feed">
                        <header className="Feed-header">
                            <h1 className="Header-title">
                            PuhonReact
                            </h1>
                            <nav className="NavBar">
                                <Link to="/feed" className="active">Home</Link>
                                <a href={"#"+this.state.userFirstName+" "+this.state.userLastName}>{this.state.userFirstName+" "+this.state.userLastName}</a>
                                <Link to="/search-user">Search Users</Link>
                                <Link to="/friend-requests">Friend Requests</Link>
                            </nav>
                            <div>
                                <button id="logout" onClick={this.logout}>Log Out</button>
                            </div>
                        </header>
                        <div className="Friends-list">
                            <div className="Friends-title">
                            Friends: 
                            </div>
                            <FriendsList data={this.state.friendsArray} />
                        </div>
                        <div className="Ads">
                            <AdsList data={Ads} />
                        </div>
                        <main className="Main-content">
                            <section className="create-post-segment">
                                <div>
                                    <img src={process.env.PUBLIC_URL + "/malePic.jpg"} alt="profile-pic" className="profile-pic"/>
                                </div>
                                <textarea id="create-post-area" rows="4" cols="122" placeholder={"Express your thoughts, " + this.state.userFirstName + " " + this.state.userLastName + "!"} value={this.state.postValue} onChange={this.handlePostChange} maxLength="150"></textarea>
                                <button id="create-post-button" onClick={this.handlePostSubmit}>Post</button>
                            </section>

                            <div>
                                <PostList data = {[this.state.postArray, this.state.userFirstName]}/>
                            </div>
                        </main>
                        </div>
                    </div>
                )
            }

            else {
                //redirect
                return <Navigate to = "/log-in"/>
            }
        }
    }
}