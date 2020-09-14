import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Link, useLocation} from 'react-router-dom';
import Step1 from './registration.step1';
import Step2 from './registration.step2';
import Step3 from './registration.step3';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import {Col, Container, Row} from 'reactstrap';

const sponsorMutation = gql`
  mutation loginExists($login: String!){
    loginExists(login: $login){
      success
    }
  }
`;

let refChecked = false;

const Registration = (props) => {
  const [step, setStep] = useState(1);

  const useQuery = new URLSearchParams(useLocation().search);
  const [sponsor, setSponsor] = useState('');

  const [loginExists, loginExistsData] = useMutation(sponsorMutation);

  const checkLogin = (data) => {
    return new Promise(resolve => {
      loginExists({
        variables: {
          login: data,
        },
      }).then((result) => {
        resolve(result.data['loginExists'].success);
      });
    });
  };

  const checkSponsor = async (sponsor) => {
    let result = await checkLogin(sponsor);
    if (result) {
      setSponsor(sponsor);
      setStep(2);
      return true;
    }
    return false;
  };

  if (useQuery.get('ref') !== null) {
    if (refChecked === false && loginExistsData.loading === false &&
        sponsor !== useQuery.get('ref')) {
      refChecked = true;
      checkSponsor(useQuery.get('ref'));
    }
  }

  const getStep = (step) => {
    switch (step) {
      case 2:
        return <Step2 sponsor={sponsor} t={props.t} setStep={setStep}/>;
      case 3:
        return <Step3 t={props.t}/>;
      default:
        return <Step1 checkSponsor={checkSponsor} t={props.t}/>;
    }
  };

  return (
      <Container>
        <Row>
          <Col sm="12" md={{size: 6, offset: 3}} lg={{size: 4, offset: 4}}>
            <h1 className="text-center mb-5 mt-5">
              {props.t('registration-form-header')}
            </h1>
            {getStep(step)}
            <div className="text-center mb-5">
              <Link to={'/'}>{props.t('login-form-button')}</Link>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default withTranslation('Web')(Registration);
