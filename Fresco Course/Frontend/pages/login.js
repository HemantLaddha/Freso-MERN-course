import React, { Component } from "react";

class Login extends Component {
    state = {
        name: "",
        password: "",
    };

    // onMounting token stored in localStorage should be removed

    handleChange = (e) => {
        // code goes here to handle onChange event for input fields
        this.setState({ [e.target.name]: e.target.value });
    };

    loginRequest = async () => {
        // code goes here to return the response after hitting login api
        const response = await fetch("/api/admin/login", {
            body: JSON.stringify({ 
                name: this.state.name, 
                password: this.state.password 
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            method: "post",
        });

        return await response.json();
    };

    handleLogin = async () => {
        // handles login button
        // based on the login response, token should be set in local storage or alert displayed
        const res = await this.loginRequest();

        if (res.status === 200) {
            localStorage.clear();
            localStorage.setItem("token", res.token);
        } else {
            alert("Please enter a valid credentials");
        }
    };

    render() {
        return (
            <div className="login">
                <h1>Login</h1>
                
                {/* code goes here to display input field to get name and password */}
                <input 
                    type="text" 
                    name="name" 
                    value={this.state.name} 
                    onChange={this.handleChange} 
                />

                <input 
                    type="password" 
                    name="password" 
                    value={this.state.password} 
                    onChange={this.handleChange} 
                />

                <button 
                    disabled={this.state.name === "" || this.state.password === ""} 
                    onClick={this.handleLogin}
                >
                    Login
                </button>
            </div>
        );
    }
}

export default Login;