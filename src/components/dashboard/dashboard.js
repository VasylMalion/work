import React from 'react';
import {CardColumns} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import DashboardInfo from './dashboard.info';
import DashboardBinar from './dashboard.binar';
import DashboardPack from './dashboard.pack';
import DashboardSponsor from './dashboard.sponsor';
import DashboardFunds from './dashboard.funds';

const Dashboard = () => {
  return (
      <CardColumns>
        <DashboardInfo/>
        <DashboardBinar/>
        <DashboardFunds/>
        <DashboardPack/>
        <DashboardSponsor/>
      </CardColumns>
  );
};

export default withTranslation('Web')(Dashboard);
