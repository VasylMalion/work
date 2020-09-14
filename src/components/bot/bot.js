import React from 'react';
import {CardColumns} from 'reactstrap';
import {withTranslation} from 'react-i18next';
import BotIncome from './bot.income';
import BotInfo from './bot.info';
import BotPayment from './bot.payment';

const BotDashboard = () => {
  return (
      <CardColumns>
        <BotIncome/>
        <BotPayment/>
        <BotInfo/>
      </CardColumns>
  );
};

export default withTranslation('Web')(BotDashboard);
