import React, { Component } from 'react';
import parseNum from '../../modules/parseNum';
import uuid from 'uuid';

class SetTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().toISOString().substring(0, 10),
            budgetSelect: 'default',
            transaction: '',
            numberError: false,
            submitError: false,
            submitted: false
        }
        this.focused = React.createRef();
    }

    componentDidMount() {
        this.focused.current.focus();
    }

    handleChange = e => {
        this.setState({[e.target.name]: e.target.value});
        if (this.state.numberError && e.target.name === 'transaction') {
            this.setState({numberError: false});
        }
        if (this.state.submitted) {
            this.setState({submitted: false});                                                                                              
        }
    }
    
    handleSubmit = e => {
        e.preventDefault();
        let num = parseNum(this.state.transaction);
        if (!num) {
            this.setState({numberError: true});
            return;
        }

        let data = {
            _id: uuid.v4(),
            date: this.state.date,
            category: this.state.budgetSelect,
            amount: num
        }

        fetch('/api/addtransaction', {
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
                    date: '',
                    budgetSelect: 'default',
                    transaction: '',
                    submitted: true,
                    submitError: false
                });

                this.props.addTransaction(data)
            } else {
                this.setState({submitError: true});
            }
          })
          .catch(e => {
            this.setState({submitError: true});
          });
    }

    render() {
        const { data } = this.props;
        return (
            <div onClick={this.props.toggle} className="modal_div">
                <div id="transaction_add" className="create_popup">
                    <div className="close_icon">
                        <button id="closeDialog" onClick={this.props.toggle} aria-label="close modal"><i className="fa fa-times"></i></button>
                    </div>
                    <p>New Transaction</p>
                    <div className="form_container">
                        <form onSubmit={this.handleSubmit}> 
                            <div className="form_group">
                                <label>
                                    Transaction Date:
                                    <br />
                                    <input 
                                        type="date" 
                                        onChange={this.handleChange} 
                                        value={this.state.date} 
                                        required 
                                        className="modal_input"
                                        ref={this.focused} 
                                        name="date" />
                                </label>
                            </div>
                            <div className="form_group">
                                <label>
                                    Budget Category:
                                    <br />
                                    <select onChange={this.handleChange} value={this.state.budgetSelect} required className="modal_input" name="budgetSelect">
                                        <option value="default" disabled>Select One</option>
                                        {data && data.budgets.map(b => {
                                            return <option key={b._id} value={b.category}>{b.category}</option>
                                        })}
                                    </select>
                                </label>
                            </div>
                            <div className="form_group">
                                <label>
                                    Transaction amount:
                                    <br />
                                    <input 
                                        type="text" 
                                        onChange={this.handleChange} 
                                        value={this.state.transaction} 
                                        placeholder="$" 
                                        required 
                                        className="dollar_input modal_input" 
                                        name="transaction" />
                                </label>
                            </div>
                            {this.state.numberError &&
                                <div className="popup_error" role="alert">Please enter a valid number</div>
                            }
                            <button type="submit">Add Transaction</button>
                            {this.state.submitted &&
                                <div className="success" role="alert">Added!</div>
                            }
                            {this.state.submitError &&
                                <div className="popup_error" role="alert">An unknown error occurred</div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default SetTransaction;