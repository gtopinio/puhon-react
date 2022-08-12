import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

import "./Feed.css"

import AdsList from './AdsList';
import RequestList from "./RequestList";
import FriendsList from './FriendsList';

const Ads = [
  {link: "ad-juice.jpg", id: 1},
  {link: "ad-toothpaste.jpg", id: 2},
  {link: "ad-pizza.jpg", id: 3},
  {link: "ad-juice.jpg", id: 4},
  {link: "ad-toothpaste.jpg", id: 5},
  {link: "ad-pizza.jpg", id: 6}
];

// This component is for the friend request page of the user.

export default class FriendRequests extends Component {

    constructor(props){
        super(props);


        this.state = {
            checkIfLoggedIn: false,
            isLoggedIn: null,
            userFirstName: JSON.parse(localStorage.getItem("userFirstName")),
            userLastName: JSON.parse(localStorage.getItem("userLastName")),
            userId: null,
            friendsArray: [],
            requestsArray: []
        }

        this.logout = this.logout.bind(this)
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
                this.setState({ checkIfLoggedIn: true, isLoggedIn: true, userFirstName: JSON.parse(localStorage.getItem("userFirstName")), userLastName: JSON.parse(localStorage.getItem("userLastName"))}, 
                function(){
                    const user = {
                        firstName: this.state.userFirstName,
                        lastName: this.state.userLastName
                    }
                    
                    fetch(
                        // send a POST request to localhost: 3001/find-user-by-id to fetch the logged-in user document
                        "http://localhost:3001/find-user-by-id",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json" 
                            },
                            body: JSON.stringify(user),
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
                                                    this.setState({friendsArray: body.friends})
                                                }
                                            });

                                    const userId = {
                                        userId: this.state.userId
                                    }
            
                                    fetch(
                                        // send a POST request to localhost: 3001/friend-requests to fetch friend requests from logged-in user
                                        "http://localhost:3001/friend-requests",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json" 
                                            },
                                            body: JSON.stringify(userId),
                                        })
                                        .then(response => response.json())
                                        .then(body => {
                                            if(body.success){
                                                const user = body.user
                                                const idList = {
                                                    requestIds: user[0]['friendRequests']
                                                }
                                                fetch(
                                                    // send a POST request to localhost: 3001/get-friend-requests to fetch user documents from the friend requests of the logged-in user
                                                    "http://localhost:3001/get-friend-requests",
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json" 
                                                        },
                                                        body: JSON.stringify(idList),
                                                    })
                                                    .then(response => response.json())
                                                    .then(body => {
                                                        if(body.success) {this.setState({ requestsArray: body.friendRequests})}
                                                        else { alert("Failed to show friend requests"); }
                                                    });
                                            }
                                        });
                                })
                            }
                        });

                        

                });

            } else {
                this.setState({ checkIfLoggedIn: true, isLoggedIn: false });
            }
        })
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
                                <Link to="/feed">Home</Link>
                                <a href={"#"+this.state.userFirstName+" "+this.state.userLastName}>{this.state.userFirstName+" "+this.state.userLastName}</a>
                                <Link to="/search-user">Search Users</Link>
                                <Link to="/friend-requests" className="active">Friend Requests</Link>
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
                            <div>
                            <RequestList data={[this.state.requestsArray, this.state.userId]} />
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