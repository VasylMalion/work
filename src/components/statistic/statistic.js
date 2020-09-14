import React, {useState} from 'react';
import {Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import Tab1 from './statistic.tab1';
import Tab2 from './statistic.tab2';
import classnames from 'classnames';

const Statistic = (props) => {
  const [activeTab, setActiveTab] = useState('1');
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
      <div>
        <h1>{props.t('statistic-graph-header')}</h1>
        <Nav tabs className="mb-2">
          <NavItem>
            <NavLink
                className={classnames({active: activeTab === '1'})}
                onClick={() => {
                  toggle('1');
                }}
            >
              {props.t('statistic-tab1-title')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
                className={classnames({active: activeTab === '2'})}
                onClick={() => {
                  toggle('2');
                }}
            >
              {props.t('statistic-tab2-title')}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Tab1/>
          </TabPane>
          <TabPane tabId="2">
            <Tab2/>
          </TabPane>
        </TabContent>
      </div>
  );
};

export default withTranslation('Web')(Statistic);
