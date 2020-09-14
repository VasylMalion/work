import React from 'react';
import {withTranslation} from 'react-i18next';
import HtmlToReactParser from 'html-to-react';

const Documents = (props) => {
  let parser = new HtmlToReactParser.Parser();
  let html = props.t('documents-text');
  let Element = parser.parse(html);

  return (
      <div>{Element}</div>
  );
};

export default withTranslation('Web')(Documents);
