import gql from 'graphql-tag';
import {useAuth} from '../../context/auth-context';
import {useQuery} from '@apollo/react-hooks';
import {bignumber} from 'mathjs';
import React from 'react';
import Timer from '../lib/timer';
import {withTranslation} from 'react-i18next';
import HtmlToReactParser from 'html-to-react';
import {Col, Row} from 'reactstrap';
import Moment from 'moment';
import i18n from '../../utils/i18n';

const fundsQuery = gql`
  query ($session: String!){
    userSession(session: $session){
      success
      user{
        id
        login
        funds{
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

const TokenNegative = ({t}) => {
  let auth = useAuth();
  let session = auth.getSession();
  let parser = new HtmlToReactParser.Parser();

  const {loading, data} = useQuery(fundsQuery, {variables: {session}});
  if (loading) return '';

  let funds = data['userSession'].user.funds;
  let tokens = bignumber(funds.tokenBasic.balance)
      .add(funds.tokenPack.balance)
      .add(funds.tokenPremium.balance)
      .add(funds.tokenGift.balance).mul(-1).ceil().toNumber();

  if (tokens <= 0) return '';

  let deadline = new Date(2020, 8, 15);
  let moment = new Moment(new Date(2020, 8, 14));
  moment.locale(i18n.language);
  let date = moment.format('LL');

  return <div className="p-3">
    <Row className="bg-danger p-3 rounded mb-2 d-flex text-light">
      <Col xl={2} lg={2} md={3} sm={4} xs={12}
           className="d-flex align-items-center">
        <h4><Timer deadline={deadline}/></h4>
      </Col>
      <Col>
        {parser.parse(t('alert-token-negative', {tokens, date}))}
      </Col>
    </Row>
  </div>;

};

export default withTranslation('Web')(TokenNegative);
