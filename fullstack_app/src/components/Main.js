import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Registration from './pages/user/Registration';
import Dashboard from './pages/admin/Dashboard';
import QRimage from './pages/user/QRimage';
import QRaccess from './pages/admin/QRaccess';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import Cookies from 'js-cookie';
import { withRouter } from 'react-router-dom';

function loggedIn() {
  const user = Cookies.get('user');

  if(user) {
    return true;
  }else {
    return false;
  }
}

const QRimgaes = props => (
  <div>
    <QRimage id={props.match.params.id} />
  </div>
)

class Main extends Component {

  render() {
    return (
      <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>

        <Switch>

          <Route path='/home'
            render={() => (
                <Home />
              )}
          />

          <Route path='/registration'
            render={() => (
                <Registration />
              )}
          />

          <Route path='/dashboard'
            render={() => (
              loggedIn() ? (
                <Dashboard />
              ) : (
                <Redirect from='/dashboard' to='/login' />
              )
            )}
          />

          <Route path="/login"
            render={() => (
              loggedIn() ? (
                <Redirect from='/login' to='/dashboard' />
              ) : (
                <Login />
              )
            )}
          />

          <Route path="/qraccess/:id"
            render={() => (
              loggedIn() ? (
                <QRaccess id={this.props.match.params.id}/>
              ) : (
                <Redirect from='/qraccess' to='/login' />
              )
            )}
          />

          <Route path='/qrimage/:id' component={QRimgaes} />

          <Route exact path='/'
            render={() => (
                <Redirect from='/' to='/home'/>
            )}
          />

        </Switch>

      </div>
    );
  }
}

export default withRouter(Main)
