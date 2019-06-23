import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

const ErrLabel = props => <label className='err_label'>{props.message}</label>

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            passwordConfirm: '',
            error: '',
            success: false
        }
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });

        if ((name == 'password' || name == 'passwordConfirm') && this.state.error == 'password') {
            this.setState({error: ''})
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.password !== this.state.passwordConfirm) {
            this.setState({error: 'password'});
        } else {
            fetch('/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    username: this.state.username,
                    password: this.state.password,
                    passwordConfirm: this.state.passwordConfirm
                })
            })
            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(json => {
                        if (json.message === 'success') {
                            this.setState({success: true});
                        } else {
                            this.setState({error: 'username'});
                        }
                    })
                } else {
                    this.setState({error: 'other'});
                }
            })
            .catch(e => this.setState({error: 'other'}));
        }
    }

    render() {
        let userErr = this.state.error === 'username' ? <ErrLabel message='username is already taken' /> : '';
        let passErr = this.state.error === 'password' ? <ErrLabel message='passwords do not match' /> : '';
        let otherErr = this.state.error === 'other' ? <ErrLabel message='an unknown error occured' /> : '';

        if (!this.state.success) {
            return (
                <div className="main_container" style={{background: 'linear-gradient(150deg, white, #b1d3e0fc)'}}>
                    <div className="auth_form">
                        <div>Register</div>
                        <form onSubmit={this.handleSubmit}>
                            <label for="email">Email:</label>
                            <br />
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required />
                            <br />
                            <label for="username">Username:</label>
                            <br />
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={this.state.username}
                                onChange={this.handleChange}
                                required />
                            {userErr}
                            <br />
                            <label for="password">Password:</label>
                            <br />
                            <input 
                                type="password"
                                name="password"
                                id="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                required />
                            <br />
                            <label for="passwordConfirm">Confirm Password:</label>
                            <br />
                            <input 
                                type="password"
                                name="passwordConfirm"
                                id="passwordConfirm"
                                value={this.state.passwordConfirm}
                                onChange={this.handleChange}
                                required />
                            {passErr}
                            <button type="submit">Register</button>
                            {otherErr}
                        </form>
                    </div>
                </div>
            )
        } else {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {referrer: '/register'}
                }} />
            )
        }
    }
}

export default Register;