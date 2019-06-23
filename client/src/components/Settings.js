import React, { Component } from 'react';
import Loading from './Loading';
import { Redirect } from 'react-router-dom';
import Theme from './settings/Theme';
import ChangePassword from './settings/ChangePassword';
import DeleteAccount from './settings/DeleteAccount';
import DeletePrompt from './settings/DeletePrompt';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDelete: false,
        }
    }

    saveTheme = cb => {
        fetch('/api/settheme', {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.props.theme)
        })
        .then(response => {
            if (response.ok) {
                cb(null);
            } else {
                cb('error');
            }
        })
        .catch(e => cb(e));
    }

    toggleDelete = e => {
        if (e.target.classList.contains('modal_div') || e.target.id === 'cancelDeleteAccount') {
            this.setState({showDelete: false});
        } else if (e.target.id === 'showDeleteBtn') {
            this.setState({showDelete: true});
        }
    }


    render() {
        const { isAuth, loading, theme, setTheme, accountDelete, accountReset } = this.props

        if (loading) {
            return <Loading />
        } else {
            if (isAuth) {
                return (
                    <div className="main_container" style={{background: theme.background}}>
                        <div className="settings_container">
                            <Theme theme={theme} setTheme={setTheme} saveTheme={this.saveTheme} />
                            <ChangePassword />
                            <DeleteAccount toggle={this.toggleDelete} />
                        </div>
                        {this.state.showDelete &&
                            <DeletePrompt cancelDelete={this.toggleDelete} accountDelete={accountDelete} />
                        }
                    </div>
                )
            } else if (accountReset) {
                return <Redirect to="/login" />
            } else {
                return <Redirect to="/login" />
            }
        }
    }
}

export default Settings;