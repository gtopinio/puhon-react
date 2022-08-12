import React from "react";

// This component is for 'posts' in the main content area. Posts have a timestamp, post author, and the content. It also has a dummy profile picture of the post author.

function refreshPage() {
    window.location.reload(false);
}

class PostList extends React.Component {

    constructor(props){
        super(props);


        this.state = {
            edit: false,
            editId: null,
            editDetails: null,
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.deletePost = this.deletePost.bind(this)
        this.editPost = this.editPost.bind(this)
    }

    // handles the state of the edit section of a post
    editPost = id => e =>{
        this.setState({edit: !this.state.edit, editId: id})
    }

    // handles the new details of a post
    handleEdit(e){
        e.stopPropagation();
        this.setState({ editDetails: e.target.value})
    }

    // handles the deletion of a post
    deletePost = id => event =>{
        event.preventDefault();

        const post = {
            deletePost: id
        }
        
        // send a POST request to localhost: 3001/delete-post to remove a post
        fetch(
            "http://localhost:3001/delete-post",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(post),
            })
            .then(response => response.json())
            .then(body => {
                if(body.success) { alert("Successfully deleted post"); refreshPage()}
                else { alert("Failed to delete post"); }
            });
    }

    render(){
        const posts = this.props.data[0]
        if(!posts){
            return(
                <div>
                </div>
            )
        }
        else{
            return(
                <div>{
                posts.map((post, index) => {
                    return(
                        <div className="Content-segment" key={index}>
                            <img src={process.env.PUBLIC_URL + "/malePic.jpg"} alt="profile-pic" className="profile-pic"/>
                            <h2>{post.authorFirstName} {post.authorLastName}</h2> 
                        <h5 className="Date">Date: {new Date(post.createdAt).toISOString().substring(0,10)}</h5>
                            <p className="Post-content">
                                {post.content}
                            </p>
                            {this.props.data[1] === post.authorFirstName ? <button id="edit-post-button" onClick={this.editPost(post._id)}>Edit Post</button> : <div></div>} 
                            {this.props.data[1] === post.authorFirstName ? <button id="delete-post-button" onClick={this.deletePost(post._id)}>Delete Post</button> : <div></div>}
                            {this.state.edit && this.props.data[1] === post.authorFirstName && this.state.editId === post._id
                            ? <div>
                                <textarea id="create-edit-area" rows="3" cols="108" placeholder="Enter new post details" maxLength="110" value={this.state.editDetails == null ? "" : this.state.editDetails} onChange={this.handleEdit}></textarea>
                                <button id="create-edit-button" onClick={(e) => 
                                    {this.state.editDetails === "" || this.state.editDetails === null
                                    ? alert("Please enter non-empty post") 
                                    : e.preventDefault();

                                    const post = {
                                        postId: this.state.editId,
                                        content: this.state.editDetails
                                    }
                                    // send a POST request to localhost: 3001/edit-post
                                    fetch(
                                        "http://localhost:3001/edit-post",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json" 
                                            },
                                            body: JSON.stringify(post),
                                        })
                                        .then(response => response.json())
                                        .then(body => {
                                            if(body.success) { alert("Successfully edited the post"); refreshPage()}
                                            else { alert("Failed to edit post"); }
                                        });
                                    
                                    }}>Update Post</button>
                                </div>
                            : 
                            <div></div>
                        }
                        </div>
                    );
                })
            }
                </div>
              );
        }
    }
}

export default PostList;

// References:
//      onClick function on React Component:
//          https://stackoverflow.com/a/33846760
//      refresh a page or component in React:
//          https://upmostly.com/tutorials/how-to-refresh-a-page-or-component-in-react