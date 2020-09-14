import React, {useState, useRef} from 'react';
import gql from 'graphql-tag';
import {ButtonGroup, Button, Row, Col, Spinner} from 'reactstrap';
import Order from './payment.order';
import {withTranslation} from 'react-i18next';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {useAuth} from '../../context/auth-context';
import {
  AvField,
  AvForm,
  AvGroup,
} from 'availity-reactstrap-validation';

const scrollToRef = (ref) => {
  ref.current.scrollIntoView({behavior: 'smooth', block: 'start'});
};

const orderMutation = gql`
  mutation createOrder($session: String, $gateway: String!, $currency: String!, $product: Int! $amount: Int) {
    createOrder(session: $session, gateway: $gateway, currency: $currency, product: $product, amount: $amount) {
      id
      amount
      currency
      status
      created
      timeout
      product
      quantity
      data{
        address
        checkoutUrl
      }
    }
  }
`;

const userOrderSession = gql`
  query userSession($session: String!){
    userSession(session: $session){
      success
      user{
        id
        pack
        orders{
          id
          amount
          quantity
          currency
          status
          created
          timeout
          product
          data{
            address
            checkoutUrl
          }
        }
      }
    }
  }
`;

const Payment = (props) => {
  const [orderCreating, setOrderCreating] = useState(false);
  const [product, setProduct] = useState(1);
  const [currency, setCurrency] = useState('BTC');
  const [order, setOrder] = useState({
    list: null,
  });
  const orderRef = useRef(null);
  const [createOrder] = useMutation(orderMutation);
  const auth = useAuth();

  const {loading, data} = useQuery(userOrderSession,
      {variables: {session: auth.getSession()}});

  if (loading) return <div/>;

  let list = data['userSession'].user['orders'];
  if (order.list === null) {
    list = list.sort((a, b) => {
      let dateA = Date.parse(a['createdAt']);
      let dateB = Date.parse(b['createdAt']);
      return dateB - dateA;
    });
    let result = [];
    let threshold = new Date();
    threshold = new Date(threshold.getTime() - (3 * 24 * 60 * 60 * 1000));
    for (let item of list) {
      let finish = new Date(item.created + item.timeout * 1000);
      if (finish < threshold) continue;
      result.push(item);
    }
    setOrder({list: result});
  }

  let pack = data.userSession.user.pack;
  if (pack === 1)
    if (product !== 5 && product !== 8 && product !== 100) setProduct(5);

  if (pack === 3)
    if (product !== 9 && product !== 100) setProduct(9);

  const createOrderClick = (data, tokenProduct) => {
    setOrderCreating(true);
    let productNumber = parseInt(product);
    let token = undefined;
    if (tokenProduct) {
      token = parseInt(data);
      productNumber = parseInt(tokenProduct);
    }
    createOrder({
      variables: {
        gateway: 'cp',
        session: auth.getSession(),
        currency: currency,
        product: productNumber,
        amount: token,
      },
    }).then((data) => {
      setOrderCreating(false);
      let result = data.data['createOrder'];
      order.list.unshift(result);
      setOrder({list: order.list});
      scrollToRef(orderRef);
    });
  };

  const ProductButton = (props) => {
    return (<Button color="dark" outline size="lg"
                    onClick={props.onClick}
                    active={props.active}>{props.children}</Button>);
  };

  const ProductList = () => {
    if (pack === 0) {
      return (<ButtonGroup className={`col-12 mb-5`}>
        <ProductButton onClick={() => setProduct(1)}
                       active={product === 1}>START<br/>€300</ProductButton>
        <ProductButton onClick={() => setProduct(3)}
                       active={product === 3}>VIP<br/>€900</ProductButton>
        <ProductButton onClick={() => setProduct(7)}
                       active={product === 7}>LUX<br/>€5000</ProductButton>
      </ButtonGroup>);
    }
    if (pack === 1) {
      return (<ButtonGroup className={`col-12 mb-5`}>
        <ProductButton onClick={() => setProduct(5)}
                       active={product === 5}>VIP<br/>€600</ProductButton>
        <ProductButton onClick={() => setProduct(8)}
                       active={product === 8}>LUX<br/>€4700</ProductButton>
      </ButtonGroup>);
    }
    if (pack === 3) {
      return (<ButtonGroup className={`col-12 mb-5`}>
        <ProductButton onClick={() => setProduct(9)}
                       active={product === 9}>LUX<br/>€4100</ProductButton>
      </ButtonGroup>);
    }
    return '';
  };

  const OrderList = () => {
    if (order.list === null || order.list.length === 0)
      return (<div>{props.t('payment-orders-empty')}</div>);
    return (
        <Row>
          <h3 className="mb-3 col-12">{props.t('payment-orders-title')}</h3>
          {order.list.map((item) => {
            if (item.status >= 0 ||
                item.created + 86400 * 3 * 1000 > new Date().getTime())
              return (
                  <Order key={item.id} data={item}/>
              );
            return '';
          })}
        </Row>
    );
  };

  // if (pack === 7) return (<OrderList/>);

  const PurchaseToken = () => {
    if (pack > 0) {
      return (
          <AvForm className={`col-12`} onValidSubmit={async (event, data) => {
            await createOrderClick(data.value, 100);
          }}>
            <AvField label={props.t(props.t('payment-token'))}
                     className={`col-3`} type={'number'} name={'value'}
                     id={'amount'}
                     validate={{
                       required: {
                         value: true, errorMessage: props.t(
                             'registration-error-field-invalid-empty'),
                       },
                     }}/>
            <AvGroup row>
              <Col xs={12}>
                <Button size="lg" type={'submit'} color="success"
                        disabled={orderCreating}>
                  {props.t('payment-pay') + ' '}
                  {orderCreating ? (<Spinner color="light"/>) : ''}
                </Button>
              </Col>
            </AvGroup>
          </AvForm>
      );
    }
    return '';
  };

  const CurrencySwitch = () => {
    return (
        <ButtonGroup className={`col-12 mb-5`}>
          <Button color="dark" outline size="lg"
                  onClick={() => setCurrency('BTC')}
                  active={currency === 'BTC'}>BTC</Button>
          <Button color="dark" outline size="lg"
                  onClick={() => setCurrency('ETH')}
                  active={currency === 'ETH'}>ETH</Button>
          <Button color="dark" outline size="lg"
                  onClick={() => setCurrency('USDT')}
                  active={currency === 'USDT'}>USDT</Button>
        </ButtonGroup>
    );
  };

  const PaymentHeader = (props) => {
    return (<Col xs={12}>
      <h4 className="mb-5">{props.children}</h4>
    </Col>);
  };

  return (
      <Row>
        <PaymentHeader>{props.t('payment-header-currency')}</PaymentHeader>
        <CurrencySwitch/>
        <PaymentHeader>{pack === 0 ?
            props.t('payment-header') : pack === 7 ? '' :
                props.t('payment-header-upgrade')}</PaymentHeader>
        <ProductList/>
        {pack === 7 ? '' :
            <Col xs={12} className="mb-5">
              <h5><a href={props.t('payment-orders-difference-link')}
                     target="_blank" rel="noopener noreferrer">
                {props.t('payment-orders-difference')}
              </a></h5>
            </Col>}
        {pack === 7 ? '' :
            <Col className="mb-5" xs={12}>
              <Button size="lg" color="success"
                      onClick={createOrderClick}
                      disabled={orderCreating}>
                {props.t('payment-pay') + ' '}
                {orderCreating ? (<Spinner color="light"/>) : ''}
              </Button>
            </Col>}
        <PaymentHeader>{props.t('payment-header-token')}</PaymentHeader>
        <PurchaseToken/>
        <div ref={orderRef} className="col-12">
          <OrderList/>
        </div>
      </Row>
  );
};

export default withTranslation('Web')(Payment);
