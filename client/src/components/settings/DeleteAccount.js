import React, { Component } from 'react';

class DeleteAccount extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="settings_section delete_account">
                <h3 className="settings_heading">Delete Account</h3>
                <div className="settings_content">
                    <div>
                        <button id="showDeleteBtn" onClick={this.props.toggle}>Delete Account</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeleteAccount;