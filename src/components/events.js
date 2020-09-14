import React from 'react';
import {withTranslation} from 'react-i18next';
import HtmlToReactParser from 'html-to-react';

const Events = (props) => {
  let parser = new HtmlToReactParser.Parser();
  let html = props.t('events-text');
  let Element = parser.parse(html);

  return (
      <div>{Element}</div>
  );
};

export default withTranslation('Web')(Events);
