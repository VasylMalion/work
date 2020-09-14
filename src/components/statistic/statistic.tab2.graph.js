import React, {useState} from 'react';
import {
  AreaSeries, Crosshair, GradientDefs,
  HorizontalGridLines, VerticalGridLines, XAxis, XYPlot, YAxis,
} from 'react-vis/es';
import AutoSizer from 'react-virtualized-auto-sizer';
import Moment from 'moment';
import i18n from '../../utils/i18n';
import {withTranslation} from 'react-i18next';
import './statistic.scss';

const StatisticTab2Graph = (props) => {
  const [value, setValue] = useState(null);

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
      title: props.t('statistic-graph-date'),
      value: moment.format('LL'),
    };
  };

  const itemsFormat = item => {
    return [
      {
        title: props.t('statistic-graph-balance'),
        value: new Intl.NumberFormat(i18n.language,
            {style: 'currency', currency: 'USD'}).format(item[0].y),
      }];
  };

  const xTickFormat = (value) => {
    let moment = new Moment(value);
    moment.locale(i18n.language);
    return moment.format('LL');
  };

  const yTickFormat = (value) => {
    return new Intl.NumberFormat(i18n.language,
        {style: 'currency', currency: 'USD'}).format(value);
  };

  return (
      <AutoSizer disableHeight={true}>
        {({width}) => (
            <XYPlot onMouseLeave={_forgetValue}
                    width={width} height={600} margin={{left: 80, bottom: 100}}>
              <GradientDefs>
                <linearGradient id="RichlandGradient2"
                                x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#31153b" stopOpacity={0.2}/>
                  <stop offset="100%" stopColor="#502361" stopOpacity={1}/>
                </linearGradient>
              </GradientDefs>
              <VerticalGridLines tickValues={props.xTicks}/>
              <HorizontalGridLines/>
              <XAxis tickValues={props.xTicks} tickLabelAngle={315}
                     tickFormat={xTickFormat}/>
              <YAxis tickFormat={yTickFormat}/>
              <AreaSeries color={'url(#RichlandGradient2)'} data={props.data}
                          onNearestX={_rememberValue}/>
              <Crosshair values={value}
                         itemsFormat={itemsFormat}
                         titleFormat={titleFormat}/>
            </XYPlot>
        )}
      </AutoSizer>
  );
};

export default withTranslation('Web')(StatisticTab2Graph);
