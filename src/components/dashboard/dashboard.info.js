import React from 'react';
import {withTranslation} from 'react-i18next';
import CardList from '../lib/card.list';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

const userQuery = gql`
  query {
    user @client {
      login
      phone
      email
      firstName
      lastName
    }
  }
`;

const DashboardInfo = (props) => {
  let {loading, data} = useQuery(userQuery);
  if (loading) return <div/>;

  let user = data.user;

  let firstPanel = [
    {label: props.t('dashboard-login'), value: user.login},
    {label: props.t('dashboard-phone'), value: '+' + user.phone},
    {label: props.t('dashboard-email'), value: user.email},
    {
      label: props.t('dashboard-name'),
      value: user.firstName + ' ' + user.lastName,
    },
  ];

  return <CardList left={4} list={firstPanel}/>;
};

export default withTranslation('Web')(DashboardInfo);
