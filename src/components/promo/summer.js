import React from 'react';
import {Col, Row, UncontrolledAlert} from 'reactstrap';
import Timer from '../lib/timer';
import './summer.scss';
import {withTranslation} from 'react-i18next';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import HtmlToReactParser from 'html-to-react';

const summerQuery = gql`
  query {
    user @client {
      id
      login
      promo {
        summer {
          allow
          start
          pack1
          pack3
          pack7
          end
        }
      }
    } 
  }
`;

const SummerPromo = (props) => {
  let parser = new HtmlToReactParser.Parser();

  const {loading, data} = useQuery(summerQuery);

  if (loading) return '';

  let result = data.user.promo.summer;
  if (result.allow === false && result.start === false) return '';
  if (result.start) {
    result.end = new Date();
    result.pack1 = 0;
    result.pack3 = 0;
    result.pack7 = 0;
  }

  return (
      <UncontrolledAlert color="success">
        <Row>
          <Col xs={{size: 12, order: 2}} md={{size: 4, order: 1}}>
            <p><Timer className="promo-summer-timer"
                      deadline={result.end}/></p>
            <p>START - {result.pack1}<br/>
              VIP - {result.pack3}<br/>
              LUX - {result.pack7}
            </p>
          </Col>
          <Col xs={{size: 12, order: 1}} md={{size: 8, order: 2}}>
            <h2>{props.t('promo-summer-title')}</h2>
            {parser.parse(props.t('promo-summer-description'))}
          </Col>
        </Row>
      </UncontrolledAlert>
  );
};

export default withTranslation('Web')(SummerPromo);
