import {withTranslation} from 'react-i18next';
import Spinner from '../lib/spinner';
import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {useAuth} from '../../context/auth-context';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
} from 'reactstrap';
import getAvatar from '../avatar';
import Suggest from './genealogy.suggest';
import classNames from 'classnames';

const personalQuery = gql`
  query userSession($session: String!){
    userSession(session: $session){
      user{
        id
        genealogy
        direction
      }
    }
  }
`;

let loginObjects = [];

const Genealogy = (props) => {
  let auth = useAuth();
  let session = auth.getSession();
  const {loading, data} = useQuery(personalQuery, {variables: {session}});
  const [pointer, setPointer] = useState(null);
  const [genealogy, setGenealogy] = useState(null);

  const calculateGenealogy = (item) => {
    loginObjects.push({login: item.login, object: item});
    if (item.left) {
      item.left.up = item;
      calculateGenealogy(item.left);
      item.registrationLeft
          = item.left.registrationLeft + item.left.registrationRight + 1;
    } else {
      item.registrationLeft = 0;
    }
    if (item.right) {
      item.right.up = item;
      calculateGenealogy(item.right);
      item.registrationRight
          = item.right.registrationLeft + item.right.registrationRight + 1;
    } else {
      item.registrationRight = 0;
    }
    return item;
  };

  if (loading) {
    return (
        <Spinner/>
    );
  }

  if (!loading && genealogy === null) {
    loginObjects = [];
    setGenealogy(
        calculateGenealogy(JSON.parse(data.userSession.user.genealogy)));
  }
  if (!loading && genealogy !== null && pointer === null) {
    let item = genealogy;
    let direction = data.userSession.user.direction === 0 ? 'left' : 'right';
    while (item[direction]) {
      item = item[direction];
    }
    item[direction] = {next: true};
    setPointer(genealogy);
    setGenealogy(genealogy);
  }

  const handleGenealogyClick = (user, depth) => {
    if (depth === 0) {
      if (user.up !== undefined) {
        setPointer(user.up);
        return;
      }
    }
    setPointer(user);
  };

  const handleTop = () => {
    setPointer(genealogy);
  };

  const handleUp = () => {
    if (pointer.up) setPointer(pointer.up);
  };

  const handleDown = (direction = 'left') => {
    if (pointer[direction]) {
      if (pointer[direction].next) return;
      setPointer(pointer[direction]);
    }
  };

  const handleBottom = (direction = 'left') => {
    let item = pointer;
    while (item[direction] && item[direction].next === undefined) {
      item = item[direction];
    }
    setPointer(item);
  };

  const handleNew = (object) => {
    setPointer(object);
  };

  const UserEmpty = (local) => {
    if (local.depth > 2) return (' ');
    const classList = ['personal-card', 'mod-genealogy', 'mod-empty'];
    if (local.next) classList.push('mod-next');
    const list = classNames(classList);
    return (
        <div>
          <Card className={list}>
            <CardBody className="personal-card-body">
              {local.next ?
                  props.t('genealogy-next') :
                  props.t('genealogy-empty')}
            </CardBody>
          </Card>
        </div>);
  };

  const NextCard = (props) => {
    return (
        <Col>
          {props.user !== null ?
              <UserCard user={props.user}
                        depth={props.depth}/> :
              <UserEmpty user={props.user}
                         depth={props.depth}/>}
        </Col>);
  };

  const UserCard = (props) => {
    const maxDepth = 2;
    if (props.depth > maxDepth) return (' ');
    if (props.user && props.user.next) return <UserEmpty next={true}/>;
    let avatar = props.user.avatar;
    if (!avatar) avatar = getAvatar(props.user.login);
    const style = {'backgroundImage': 'url(' + avatar + ')'};
    return (
        <div className={(props.depth < maxDepth) ? 'genealogy-lines' : ''}>
          <Card className="personal-card mod-genealogy"
                onClick={() => handleGenealogyClick(props.user, props.depth)}>
            <div className="genealogy-card-left">
              <div className="genealogy-card-hint">
                {props.user.registrationLeft}</div>
              <div className="genealogy-card-hint">
                {props.user.pointLeft}</div>
            </div>
            <CardHeader
                className={'text-center personal-card-header ' +
                defineColorPack(props.user.pack)}>
              {props.user.login}
            </CardHeader>
            <CardBody style={style} className="personal-card-body"/>
            <div className="genealogy-card-right">
              <div className="genealogy-card-hint">
                {props.user.registrationRight}</div>
              <div className="genealogy-card-hint">
                {props.user.pointRight}</div>
            </div>
          </Card>
          <Row>
            <NextCard user={props.user.left} depth={props.depth + 1}/>
            <NextCard user={props.user.right} depth={props.depth + 1}/>
          </Row>
        </div>
    );
  };

  const Buttons = (local) => {
    const direction = local.direction;
    return (
        <Col className={'text-' + direction}>
          <Button color="success" className="mb-1"
                  onClick={() => handleDown(local.direction)}>
            {props.t('genealogy-' + direction + '-down')}</Button><br/>
          <Button color="success" onClick={() => handleBottom(direction)}>
            {props.t('genealogy-' + direction + '-down-full')}</Button>
        </Col>
    );
  };

  return (
      <div>
        <Suggest data={loginObjects} newPosition={handleNew}/>
        <div className="text-center mb-3">
          <Button color="success" className="mb-1" onClick={handleTop}>
            {props.t('genealogy-top')}</Button><br/>
          <Button color="success" onClick={handleUp}>
            {props.t('genealogy-up')}</Button>
        </div>
        <UserCard user={pointer} depth={0}/>
        <Row>
          <Buttons direction="left"/>
          <Buttons direction="right"/>
        </Row>
      </div>);
};

function defineColorPack(pack) {
  switch (pack) {
    case 1:
      return 'background-pack-start';
    case 2:
      return 'background-pack-premium';
    case 3:
      return 'background-pack-vip';
    case 7:
      return 'background-pack-lux';
    default:
      return '';
  }
}

export default withTranslation('Web')(Genealogy);
