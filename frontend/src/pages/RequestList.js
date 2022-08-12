import React from "react";

import "./RequestList.css"


// function to refresh the page after an update of data
function refreshPage() {
    window.location.reload(false);
}

// This component is for the friend request sections of the friend requests page.

class RequestList extends React.Component {

    constructor(props){
        super(props);

        this.addFriend = this.addFriend.bind(this)
    }

    // handles the confirm friend feature
    addFriend = (source, destination) => e => {
        const user = {
            pendingId: source,
            destId: destination
        }
    
        fetch(
            // send a POST request to localhost: 3001/confirm-friend to handle friend request confirmation
            "http://localhost:3001/confirm-friend",
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
                    alert("Successfully confirmed friend!")
                    refreshPage();
                }
                else {
                    alert("Confirm friend request unsuccessful!")
                }
            });
    }

    // handles the remove friend request feature
    removeRequest = (source, destination) => e => {
        const user = {
            pendingId: source,
            destId: destination
        }
    
        fetch(
            // send a POST request to localhost: 3001/remove-request to delete the friend requests from the logged-in users array of friend requests
            "http://localhost:3001/remove-request",
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
                    alert("Successfully remove request!")
                    refreshPage();
                }
                else {
                    alert("Delete friend request unsuccessful!")
                }
            });
    }

    render(){
        const users = this.props.data[0]
        if(!users){
            return(
                <div>
                </div>
            )
        }
        else{
            return(
                <div>{
                    users.map((user, index) => {
                    return(
                        <div className="r-User-segment" key={index}>
                            <img src={process.env.PUBLIC_URL + "/malePic.jpg"} alt="profile-pic" className="profile-pic"/>
                            <h2>{user.firstName} {user.lastName}</h2> 
                            <h3>{user.email}</h3>
                            {this.props.data[1] === user._id ?  <div></div> : <button id="r-add-friend-button" onClick={this.addFriend(this.props.data[1], user._id)}>Add friend</button>}
                            {this.props.data[1] === user._id ?  <div></div> : <button id="r-remove-request-button" onClick={this.removeRequest(this.props.data[1], user._id)}>Remove Request</button>}
                        </div>
                    );
                })
            }
                </div>
              );
        }
    }
}

export default RequestList;