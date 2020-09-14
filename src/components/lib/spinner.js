import React from 'react';
import {Col, Row, Spinner} from 'reactstrap';

const SpinnerPage = () => {

  return (
      <Row className="h-100 justify-content-center align-items-center">
        <Col className="text-center">
          <Spinner color="success" style={{width: '10rem', height: '10rem'}}
                   type="grow"/>
        </Col>
      </Row>);
};

export default SpinnerPage;
