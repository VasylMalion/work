import React from 'react';
import {Row, Col} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import Moment from 'react-moment';
import i18n from '../../utils/i18n';
import 'moment/locale/ru';
import Wrapper from '../lib/card.wrapper';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';

const packQuery = gql`
  query {
    user @client {
      login
      pack
      packEnd
    }
  }
`;

const DashboardPack = (props) => {
  let {loading, data} = useQuery(packQuery);
  if (loading) return <div/>;

  let user = data.user;

  let packName = convertPackName(user.pack);

  return (
      <Wrapper>
        <Row className="border-bottom mb-3 mt-3">
          <Col xs={5}>{props.t('dashboard-pack-type')}</Col>
          <Col xs={7}>{packName}</Col>
        </Row>
        {user.pack > 0 ?
            <Row>
              <Col xs={5}>{props.t('dashboard-pack-expire')}</Col>
              <Col xs={7}>
                <Moment format="LLL" locale={i18n.language}>
                  {parseInt(user.packEnd)}
                </Moment>
              </Col>
            </Row> : ''}
      </Wrapper>
  );
};

function convertPackName(packId) {
  switch (packId) {
    case 1:
      return 'Start';
    case 2:
      return 'Premium';
    case 3:
      return 'VIP';
    case 7:
      return 'LUX';
    default:
      return '-';
  }
}

export default withTranslation('Web')(DashboardPack);
