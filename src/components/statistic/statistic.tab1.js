import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {useQuery} from '@apollo/react-hooks';
import Spinner from '../lib/spinner';
import gql from 'graphql-tag';
import {useAuth} from '../../context/auth-context';
import statisticCalculate from '../lib/statistic.calculate';
import math from 'mout/math';
import {
  Crosshair, GradientDefs,
  VerticalBarSeries,
  XAxis,
  XYPlot,
  YAxis,
} from 'react-vis';
import AutoSizer from 'react-virtualized-auto-sizer';
import Moment from 'moment';
import i18n from '../../utils/i18n';
import HtmlToReactParser from 'html-to-react';

const stocksQuery = gql`
  query ($session: String!) {
    userSession(session: $session) {
      user {
        id
        login
        statistic {
          closed {
            symbol
            status
            closeDate
            profit {
              tp0
              tp1
              tp2
              tp3
            }
            buySum
            quantitySell
          }
        }
      }
    }
  }  
`;

const StatisticTab1 = (props) => {
  let auth = useAuth();
  let session = auth.getSession();
  const [value, setValue] = useState(null);

  const {loading, data} = useQuery(stocksQuery,
      {variables: {session}});

  if (loading) return <Spinner/>;
  if (!data['userSession'].user.statistic.closed ||
      data['userSession'].user.statistic.closed.length === 0) {
    return ('');
  }

  let {result} = statisticCalculate(data['userSession'].user.statistic.closed);

  let graph = [];
  let ticks = [];
  for (const [year, partObject] of Object.entries(result)) {
    for (const [month, value] of Object.entries(partObject)) {
      let date = new Date(year, month, 1).getTime();
      ticks.push(date);
      graph.push(
          {
            id: 1,
            x: date,
            y: math.round(value, 0.01),
          });
    }
  }

  const _forgetValue = () => {
    setValue(null);
  };

  const _rememberValue = value => {
    setValue([value]);
  };

  const titleFormat = item => {
    let moment = new Moment(item[0].x);
    moment.locale(i18n.language);
    return {
      title: props.t('statistic-graph-tab1-date'),
      value: moment.format('MMMM YYYY'),
    };
  };

  const itemsFormat = item => {
    return [
      {
        title: props.t('statistic-graph-tab1-balance'),
        value: new Intl.NumberFormat(i18n.language,
            {style: 'currency', currency: 'USD'}).format(item[0].y),
      }];
  };

  const xTickFormat = (value) => {
    let moment = new Moment(value);
    moment.locale(i18n.language);
    return moment.format('MMMM YYYY');
  };

  const yTickFormat = (value) => {
    return new Intl.NumberFormat(i18n.language,
        {style: 'currency', currency: 'USD'}).format(value);
  };

  let parser = new HtmlToReactParser.Parser();
  return (<div>
    <p>{parser.parse(props.t('statistic-tab1-description'))}</p>
    <AutoSizer disableHeight={true}>
      {({width}) => (
          <XYPlot onMouseLeave={_forgetValue}
                  margin={{left: 75, bottom: 100}}
                  width={width}
                  height={600}>
            <GradientDefs>
              <linearGradient id="RichlandGradient"
                              x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#31153b" stopOpacity={0.6}/>
                <stop offset="100%" stopColor="#502361" stopOpacity={1}/>
              </linearGradient>
            </GradientDefs>
            <VerticalBarSeries onNearestX={_rememberValue} data={graph}
                               color={'url(#RichlandGradient)'}/>
            <XAxis tickValues={ticks} tickLabelAngle={315}
                   tickFormat={xTickFormat}/>
            <YAxis tickFormat={yTickFormat}/>
            <Crosshair values={value}
                       itemsFormat={itemsFormat}
                       titleFormat={titleFormat}/>
          </XYPlot>
      )}
    </AutoSizer>
  </div>);
};

export default withTranslation('Web')(StatisticTab1);
