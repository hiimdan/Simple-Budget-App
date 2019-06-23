import React, { Component } from 'react';

class EditBudget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: props.data.budget,
            success: false,
            deleted: false,
            initialValue: props.data.budget
        }
        this.focused = React.createRef();
    }

    componentDidMount() {
        this.focused.current.focus();
    }

    handleChange = e => {
        this.setState({amount: e.target.value, success: false});
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.initialValue !== this.state.amount) {
            let data = {
                _id: this.props.data._id,
                amount: parseInt(this.state.amount)
            };
    
            fetch('/api/editbudget', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    this.setState({success: true});
                    this.props.editBudget(data);
                }
            })
        }  
    }

    deleteBudget = () => {
        let data = {_id: this.props.data._id}
        fetch('/api/removebudget', {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                this.props.removeBudget(data);
                this.setState({deleted: true});
                setTimeout(this.props.budgetRemoved, 370);
            }
        })
    }

    render() {
        const { data, toggle } = this.props;

        return (
            <div className="modal_div light_modal" onClick={toggle}>
                <div className="budget_edit" role="dialog" aria-label="edit budget">
                    <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.3)', padding: '4px 0', fontWeight: '600'}}>
                        <div className="close_icon">
                            <button onClick={toggle} aria-label="close dialog" id="closeDialog"><i className="fa fa-times"></i></button>
                        </div>
                        Category: {data.category}
                    </div>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <label style={{fontWeight: '600'}}>
                                Amount: 
                                <input 
                                    type="number"
                                    name="amount"
                                    onChange={this.handleChange}
                                    value={this.state.amount}
                                    ref={this.focused}
                                    required
                                    placeholder="$"
                                    min="1" />
                            </label>
                            <button className="save">Save</button>
                        </form>
                    </div>
                    {this.state.success &&
                        <div className="success">Saved</div>
                    }
                    <button className="delete_button delete_budget" onClick={this.deleteBudget}>Delete Budget</button>
                    {this.state.deleted &&
                        <div className="delete_message">Deleted</div>
                    }
                </div>
            </div>
        )
    }
}

export default EditBudget;