import React, {useState} from 'react';
import {Button, Row, Col} from 'reactstrap';

import {withTranslation} from 'react-i18next';
import {useAuth} from '../context/auth-context';
import {
  AvField,
  AvForm,
  AvGroup,
} from 'availity-reactstrap-validation';
import {useMutation} from '@apollo/react-hooks';
import gql from "graphql-tag";

const changeUserPasswordMutation = gql`
  mutation changeUserPassword($session: String!, $oldPassword: String!, $newPassword: String!,
    $repeatPassword: String!){
    changeUserPassword(session: $session, oldPassword: $oldPassword, newPassword: $newPassword,
      repeatPassword: $repeatPassword){
      success
    }
  }
`;

const ChangePassword = (props) => {
  const auth = useAuth();
  let session = auth.getSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [changeUserPassword] = useMutation(changeUserPasswordMutation);

  const change = (data) => {
    setLoading(true);
    return new Promise(resolve => {
      changeUserPassword({
        variables: {
          session,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          repeatPassword: data.repeatPassword,
        },
      }).then((result) => {
        setLoading(false);
        let success = result.data['changeUserPassword'];
        if(success) {
          setMessage(props.t('change-form-success'));
        } else {
          setMessage(props.t('change-form-error'));
        }
        resolve();
      })
    });
  };

  const validateOptions = {
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
  };

  return (
      <Row>
        <Col sm="12" md={{size: 6, offset: 0}} lg={{size: 5, offset: 0}}>
          <h3 className="text-center mb-3 mt-3">
            {props.t('change-form-header')}
          </h3>
          <AvForm onValidSubmit={async (event, data) => {
            await change(data);
          }}>
            <AvField type='password' name='oldPassword'
                     label={props.t('change-form-old')} id='oldPassword'
                     validate={validateOptions}/>
            <AvField type='password' name='newPassword'
                     label={props.t('change-form-new')} id='newPassword'
                     validate={validateOptions}/>
            <AvField type='password' name='repeatPassword'
                     label={props.t('change-form-repeat')} id='repeatPassword'
                     validate={validateOptions}/>
            <AvGroup row>
              <Col sm={12} className='text-center'>
                <Button type='submit' color='success' disabled={loading}>
                  {props.t('change-form-button')}
                </Button>
                <div className="text-center alert-warning mt-2">
                  <p>{message}</p>
                </div>
              </Col>
            </AvGroup>
          </AvForm>
        </Col>
      </Row>
  );
};

export default withTranslation('Web')(ChangePassword);
