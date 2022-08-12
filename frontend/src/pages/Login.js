import React, { Component } from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css"

// This component is for the login page for the user

export default class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            loggedIn: null,
        }

        this.login = this.login.bind(this)
    }

    login(e){
        e.preventDefault();

        const credentials = {
            email: document.getElementById("l-email").value,
            password: document.getElementById("l-password").value
        }

        // Send POST request
        fetch(
            "http://localhost:3001/log-in",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            })
            .then(response => response.json())
            .then(body => {
                if(!body.success) {alert("Failed to log-in"); }
                else{
                    // successful log-in. store the token as a cookie

                    const cookies = new Cookies();
                    cookies.set(
                        "authToken",
                        body.token,
                        {
                            path: "localhost:3001/",
                            age: 60*60,
                            sameSite: "lax"
                        }
                    );
                    localStorage.setItem("userFirstName", JSON.stringify(body.userFirstName));
                    localStorage.setItem("userLastName", JSON.stringify(body.userLastName));
                    this.setState({ loggedIn: true });
                    alert("Successfully logged-in");
                }
            })

    }

    render() {
        return(
            <div>
                <img src={process.env.PUBLIC_URL + "/PuhonReact_BG.png"} alt="home_bg" className="home-bg"/>
                <div>
                    <form id="l-formData" name="l-formData" align="center">
                        <fieldset id="l-formField">
                        <legend style={{ fontFamily: "Courgette"}}>Login</legend>
                            <input type="text" id="l-email" placeholder="Email"/><br/><br/>
                            <input type="password" id="l-password" placeholder="Password"/><br/><br/>
                            <button id="login" onClick={this.login} style={{ fontFamily: "Courgette"}}>Login</button><br></br><br></br>
                            <Link to="/" className="h-btn" style={{ fontFamily: "Courgette"}}>Back to Home</Link>
                            {this.state.loggedIn ? <Navigate to = "/feed"/> : <div></div>}
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}