import React, {useState} from 'react';
import gql from 'graphql-tag';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import classnames from 'classnames';
import FundsTab from './funds.tab';
import './funds.scss';
import i18n from '../../utils/i18n';

const getCurrencyQuery = (currency) => {
  return gql(`
  query ($session: String!){
    userSession(session: $session){
      success
      user {
        id
        funds {
          ` + currency + ` {
            balance
            history {
              amount
              date
              message {
                text
                login
                data
              }
            }
          }
        }
      }
    }
  }
`);
};

const tokenQuery = gql`
query ($session: String!){
    userSession(session: $session){
      success
      user {
        id
        funds {
          tokenBasic {
            balance
            history {
              amount
              date
              description
              message {
                text
                login
                data
              }
            }
          }
          tokenPack {
            balance
            history {
              amount
              date
              description
              message {
                text
                login
                data
              }
            }
          }
          tokenPremium {
            balance
            history {
              amount
              date
              description
              message {
                text
                login
                data
              }
            }
          }
          tokenGift {
            balance
            history {
              amount
              date
              description
              message {
                text
                login
                data
              }
            }
          }
        }
      }
    }
  }
`;

const euroQuery = getCurrencyQuery('euro');
const pointLeftQuery = getCurrencyQuery('pointLeft');
const pointRightQuery = getCurrencyQuery('pointRight');
// const tokenQuery = getCurrencyQuery('tokenPremium');

const Funds = (props) => {
  const [activeTab, setActiveTab] = useState('1');
  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const TabHeader = (props) => {
    return (
        <NavItem>
          <NavLink
              className={classnames(
                  {
                    active: activeTab === props.id,
                    'funds-tabs-item': true,
                  })}
              onClick={() => {
                toggle(props.id);
              }}>
            {props.children}
          </NavLink>
        </NavItem>
    );
  };

  let currency = new Intl.NumberFormat(i18n.language,
      {style: 'currency', currency: 'EUR'});

  let tokens = new Intl.NumberFormat(i18n.language, {maximumFractionDigits: 2});

  const TabResult = () => {
    switch (activeTab) {
      default:
        return <FundsTab query={euroQuery} nf={currency}/>;
      case '2':
        return <FundsTab query={pointLeftQuery}/>;
      case '3':
        return <FundsTab query={pointRightQuery}/>;
      case '5':
        return <FundsTab query={tokenQuery} nf={tokens}/>;
    }
  };

  return (<div>
    <Nav tabs>
      <TabHeader id={'1'}>{props.t('transaction-header-euro')}</TabHeader>
      <TabHeader id={'2'}>{props.t('transaction-header-point-left')}</TabHeader>
      <TabHeader id={'3'}>{props.t(
          'transaction-header-point-right')}</TabHeader>
      <TabHeader id={'5'}>
        {props.t('transaction-header-token-premium')}</TabHeader>
    </Nav>
    <TabResult/>
  </div>);
};

export default withTranslation('Web')(Funds);
