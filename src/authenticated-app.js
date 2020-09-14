import React from 'react';
import Sidebar from './components/sidebar/sidebar';
import Top from './components/top';
import {Redirect} from 'react-router-dom';

import {withTranslation} from 'react-i18next';

const AuthenticatedApp = () => {
  return (
      <div>
        <Redirect
            to={{
              pathname: '/dashboard',
            }}
        />
        <Top/>
        <Sidebar/>
      </div>
  );
};

export default withTranslation('Web')(AuthenticatedApp);
