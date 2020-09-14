import React from 'react';
import {withTranslation} from 'react-i18next';
import {useQuery} from '@apollo/react-hooks';
import {useAuth} from '../../context/auth-context';
import Spinner from '../lib/spinner';
import Moment from 'react-moment';
import MomentLib from 'moment';
import i18n from '../../utils/i18n';

const FundsTab = (props) => {
  const auth = useAuth();
  const {loading, data} = useQuery(props.query,
      {variables: {session: auth.getSession()}});

  if (loading) return <Spinner/>;
  let list = [];
  for (let key in data.userSession.user.funds) {
    if (data.userSession.user.funds.hasOwnProperty(key)) {
      if (data.userSession.user.funds[key].hasOwnProperty('history')) {
        list = list.concat(data.userSession.user.funds[key]['history']);
      }
    }
  }

  list = list.sort((a, b) => {
    if (typeof a.date === 'string') a.date = parseInt(a.date);
    if (typeof b.date === 'string') b.date = parseInt(b.date);
    return b.date - a.date;
  });

  const ListItemMessage = (object) => {
    let result = messageHandler(object);
    if (result !== false) return result;
    let data = object.data.message;
    let login = '';
    if (data.text === 'transaction-message-pack-buy' ||
        data.text === 'transaction-message-pack-upgrade' ||
        data.text === 'transaction-message-pack-tree-buy' ||
        data.text === 'transaction-message-pack-tree-upgrade') {
      if (data.login) login = data.login;
      return <span>{props.t(data.text)} <b>{login}</b></span>;
    } else if (data.text === 'transaction-message-promo-summer') {
      const info = JSON.parse(data.data);
      let add = '';
      if (info['1'] > 0) add += 'START x' + info['1'].toString() + ', ';
      if (info['2'] > 0) add += 'PREMIUM x' + info['2'].toString() + ', ';
      if (info['3'] > 0) add += 'VIP x' + info['3'].toString();
      return <span>{props.t(data.text)} ({add})</span>;
    } else {
      return <span>{props.t(data.text)}</span>;
    }
  };

  const messageHandler = (object) => {
    try {
      let obj = JSON.parse(object.data.description);
      const moment = new MomentLib(new Date(obj.year, obj.month, 1));
      moment.locale(i18n.language);
      let date = moment.format('MMMM YYYY');
      if (obj.type === 'month-fee') return <span>{props.t(
          'transaction-message-month-fee', {date})}</span>;
    } catch (e) {
      return false;
    }
    return false;
  };

  const ListItem = (data) => {
    let amount = props.nf === undefined ?
        data.data.amount :
        props.nf.format(data.data.amount);
    return (
        <tr className="funds-list">
          <td className="funds-list-item">
            <Moment format="LLL" locale={i18n.language}>
              {parseInt(data.data.date)}</Moment>
          </td>
          <td className="funds-list-item">
            <ListItemMessage data={data.data}/></td>
          <td className="funds-list-item funds-list-item-amount">
            {amount}</td>
        </tr>);
  };

  return (
      <table className="w-100">
        <tbody>
        {list.map((item, index) => {
          return <ListItem key={index} data={item}/>;
        })}
        </tbody>
      </table>
  );
};

export default withTranslation('Web')(FundsTab);
