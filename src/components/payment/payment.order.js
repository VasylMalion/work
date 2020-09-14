import React, {useRef, useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Button, Card, CardText, CardTitle, Col} from 'reactstrap';
import 'moment/locale/ru';
import InputGroup from 'reactstrap/es/InputGroup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy} from '@fortawesome/free-regular-svg-icons';
import './payment.scss';
import btcPng from '../../image/coins/btc.png';
import ethPng from '../../image/coins/eth.png';
import usdtPng from '../../image/coins/usdt.png';

const PaymentOrder = (props) => {
  let refInput = useRef(null);
  const [deadline, setDeadline] = useState(null);

  if (deadline === null) {
    let finish = new Date(props.data.created + props.data.timeout * 1000);
    let left = finish.getTime() - new Date().getTime();
    left = Math.floor(left / 1000);
    if (left < 0) left = 0;
    setDeadline(left);
  }

  let status = props.data.status;
  if (deadline === 0) {
    status = -1;
  }

  const productName = () => {
    switch (props.data.product) {
      case 1:
        return 'START';
      case 2:
        return 'PREMIUM';
      case 3:
        return 'VIP';
      case 4:
        return props.t('payment-order-upgrade-to') + ' PREMIUM';
      case 5:
        return props.t('payment-order-upgrade-to') + ' VIP';
      case 6:
        return props.t('payment-order-upgrade-to') + ' VIP';
      case 7:
        return 'LUX';
      case 8:
        return props.t('payment-order-upgrade-to') + ' LUX';
      case 9:
        return props.t('payment-order-upgrade-to') + ' LUX';
      case 100:
        return props.t('payment-order-token') + ' x ' + props.data.quantity;
      default:
        return 'START';
    }
  };

  const getDeadline = () => {
    if (status < 0) return (
        <b>{props.t('payment-order-expired')}</b>);
    if (status > 0) return (
        <b>{props.t('payment-order-success')}</b>);
    const hours = ('0' + Math.floor(deadline / 3600)).slice(-2);
    const minutes = ('0' + Math.floor((deadline - hours * 3600) / 60)).slice(
        -2);
    const seconds = ('0' + (deadline - hours * 3600 - minutes * 60)).slice(-2);

    const result = hours + ':' + minutes + ':' + seconds;
    return (<span><b>{props.t('payment-order-deadline')}: </b>{result}</span>);
  };
  const copyAddress = () => {
    refInput.select();
    document.execCommand('copy');
  };

  useEffect(() => {
    deadline > 0 && setTimeout(() => setDeadline(deadline - 1), 1000);
  }, [deadline]);

  const isDone = () => {
    return status !== 0;
  };

  const cardClasses = () => {
    if (status > 0) return 'order-success';
    if (deadline > 0) return '';
    return 'order-expired';
  };

  const AmountView = () => {
    let amount = parseFloat(props.data.amount);
    if (['USDT', 'USDT.ERC20'].includes(props.data.currency)) amount.toFixed(2);
    else amount.toFixed(8);
    return (
        <span>{amount} {props.data.currency}</span>
    );
  };

  let image;
  switch (props.data.currency) {
    case 'BTC':
      image = btcPng;
      break;
    case 'ETH':
      image = ethPng;
      break;
    case 'USDT':
    case 'USDT.ERC20':
      image = usdtPng;
      break;
    default:
      image = '';
  }

  const TokenAmount = () => {
    let quantity = parseFloat(props.data.quantity);
    if (quantity > 1) {
      return (
          <span>{<b>{props.t('payment-order-quantity')}: </b>} {quantity}</span>
      );
    }
    return (<div/>);
  };

  return (
      <Col xs={12} lg={6}>
        <Card body className={'mb-3 order-body ' + cardClasses()}
              style={{backgroundImage: 'url(' + image + ')'}}>
          <CardTitle className="order-body-title">
            <h5>{productName()}</h5></CardTitle>
          <CardText tag="div" className="mb-2">
            <TokenAmount/> <br/>
            <b>{props.t('payment-order-amount')}: </b>
            <AmountView/> <br/>
            <b>{props.t('payment-order-address')}:</b> <br/>
            <InputGroup>
              <input className="form-control" type="text"
                     value={props.data.data.address} readOnly
                     ref={(c => (refInput = c))}/>
              <div className="input-group-append">
                <Button outline onClick={copyAddress}
                        className="order-body-button">
                  <FontAwesomeIcon icon={faCopy}/></Button>
              </div>
            </InputGroup>
            {getDeadline()}
          </CardText>
          <Button color="success" href={props.data.data.checkoutUrl}
                  target="_blank" disabled={isDone()}>
            {props.t('payment-order-checkout')}</Button>
        </Card>
      </Col>
  );
};

export default withTranslation('Web')(PaymentOrder);
