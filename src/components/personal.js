import React from 'react';
import {withTranslation} from 'react-i18next';
import {
  Card, CardBody, CardDeck, CardHeader, CardText,
} from 'reactstrap';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {useAuth} from '../context/auth-context';
import i18n from '../utils/i18n';
import Moment from 'react-moment';
import 'moment/locale/ru';
import getAvatar from './avatar';
import Spinner from './lib/spinner';

const personalQuery = gql`
  query userSession($session: String!){
    userSession(session: $session){
      success
      user{
        id
        personals{
          id
          login
          pack
          email
          phone
          firstName
          lastName
          createdAt
          avatar{
            personal
          }
        }
      }
    }
  }
`;

let personalData = [];
const Personal = (props) => {
  let auth = useAuth();
  let session = auth.getSession();

  const {loading, error, data} = useQuery(personalQuery,
      {variables: {session}});
  if (loading === false && error === undefined) {
    if (data['userSession'].success) {
      personalData = data['userSession'].user.personals;
    }
  }

  const UserCard = (props) => {
    const fullName = props.user.firstName + ' ' + props.user.lastName;
    let avatar = props.user.avatar.personal;
    if (!avatar) avatar = getAvatar(props.user.login);
    const style = {
      'backgroundImage': 'url(' + avatar + ')',
    };
    return (
        <Card className="personal-card">
          <CardHeader
              className={'text-center personal-card-header ' +
              defineColorPack(props.user.pack)}>
            {props.user.login}
          </CardHeader>
          <CardBody style={style} className="personal-card-body">
            <CardText>
              {fullName}<br/>
              <small>
                <a href={'mailto:' + props.user.email}>
                  {props.user.email}</a><br/>
                {'+' + props.user.phone} <br/>
              </small>
              <small className="text-muted">
                {props.t('personals-registration') + ': '}
                <Moment format="LLL" locale={i18n.language}>
                  {parseInt(props.user.createdAt)}
                </Moment>
              </small>
            </CardText>
          </CardBody>
        </Card>
    );
  };

  personalData = personalData.sort((a, b) => {
    return parseInt(a.createdAt) - parseInt(b.createdAt);
  });

  if (loading) {
    return (
        <Spinner/>
    );
  }

  return (
      <CardDeck>
        {personalData.map((item) => {
          return (<UserCard t={props.t} user={item} key={item.id}/>);
        })}
      </CardDeck>);
};

function defineColorPack(pack) {
  switch (pack) {
    case 1:
      return 'background-pack-start';
    case 2:
      return 'background-pack-premium';
    case 3:
      return 'background-pack-vip';
    default:
      return '';
  }
}

export default withTranslation('Web')(Personal);
