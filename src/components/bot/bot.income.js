import React from 'react';
import NumberFormat from 'react-number-format';
import {useAuth} from '../../context/auth-context';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {withTranslation} from 'react-i18next';
import Math from 'mout/math';
import CardList from '../lib/card.list';
import statisticCalculate from '../lib/statistic.calculate';
import Moment from 'moment';
import i18n from '../../utils/i18n';

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

const DashboardStocks = (props) => {
  let auth = useAuth();
  let session = auth.getSession();

  const {loading, data} = useQuery(stocksQuery,
      {variables: {session}});

  if (loading) return <CardList loading={loading}/>;

  if (!data['userSession'].user.statistic.closed) return '';

  let {sum, result, dateMin} =
      statisticCalculate(data['userSession'].user.statistic.closed);

  let currentDate = new Date();

  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth();

  currentDate.setDate(1);
  currentDate.setMonth(currentDate.getMonth() - 1);

  let previousYear = currentDate.getFullYear();
  let previousMonth = currentDate.getMonth();
  if (result[currentYear] === undefined) {
    result[currentYear] = {};
  }
  if (result[currentYear][currentMonth] === undefined) {
    result[currentYear][currentMonth] = 0;
  }

  if (result[previousYear] === undefined) {
    result[previousYear] = {};
  }
  if (result[previousYear][previousMonth] === undefined) {
    result[previousYear][previousMonth] = 0;
  }

  if (result[previousYear][previousMonth] === 0 &&
      result[currentYear][currentMonth] === 0) {
    return '';
  }

  const Money = (props) => {
    return <NumberFormat
        value={Math.round(props['value'], 0.01).toFixed(2)}
        displayType={'text'}
        prefix={'$'}/>;
  };

  let moment = new Moment(dateMin);
  moment.locale(i18n.language);

  let list = [
    {
      label: props.t('dashboard-stocks-current-month'),
      value: <Money value={result[currentYear][currentMonth]}/>,
    },
    {
      label: props.t('dashboard-stocks-last-month'),
      value: <Money value={result[previousYear][previousMonth]}/>,
    },
    {
      label: props.t('dashboard-stocks-all-time') + ' ' + moment.format('LL'),
      value: <Money value={sum}/>,
    },
  ];

  return <CardList loading={loading}
                   header={props.t('dashboard-stocks-header')}
                   list={list}/>;
};

export default withTranslation('Web')(DashboardStocks);
