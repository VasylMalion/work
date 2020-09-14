import React, {useState} from 'react';
import {
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
} from 'reactstrap';
import validateAddress from 'bitcoin-address-validation';
import {withTranslation} from 'react-i18next';

let addressTouched = false;

const WithdrawForm = (props) => {
  const [validAddress, setValidAddress] = useState(false);
  const [address, setAddress] = useState('');
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    let form = event.target;
    event.preventDefault();

    if (event.target.amount.value < 20) {
      setError(props.t('withdraw-error-minimal-amount'));
      return;
    }
    if (event.target.amount.value > props.euro) {
      setError(props.t('withdraw-error-balance-not-enough'));
      return;
    }
    if (validAddress === false) {
      setError(props.t('withdraw-error-address-invalid'));
      return;
    }
    setLoadingWithdraw(true);
    await props.send(parseFloat(event.target.amount.value), address);

    setLoadingWithdraw(false);
    form.amount.value = '0';
    setAddress('');
  };

  const handleAddressChange = (event) => {
    let result = !!validateAddress(event.target.value);
    if (addressTouched === false) setValidAddress(result);
    else if (result !== validAddress) setValidAddress(result);

    addressTouched = true;
    setAddress(event.target.value);
  };

  if (props.euro < 20) {
    return (<div className="mb-3">
      {props.t('withdraw-euro-not-enough')}
    </div>);
  }
  return (
      <div className="mb-5">
        {props.t('withdraw-form-prepend')}
        <div className="withdraw-balance">
          <Form onSubmit={handleSubmit}>
            <InputGroup className="withdraw-form-group mb-2">
              <InputGroupAddon addonType="prepend"
                               className="withdraw-bigfont">
                €</InputGroupAddon>
              <Input name="amount" type="number" defaultValue={props.euro}
                     key="address-input" className="withdraw-balance-input"/>
            </InputGroup>
            <Label>{props.t('withdraw-form-address')}</Label>
            <Input type="text" className="mb-2"
                   value={address}
                   onChange={handleAddressChange}
                   valid={validAddress && addressTouched}
                   invalid={!validAddress && addressTouched}
            />
            <Button color="success" type="submit" disabled={loadingWithdraw}
                    className="mb-2">
              {props.t('withdraw-form-button')}
            </Button>
            <div className="withdraw-error">{error}</div>
          </Form>
        </div>
        {props.t('withdraw-form-append')}
      </div>);
};

export default withTranslation('Web')(WithdrawForm);
