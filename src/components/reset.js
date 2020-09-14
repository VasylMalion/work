import React, {useState} from 'react';
import {
  Button,
  Form,
  Input,
  FormGroup,
  Label,
  Container,
  Row,
  Col,
} from 'reactstrap';

import {withTranslation} from 'react-i18next';
import {useAuth} from '../context/auth-context';
import {Link} from 'react-router-dom';

const Reset = (props) => {
  const auth = useAuth();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendReset = async (event) => {
    let target = event.target;
    setLoading(true);
    let result = await auth.reset(event.target.login.value,
        event.target.email.value);
    setLoading(false);
    if (result) {
      target.reset();
      setMessage(props.t('reset-form-success'));
    } else {
      setMessage(props.t('reset-form-error'));
    }
  };
  return (
      <Container>
        <Row>
          <Col sm="12" md={{size: 6, offset: 3}} lg={{size: 4, offset: 4}}>
            <h1 className="text-center mb-5 mt-5">
              {props.t('reset-form-header')}
            </h1>
            <Form onSubmit={async (e) => {
              e.preventDefault();
              await sendReset(e);
            }}>
              <FormGroup row>
                <Label for='login' sm={4}>
                  {props.t('reset-form-login')}
                </Label>
                <Col sm={8}>
                  <Input type='text' name='login' id='login' required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="email" sm={4}>
                  {props.t('reset-form-email')}
                </Label>
                <Col sm={8}>
                  <Input type="email" id="email" required/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={12} className='text-center'>
                  <Button type='submit' color='success'
                          disabled={loading}>
                    {props.t('reset-form-button')}
                  </Button>
                </Col>
              </FormGroup>
            </Form>
            <div className="text-center">
              <Link to="/">{props.t('login-form-header')}</Link>
            </div>
            <div className="text-center alert-warning">
              <p>{message}</p>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default withTranslation('Web')(Reset);
