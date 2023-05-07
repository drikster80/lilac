import * as React from 'react';
import {VegaLite} from 'react-vega';
import {compile, Config, TopLevelSpec} from 'vega-lite';
import {LeafValue} from '../schema';

const BAR_COUNT_LABEL = 'count';
const BAR_VALUE_LABEL = 'value';
const BAR_COLOR = 'rgb(163,191,250)'; // Light indigo.
const LABEL_COLOR = 'rgb(45,55,72)'; // Dark gray.

export interface HistogramProps {
  values: [LeafValue, number][];
}

export const Histogram = React.memo(function Histogram({values}: HistogramProps): JSX.Element {
  const histogramData = values.map((row) => {
    return {
      [BAR_VALUE_LABEL]: row[0],
      [BAR_COUNT_LABEL]: row[1],
    };
  });

  const spec: TopLevelSpec = {
    layer: [
      {
        mark: {type: 'bar', color: BAR_COLOR},
        encoding: {
          x: {
            field: BAR_COUNT_LABEL,
            type: 'quantitative',
            title: '',
            axis: {ticks: false, domain: false, grid: false, values: []},
          },
        },
      },
      {
        mark: {
          type: 'text',
          align: 'left',
          baseline: 'middle',
          dx: 3,
          color: LABEL_COLOR,
        },
        encoding: {
          text: {field: BAR_COUNT_LABEL},
          x: {value: 0},
        },
      },
    ],
    encoding: {
      y: {
        field: BAR_VALUE_LABEL,
        sort: null,
        type: 'ordinal',
        title: '',
        axis: {
          ticks: false,
          domain: false,
          grid: false,
          labelPadding: 130,
          labelAlign: 'left',
          labelFontSize: 14,
          labelColor: LABEL_COLOR,
          labelLimit: 120,
        },
      },
      tooltip: [{field: BAR_VALUE_LABEL}, {field: BAR_COUNT_LABEL}],
    },
    config: {
      view: {
        stroke: 'transparent',
      },
    },
    data: {name: 'table'},
  };

  const barData = {
    table: histogramData,
  };
  const config: Config = {
    bar: {
      orient: 'horizontal',
    },
  };
  const vegaSpec = compile(spec, {config}).spec;
  return <VegaLite spec={vegaSpec} data={barData} actions={false} />;
});