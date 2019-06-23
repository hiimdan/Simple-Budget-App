import React, { Component } from 'react';
import uuid from 'uuid';

class SetBudget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            budgetName: '',
            budget: '',
            matchError: false,
            budgetError: false,
            submitted: false
        }
        this.focused = React.createRef();
    }

    componentDidMount() {
        this.focused.current.focus();
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
        if (this.state.matchError) {
            this.setState({matchError: false});
        }
        if (this.state.submitted) {
            this.setState({submitted: false});
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.props.data && this.props.data.budgets.length) {
            let match = false;
            this.props.data.budgets.forEach(b => {
                if (b.category === this.state.budgetName) {
                    match = true;
                }
            });
            if (match) {
                this.setState({budgetError: true});
                return;
            } 
        }

        let data = {
            _id: uuid.v4(),
            category: this.state.budgetName,
            budgetAmt: parseInt(this.state.budget)
        }

        fetch('/api/addbudget', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(response => {
            if (response.ok) {
                this.setState({
                    budgetName: '',
                    budget: '',
                    submitted: true,
                    budgetError: false
                });
                this.props.addBudget(data);
            } else {
                this.setState({budgetError: true})
            }
          })
          .catch(e => {
            this.setState({budgetError: true});
          });

    }

    render() {
        return (
            <div onClick={this.props.toggle} className="modal_div">
                <div id="budget_add" className="create_popup">
                    <div className="close_icon">
                        <button aria-label="close modal" id="closeDialog" onClick={this.props.toggle}><i className="fa fa-times"></i></button>
                    </div>
                    <p>New Budget</p>
                    <div className="form_container">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form_group">
                                <label>
                                    Budget Name:
                                    <br />
                                    <input
                                        type="text"
                                        onChange={this.handleChange}
                                        value={this.state.budgetName}
                                        required
                                        maxLength="20"
                                        ref={this.focused}
                                        className="modal_input"
                                        name="budgetName" />
                                </label>
                                {this.state.matchError &&
                                    <div className="error_div" role="alert"><label style={{color: 'red', textAlign: 'center'}}>Budget Already exists</label></div>
                                }
                            </div>
                            <div className="form_group">
                                <label>
                                    Budget Amount:
                                    <br />
                                    <input
                                        type="number"
                                        onChange={this.handleChange}
                                        value={this.state.budget}
                                        required
                                        placeholder="$"
                                        min="1"
                                        className="modal_input dollar_input"
                                        name="budget" />
                                </label>
                            </div>
                            <button type="submit">Add Budget</button>
                            {this.state.submitted &&
                                <div className="success" style={{textAlign: 'center'}} role="alert">Added!</div>
                            }
                            {this.state.budgetError &&
                                <div className="error_div" role="alert">An unknown error occurred</div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SetBudget;