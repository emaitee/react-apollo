import React, { Component } from 'react';
import { Switch, Route } from 'react-router'
import LinkList from './link-list';
import CreateLink from './create-link';
import Header from './header';
import Login from './login';

class App extends Component {
  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default App;
