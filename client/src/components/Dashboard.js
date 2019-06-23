import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Budget from './dashboard/Budget';
import SetTransaction from './dashboard/SetTransaction';
import SetBudget from './dashboard/SetBudget';
import Loading from './Loading';
import getCurrentMonth from '../modules/getCurrentMonth';
import EditBudget from './dashboard/EditBudget';
import Pie from './dashboard/Pie';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleMainView: true,
            toggleActions: false,
            setTransaction: false,
            setBudget: false,
            editBudget: false,
            editBudgetData: ''
        }
    }

    componentDidMount() {
        window.addEventListener('click', this.toggleActions, false);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.toggleActions, false);
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.state.setBudget && !prevState.setBudget) || (this.state.setTransaction && !prevState.setTransaction)) {
            setTimeout(() => this.setState({toggleActions: false}), 30);
        }
    }

    setTransaction = e => {
        if (this.state.setTransaction && 
            (e.target.classList.contains('modal_div') || e.currentTarget.id === 'closeDialog')) {
            this.setState({setTransaction: false});
        } else if (!this.state.setTransaction) {
            e.preventDefault();
            this.setState({setTransaction: true});
        }
    }

    setBudget = e => {
        if (this.state.setBudget && 
            (e.target.classList.contains('modal_div') || e.currentTarget.id === 'closeDialog')) {
            this.setState({setBudget: false});
        } else if (!this.state.setBudget) {
            this.setState({setBudget: true});
        }
    }

    toggleEditBudget = data => {
        if (this.state.editBudget &&
            (data.target === data.currentTarget || data.currentTarget.id === 'closeDialog')) {
            this.setState({editBudget: false});
        } else if (!this.state.editBudget) {
            this.setState({editBudget: true, editBudgetData: data});
        }
    }

    toggleView = e => {
        if (e.target.id === 'main') {
            this.setState({toggleMainView: true});
        } else if (e.target.id === 'pie') {
            this.setState({toggleMainView: false});
        }
    }


    toggleActions = e => {
        if (!e.target.classList.contains('action') && this.state.toggleActions) {
            this.setState({toggleActions: false});
        } else if (e.target.classList.contains('dash_btn') && !this.state.toggleActions) {
            this.setState({toggleActions: true});    
        }
    }

    render() {
        const { data, isAuth, addBudget, editBudget, removeBudget, addTransaction, loading, theme } = this.props;

        const leftButton = this.state.toggleMainView ? theme.dashToggle.primary : theme.dashToggle.secondary;
        const rightButton = this.state.toggleMainView ? theme.dashToggle.secondary : theme.dashToggle.primary;
        const toggleFont = theme.name === 'dark' ? 'white' : 'black';
        const btnClass = this.state.toggleActions ? 'button_actions move_up' : 'button_actions';
        const btnShow = data && data.budgets.length ? {visibility: 'visible'} : {visibility: 'hidden'};
        const btnFont = theme.name === 'purple' || theme.name === 'dark' ? 'white' : 'black';
        const btnColor = theme.name === 'dark' ? '#2d6ed4ad' : theme.main;
        const isOver = data && data.totalSpent >= data.totalBudget ? 'red' : theme.mainFont;
        const context = this.state.toggleMainView ? 'budget' : 'spending';

        if (loading) {
            return <Loading />
        } else {
            if (isAuth) {
                return (
                    <div className="main_container" style={{background: theme.background}}>
                        <div id="dash_container">
                            {data &&
                                <div>
                                    <h1 className="greeting" style={{color: theme.mainFont}}>{`Your ${context} for ${getCurrentMonth().monthName}`}</h1>
                                    <div>
                                        <div className="dash_toggle_container" onClick={this.toggleView}>
                                            <div className="toggleDiv" id="main" style={{background: leftButton, color: toggleFont}}>Main</div>
                                            <div className="toggleDiv" id="pie" style={{background: rightButton, color: toggleFont}}>Pie</div>
                                        </div>
                                    </div>
                                    {this.state.toggleMainView &&
                                        <div className="budget_container">
                                            {data.budgets.map(b => <Budget key={b._id} {...b} toggleEdit={this.toggleEditBudget} theme={theme} />)}
                                        </div>
                                    }
                                    {!this.state.toggleMainView &&
                                        <Pie totalSpent={data.totalSpent} budgets={data.budgets} theme={theme} />
                                    }
                                    <div className="totalBudget" style={{color: theme.mainFont}}><span style={{color: isOver}}>{'$' + data.totalSpent}</span>{' spent out of your budget of $' + data.totalBudget}</div>
                                </div>
                            }
                            {!data &&
                                <div>
                                    <h2 style={{textAlign: 'center'}}>Looks like you haven't added any categories or transactions yet!</h2>
                                </div>
                            }
                            {this.state.setTransaction &&
                                <SetTransaction toggle={this.setTransaction} addTransaction={addTransaction} data={data}/>
                            }
                            {this.state.setBudget &&
                                <SetBudget toggle={this.setBudget} addBudget={addBudget} data={data}/>
                            }
                            {this.state.editBudget &&
                                <EditBudget 
                                    data={this.state.editBudgetData} 
                                    toggle={this.toggleEditBudget} 
                                    editBudget={editBudget} 
                                    removeBudget={removeBudget} 
                                    budgetRemoved={() => this.setState({editBudget: false})} />
                            }
                            <div className="btn_row">
                                <div className="action_btn_container">
                                    <button className="dash_btn" style={{color: btnFont, background: btnColor}}>Add</button>
                                    <div className="button_actions_container">
                                        <div className={btnClass}>
                                            <div onClick={this.setTransaction} onKeyDown={this.setTransaction} className="action" role="button" tabIndex="0" style={btnShow}>New transaction</div>
                                            <div onClick={this.setBudget} onKeyDown={this.setBudget} className="action" role="button" tabIndex="0">New budget</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                
            } else {
                return <Redirect to="/login" />
            }
        }
        
    }
}

export default Dashboard;