// @flow

import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

const EM = require('exact-math');

import 'bootstrap/dist/css/bootstrap.min.css';

import apis from '../api';
import { ListItems } from './ListItems';
import { AddEntryForm } from './AddEntryForm';
import { AddTransactionForm } from './AddTransactionForm';
import { EntryList } from './EntryList';
import { TransactionList } from './TransactionList';
import { BudgetList } from './TotalList';
import { ShowAddForm } from './ShowAddForm';
import { ItemsFormAndList } from './ItemsFormAndList';
import { Typography, Grid } from '@material-ui/core';

export const findItemById = (where, id) => {
  const res = where.filter(wi => {
    return wi._id === id;
  });
  return res[0];
};

class App extends React.Component {
  constructor() {
    super();
    const pa = window.location.pathname.split('/');
    this.state = {
      showAccountForm: false,
      budget: {
        _id: pa[1],
        name: '',
        accounts: [],
        categories: [],
        payees: [],
        transactions: [],
        entries: [],
        total: 0,
        budgeted: 0,
        activity: 0,
        year: parseInt(pa[2], 10),
        month: pa[3]
      }
    };
  }

  componentDidMount() {
    apis.getBudgetById(this.state.budget._id).then(apiResponse => {
      this.setState(
        prevState => {
          prevState.budget.name = apiResponse.data.data.name;

          return { prevState };
        },
        () => {
          this.gAAs();
          this.gACs();
          this.gAPs();
          this.gATs();
          this.gAEs();
        }
      );
    });
  }

  onChange = (id, name, what) => {
    this.setState(prevState => {
      prevState.budget[what].forEach(w => {
        if (w._id === id) {
          w.name = name;
        }
      });
      return prevState;
    });
  };
  saveItemToDb = (id, name, action) => {
    apis[action](id, { budgetId: this.state.budget._id, name: name })
      .then(apiResponse => {})
      .catch(e => {});
  };
  gAAs() {
    apis
      .getAllAccounts(this.state.budget._id)
      .then(apiResponse => {
        this.setState(prevState => {
          prevState.budget.accounts = apiResponse.data.data;
          prevState.budget.accounts.forEach(a => {
            a.balance = 0;
            a.showPopup = false;
            a.onChange = this.onChange;
            a.saveAction = this.saveItemToDb;
            a.editAction = 'updateAccountById';
          });
          return { prevState };
        });
      })
      .then(() => {})
      .catch(e => {});
  }

  gACs() {
    apis
      .getAllCategories(this.state.budget._id)
      .then(apiResponse => {
        this.setState(prevState => {
          prevState.budget.categories = apiResponse.data.data;
          prevState.budget.categories.forEach(c => {
            c.onChange = this.onChange;
            c.saveAction = this.saveItemToDb;
            c.editAction = 'updateCategoryById';
          });
          return { prevState };
        });
      })
      .then(() => {})
      .catch(e => {});
  }

  gAPs() {
    apis
      .getAllPayees(this.state.budget._id)
      .then(apiResponse => {
        this.setState(prevState => {
          prevState.budget.payees = apiResponse.data.data;
          prevState.budget.payees.forEach(p => {
            p.onChange = this.onChange;
            p.saveAction = this.saveItemToDb;
            p.editAction = 'updatePayeeById';
          });
          return { prevState };
        });
      })
      .then(() => {})
      .catch(e => {});
  }

  gATs() {
    apis
      .getAllTransactions(this.state.budget._id)
      .then(apiResponse => {
        this.setState(
          prevState => {
            prevState.budget.transactions = apiResponse.data.data;

            return { prevState };
          },
          () => {
            this.processTransactions();
          }
        );
      })
      .then(() => {
        this.calculateEntries();
      })
      .catch(e => {});
  }

  processTransactions() {
    const accounts = this.state.budget.accounts;
    var total = this.state.budget.total;
    this.state.budget.transactions.forEach(t => {
      if (t.accountIdFrom !== '') {
        accounts.forEach(a => {
          if (t.accountIdFrom === a._id) {
            a.balance = EM.sub(a.balance, t.ammount);
          }
        });
      }
      if (t.accountIdTo !== '') {
        accounts.forEach(a => {
          if (t.accountIdTo === a._id) {
            a.balance = EM.add(a.balance, t.ammount);
          }
        });
      }
    });
    accounts.forEach(a => {
      total = EM.add(total, a.balance);
    });
    this.setState(
      prevState => {
        prevState.budget.accounts = accounts;
        prevState.budget.total = total;
        return prevState;
      },
      () => {}
    );
  }

  calculateEntries() {
    const entries = this.state.budget.entries;
    const transactions = this.state.budget.transactions;

    var budgeted = 0;
    var activity = 0;
    var available = 0;

    entries.forEach(entry => {
      budgeted = EM.add(budgeted, entry.budgeted);
      let activitySum = 0;
      transactions.forEach(t => {
        if (t.categoryId === entry.categoryId) {
          if (t.accountIdFrom !== '') {
            activitySum = EM.sub(activitySum, t.ammount);
          }
          if (t.accountIdTo !== '') {
            activitySum = EM.add(activitySum, t.ammount);
          }
        }
      });

      entry['activitySum'] = activitySum;
      entry['available'] = EM.add(entry.budgeted, activitySum);

      activity = EM.add(activity, entry.activitySum);
      available = EM.add(available, entry.available);
    });
    this.setState(
      p => {
        p.budget.entries = entries;
        p.budget.budgeted = budgeted;
        p.budget.activity = activity;
        p.budget.available = available;
        p.budget.currentState = p.budget.total - budgeted;
        return p;
      },
      () => {}
    );
  }

  gAEs() {
    apis
      .getAllEntries(this.state.budget._id)
      .then(apiResponse => {
        this.setState(prevState => {
          prevState.budget.entries = apiResponse.data.data;
          // moved this filtering to the display part
          // apiResponse.data.data.forEach( e => {
          //
          //     if ( e.year === this.state.budget.year &&
          //             e.month === this.state.budget.month ) {
          //             // return e
          //             prevState.budget.entries.push(e)
          //         }
          //         // return e
          // })
          return prevState;
        }, this.calculateEntries);
      })
      .then(() => {})
      .catch(e => {});
  }

  deleteCategory = id => {
    const categories = this.state.budget.categories.filter(value => {
      return value._id !== id;
    });
    apis.deleteCategoryById(id);
    this.setState(prevState => {
      prevState.budget.categories = categories;
      return { prevState };
    });
  };

  deleteTransaction = id => {
    const ts = this.state.budget.transactions.filter(t => {
      return t._id !== id;
    });
    const transaction = this.state.budget.transactions.filter(t => {
      return t._id === id;
    })[0];
    const AAA = parseFloat(transaction.ammount);

    var toAdd = 0;
    var toSub = 0;
    var accountTo = findItemById(
      this.state.budget.accounts,
      transaction.accountIdTo
    );
    if (accountTo !== undefined) {
      accountTo.balance = EM.sub(accountTo.balance, AAA);
      toSub = AAA;
      apis.updateAccountById(accountTo._id, accountTo).then(r => {
        // toSub = AAA
      });
    }
    var accountFrom = findItemById(
      this.state.budget.accounts,
      transaction.accountIdFrom
    );
    if (accountFrom !== undefined) {
      toAdd = AAA;
      accountFrom.balance = EM.add(accountFrom.balance, AAA);
      apis.updateAccountById(accountFrom._id, accountFrom).then(r => {
        // toAdd = AAA
      });
    }

    apis.deleteTransactionById(id);
    this.setState(prevState => {
      prevState.budget.transactions = ts;
      prevState.budget.total = EM.add(prevState.budget.total, toAdd);
      prevState.budget.total = EM.sub(prevState.budget.total, toSub);

      return { prevState };
    }, this.calculateEntries);
  };

  deleteEntry = id => {
    const es = this.state.budget.entries.filter(e => {
      return e._id !== id;
    });
    apis.deleteEntryById(id);
    this.setState(prevState => {
      prevState.budget.entries = es;
      return { prevState };
    });
  };

  addItem = (e, actions, fields, items) => {
    e.preventDefault();
    let data = {
      budgetId: this.state.budget._id
    };
    fields.forEach(field => {
      data[field.name] = e.target[field.name].value;
    });
    if (items === 'accounts') {
      data.balance = 0;
    }
    apis[actions](data).then(apiResponse => {
      data._id = apiResponse.data.id;
      this.setState(prevState => {
        prevState.budget[items].push(data);
        return prevState;
      });
    });
  };

  deleteItem = (id, items, action) => {
    const newItems = this.state.budget[items].filter(item => {
      return item._id !== id;
    });
    apis[action](id);
    this.setState(prevState => {
      prevState.budget[items] = newItems;
      return { prevState };
    });
  };

  addTransaction = e => {
    e.preventDefault();
    const data = {
      budgetId: this.state.budget._id,
      date: e.target.date.value,
      payeeId: e.target.payeeId.value,
      accountIdFrom: e.target.accFrom.value,
      accountIdTo: e.target.accTo.value,
      categoryId: e.target.category.value,
      ammount: e.target.ammount.value,
      cleared: true
    };

    if (data.accountIdFrom === '' && data.accountIdTo === '') {
      throw new Error('Here be needed at least on account');
    }

    var accountFrom = findItemById(
      this.state.budget.accounts,
      data.accountIdFrom
    );
    var toAdd = 0;
    var toSub = 0;
    if (accountFrom !== undefined) {
      accountFrom.balance = EM.sub(
        accountFrom.balance,
        parseFloat(data.ammount)
      );
      apis.updateAccountById(accountFrom._id, accountFrom).then(() => {});
      toSub = data.ammount;
    }
    var accountTo = findItemById(this.state.budget.accounts, data.accountIdTo);
    if (accountTo !== undefined) {
      accountTo.balance = EM.add(accountTo.balance, parseFloat(data.ammount));
      apis.updateAccountById(accountTo._id, accountTo).then(() => {});
      toAdd = data.ammount;
    }
    apis.insertTransaction(data).then(apiResponse => {
      data._id = apiResponse.data.id;
      this.setState(
        p => {
          p.budget.transactions.push(data);
          if (toAdd.id !== null) {
            p.budget.total = EM.add(p.budget.total, toAdd);
          }
          if (toSub.id !== null) {
            p.budget.total = EM.sub(p.budget.total, toSub);
          }

          return p;
        },
        () => {
          this.calculateEntries();
        }
      );
    });
  };

  addEntry = e => {
    e.preventDefault();
    const data = {
      budgetId: this.state.budget._id,
      year: this.state.budget.year,
      month: this.state.budget.month,
      categoryId: e.target.category.value,
      budgeted: e.target.budgeted.value
    };
    apis.insertEntry(data).then(apiResponse => {
      data._id = apiResponse.data.id;
      this.setState(prevState => {
        prevState.budget.entries.push(data);
        return prevState;
      }, this.calculateEntries);
    });
  };

  saveEntry = e => {
    apis.updateEntryById(e._id, e);
  };

  handleEntryChange = (e, v) => {
    this.setState(prevState => {
      prevState.budget.entries.forEach(be => {
        if (be._id === e._id) {
          be.budgeted = v;
        }
      });
      return prevState;
    }, this.calculateEntries);
  };

  render() {
    const entries = [];
    this.state.budget.entries.forEach(e => {
      if (
        e.year === this.state.budget.year &&
        e.month === this.state.budget.month
      ) {
        entries.push(e);
      }
    });
    return (
      <Router>
        <div className="container-fluid">
          <div className="row">
            <div className="col-2">
              <Grid container>
                <Grid item xs>
                  {this.state.budget.total}
                </Grid>
              </Grid>
              <ItemsFormAndList
                className="accounts"
                addItem={this.addItem}
                action="insertAccount"
                items="accounts"
                label="Account"
                fields={[{ name: 'name', ph: 'Add Account' }]}
                showFields={['name', 'balance']}
                data={this.state.budget.accounts}
                deleteItem={this.deleteItem}
                apiCall="deleteAccountById"
              />
              <div className="categories">
                <ShowAddForm
                  addItem={this.addItem}
                  action="insertCategory"
                  what="categories"
                  fields={[{ name: 'name', ph: 'Add Category' }]}
                />
                <ListItems
                  fields={['name']}
                  data={this.state.budget.categories}
                  deleteItem={this.deleteItem}
                  items="categories"
                  label="Category"
                  apiCall="deleteCategoryById"
                />
              </div>
              <div className="payees">
                <ShowAddForm
                  addItem={this.addItem}
                  action="insertPayee"
                  what="payees"
                  fields={[{ name: 'name', ph: 'Add Payee' }]}
                />
                <ListItems
                  fields={['name']}
                  data={this.state.budget.payees}
                  deleteItem={this.deleteItem}
                  items="payees"
                  label="Payee"
                  apiCall="deletePayeeById"
                />
              </div>
            </div>

            <div className="col-10">
              <Route>
                <Typography variant="h5" style={{ marginLeft: 20 }}>
                  <BudgetList budget={this.state.budget} />
                </Typography>
                <AddEntryForm
                  categories={this.state.budget.categories}
                  addEntry={this.addEntry}
                />
                <EntryList
                  es={entries}
                  budget={this.state.budget.categories}
                  handleChange={this.handleEntryChange}
                  deleteEntry={this.deleteEntry}
                  onBlur={this.saveEntry}
                />
              </Route>

              <AddTransactionForm
                payees={this.state.budget.payees}
                accounts={this.state.budget.accounts}
                categories={this.state.budget.categories}
                addTransaction={this.addTransaction}
              />
              <TransactionList
                ts={this.state.budget}
                deleteTransaction={this.deleteTransaction}
              />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
