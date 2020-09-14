import React from 'react';
import {Card} from 'reactstrap';
import {withTranslation} from 'react-i18next';

const Wrapper = ({children}) => {
  return (
      <Card body className="shadow mb-3">
        {children}
      </Card>
  );
};

export default withTranslation('Web')(Wrapper);
