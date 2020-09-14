import React from 'react';
import {withTranslation} from 'react-i18next';

const Step3 = (props) => {
  return (
      <div className="text-center">
        <h4 className={'text-success'}>
          {props.t('registration-form-success')}</h4>
      </div>
  );
};

export default withTranslation('Web')(Step3);
