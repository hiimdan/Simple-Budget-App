import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }

    navExpand = e => {
        if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
            this.setState({expanded: !this.state.expanded});
        }
    }

    render() {
        const {isAuth, logout, username, theme} = this.props;

        let classes = this.state.expanded ? 'minimized expanded' : 'minimized';
        if (theme.name === 'purple') {
            classes+= ' purpleNav';
        } else if (theme.name === 'dark') {
            classes+= ' darkNav';
        }
        let greeting = 'BudgetApp';
        if (isAuth && username) {
            greeting = /s$/i.test(username) ? username + "' budget" : username + "'s budget";
        }

        let navClass = isAuth ? 'nav_auth' : '';

        return (
            <nav style={{background: theme.main, color: theme.headerFont}}>
                <div id="nav_header" className={navClass}>
                    {isAuth && 
                        <div onClick={this.navExpand} onKeyDown={this.navExpand} id="nav_menu" role="button" tabIndex="0" aria-haspopup="menu" aria-expanded="false"><i className="fas fa-bars" id="hamburger_menu"></i></div>
                    }
                    <div style={{fontWeight: 'bold'}} className="username">{greeting}</div>
                    <div style={{fontWeight: 'bold'}} className="navShrink">budgetApp</div>
                </div>
                {!isAuth &&
                    <ul className="navLinks notAuth">
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </ul>
                }
                {isAuth &&
                    <div className={classes}>
                        <ul className="navLinks auth">
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/transactions">Transactions</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                            <li id="logoutbutton" onClick={logout}><a href="#"><i class="fas fa-power-off" id="logout_icon"></i>Logout</a></li>
                        </ul>
                    </div>
                }
            </nav>
        )
    }
    
}

export default Navbar;