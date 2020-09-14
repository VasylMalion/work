import React from 'react';
import {withTranslation} from 'react-i18next';
import gql from 'graphql-tag';
import {useAuth} from '../../context/auth-context';
import {useMutation, useQuery} from '@apollo/react-hooks';
import './withdraw.scss';
import {Input, InputGroup, InputGroupAddon} from 'reactstrap';
import WithdrawList from './withdraw.list';
import WithdrawForm from './withdraw.form';
import Spinner from '../lib/spinner';

const fundsQuery = gql`
  query ($session: String!){
    userSession(session: $session){
      success
      user {
        id
        login
        funds {
          euro {
            balance
          }
        }
        withdraws {
          address
          created
          amount
          status
        }
      }
    }
  }
`;

const makeWithdrawQuery = gql`
  mutation ($session: String!, $amount: Float!, $address: String!) {
    makeWithdraw(session: $session, amount: $amount, address: $address) {
      success
    }
  }
`;

const Withdraw = (props) => {
  let auth = useAuth();
  let session = auth.getSession();

  const [makeWithdraw] = useMutation(makeWithdrawQuery);

  const {loading, data, refetch} = useQuery(fundsQuery,
      {variables: {session}});

  if(loading) return '';

  let euro = 0;

  if (loading === false) {
    if (data['userSession'].success) {
      euro = data['userSession'].user.funds.euro.balance;
    }
  }

  const sendWithdraw = async (amount, address) => {
    await makeWithdraw({
      variables: {address, session, amount},
    });
    refetch();
  };

  if (loading) return (<Spinner/>);

  let list = data['userSession'].user.withdraws;
  list = list.sort((a, b) => {
    return b.created - a.created;
  });

  return (
      <div>
        <h3>{props.t('withdraw-title')}</h3>
        <div>{props.t('withdraw-current-balance')}:</div>
        <div className="withdraw-balance">
          <InputGroup className="withdraw-current-group">
            <InputGroupAddon addonType="prepend" className="withdraw-bigfont">
              €</InputGroupAddon>
            <Input value={euro} disabled={true}
                   className="withdraw-balance-input"/>
          </InputGroup>
        </div>
        <WithdrawForm euro={euro} send={sendWithdraw}/>
        <WithdrawList list={list}/>
      </div>
  );
};

export default withTranslation('Web')(Withdraw);
