import React, { Suspense, Component } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { CContainer, CFade } from '@coreui/react';
import Page404 from '../components/Page404';

// routes config
import routes from '../routes'
import Login from "../components/Login";
  
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

class TheContent extends Component {
  render(){
    const {authUser, loggedIn} = this.props;

    if(!loggedIn) {
      return (
          <main className="c-main">
            <CContainer fluid>
              <Suspense fallback={loading}>
                <Switch>
                    <Route exact
                           path="/login"
                           render={props => (
                            <CFade>
                              <Login {...props} loggedIn={loggedIn} authUser={authUser} updateLogin={this.props.updateLogin}/>
                            </CFade>
                        )} />
                  <Redirect path="*" to="/login" />
                </Switch>
              </Suspense>
            </CContainer>
          </main>
          )
    } else {
      return (
          <main className="c-main">
            <CContainer fluid>
              <Suspense fallback={loading}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component && (
                        <Route
                            key={idx}
                            path={route.path}
                            exact={route.exact}
                            name={route.name}
                            render={props => (
                                <CFade>
                                  <route.component {...props} loggedIn={loggedIn} authUser={authUser} updateLogin={this.props.updateLogin}/>
                                </CFade>
                            )} />
                    )
                  })}
                  <Route path="*" component={Page404} />
                </Switch>
              </Suspense>
            </CContainer>
          </main>
      )
    }
  }
}

export default TheContent