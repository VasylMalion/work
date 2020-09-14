import {Button, Col, Label} from 'reactstrap';
import {
  AvFeedback,
  AvField,
  AvForm,
  AvGroup,
  AvInput,
} from 'availity-reactstrap-validation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import i18n from '../../utils/i18n';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';

const registrationMutation = gql`
  mutation registration($sponsor: String!, $login: String!, $firstName: String!,
    $lastName: String!, $email: String!, $phone: String!, $locale: String!){
    registration(sponsor: $sponsor, login: $login, firstName: $firstName,
      lastName: $lastName, email: $email, phone: $phone, locale: $locale){
      success
      error
    }
  }
`;

let phoneValid = false;
let phoneTouch = false;

const Step2 = (props) => {
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (phone) => {
    setPhone(phone);
  };
  const validatePhone = (value, country) => {
    if (phoneTouch === false) return true;
    phoneValid = (value && value.startsWith(country.dialCode) &&
        value.length > 10);
    return phoneValid;
  };

  const PhoneInputError = () => {
    if (phoneTouch === true && phoneValid === false)
      return (
          <span className={'small text-danger'}>
            {props.t('registration-error-field-invalid-phone')}</span>
      );
    return '';
  };

  const RegistrationError = () => {
    if (errorMessage)
      return (
          <div className="text-center alert-warning mt-2">
            <p>{props.t(errorMessage)}</p>
          </div>
      );
    return '';
  };

  const [registerUser] = useMutation(registrationMutation);

  const registration = (data) => {
    return new Promise(resolve => {
      registerUser({
        variables: data,
      }).then((result) => {
        resolve(result.data['registration']);
      });
    });
  };

  const sendRegistration = async (data) => {
    let result = await registration({
      sponsor: data.sponsor,
      login: data.login,
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      phone: data.phone,
      locale: i18n.language,
    });
    if (result.success) {
      props.setStep(3);
    } else {
      setErrorMessage(result.error);
    }
  };

  const TermsError = () => {
    return (<AvFeedback>{props.t(
        'registration-error-field-invalid-empty')}</AvFeedback>);
  };

  return (
      <AvForm onValidSubmit={async (event, data) => {
        if (phoneTouch === false) {
          phoneTouch = true;
          setLoading(false);
          return;
        }
        if (phoneValid === false) return;
        await sendRegistration(data);
      }}>
        <Col sm={12}>
          <AvField type='text' name='sponsor' id='sponsor'
                   label={props.t('registration-form-sponsor')}
                   value={props.sponsor} disabled/>
          <AvField type='text' name='login'
                   label={props.t('login-form-login')} id='login'
                   validate={{
                     required: {
                       value: true, errorMessage: props.t(
                           'registration-error-field-invalid-empty'),
                     },
                     pattern: {
                       value: '^[A-Za-z0-9]+$',
                       errorMessage: props.t(
                           'registration-error-field-invalid-login-symbol'),
                     },
                     minLength: {
                       value: 4,
                       errorMessage: props.t(
                           'registration-error-field-invalid-login-short'),
                     },
                     maxLength: {
                       value: 20,
                       errorMessage: props.t(
                           'registration-error-field-invalid-login-long'),
                     },
                   }}/>
          <AvField type="email" id="email" name={'email'}
                   label={props.t('reset-form-email')}
                   validate={{
                     required: {
                       value: true, errorMessage: props.t(
                           'registration-error-field-invalid-empty'),
                     },
                   }}/>
          <AvField type='text' name='firstname' id='firstname'
                   label={props.t('registration-form-firstname')}
                   validate={{
                     required: {
                       value: true, errorMessage: props.t(
                           'registration-error-field-invalid-empty'),
                     },
                   }}/>
          <AvField type='text' name='lastname' id='lastname'
                   label={props.t('registration-form-lastname')}
                   validate={{
                     required: {
                       value: true, errorMessage: props.t(
                           'registration-error-field-invalid-empty'),
                     },
                   }}/>
          <AvGroup>
            <Label for="phone">
              {props.t('registration-form-phone')}
            </Label>
            <AvInput id={'phone'} name='phone' type="hidden"
                     value={phone}/>
            <PhoneInput name={'phone2'}
                        value={phone}
                        country={'ru'}
                        placeholder={''}
                        onChange={handlePhoneChange}
                        onFocus={() => phoneTouch = true}
                        isValid={validatePhone}/>
            <PhoneInputError/>
          </AvGroup>
          <Label>{props.t('registration-form-terms')}</Label>
          <div className={'mb-3'}>
            <AvGroup check>
              <Label check>
                <AvInput type={'checkbox'} name={'terms1'} required/>
                <a href={props.t('registration-form-terms1-link')}
                   rel="noopener noreferrer"
                   target={'_blank'}>{props.t('registration-form-terms1')}</a>
                <TermsError/>
              </Label>
            </AvGroup>
            <AvGroup check>
              <Label check>
                <AvInput type={'checkbox'} name={'terms2'} required/>
                <a href={props.t('registration-form-terms2-link')}
                   rel="noopener noreferrer"
                   target={'_blank'}>{props.t('registration-form-terms2')}</a>
                <TermsError/>
              </Label>
            </AvGroup>
            <AvGroup check>
              <Label check>
                <AvInput type={'checkbox'} name={'terms3'} required/>
                <a href={props.t('registration-form-terms3-link')}
                   rel="noopener noreferrer"
                   target={'_blank'}>{props.t('registration-form-terms3')}</a>
                <TermsError/>
              </Label>
            </AvGroup>
            <AvGroup check>
              <Label check>
                <AvInput type={'checkbox'} name={'terms4'} required/>
                <a href={props.t('registration-form-terms4-link')}
                   rel="noopener noreferrer"
                   target={'_blank'}>{props.t('registration-form-terms4')}</a>
                <TermsError/>
              </Label>
            </AvGroup>
          </div>
        </Col>
        <AvGroup row>
          <Col sm={12} className='text-center'>
            <Button type='submit' color='success' disabled={loading}>
              {props.t('registration-form-button')}
            </Button>
            <RegistrationError/>
          </Col>
        </AvGroup>
      </AvForm>
  );
};

export default withTranslation('Web')(Step2);
