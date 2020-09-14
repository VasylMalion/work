import gql from 'graphql-tag';
import {useAuth} from '../../context/auth-context';
import {useQuery} from '@apollo/react-hooks';
import CardList from '../lib/card.list';
import React from 'react';
import statisticCalculate from '../lib/statistic.calculate';
import {withTranslation} from 'react-i18next';
import Math from 'mout/math';
import NumberFormat from 'react-number-format';
import Moment from 'moment';
import i18n from '../../utils/i18n';
import {ceil} from 'mathjs';

const stocksQuery = gql`
  query ($session: String!) {
    userSession(session: $session) {
      user {
        id
        login
        pack
        statistic {
          closed {
            symbol
            status
            closeDate
            profit {
              tp0
              tp1
              tp2
              tp3
            }
            buySum
            quantitySell
          }
        }
      }
    }
  }  
`;

const fundsQuery = gql(`
  query ($session: String!){
    userSession(session: $session){
      success
      user {
        id
        funds {
          tokenBasic {
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
`);

const getPercent = (pack) => {
  switch (pack) {
    default:
      return 0;
    case 1:
      return 0.25;
    case 3:
      return 0.20;
    case 7:
      return 0.15;
  }
};

const BotPayment = ({t}) => {
  let rate = 1.18;
  let auth = useAuth();
  let session = auth.getSession();

  const {loading, data} = useQuery(stocksQuery, {variables: {session}});
  const {loading: loadingFunds, data: fundsData} = useQuery(fundsQuery,
      {variables: {session}});

  if (loading || loadingFunds) return <CardList loading={loading}/>;

  let result = {};
  if (data['userSession'].user.statistic.closed) {
    result = statisticCalculate(
        data['userSession'].user.statistic.closed).result;
  }

  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  if (result[year] === undefined) result[year] = {};
  if (result[year][month] === undefined) result[year][month] = 0;

  let sum = result[year][month];

  const Money = (props) => {
    return <NumberFormat
        value={Math.round(props['value'], 0.01).toFixed(2)}
        displayType={'text'} suffix={'T'}/>;
  };

  let date = new Moment(new Date());
  date.locale(i18n.language);
  let today = date.format('LL');
  let currentMonth = date.format('MMMM');

  let previousDate = new Date();
  previousDate.setMonth(previousDate.getMonth() - 1);
  let momentPrevious = new Moment(previousDate);
  momentPrevious.locale(i18n.language);
  let lastMonth = momentPrevious.format('MMMM');

  let pack = data.userSession.user.pack;

  let tokens = fundsData.userSession.user.funds.tokenBasic.balance +
      fundsData.userSession.user.funds.tokenPremium.balance +
      fundsData.userSession.user.funds.tokenGift.balance;

  let list = [
    {
      label: t('bot-payment-current-month', {month: currentMonth}),
      value: <Money value={getPercent(pack) * sum / rate}/>,
    }];

  if (pack === 1) {
    list.push({
      label: t('bot-payment-after-upgrade-vip'),
      value: <Money value={getPercent(3) * sum / rate}/>,
    });
  }

  if (pack === 1 || pack === 3) {
    list.push({
      label: t('bot-payment-after-upgrade-lux'),
      value: <Money value={getPercent(7) * sum / rate}/>,
    });
  }

  let highlight = '';

  if (tokens < 0) {
    highlight = t('bot-payment-need-pay',
        {tokens: ceil(tokens * -1), month: lastMonth});

  }

  return <CardList header={t('bot-payment-header')}
                   list={list} left={8} highlight={highlight}
                   description={t('bot-payment-description', {rate, today})}/>;
};

export default withTranslation('Web')(BotPayment);
