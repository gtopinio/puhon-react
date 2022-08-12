import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

import "./Feed.css"
import "./SearchUser.css"

import AdsList from './AdsList';
import UserList from "./UserList";
import FriendsList from "./FriendsList";

const Ads = [
  {link: "ad-juice.jpg", id: 1},
  {link: "ad-toothpaste.jpg", id: 2},
  {link: "ad-pizza.jpg", id: 3},
  {link: "ad-juice.jpg", id: 4},
  {link: "ad-toothpaste.jpg", id: 5},
  {link: "ad-pizza.jpg", id: 6}
];

// This component is for the search user page of the social media app.

export default class SearchUser extends Component {

    constructor(props){
        super(props);


        this.state = {
            checkIfLoggedIn: false,
            isLoggedIn: null,
            userFirstName: JSON.parse(localStorage.getItem("userFirstName")),
            userLastName: JSON.parse(localStorage.getItem("userLastName")),
            userId: null,
            searchValue: null,
            searchArray: [],
            friendsArray: []
        }

        this.logout = this.logout.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    }

    // handles the value for the search text area
    handleSearchChange(e){
        this.setState({searchValue: e.target.value })
    }

    // handles the search request feature
    handleSearchSubmit(e){
        if(this.state.searchValue === ""){
            alert("Please enter a non-empty input");
            e.preventDefault();
        }
        else {
            const user = {
                name: this.state.searchValue
            }
            
            // send a POST request to localhost: 3001/search-user
            fetch(
                "http://localhost:3001/search-user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(user),
                })
                .then(response => response.json())
                .then(body => {
                    if(body.userList.length === 0){
                        alert("No user(s) found!")
                        this.setState({searchArray: []})
                    }
                    else{
                        alert("User(s) found!")
                        this.setState({searchArray: body.userList})
                    }
                });

        }
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
                                    });
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
                                <Link to="/search-user" className="active">Search Users</Link>
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
                            <section className="create-search-segment">
                                    <div>
                                        <img src={process.env.PUBLIC_URL + "/malePic.jpg"} alt="profile-pic" className="profile-pic"/>
                                    </div>
                                    <textarea id="create-search-area" rows="3" cols="122" placeholder="Ender the name of the user you're looking for!" value={this.state.searchValue} onChange={this.handleSearchChange} maxLength="150"></textarea>
                                    <button id="create-search-button" onClick={this.handleSearchSubmit}>Search</button>
                            </section>
                            <div>
                                <UserList data = {[this.state.searchArray, this.state.userId]}/>
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