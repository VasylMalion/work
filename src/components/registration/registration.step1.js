import {Button} from 'reactstrap';
import {AvField, AvForm} from 'availity-reactstrap-validation';
import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';

const Step1 = (props) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const SponsorCheckError = () => {
    if (error === true)
      return (
          <div className="text-center alert-warning mt-2">
            <p>{props.t('registration-error-field-sponsor')}</p>
          </div>
      );
    return ('');
  };

  const handleSubmit = async (event, data) => {
    setLoading(true);
    if (!await props.checkSponsor(data.sponsor)) {
      setError(true);
    }
    setLoading(false);
  };

  return (
      <AvForm onValidSubmit={handleSubmit} className="mb-3">
        <AvField type='text' name='sponsor' id='sponsor'
                 label={props.t('registration-form-sponsor')}/>
        <div className="text-center">
          <Button type={'submit'} disabled={loading} color="success">
            {props.t('registration-form-button-sponsor')}</Button>
          <SponsorCheckError/>
        </div>
      </AvForm>
  );
};

export default withTranslation('Web')(Step1);
