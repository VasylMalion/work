import React, {useState} from 'react';
import {
  Button, Container, Row, Col,
} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/auth-context';
import {AvField, AvForm, AvGroup} from 'availity-reactstrap-validation';

const Login = (props) => {
  const auth = useAuth();
  const [message, setMessage] = useState('');
  const sendLogin = async (data) => {
    let result = await auth.login(data.login.trim(),
       data.password.trim());
    if (!result) {
      setMessage(props.t('login-form-error'));
    }
  };
  const LoginError = () => {
    return (
        <div className="text-center alert-warning">
          <p>{message}</p>
        </div>
    );
  };
  return (
      <Container>
        <Row>
          <Col sm="12" md={{size: 6, offset: 3}} lg={{size: 3, offset: 4}}>
            <h1 className="text-center mb-5 mt-5">
              {props.t('login-form-header')}
            </h1>
            <AvForm onValidSubmit={async (event, data) => {
              await sendLogin(data);
            }}>
              <AvField type='text' name='login'
                       label={props.t('login-form-login')} id='login'
                       validate={{
                         required: {
                           value: true, errorMessage: props.t(
                               'registration-error-field-invalid-empty'),
                         },
                         pattern: {
                           value: '^([A-Za-z0-9_\\-\\.\\@])+$',
                           errorMessage: props.t(
                               'registration-error-field-invalid-login-symbol'),
                         },
                         minLength: {
                           value: 2,
                           errorMessage: props.t(
                               'registration-error-field-invalid-login-short'),
                         },
                         maxLength: {
                           value: 20,
                           errorMessage: props.t(
                               'registration-error-field-invalid-login-long'),
                         },
                       }}/>
              <AvField type='password' name='password'
                       label={props.t('login-form-password')} id='password'
                       validate={{
                         required: {
                           value: true, errorMessage: props.t(
                               'registration-error-field-invalid-empty'),
                         },
                         minLength: {
                           value: 6,
                           errorMessage: props.t(
                               'change-error-field-invalid-password-short'),
                         },
                         maxLength: {
                           value: 20,
                           errorMessage: props.t(
                               'change-error-field-invalid-password-long'),
                         },
                       }}/>
              <AvGroup row>
                <Col sm={12} className='text-center'>
                  <Button type='submit' color='success'>
                    {props.t('login-form-button')}
                  </Button>
                </Col>
              </AvGroup>
            </AvForm>
            <div className="text-center mb-2">
              <p>
                <Link to="/reset">{props.t('login-form-forgot')}</Link>
              </p>
              <p>
                <Link to="/registration">
                  {props.t('login-form-registration')}</Link></p>
            </div>
            <LoginError/>
          </Col>
        </Row>
      </Container>);
};

export default withTranslation('Web')(Login);
