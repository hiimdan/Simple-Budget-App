import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Loading from './Loading';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: ''
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.username && this.state.password) {
            fetch('/auth/login', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: this.state.username, password: this.state.password})
            })
            .then(response => {
                if (response.ok) {
                    response.json()
                    .then(data => this.props.login(data))
                } else {
                    this.setState({error: 'incorrect username/password'});
                }
            })
            .catch(e => this.setState({error: 'an unknown error occured'}));
        }
    }

    render() {
        const error = this.state.error ? <label className='err_label'>{this.state.error}</label> : '';
        let registered;
        if (this.props.location.state) {
            if (this.props.location.state.referrer === '/register') {
                registered = true;
            }
        }
        if (this.props.loading) {
            return <Loading />
        } else {
            if (!this.props.isAuth) {
                return (
                    <div class="main_container" style={{background: 'linear-gradient(150deg, white, #b1d3e0fc)'}}>
                        <div className="auth_form">
                            <div>Login</div>
                            <form onSubmit={this.handleSubmit}>
                                <label for="username">Username:</label>
                                <br />
                                <input 
                                    type="text" 
                                    name="username"
                                    id="username" 
                                    value={this.state.username} 
                                    onChange={this.handleChange}
                                    required />
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
                                <button type="submit">Submit</button>
                                {error}
                            </form>
                            {registered && 
                                <p style={{textAlign: 'center'}}>Sucessfully registered! Please login</p>
                            }
                        </div>
                    </div>
                )
            } else {
                return (
                    <Redirect to='/dashboard' />
                )
            }
        }
        
        
    }
}


export default Login;