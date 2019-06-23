import React, { Component } from 'react';
import Loading from './Loading';
import { Redirect } from 'react-router-dom';
import History from './transactions/History';
import EditTransaction from './transactions/EditTransaction';
import DeleteTransacton from './transactions/DeleteTransaction';

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEdit: false,
            showEditData: '',
            showDelete: false,
            showDeleteData: ''
        }
    }


    editData = data => {
        this.setState({showEdit: true, showEditData: data});
    }

    toggleEditData = e => {
        if (e.target === e.currentTarget || e.target.classList.contains('fa-times')) {
            this.setState({showEdit: !this.state.showEdit});
        }
    }

    deleteData = data => {
        this.setState({showDelete: true, showDeleteData: data})
    }

    toggleDeleteData = e => {
        if (e.target === e.currentTarget || e.target.id === 'cancelDelete') {
            this.setState({showDelete: false});
        }
    }

    submitDelete = () => {
        this.setState({showDelete: false});

        let data = {_id: this.state.showDeleteData._id, date: this.state.showDeleteData.date};

        fetch('/api/deletetransaction', {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                this.props.removeTransaction(data);
            } else {
                console.log('err');
            }
        })
        .catch(e => console.log(e))
    }

    render() {
        const { data, isAuth, loading, editTransaction, theme } = this.props;

        const showData = data.curMonth.length || data.previousTransactions.length ? true : false;

        if (loading) {
            return (
                <Loading />
            )
        } else {
            if (isAuth) {
                return (
                    <div className="main_container" style={{background: theme.background}}>
                        {showData &&
                            <div className="transactions_container">
                                <History label='Current Month' data={data.curMonth} editData={this.editData} deleteData={this.deleteData} theme={theme} />
                                <History label='Previous' data={data.previousTransactions} editData={this.editData} deleteData={this.deleteData} theme={theme} />
                            </div>
                        }
                        {!showData &&
                            <h2 style={{textAlign: 'center'}}>No transactions added yet!</h2>
                        }
                        {this.state.showEdit &&
                            <EditTransaction budgets={data.categories} editData={this.state.showEditData} toggle={this.toggleEditData} editTransaction={editTransaction} />
                        }
                        {this.state.showDelete &&
                            <DeleteTransacton toggle={this.toggleDeleteData} submitDelete={this.submitDelete} />
                        }
                    </div>
                )
            } else {
                return (
                    <Redirect to='/login' />
                )
            }
        }
    }
}

export default Transactions;