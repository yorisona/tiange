// import { formatAmount } from '@/utils/string';
import icon_check from '@/assets/img/management/icon_check.png';
import icon_process_warning from '@/assets/img/management/icon_process_warning.png';
import icon_down from '@/assets/img/management/icon_down.png';
import icon_up from '@/assets/img/management/icon_up.png';

export type ManagementDateType = 'year' | 'month' | 'day';
export type ManagementDetailType = 'gmv' | 'revenue' | 'cost' | 'profit';

export type gmvKeyType =
  | 'gmv'
  | 'livestream_gmv'
  | 'showcase_gmv'
  | 'shortvideo_gmv'
  | 'others_gmv'
  | 'wechat_video_gmv';
export type GmvLineTypeOption = {
  label: string;
  gmvKey: gmvKeyType;
  gmvIncreaseRateKey: string;
};

const defaultInOptions = {
  text: '环',
  textStyle: {
    color: '#888888',
  },
};

interface RatioFormatOptions {
  decimal?: number;
  empty?: string;
  surfix?: string;
}

export type LatitudeValueType = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type LatitudeOptionType = {
  label: string;
  value: LatitudeValueType;
  department_ids: string[];
  not_department_ids?: string[];
};

export const addCommas = (amount: number | string) => {
  if (!amount) return '';
  const str = amount.toString();
  const parts = str.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = parts[1] ? `.${parts[1]}` : '';
  return integerPart + decimalPart;
};

const defaultRatioFormatOptions: Required<RatioFormatOptions> = {
  decimal: 1,
  empty: '--',
  surfix: '%',
};
export const ratioFormat = (
  ratio: number | null | undefined,
  options: RatioFormatOptions = defaultRatioFormatOptions,
) => {
  const newOptions = {
    ...defaultRatioFormatOptions,
    ...Object.fromEntries(
      Object.entries(options).filter(([_, value]) => value !== null && value !== undefined),
    ),
  };
  const { surfix } = newOptions;
  if (ratio === undefined || ratio === null) return newOptions.empty;
  if (ratio === 0) return '0' + surfix;
  const basic = Math.pow(10, newOptions.decimal);
  const val = Math.round(ratio * basic) / basic;
  return `${val.toFixed(newOptions.decimal)}${surfix}`;
};

export const statusColor = (rate: number | undefined) => {
  const newVal = rate || 0;
  if (newVal >= 120) {
    return '#9273F8';
  } else if (newVal >= 100) {
    return '#20BF55';
  } else if (newVal >= 80) {
    return '#2877FF';
  } else {
    return '#ED3434';
  }
  // 超额完成 #7328FF
  // 完成 #20BF55
  // 正常 #2877FF
  // 滞后 #ED3434
};

const zeroPerentColor = (rate: number | undefined) => {
  const newVal = rate || 0;
  if (newVal >= 120) {
    return '#6a60e914';
  } else if (newVal >= 100) {
    return '#47bd6f14';
  } else if (newVal >= 80) {
    return '#289eff14';
  } else {
    return '#ed343414';
  }
  // 超额完成 #7328FF
  // 完成 #20BF55
  // 正常 #2877FF
  // 滞后 #ED3434
};
export const chartItemColor = (rate: number | undefined) => {
  return {
    type: 'linear',
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: zeroPerentColor(rate), // 0% 处的颜色
      },
      {
        offset: 1,
        color: statusColor(rate), // 100% 处的颜色
      },
    ],
    global: false, // 缺省为 false
  };
};

export const statusStr = (rate: number | undefined) => {
  const newVal = rate || 0;
  if (newVal >= 120) {
    return '超额完成';
  } else if (newVal >= 100) {
    return '完成';
  } else if (newVal >= 80) {
    return '正常';
  } else if (rate === undefined || rate === null) {
    return '';
  } else {
    return '滞后';
  }
};

export const getStatusImg = (rate: number | undefined) => {
  const newVal = rate || 0;
  if (newVal >= 120) {
    return <img src={icon_check} alt="" />;
  } else if (newVal >= 100) {
    return <img src={icon_check} alt="" />;
  } else if (newVal >= 80) {
    return '';
  } else {
    return <img src={icon_process_warning} alt="" />;
  }
};

export const getAmountFormatUnion = (
  amount: number | null | undefined,
  // dicimal: 'auto' | number = 'auto',
) => {
  if (amount === null || amount === undefined) {
    return {
      unit: undefined,
      amountStr: '--',
      amountUnitStr: '--',
    };
  }
  let unit = '元';
  let newVal = amount / 100;
  let basic = 0;
  const absVal = Math.abs(newVal);
  // if (absVal >= 100000000) {
  //   newVal = newVal / 100000000;
  //   unit = '亿元';
  // } else
  if (absVal >= 10000) {
    newVal = newVal / 10000;
    unit = '万';
    basic = 2;
  }
  const basicPow = Math.pow(10, basic);
  const amountStr = (Math.round(newVal * basicPow) / basicPow).toFixed(basic);
  const amountCommasStr = addCommas(amountStr);
  return {
    unit,
    amountStr: amountCommasStr,
    amountUnitStr: amountCommasStr + unit,
  };
};

export const getTooltipIncreatRateDomStr = (rate: number | undefined) => {
  const newVal = rate || 0;
  if (newVal === 0) return '';
  const color = getIncreaseColor(newVal);
  return `<div class="ratio" style="display: flex;margin-left: 12px; align-items: center;">
      <span style="color: #888888;">环</span>
      <img src=${newVal > 0 ? icon_up : icon_down} alt="" style="width: 16px; height: 16px;"/>
      <span style="color: ${color}">${ratioFormat(Math.abs(newVal))}</span>
    </div>`;
};

export const getIncreaseColor = (rate: number | null | undefined) => {
  const newVal = rate || 0;
  return newVal > 0 ? '#F30220' : newVal < 0 ? '#00CD0A' : '#19232d';
};

export const getIncreateRateNode = (
  rate: number | undefined,
  options: {
    text?: string;
    textStyle?: any;
  } = defaultInOptions,
) => {
  const newVal = rate || 0;
  // if (newVal === 0) return '';
  const color = getIncreaseColor(newVal);
  const newOptions = {
    ...defaultInOptions,
    ...Object.fromEntries(
      Object.entries(options).filter(([_, value]) => value !== null && value !== undefined),
    ),
  };
  return (
    <div class="ratio" style="display: flex; align-items: center;">
      <span style={newOptions.textStyle}>{newOptions.text}</span>
      {rate === undefined || rate === null || rate === 0 ? (
        <span style={`color: ${newOptions.textStyle.color}; margin-left: 4px`}>
          {rate === 0 ? '0' : '--'}
        </span>
      ) : (
        <fragments>
          {/* <img src={newVal > 0 ? icon_up : icon_down} alt="" style="width: 16px; height: 16px;" /> */}
          <tg-icon
            name={newVal > 0 ? 'ico-icon_tongyong_shangsheng_16' : 'ico-icon_tongyong_xiajiang_16'}
            style={`color: ${getIncreaseColor(newVal)}; font-size: 16px`}
          ></tg-icon>
          <span style={`color: ${color}`}>{ratioFormat(Math.abs(newVal))}</span>
        </fragments>
      )}
    </div>
  );
};

export const gmvLineTypeOptions: GmvLineTypeOption[] = [
  {
    label: '总GMV',
    gmvKey: 'gmv',
    gmvIncreaseRateKey: 'gmv_increase_rate',
  },
  {
    label: '抖音直播',
    gmvKey: 'livestream_gmv',
    gmvIncreaseRateKey: 'livestream_gmv_increase_rate',
  },
  {
    label: '橱窗',
    gmvKey: 'showcase_gmv',
    gmvIncreaseRateKey: 'showcase_gmv_increase_rate',
  },
  {
    label: '短视频',
    gmvKey: 'shortvideo_gmv',
    gmvIncreaseRateKey: 'shortvideo_gmv_increase_rate',
  },
  {
    label: '其它',
    gmvKey: 'others_gmv',
    gmvIncreaseRateKey: 'others_gmv_increase_rate',
  },
  {
    label: '微信视频号',
    gmvKey: 'wechat_video_gmv',
    gmvIncreaseRateKey: 'wechat_video_gmv_increase_rate',
  },
];

export const latitudeOptions: LatitudeOptionType[] = [
  {
    label: '电商一部',
    value: 1,
    department_ids: ['cf5fc249ebb158b6'],
    not_department_ids: ['7ffc3373a576agdc'],
  },
  {
    label: '电商二部',
    value: 2,
    department_ids: ['cd974448b26bd278'],
  },
  {
    label: '电商三部',
    value: 3,
    department_ids: ['4g382eca1a345382'],
    not_department_ids: ['8247abbegd76e78a'],
  },
  {
    label: '电商四部',
    value: 4,
    department_ids: ['6b63c41dd4e7792g'],
  },
  {
    label: '供应链',
    value: 5,
    department_ids: ['7ffc3373a576agdc', '8247abbegd76e78a'],
  },
  {
    label: '本地生活',
    value: 6,
    department_ids: ['6956795382802286117'],
  },
  {
    label: '创新',
    value: 7,
    department_ids: ['5e2bfa19d4628368'],
  },
];
