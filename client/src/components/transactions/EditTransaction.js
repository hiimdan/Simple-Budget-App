import React, { Component } from 'react';
import parseNum from '../../modules/parseNum';

class EditTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.editData.date,
            budgetSelect: props.editData.category,
            transaction: props.editData.amount,
            submitted: false,
            numberError: false,
            otherError: false
        }
        this.focused = React.createRef();
    }

    componentDidMount() {
        this.focused.current.focus();
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            submitted: false,
            numberError: false,
            otherError: false
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        let num = parseNum(this.state.transaction);
        if (!num) {
            this.setState({numberError: true});
            return;
        }

        let data = {
            _id: this.props.editData._id,
            date: this.state.date,
            category: this.state.budgetSelect,
            amount: this.state.transaction
        }

        fetch('/api/edittransaction', {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                this.setState({submitted: true});
                this.props.editTransaction(data);
            } else {
                this.setState({otherError: true});
            }
        })
        .catch(e => {
            this.setState({otherError: true});
        })

    }

    render() {
        const { budgets, editData, toggle } = this.props;

        return (
            <div className="modal_div" onClick={toggle}>
                <div className="create_popup" role="dialog" aria-labeledby="editDescription">
                    <div className="close_icon">
                        <button onClick={toggle} aria-label="close modal" id="closeDialog"><i className="fa fa-times"></i></button>
                    </div>
                    <p id="editDescription">Edit Transaction</p>
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
                                        name="date"/>
                                </label>
                            </div>
                            <div className="form_group">
                                <label>
                                    Budget Category:
                                    <br />
                                    <select value={this.state.budgetSelect} onChange={this.handleChange} required className="modal_input" name="budgetSelect">
                                        {budgets.map(b => {
                                            return <option key={b._id} value={b.category}>{b.category}</option>
                                        })}
                                    </select>
                                </label>
                            </div>
                            <div className="form_group">
                                <label>
                                    Transaction Amount:
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
                            <button type="submit">Edit Transaction</button>
                            {this.state.submitted &&
                                <div className="success" style={{textAlign: 'center'}} role="alert">Transaction Modified</div>
                            }
                            {this.state.otherError &&
                                <div className="popup_error" role="alert">An unknown error occurred</div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default EditTransaction;