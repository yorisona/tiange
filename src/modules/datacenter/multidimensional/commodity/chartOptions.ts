// query_product_multidimensional_statistics
import { query_product_multidimensional_statistics } from '@/services/datacenter';
import { useBubblePieColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import formatData from '@/utils/formatData';

type Params = TG.HttpResultType<typeof query_product_multidimensional_statistics>;

const config = {
  xAxis3D: 'protein',
  yAxis3D: 'fiber',
  zAxis3D: 'sodium',
  color: 'fiber',
  symbolSize: 'vitaminc',
};

const common = {
  tooltipFormat(data: Params, type = 'default') {
    return (params: any) => {
      return data.row_name_list
        .map((it, index) => {
          let key: any = index;
          if (type === 'pie') {
            if (index === 0) key = 'name';
            else if (index === 1) key = 'value';
          }
          let value = params.data[key];
          if (it === '销售额') {
            value = formatData.formatMoney(value, 2);
          }
          value = formatData.formatEmpty(value);
          return `${it} ：${value}`;
        })
        .join('<br />');
    };
  },
};

export const get_latitude_2_base = (data: Params) => {
  return {
    effectiveLength: 2,
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      formatter: common.tooltipFormat(data, 'pie'),
    },
    legend: {
      bottom: '0%',
      type: 'scroll',
      left: 'center',
      data: data.axle_data_list[0].map((it, index) => {
        return { name: index === 0 ? formatData.formatEmpty(it) : it };
      }),
    },
    color: useBubblePieColors,
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        top: '-10%',
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.row_data_list.map(item => {
          const result = {
            value: item[1],
            name: formatData.formatEmpty(item[0]),
          };
          return result;
        }),
      },
    ],
  };
};

export const get_latitude_3_base = (data: Params) => {
  let maxValue = 0;
  for (let i = 0; i < data.row_data_list.length; i++) {
    if (data.row_data_list[i][2] === null) continue;
    maxValue = Math.max(maxValue, data.row_data_list[i][2]);
  }
  const scale = maxValue / 50;
  return {
    effectiveLength: 3,
    tooltip: {
      position: 'top',
      appendToBody: true,
      formatter: common.tooltipFormat(data),
    },
    color: useBubblePieColors,
    grid: {
      left: 2,
      bottom: 10,
      right: data.row_name_list[0].length * 20,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      name: data.row_name_list[0],
      data: data.axle_data_list[0],
      boundaryGap: false,
      splitLine: {
        show: true,
      },
      axisLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      nameTextStyle: {
        padding: data.axle_data_list[1]?.length
          ? 0
          : [
              0,
              (-(data.row_name_list[1]?.length || 0) * 12) / 2,
              0,
              (data.row_name_list[1]?.length * 12 || 0) / 2,
            ],
      },
      name: data.row_name_list[1],
      data: data.axle_data_list[1],
      axisLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'scatter',
        data: data.row_data_list.map(it => {
          const result = [...it];
          return result;
        }),
        symbolSize: function (val: any) {
          return Math.max(6, val[2] / scale);
        },
        animationDelay: function (idx: any) {
          return idx * 5;
        },
      },
    ],
  };
};

export const get_latitude_4_base = (data: Params) => {
  let maxValue = 0;
  for (let i = 0; i < data.row_data_list.length; i++) {
    if (data.row_data_list[i][3] === null) continue;
    maxValue = Math.max(maxValue, data.row_data_list[i][3]);
  }

  return {
    effectiveLength: 4,
    tooltip: {
      appendToBody: true,
      formatter: common.tooltipFormat(data),
    },
    visualMap: [
      {
        bottom: 10,
        calculable: true,
        dimension: 4,
        max: maxValue,
        inRange: {
          symbolSize: [6, 50],
        },
        textStyle: {
          color: '#6A7B92',
        },
        itemHeight: 77,
        itemWidth: 12,
        text: [null, data.row_name_list[3]],
      },
    ],
    xAxis3D: {
      nameTextStyle: {
        color: '#5a5a5a',
      },
      name: null,
      type: 'category',
      data: data.axle_data_list[0],
    },
    yAxis3D: {
      name: null,
      nameTextStyle: {
        color: '#5a5a5a',
      },
      type: 'category',
      data: data.axle_data_list[1],
    },
    zAxis3D: {
      name: null,
      nameTextStyle: {
        color: '#5a5a5a',
      },
      type: 'category',
      data: data.axle_data_list[2],
    },
    grid3D: {
      axisLabel: {
        textStyle: {
          color: '#5a5a5a',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#D8D8D8',
        },
      },
      axisPointer: {
        lineStyle: {
          color: '#ffbd67',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#D8D8D8',
        },
      },
      viewControl: {
        // autoRotate: true
        // projection: 'orthographic'
      },
    },
    series: [
      {
        type: 'scatter3D',
        // dimensions: [config.xAxis3D, config.yAxis3D, config.zAxis3D, config.symbolSize],
        data: data.row_data_list.map((data: any[], _) => {
          const result = [...data, data[data.length - 1]];
          return result;
        }),
        symbolSize: 12,
        // symbol: 'triangle',
        itemStyle: {
          borderWidth: 0,
          borderColor: 'rgba(255,255,255,0.8)',
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            color: '#f57070',
          },
        },
      },
    ],
  };
};

export const get_latitude_5_base = (data: Params) => {
  let maxValue = 0;
  for (let i = 0; i < data.row_data_list.length; i++) {
    if (data.row_data_list[i][4] === null) continue;
    maxValue = Math.max(maxValue, data.row_data_list[i][4]);
  }
  return {
    effectiveLength: 5,
    tooltip: {
      appendToBody: true,
      formatter: common.tooltipFormat(data),
    },
    visualMap: [
      {
        type: 'piecewise',
        top: 10,
        calculable: true,
        dimension: 3,
        max: data.axle_data_list[3].length,
        categories: data.axle_data_list[3].map(it => {
          return formatData.formatEmpty(it);
        }),
        itemGap: 6,
        inRange: {
          color: useBubblePieColors, // ['#0C6FE1', '#22B2FF', '#11E6D7', '#36DE8A', '#FFE869', '#FFB218', '#F73434'],
        },
        textStyle: {
          color: '#6A7B92',
        },
        itemWidth: 12,
        showLabel: true,
        text: [data.row_name_list[3], ''],
      },
      {
        right: 10,
        calculable: true,
        dimension: 4,
        max: maxValue,
        inRange: {
          symbolSize: [6, 50],
        },
        textStyle: {
          color: '#6A7B92',
        },
        itemHeight: 77,
        itemWidth: 12,
        text: [data.row_name_list[4], ''],
      },
    ],
    xAxis3D: {
      nameTextStyle: {
        color: '#5a5a5a',
      },
      name: null,
      type: 'category',
      data: data.axle_data_list[0],
    },
    yAxis3D: {
      name: null,
      nameTextStyle: {
        color: '#5a5a5a',
      },
      type: 'category',
      data: data.axle_data_list[1],
    },
    zAxis3D: {
      name: null,
      nameTextStyle: {
        color: '#5a5a5a',
      },
      type: 'category',
      data: data.axle_data_list[2],
    },
    grid3D: {
      top: -20,
      axisLabel: {
        textStyle: {
          color: '#5a5a5a',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#D8D8D8',
        },
      },
      axisPointer: {
        lineStyle: {
          color: '#ffbd67',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#D8D8D8',
        },
      },
      viewControl: {
        // autoRotate: true
        // projection: 'orthographic'
      },
    },
    series: [
      {
        type: 'scatter3D',
        dimensions: [
          config.xAxis3D,
          config.yAxis3D,
          config.yAxis3D,
          config.color,
          config.symbolSize,
        ],
        data: data.row_data_list.map((item: any[]) => {
          const result = [...item];
          result[3] = formatData.formatEmpty(result[3]);
          // result[3] = data.axle_data_list[3].indexOf(item[3]);
          return result;
        }),
        // symbolSize: 12,
        // symbol: 'triangle',
        itemStyle: {
          borderWidth: 0,
        },
        emphasis: {
          label: {
            show: false,
          },
          itemStyle: {
            color: '#f57070',
          },
        },
      },
    ],
  };
};
export default {
  get_latitude_2_base,
  get_latitude_3_base,
  get_latitude_4_base,
  get_latitude_5_base,
};
