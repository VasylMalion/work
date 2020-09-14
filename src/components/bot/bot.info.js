import React from 'react';
import {withTranslation} from 'react-i18next';
import Wrapper from '../lib/card.wrapper';
import {Col, Row} from 'reactstrap';
import HtmlToReactParser from 'html-to-react';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import CardList from '../lib/card.list';

const fundsQuery = gql`
  query {
    user{
      id
      botToken
    }
  }
`;

const BotInfo = (props) => {
  let parser = new HtmlToReactParser.Parser();

  const {loading, data} = useQuery(fundsQuery);

  if (loading) return <CardList loading={loading}/>;

  return (
      <Wrapper>
        <Row>
          <Col xs={12} className="mb-2">
            {parser.parse(props.t('bot-info-link', {
              link: 'https://t.me/richlandbot?start=' +
                  data.user.botToken,
            }))}
          </Col>
          <Col xs={12}>{parser.parse(props.t('bot-info-help'))}</Col>
        </Row>
      </Wrapper>
  );
};

export default withTranslation('Web')(BotInfo);
