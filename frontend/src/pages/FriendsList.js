import React from "react";

// This component is for listing 'friends' beside the social media feed.

class FriendsList extends React.Component {

    render() {
        const friends = this.props.data;

        return(
          <ul>
              {
              friends.map((friends, index) => {
                  return <li key={index} className="Friend">{friends.firstName} {friends.lastName}</li>
              })
            }
          </ul>  
        );
    }

}

export default FriendsList;