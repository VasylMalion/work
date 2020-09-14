import React from 'react';
import {withTranslation} from 'react-i18next';
import Spinner from '../lib/spinner';
import Wrapper from '../lib/card.wrapper';
import {Col, Row} from 'reactstrap';
import HtmlToReactParser from 'html-to-react';

const CardList = (props) => {
  const loading = props['loading'] === undefined ? false : props['loading'];
  if (loading) {
    return (
        <Wrapper>
          <Spinner/>
        </Wrapper>);
  }

  let parser = new HtmlToReactParser.Parser();
  const list = props['list'];
  if (list.length === 0) {
    return '';
  }

  const header = props['header'];
  const left = props['left'] ? props['left'] : 7;
  const right = 12 - left;
  const description = props['description'];
  const highlight = props['highlight'];

  return (
      <Wrapper>
        {header ? <Row><Col><h4>{header}</h4></Col></Row> : ''}
        {list.map((item, index) =>
            <Row className="border-bottom mb-3 mt-3" key={index}>
              <Col xs={left}>{item.label}</Col>
              <Col xs={right}>{item.value}</Col>
            </Row>,
        )}
        {highlight ?
            <Row><Col>
              <b>{parser.parse(highlight)}</b>
            </Col></Row> :
            ''}
        {description ?
            <Row><Col>
              <small>{parser.parse(description)}</small>
            </Col></Row> :
            ''}
      </Wrapper>
  );
};

export default withTranslation('Web')(CardList);
