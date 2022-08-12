import React from "react";

// This component is for the sign up input components sign up page.

function SignUpInput(props) {
    return(
        <div>
            {props.field}<input 
            id={props.id}
            type={props.type}
            value={props.value}
            onChange={props.changeHandler}
            disabled={props.disabled}
            placeholder={props.placeholder}
            required
            />
        </div> 
    );
}

export default SignUpInput