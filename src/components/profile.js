import React, {useState} from 'react';
import gql from 'graphql-tag';
import {withTranslation} from 'react-i18next';
import {useAuth} from '../context/auth-context';
import {Button, Col, Form, Input, Label, Row, Spinner} from 'reactstrap';
import {useMutation, useQuery} from '@apollo/react-hooks';
import getAvatar from './avatar';
import Change from './change.password';

const uploadFile = gql`
  mutation ($file: Upload!, $session: String!) {
    avatarUpload(file: $file, session: $session) {
      success
    }
  }
`;

const userAvatar = gql`
  query {
    user @client {
      login
      avatar {
        personal
      }
    }
  }
`;

const Profile = (props) => {
  let auth = useAuth();
  let session = auth.getSession();
  const [loading, setLoading] = useState(false);
  const [avatarUpload] = useMutation(uploadFile);
  const {loadingAvatar, data} = useQuery(userAvatar);

  if (loadingAvatar) return <div/>;

  const handleSubmit = (event) => {
    event.preventDefault();
    let form = event.target;
    setLoading(true);
    if (form.file.files[0] !== undefined)
      avatarUpload({variables: {file: form.file.files[0], session}})
          .then(async () => {
            form.reset();
            await auth.refetch();
            setLoading(false);
          });
  };

  let avatar = data.user.avatar.personal;
  if (!avatar) avatar = getAvatar(data.user.login);
  return (
      <div>
        <Row>
          <Col>
            <img src={avatar} alt="avatar"
                 style={{height: '256px', width: '256px'}}/>
            <Form onSubmit={handleSubmit}>
              <Label>{props.t('profile-avatar-upload')}</Label>
              <Input name="file" type="file" required className="mb-2"/>
              <Button type="submit" color="success" disabled={loading}>
                {props.t('profile-avatar-upload-button')}
                {loading ? <Spinner type="grow" size="sm"/> : ''}
              </Button>
            </Form>
          </Col>
        </Row>
        <Change/>
      </div>
  );
};

export default withTranslation('Web')(Profile);
