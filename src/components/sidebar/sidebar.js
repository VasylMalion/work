import React from 'react';
import {Container, Row, Col, ListGroup, ListGroupItem} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import Dashboard from '../dashboard/dashboard';
import Payment from '../payment/payment';
import Personal from '../personal';
import Genealogy from '../genealogy/genealogy';
import Profile from '../profile';
import Documents from '../documents';
import Events from '../events';
import Withdraw from '../withdraw/withdraw';
import Funds from '../funds/funds';
import Bot from '../bot/bot';
import Statistic from '../statistic/statistic';
import {Switch, Route, NavLink, useLocation} from 'react-router-dom';
import SummerPromo from '../promo/summer';
import './sidebar.scss';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import Logger from '../../logger/logger';
import TokenNegative from '../alerts/tokens.negative';

const userQuery = gql`
  query {
    user @client {
      id
      personalCount
    }
  }
`;

const Sidebar = (props) => {
  let location = useLocation();

  let {loading, data} = useQuery(userQuery);
  if (loading) return <div/>;
  let user = data.user;

  Logger.put({
    id: user.id,
    location: location.pathname,
    type: 'n',
  });

  const MenuItem = (props) => {
    let active = props.to === location.pathname;
    let activeClass = active ? 'active' : '';

    return (
        <li>
          <NavLink to={props.to}
                   className={'sidebar-item list-group-item ' + activeClass}>
            {props.name}</NavLink>
        </li>
    );
  };

  const SidebarBlock = (props) => {
    return (
        <ListGroupItem className="sidebar-block">
          <ListGroup>
            <ListGroupItem className="sidebar-title">
              {props.title}</ListGroupItem>
            {props.children}
          </ListGroup>
        </ListGroupItem>
    );
  };

  const FinanceBlock = () => {
    return (
        <SidebarBlock title={props.t('sidebar-finance')}>
          <MenuItem to="/payment" name={props.t('sidebar-payment')}/>
          <MenuItem to="/withdraw" name={props.t('sidebar-withdraw')}/>
          <MenuItem to="/funds" name={props.t('sidebar-funds')}/>
        </SidebarBlock>
    );
  };

  const TeamBlock = () => {
    return (
        <SidebarBlock title={props.t('sidebar-team')}>
          {user.personalCount > 0 ?
              <MenuItem to="/personal" name={props.t('sidebar-personal')}/> : ''
          }
          <MenuItem to="/genealogy" name={props.t('sidebar-genealogy')}/>
        </SidebarBlock>
    );
  };

  const InformationBlock = () => {
    return (
        <SidebarBlock title={props.t('sidebar-information')}>
          <MenuItem to="/documents" name={props.t('sidebar-documents')}/>
          <MenuItem to="/events" name={props.t('sidebar-events')}/>
        </SidebarBlock>
    );
  };

  const SettingsBlock = () => {
    return (
        <SidebarBlock title={props.t('sidebar-settings')}>
          <MenuItem to="/profile" name={props.t('sidebar-profile')}/>
        </SidebarBlock>
    );
  };

  const BotBlock = () => {
    return (
        <SidebarBlock title={props.t('sidebar-bot')}>
          <MenuItem to="/bot" name={props.t('sidebar-bot-info')}/>
          <MenuItem to="/statistic" name={props.t('sidebar-bot-statistic')}/>
        </SidebarBlock>
    );
  };

  return (
      <Container className="mb-5">
        <Row>
          <Col xs={12}><TokenNegative/></Col>
          <Col xs="12"><SummerPromo/></Col>
          <Col md={3} sm={4}>
            <ListGroup className="shadow mb-3 sidebar">
              <MenuItem to="/dashboard"
                        name={props.t('sidebar-dashboard')}/>
              <FinanceBlock/>
              <BotBlock/>
              <TeamBlock/>
              <InformationBlock/>
              <SettingsBlock/>
            </ListGroup>
          </Col>
          <Col md={9} sm={8}>
            <Switch>
              <Route exact path='/dashboard' component={Dashboard}/>
              <Route exact path='/payment' component={Payment}/>
              <Route exact path='/personal' component={Personal}/>
              <Route exact path='/genealogy' component={Genealogy}/>
              <Route exact path='/profile' component={Profile}/>
              <Route exact path='/documents' component={Documents}/>
              <Route exact path='/events' component={Events}/>
              <Route exact path='/withdraw' component={Withdraw}/>
              <Route exact path='/funds' component={Funds}/>
              <Route exact path='/bot' component={Bot}/>
              <Route exact path='/statistic' component={Statistic}/>
            </Switch>
          </Col>
        </Row>
      </Container>
  );
};

export default withTranslation('Web')(Sidebar);
