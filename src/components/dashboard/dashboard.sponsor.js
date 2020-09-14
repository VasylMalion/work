import React from 'react';
import {withTranslation} from 'react-i18next';
import getAvatar from '../avatar';
import Wrapper from '../lib/card.wrapper';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

import 'moment/locale/ru';

const sponsorQuery = gql`
  query {
    user @client {
      id
      sponsor {
        login
        email
        avatar {
          dashboard
        }
      }
    }
  }
`;

const DashboardSponsor = (props) => {
  let {loading, data} = useQuery(sponsorQuery);
  if (loading) return <div/>;

  let user = data.user.sponsor;

  let avatar = user.avatar.dashboard;
  if (!avatar) avatar = getAvatar(user.login);
  return (
      <Wrapper>
        <div className="dashboard-sponsor">
          <div className="mr-3 dashboard-sponsor-image" style={{
            'backgroundImage': 'url(' + avatar + ')',
          }}/>
          <div>
            <h5>{props.t('dashboard-sponsor-title')}</h5>
            {user.login}<br/>
            <small>
              <a href={'mailto:' + user.email}>
                {user.email}</a><br/>
            </small>
          </div>
        </div>
      </Wrapper>
  );
};

export default withTranslation('Web')(DashboardSponsor);
