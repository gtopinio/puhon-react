import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// This component is for the social media home page of the web app.

export default class Home extends Component{

    render() {
        return (
            <div>
                <img src={process.env.PUBLIC_URL + "/PuhonReact_BG.png"} alt="home_bg" className="home-bg"/>
                <div>
                    <h1 style={{ fontFamily: "Ruthie"}} className="puhon-header">Puhon React</h1>
                    <Link to="/sign-up" className="s-btn" style={{ fontFamily: "Courgette"}}>Sign-Up</Link><br/>
                    <Link to="/log-in" className="l-btn" style={{ fontFamily: "Courgette"}}>Log-In</Link>
                </div>
          </div>
        );
    }
}

// References:
// Link Component: https://stackoverflow.com/a/58198328
// Custom font-style: https://stackoverflow.com/a/53229594
//
// To my beloved Jewel