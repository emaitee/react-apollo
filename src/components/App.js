import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router'
import LinkList from './link-list';
import CreateLink from './create-link';
import Header from './header';
import Login from './login';
import Search from './search';
import { Container } from 'reactstrap'

class App extends Component {
  render() {
    return (
      <Container>
        <Header />
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/new/1" />} />
            <Route exact path="/create" component={CreateLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/top" component={LinkList} />
            <Route exact path="/new/:page" component={LinkList} />
          </Switch>
      </Container>
    )
  }
}

export default App;
