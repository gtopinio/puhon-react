import React, { Component } from "react";
import SignUpInput from "./SignUpInput";
import { Link } from "react-router-dom";
import "./SignUp.css"

// Function for form validation
function formValidate(fname, lname, email, password, rePassword, ){
    const errors = [];

    var regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    var testPass = regPass.test(password);

    if(fname.length === 0){
        errors.push("First name cannot be empty");
    }
    if(lname.length === 0){
        errors.push("Last name cannot be empty");
    }
    if (email.split("").filter(x => x === "@").length !== 1) {
        errors.push("Email should contain a @");
      }
    if (email.indexOf(".") === -1) {
        errors.push("Email should contain at least one dot");
    }
    if (password.length === 0) {
        errors.push("Password should not be empty");
    }
    if (!testPass && password.length > 0) {
        errors.push("Please follow the password syntax");
    }
    if (rePassword.length === 0 && password.length > 0) {
        errors.push("Please retype your password");
    }
    if (rePassword !== password) {
        errors.push("Please match your password");
    }
    return errors
}

// This component is for the sign up page of the web app.

export default class SignUp extends Component {
    constructor(props){
        super(props)

        this.state = {
            fname:"",
            lname:"",
            email:"",
            password: "",
            rePassword:"",
            passwordError:"",
            rePasswordError:"",
            errors:"",
        }
        
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleRePasswordChange = this.handleRePasswordChange.bind(this)
        this.handleFNameChange = this.handleFNameChange.bind(this)
        this.handleLNameChange = this.handleLNameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handleSignUp = this.handleSignUp.bind(this)

    }

    // Handles the values for the First Name field
    handleFNameChange(e){
        this.setState({fname: e.target.value})
    }
    // Handles the values for the Last Name field
    handleLNameChange(e){
        this.setState({lname: e.target.value})
    }
    // Handles the values for the Email field
    handleEmailChange(e){
        this.setState({email: e.target.value})

    }
    // Handles the values for the Password field
    handlePasswordChange(e){
        this.setState({password: e.target.value})

        var pass = e.target.value
        // The regex below requires these:
        /*
            At least 8 characters,
            A digit,
            An uppercase letter,
            A lowercase letter
        */
        var reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        var test = reg.test(pass);
        this.setState({passwordError: test})
    }
    // Handles the values for the Repeat Password field
    handleRePasswordChange(e){
        this.setState({rePassword: e.target.value})

        var pass = this.state.password
        var rePass = e.target.value
        if((!pass && !rePass) || (pass !== rePass)){
            this.setState({rePasswordError: true})
        }
        else{
            this.setState({rePasswordError: false})
        }
    }

    handleSignUp(event){
        const errors = formValidate(this.state.fname, this.state.lname, this.state.email, this.state.password, this.state.rePassword)

        if(errors.length > 0){
            this.setState({errors})
            event.preventDefault();
        }
        else { // If validation is successful, create a User based on the input details
            event.preventDefault();
            
            const user = {
                firstName: document.getElementById("s-fname").value,
                lastName: document.getElementById("s-lname").value,
                email: document.getElementById("s-email").value,
                password: document.getElementById("s-password").value
            }
            
            // send a POST request to localhost: 3001/sign-up
            fetch(
                "http://localhost:3001/sign-up",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(user),
                })
                .then(response => response.json())
                .then(body => {
                    if(body.success) { alert("Successfully saved user"); }
                    else { alert("Failed to save user"); }
                });

            this.setState ({
                fname:"",
                lname:"",
                email:"",
                password: "",
                rePassword:"",
                passwordError:"",
                rePasswordError:"",
                errors:"",
                loggedIn: null
            })
        }
    }

    render() {
        return(
        <div>
            <img src={process.env.PUBLIC_URL + "/PuhonReact_BG.png"} alt="home_bg" className="home-bg"/>
            <div>
            <form id="s-formData" name="s-formData" align="center">
                <fieldset id="s-formField">
                    <legend style={{ fontFamily: "Courgette"}}>Sign-Up</legend>
                        <SignUpInput id={"s-fname"} type={"text"} value={this.state.fname} changeHandler={this.handleFNameChange} placeholder={"First name"} /><br/>
                        <SignUpInput id={"s-lname"} type={"text"} value={this.state.lname} changeHandler={this.handleLNameChange} placeholder={"Last name"}/><br/>
                        <SignUpInput id={"s-email"} type={"email"} value={this.state.email} changeHandler={this.handleEmailChange} placeholder={"Email"}/><br/>
                        <SignUpInput id={"s-password"} 
                        type={"password"} value={this.state.password}
                        changeHandler={this.handlePasswordChange} placeholder={"Password"}/>
                            <div>{this.state.password && this.state.passwordError === false ? "Password invalid (Needs 8 characters at least, 1 number, 1 lowercase, 1 uppercase)" : ""}</div><br/>
                        <SignUpInput id={"s-rePassword"} type={"password"} value={this.state.rePassword} changeHandler={this.handleRePasswordChange} disabled={!this.state.password} placeholder={"Re-type your password"}/>
                            <div>{this.state.rePassword && this.state.rePasswordError === true ? "Password does not match" : ""}</div><br/><br/>
                        <button type="submit" id="submit" onClick={this.handleSignUp} style={{ fontFamily: "Courgette"}}>Sign-Up</button><br></br><br></br>
                        <Link to="/" className="h-btn" style={{ fontFamily: "Courgette"}}>Back to Home</Link>
                        {this.state.errors.length > 0 ? this.state.errors.map(error => (
                                <p key={error}>Error: {error}</p>
                                )) : <p></p>}
                </fieldset>
            </form>
            </div>
        </div>
        );
    }
}