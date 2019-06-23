import React, { Component} from 'react';

class DeletePrompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            incorrectPassword: false,
            error: false
        }
    }

    handleChange = e => {
        this.setState({password: e.target.value, incorrectPassword: false, error: false});
    }

    handleSubmit = e => {
        e.preventDefault();
        fetch('/auth/deleteaccount', {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: this.state.password})
        })
        .then(response => {
            if (response.ok) {
              this.props.accountDelete();  
            } else {
                this.setState({incorrectPassword: true})
            }
        })
        .catch(e => {
            this.setState({error: true});
        })
    }

    render() {
        const { cancelDelete } = this.props;
        return (
            <div className="modal_div" onClick={cancelDelete}>
                <div className="delete_prompt">
                    <p>Confirm Account Deletion</p>
                    <hr />
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Password:
                            <input
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                            onChange={this.handleChange}
                            value={this.state.password}
                            required />
                        </label>
                        
                    </form>
                    <div>
                        <button onClick={cancelDelete} id="cancelDeleteAccount">Cancel</button>
                        <button onClick={this.handleSubmit} id="confirmDeleteAccount">Delete Account</button>
                    </div>
                    {this.state.incorrectPassword &&
                        <div className="popup_error">Incorrect Password</div>
                    }
                    {this.state.error &&
                        <div className="popup_error">An unknown error occurred</div>
                    }
                </div>
            </div>
        )
    }
}

export default DeletePrompt;