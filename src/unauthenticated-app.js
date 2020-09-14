import React from 'react';
import Login from './components/login';
import Top from './components/top';
import Reset from './components/reset';
import Registration from './components/registration/registration';

import {Switch, Route, Redirect} from 'react-router-dom';
import {withTranslation} from 'react-i18next';

const UnauthenticatedApp = () => {
  return (
      <div>
        <Top/>
        <Switch>
          <Route exact path='/' component={Login}/>
          <Route exact path='/reset' component={Reset}/>
          <Route exact path='/registration' component={Registration}/>
          <Route>
            <Redirect
                to={{
                  pathname: '/',
                }}
            />
          </Route>
        </Switch>
      </div>
  );
};

export default withTranslation('Web')(UnauthenticatedApp);
