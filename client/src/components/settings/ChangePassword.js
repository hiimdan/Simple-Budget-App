import React, { Component } from 'react';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            newPassword: '',
            mismatchError: false,
            incorrectPassword: false,
            success: false,
            otherError: false
        }
    }

    handleChange = e => {
        let name = e.target.name;
        this.setState({[name]: e.target.value, otherError: false});
        if (name === 'password' || name === 'confirmPassword')  {
            this.setState({mismatchError: false, incorrectPassword: false});
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            this.setState({mismatchError: true, success: false});
        } else {
            fetch('/auth/changepassword', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: this.state.password,
                    confirmPassword: this.state.confirmPassword,
                    newPassword: this.state.newPassword
                })
            })
            .then(response => {
                if (response.ok) {
                    this.setState({
                        success: true,
                        otherError: false,
                        password: '',
                        confirmPassword: '',
                        newPassword: ''
                    })
                } else {
                    response.json()
                    .then(json => {
                        if (json.message === 'incorrect password') {
                            this.setState({incorrectPassword: true});
                        } else {
                            this.setState({otherError: true});
                        }
                    })
                }
            })
            .catch(e => {
                this.setState({otherError: true});
            });
        }
    }

    render() {
        return (
            <div className="settings_section change_password">
                <h3 className="settings_heading">Change Password</h3>
                <div className="settings_content">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form_group">
                            <label>
                                Current Password:
                                <br />
                                <input 
                                    type="password"
                                    name="password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    required />
                            </label>
                        </div>
                        <div className="form_group">
                            <label>
                                Confirm Password:
                                <br />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    onChange={this.handleChange}
                                    value={this.state.confirmPassword}
                                    required />
                            </label>
                        </div>
                        <div className="form_group">
                            <label>
                                New Password
                                <br />
                                <input
                                    type="password"
                                    name="newPassword"
                                    onChange={this.handleChange}
                                    value={this.state.newPassword}
                                    required />
                            </label>
                        </div>
                        <div className="save_settings">
                            <button>Save</button>
                        </div>
                    </form>
                    <div className="message_handling">
                        {this.state.mismatchError &&
                            <div className="popup_error" role="alert">Passwords do not match</div>
                        }
                        {this.state.incorrectPassword &&
                            <div className="popup_error" role="alert">Incorrect Password</div>
                        }
                        {this.state.success &&
                            <div className="success" role="alert">Password successfully changed</div>
                        }
                        {this.state.otherError &&
                            <div className="popup_error" role="alert">An unkwown error occurred</div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePassword;