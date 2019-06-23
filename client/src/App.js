import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import getCurrentMonth from './modules/getCurrentMonth';
import insertDate from './modules/dateInsertionSort';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import NotFound from './components/NotFound';
import themes from './themes';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      navExpanded: false,
      loading: true,
      error: false,
      username: '',
      userCategories: [],
      currentMonth: [],
      pastTransactions: [],
      theme: themes.default,
      accountReset: false
    }
  }

  componentDidMount() {
    fetch('/api/getuser', {credentials: 'same-origin'})
    .then(response => {
      if (response.ok) {
        response.json()
        .then(data => {
          this.login(data);
          this.setState({loading: false});
        });
      } else {
        this.setState({loading: false});
      }
    })
    .catch(e => {
      this.setState({loading: false, error: true});
    })
  }

  login = data => {
    let pastTransactions = [];
    let currentMonth = data.transactions.filter(obj => {
      let tDate = new Date(obj.date);
      if (getCurrentMonth(tDate).isCurrentMonth) {
        return true;
      } else {
        pastTransactions.push(obj);
        return false;
      }
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
    pastTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    this.setState({
      isAuthenticated: true,
      currentMonth,
      pastTransactions,
      userCategories: data.categories,
      username: data.username,
      theme: data.theme
    });
  }

  logout = () => {
    fetch('/auth/logout', {method: 'POST', credentials: 'same-origin', body: JSON.stringify({})})
    .then(response => {
      if (response.ok) {
        this.setState({isAuthenticated: false, theme: themes.default});
      } else {
        this.setState({error: true});
      }
    })
  }

  dashboardData = (t, c) => {
    if (!c.length && !t.length) {
      return null;
    }

    let totalSpent = 0;
    let totalBudget = 0;
    let curBudgets = c.map(obj => {
      totalBudget+= obj.budgetAmt;
      return {
        _id: obj._id,
        category: obj.category,
        budget: obj.budgetAmt,
        total: 0
      }
    });
    t.forEach(tx => {
      curBudgets.forEach(b => {
        if (tx.category === b.category) {
          b.total+= tx.amount;
          totalSpent+= tx.amount;
        }
      })
    });

    return {totalSpent, totalBudget, budgets: curBudgets};
  }

  addBudget = data => {
    this.setState({userCategories: [...this.state.userCategories, data]});
  }

  addTransaction = data => {
    let tDate = new Date(data.date);
    if (getCurrentMonth(tDate).isCurrentMonth) {
      this.setState({currentMonth: insertDate(0, this.state.currentMonth.length - 1, data, this.state.currentMonth)});
    } else {
      this.setState({pastTransactions: insertDate(0, this.state.pastTransactions.length - 1, data, this.state.pastTransactions)});
    }
  }

  editTransaction = data => {
    let tDate = new Date(data.date);
    let tGroup = getCurrentMonth(tDate).isCurrentMonth ? 'currentMonth' : 'pastTransactions';

    for (let i = 0, len = this.state[tGroup].length; i < len; i++) {
      if (this.state[tGroup][i]._id === data._id) {
        return this.setState({[tGroup]: [...this.state[tGroup].slice(0, i), data, ...this.state[tGroup].slice(i + 1)]});
      }
    }
  }

  removeTransaction = data => {
    let tDate = new Date(data.date);
    let tGroup = getCurrentMonth(tDate).isCurrentMonth ? 'currentMonth' : 'pastTransactions';

    for (let i = 0, len = this.state[tGroup].length; i < len; i++) {
      if (this.state[tGroup][i]._id === data._id) {
        return this.setState({[tGroup]: [...this.state[tGroup].slice(0, i), ...this.state[tGroup].slice(i + 1)]});
      }
    }
  }

  editBudget = data => {
    this.state.userCategories.forEach((b, i) => {
      if (b._id === data._id) {
        let obj = Object.assign({}, b);
        obj.budgetAmt = data.amount;
        return this.setState({userCategories: [...this.state.userCategories.slice(0, i), obj, ...this.state.userCategories.slice(i + 1)]});
      }
    })
  }

  removeBudget = data => {
    this.state.userCategories.forEach((b, i) => {
      if (b._id === data._id) {
        return this.setState({userCategories: [...this.state.userCategories.slice(0, i), ...this.state.userCategories.slice(i + 1)]});
      }
    })
  }

  setTheme = name => {
    this.setState({theme: themes[name]});
  }

  accountDelete = () => {
    this.setState({
      isAuthenticated: false,
      theme: themes.default,
      accountReset: true
    }, () => this.setState({accountReset: false}));
  }


  render() {
    return (
      <Router>
        <Navbar isAuth={this.state.isAuthenticated} logout={this.logout} username={this.state.username} theme={this.state.theme} />
        <Switch>
          <Route exact path='/login' render={props => <Login login={this.login} isAuth={this.state.isAuthenticated} loading={this.state.loading} {...props} />} />
          <Route exact path='/register' component={Register} />
          <Route exact path={['/', '/dashboard']} render={() => <Dashboard 
            data={this.dashboardData(this.state.currentMonth, this.state.userCategories)} 
            isAuth={this.state.isAuthenticated} 
            theme={this.state.theme}
            addBudget={this.addBudget} 
            addTransaction={this.addTransaction}
            editBudget={this.editBudget}
            removeBudget={this.removeBudget} 
            loading={this.state.loading} />} />
          <Route exact path='/transactions' render={() => <Transactions
            data={{curMonth: this.state.currentMonth, previousTransactions: this.state.pastTransactions, categories: this.state.userCategories}} 
            isAuth={this.state.isAuthenticated}
            loading={this.state.loading}
            theme={this.state.theme}
            editTransaction={this.editTransaction}
            removeTransaction={this.removeTransaction} />} />
          <Route exact path='/settings' render={() => <Settings 
            isAuth={this.state.isAuthenticated}
            loading={this.state.loading}
            theme={this.state.theme} 
            setTheme={this.setTheme} 
            accountDelete={this.accountDelete} 
            accountReset={this.state.accountReset} />} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

export default App;
