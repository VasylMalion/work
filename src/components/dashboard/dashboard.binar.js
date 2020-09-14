import React, {useRef} from 'react';
import {Row, Col, Button, ButtonGroup, Spinner} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import InputGroup from 'reactstrap/es/InputGroup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy} from '@fortawesome/free-regular-svg-icons';
import gql from 'graphql-tag';
import {useMutation, useQuery} from '@apollo/react-hooks';
import Wrapper from '../lib/card.wrapper';

const getDirection = gql`
  query {
    user @client {
      login
      referLink
      referLinkLogin
      personalCount
      direction
    }
  }
`;
const changeDirectionMutation = gql`
  mutation changeDirection ($session: String!, $direction: Int!){
    changeDirection (session: $session, direction: $direction) @client
  }
`;

const DashboardBinar = (props) => {
  const {loading, data} = useQuery(getDirection);

  let refInput = useRef(null);
  let refInput2 = useRef(null);

  const [changeDirection] = useMutation(changeDirectionMutation);

  const handleChangeDirection = (direction) => {
    return changeDirection({variables: {direction}});
  };

  if (loading) return <Spinner/>;
  let user = data.user;

  const ButtonDirection = (props) => {
    return (
        <Button color="success" outline={user.direction !== props.id}
                disabled={user.personalCount === 0}
                onClick={() => handleChangeDirection(props.id)}
                active={user.direction === props.id}>{props.text}</Button>
    );
  };

  const copyLink = () => {
    refInput.select();
    document.execCommand('copy');
  };
  const copyLink2 = () => {
    refInput2.select();
    document.execCommand('copy');
  };

  return (
      <Wrapper>
        <Row className="border-bottom mb-3 mt-3">
          <Col xs={6}>{props.t('dashboard-binar-direction')}</Col>
          <Col xs={6}>
            <ButtonGroup>
              <ButtonDirection id={0} text={props.t('dashboard-binar-left')}/>
              <ButtonDirection id={1} text={props.t('dashboard-binar-right')}/>
            </ButtonGroup>
            {loading ? <Spinner type="grow" color="success"/> : ''}
            <br/>
          </Col>
        </Row>
        {user.personalCount === 0 ?
            <Row>
              <Col xs={12}>
                <span className="dashboard-hint">
                  {props.t('dashboard-binar-personal-zero')}</span>
              </Col>
            </Row> : ''}
        <Row className="border-bottom mb-3 mt-3">
          <Col xs={6}>{props.t('dashboard-binar-personal-count')}</Col>
          <Col xs={6}>
            {user.personalCount}
          </Col>
        </Row>
        <Row className="border-bottom mb-3 mt-3">
          <Col xs={12}>{props.t('dashboard-binar-refer-link')}</Col>
          <Col xs={12}>
            <InputGroup>
              <input value={user.referLink} readOnly className="form-control"
                     ref={(c => (refInput = c))}/>
              <div className="input-group-append">
                <Button outline onClick={copyLink}>
                  <FontAwesomeIcon icon={faCopy}/></Button>
              </div>
            </InputGroup>
          </Col>
        </Row>
        <Row className="border-bottom mb-3 mt-3">
          <Col xs={12}>{props.t('dashboard-binar-refer-link-login')}</Col>
          <Col xs={12}>
            <InputGroup>
              <input value={user.referLinkLogin} readOnly
                     className="form-control"
                     ref={(c => (refInput2 = c))}/>
              <div className="input-group-append">
                <Button outline onClick={copyLink2}>
                  <FontAwesomeIcon icon={faCopy}/></Button>
              </div>
            </InputGroup>
          </Col>
        </Row>
      </Wrapper>
  );
};

export default withTranslation('Web')(DashboardBinar);
