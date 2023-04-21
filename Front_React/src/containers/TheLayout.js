import React, {Component} from 'react'
import {
  TheSidebar,
  TheFooter,
  TheHeader,
  TheContent
} from './index'
import {withRouter} from "react-router";

class TheLayout extends Component{

  constructor(props) {
    super(props);

    this.state = {
      'show' : true,
      'loggedIn' : false,
      'authUser' : undefined,
    }
  }

  componentDidMount() {
    const localAppState = localStorage["appState"];
    if (localAppState) {
      const appState = JSON.parse(localAppState);
      this.setState({
        'loggedIn': appState.loggedIn,
        'authUser': appState.authUser
      });
      if(appState.loggedIn) {
        if(appState.authUser.admin == 1) {
          this.props.history.push('/admin-dashboard');
        } else {
          this.props.history.push('/user-dashboard');
        }
      }
    }
  }

  setSidebar = (ev) => {
    const {show} = this.state;
    ev.preventDefault();
    this.setState({
      'show' : !show
    })
  }

  updateLogin = (loggedIn, authUser) => {
    this.setState({
      loggedIn: loggedIn,
      authUser: authUser,
    })
    if(loggedIn) {
      if(authUser.admin == 1) {
        this.props.history.push('/admin-dashboard');
      } else {
        this.props.history.push('/user-dashboard');
      }
    } else {
      this.props.history.push('/login');
    }
  }

  render() {
    const {loggedIn, authUser} = this.state;

    return (
      <div className="c-app c-default-layout">
        <TheSidebar loggedIn={loggedIn} authUser={authUser} show={this.state.show} />
        <div className="c-wrapper">
          <TheHeader  loggedIn={loggedIn} authUser={authUser} handleSidebar={this.setSidebar} updateLogin={this.updateLogin} />
          <div className="c-body">
            <TheContent loggedIn={loggedIn} authUser={authUser} updateLogin={this.updateLogin} />
          </div>
          <TheFooter/>
        </div>
      </div>
    )
  }
}

export default withRouter(TheLayout)
