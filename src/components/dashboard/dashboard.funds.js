import React from 'react';
import {withTranslation} from 'react-i18next';
import {useAuth} from '../../context/auth-context';
import 'moment/locale/ru';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import CardList from '../lib/card.list';
import i18n from '../../utils/i18n';

const fundsQuery = gql`
  query ($session: String!){
    userSession(session: $session){
      success
      user{
        id
        login
        funds{
          euro {
            balance
          }
          pointLeft {
            balance
          }
          pointRight {
            balance
          }
          tokenBasic {
            balance
          }
          tokenPack {
            balance
          }
          tokenPremium {
            balance
          }
          tokenGift {
            balance
          }
        }
      }
    }
  }
`;

const DashboardFunds = (props) => {
  let auth = useAuth();
  let session = auth.getSession();

  const {loading, data} = useQuery(fundsQuery,
      {variables: {session}});

  let nf = new Intl.NumberFormat(i18n.language,
      {style: 'currency', currency: 'EUR'});
  if (loading) return '';
  if (data['userSession'].success === false) return '';

  let tokens = new Intl.NumberFormat(i18n.language,
      {maximumFractionDigits: 2});

  let list = [
    {
      label: props.t('dashboard-funds-euro'),
      value: nf.format(data['userSession'].user.funds.euro.balance),
    },
    {
      label: props.t('dashboard-funds-point-left'),
      value: data['userSession'].user.funds.pointLeft.balance,
    },
    {
      label: props.t('dashboard-funds-point-right'),
      value: data['userSession'].user.funds.pointRight.balance,
    },
    {
      label: props.t('dashboard-funds-token-premium'),
      value: tokens.format(
          data['userSession'].user.funds.tokenPremium.balance +
          data['userSession'].user.funds.tokenGift.balance +
          data['userSession'].user.funds.tokenPack.balance +
          data['userSession'].user.funds.tokenBasic.balance),
    },
  ];
  return <CardList
      loading={loading}
      header={props.t('dashboard-funds-header')}
      list={list}/>;
};

export default withTranslation('Web')(DashboardFunds);
