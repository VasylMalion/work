import React from 'react';
import {withTranslation} from 'react-i18next';
import gql from 'graphql-tag';
import {useQuery} from '@apollo/react-hooks';
import {Table} from 'reactstrap';
import Graph from './statistic.tab2.graph';
import i18n from '../../utils/i18n';
import Moment from 'moment';
import Spinner from '../lib/spinner';
import HtmlToReactParser from 'html-to-react';
import '../../../node_modules/react-vis/dist/style.css';

const stocksQuery = gql`
  query {
    exampleStatistic {
      id
      symbol
      createDate
      openedDate
      closeDate
      buyPrice
      sellPrice
      percentAmount
      status
    }
  }  
`;

let graph = [];
let xTickValues = [];
let finalTable = [];
let calculateStatistic = (data) => {
  graph = [];
  xTickValues = [];
  let timeline = [];

  let sum = 1000;
  let calcSum = sum;
  let startSum = sum;

  for (let item of data) {
    if (item.id === 412 || item.id === 556 || item.id === 560) continue;
    if (item.status === 'closed' && item.sellPrice === 0) continue;
    if (!item.percentAmount) item.percentAmount = 10;
    timeline.push({
      event: 'buy',
      time: parseFloat(item.openedDate),
      signal: item,
      status: item.status,
    });
    if (item.status === 'closed') {
      timeline.push({
        event: 'sell',
        time: parseFloat(item.closeDate),
        signal: item,
      });
    }
  }
  timeline = timeline.sort((a, b) => {
    return a.time - b.time;
  });

  for (let item of timeline) {
    if (item.event === 'buy') {
      let buyAmount = sum * item.signal.percentAmount * 0.01;
      sum = sum - buyAmount;
      item.signal.coin = buyAmount / item.signal.buyPrice;
    }
    if (item.event === 'sell') {
      sum = sum + item.signal.coin * item.signal.sellPrice;
      let result = (item.signal.sellPrice - item.signal.buyPrice) *
          item.signal.coin;
      calcSum += result;
      graph.push({
        x: item.time,
        y: calcSum,
      });
    }
  }

  let min = graph[0].x;
  let max = graph[graph.length - 1].x;

  let date = new Date(min);
  while (date.getTime() < max) {
    date.setMonth(date.getMonth() + 1);
    date.setDate(1);
    let currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    xTickValues.push(currentDate.getTime());
  }
  xTickValues.splice(-1, 1);

  finalTable.push({
    time: graph[0].x,
    value: startSum,
    partPercent: 0,
    fullPercent: 0,
  });

  let i = 0;
  let previous;
  for (let item of graph) {
    if (i === xTickValues.length) break;
    if (previous === undefined) previous = item;
    if (xTickValues[i] < item.x) {
      let obj = {
        time: xTickValues[i],
        value: previous.y,
        partPercent: ((previous.y - finalTable[i].value) / finalTable[i].value),
        fullPercent: (previous.y - startSum) / startSum,
      };
      finalTable.push(obj);
      i++;
    }
    previous = item;
  }

  let lastValue = graph[graph.length - 1].y;
  finalTable.push({
    time: new Date().getTime(),
    value: lastValue,
    partPercent:
        ((lastValue - finalTable[i].value) /
            finalTable[i].value),
    fullPercent: (lastValue - startSum) / startSum,
  });
};

const StatisticTab2 = (props) => {
  let parser = new HtmlToReactParser.Parser();
  const {loading, data} = useQuery(stocksQuery);

  if (!data) {
    return (<div></div>);
  }

  if (loading) return (<Spinner/>);

  if (graph.length === 0) calculateStatistic(data.exampleStatistic);

  return (<div>
    <p>{parser.parse(props.t('statistic-graph-description'))}</p>
    <Graph data={graph} xTicks={xTickValues}/>
    <Table>
      <thead>
      <tr>
        <th>{props.t('statistic-graph-table-column-1')}</th>
        <th>{props.t('statistic-graph-table-column-2')}</th>
        <th>{props.t('statistic-graph-table-column-3')}</th>
        <th>{props.t('statistic-graph-table-column-4')}</th>
      </tr>
      </thead>
      <tbody>
      {finalTable.map((item) => {
        let moment = new Moment(item.time);
        moment.locale(i18n.language);
        let date = moment.format('LL');
        let value = new Intl.NumberFormat(i18n.language,
            {style: 'currency', currency: 'USD'}).format(item.value);
        let partPercent = formatPercent(item.partPercent, i18n.language);
        let fullPercent = formatPercent(item.fullPercent, i18n.language);
        return (
            <tr key={item.time}>
              <td>{date}</td>
              <td>{value}</td>
              <td>{partPercent}</td>
              <td>{fullPercent}</td>
            </tr>);
      })}
      </tbody>
    </Table>
  </div>);
};

function formatPercent(value, language) {
  return value === 0 ? '-' :
      new Intl.NumberFormat(language,
          {style: 'percent', minimumFractionDigits: 1}).format(value);
}

export default withTranslation('Web')(StatisticTab2);
