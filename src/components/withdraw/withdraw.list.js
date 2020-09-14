import React from 'react';
import Moment from 'react-moment';
import {withTranslation} from 'react-i18next';

import {Card, CardBody, CardTitle, Col, Row} from 'reactstrap';
import CardText from 'reactstrap/es/CardText';
import i18n from '../../utils/i18n';
import CardFooter from 'reactstrap/es/CardFooter';

const WithdrawList = (props) => {

  let transformStatus = (status) => {
    switch (status) {
      case 0:
        return props.t('withdraw-card-status-pending');
      case 1:
        return props.t('withdraw-card-status-approved');
      default:
        return props.t('withdraw-card-status-invalid');
    }
  };

  let ListItem = (localProps) => {
    return (
        <Col xs={12}>
          <Card className="mb-2">
            <CardBody>
              <CardTitle>
                {props.t('withdraw-card-title') + ' '}
                <Moment format="LLL" locale={i18n.language}>
                  {parseFloat(localProps.data.created)}
                </Moment>
              </CardTitle>
              <CardText>
                {props.t('withdraw-card-address') + ': ' +
                localProps.data.address}<br/>
                {props.t('withdraw-card-amount') + ': €' +
                localProps.data.amount}<br/>
              </CardText>
            </CardBody>
            <CardFooter>
              <b>
                {props.t('withdraw-card-status') + ': ' +
                transformStatus(localProps.data.status)}
              </b>
            </CardFooter>
          </Card>
        </Col>);
  };

  if (props.list.length === 0) return ('');
  return (
      <Row>
        <h3>{props.t('withdraw-list-title')}</h3>
        {props.list.map((value, index) => {
          return (<ListItem key={index} data={value}/>);
        })}
      </Row>
  );
};

export default withTranslation('Web')(WithdrawList);
