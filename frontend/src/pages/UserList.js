import React from "react";

import "./UserList.css"

// This component is for the list of users being searched by the logged-in user

class UserList extends React.Component {

    constructor(props){
        super(props);

        this.addFriend = this.addFriend.bind(this)
    }

    // handles the send friend request feature
    addFriend = (source, destination) => e => {
        const user = {
            pendingId: source,
            destId: destination
        }
    
        fetch(
            "http://localhost:3001/add-friend",
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
                    alert("Successfully added friend!")
                }
                else {
                    alert("Error: already sent request or already your friend!")
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
                        <div className="User-segment" key={index}>
                            <img src={process.env.PUBLIC_URL + "/malePic.jpg"} alt="profile-pic" className="profile-pic"/>
                            <h2>{user.firstName} {user.lastName}</h2> 
                            <h3>{user.email}</h3>
                            {this.props.data[1] === user._id ?  <div></div> : <button id="add-friend-button" onClick={this.addFriend(this.props.data[1], user._id)}>Add friend</button>}
                        </div>
                    );
                })
            }
                </div>
              );
        }
    }
}

export default UserList;