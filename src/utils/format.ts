// @ts-nocheck
// import moment from 'moment'
import miment from 'miment';

export function displayTypeFormate(row, _column) {
  const displayType = row.display_type;
  switch (displayType) {
    case 0:
      return '混播';
    case 1:
      return '专场';
  }
}
export const categoryList = [
  '综合',
  '美妆',
  '生活',
  '服饰',
  '美食',
  '母婴',
  '数码',
  '家装',
  '健康',
  '宠物',
  '时尚',
  '配饰',
  '家电',
  '测评',
  '旅行',
  '运动',
  '摄影',
  '情感',
  '汽车',
  '搞笑',
  '教育',
  '财经',
  '萌娃',
  '文化',
  '影视',
  '娱乐',
  '游戏',
  '海外',
  '才艺',
  '二次元',
  '高颜值',
];

export const categoryListNew = [
  '美妆',
  '生活',
  '服饰',
  '美食',
  '母婴',
  '数码',
  '家装',
  '健康',
  '宠物',
  '时尚',
  '配饰',
  '家电',
  '测评',
  '旅行',
  '运动',
  '摄影',
  '情感',
  '汽车',
  '搞笑',
  '教育',
  '财经',
  '萌娃',
  '文化',
  '影视',
  '娱乐',
  '游戏',
  '海外',
  '才艺',
  // '三农',
  '二次元',
  '高颜值',
  '行政采购',
];

export function categoryFormate({ category }: { category: number }) {
  if (category === 0) {
    return '无';
  } else {
    return categoryList[category];
  }
}
export function stateFormat(row, _column) {
  const state = row.is_checked;
  switch (state) {
    case 0:
      return '未审核';
    case 1:
      return '已审核';
    case 2:
      return '禁用';
  }
}
export function roleFormat(row, _column) {
  const role = row.role;
  switch (role) {
    case 0:
      return '客户执行';
    case 1:
      return '管理员';
    case 2:
      return '客户经理';
    case 3:
      return '项目经理';
  }
}
export function salesFormat(row, _column) {
  const sales = row.sales_price_period;
  switch (sales) {
    case 0:
      return '0 ~ 100';
    case 1:
      return '100 ~ 200';
    case 2:
      return '200以上';
  }
}
export function dateFormat(row, column) {
  const date = row[column.property];
  if (date === undefined) {
    return '';
  }
  return miment(date).format('YYYY-MM-DD');
}
export function showProDateFormat(value, fmt = 'YYYY-MM-DD') {
  return miment(value).format(fmt);
}

export function addDateFormat(value, format = 'YYYY-MM-DD hh:mm:ss') {
  return miment(value + '+0800').format(format);
}
// 新增处理北京时间
export function showZhCnDate(time, pattern) {
  return miment(time + '+0800').format(pattern || 'YYYY-MM-DD');
}

export function formatSeconds(value) {
  let secondTime = parseInt(value, 10); // 秒
  let minuteTime = 0; // 分
  let hourTime = 0; // 小时
  if (secondTime >= 60) {
    minuteTime = parseInt(secondTime / 60, 10);
    secondTime = parseInt(secondTime % 60, 10);
    if (minuteTime >= 60) {
      hourTime = parseInt(minuteTime / 60, 10);
      minuteTime = parseInt(minuteTime % 60, 10);
    }
  }
  let result =
    '' +
    (parseInt(secondTime, 10) < 10 ? '0' + parseInt(secondTime, 10) : parseInt(secondTime, 10));
  result =
    '' +
    (parseInt(minuteTime, 10) < 10 ? '0' + parseInt(minuteTime, 10) : parseInt(minuteTime, 10)) +
    ':' +
    result;
  result =
    '' +
    (parseInt(hourTime, 10) < 10 ? '0' + parseInt(hourTime, 10) : parseInt(hourTime, 10)) +
    ':' +
    result;
  return result;
}

export function periodFormate(row, _column) {
  const value = row.display_period;
  switch (value) {
    case -1:
      return '未录入';
    case 0:
      return '白天';
    case 1:
      return '晚上';
  }
}
export function getIsPresell(row) {
  const value = row.is_presell;
  switch (value) {
    case -1:
      return '未录入';
    case 1:
      return '预售';
    case 0:
      return '非预售';
    case 2:
      return '预热';
  }
}
export function getIsDisplay(row) {
  const value = row.is_display;
  switch (value) {
    case -1:
      return '未录入';
    case 2:
      return '已出单';
    case 1:
      return '未出单';
  }
}
export function getDuration(row) {
  const value = row.duration;
  switch (value) {
    case -1:
      return '未录入';
    case 0:
      return '5 ~ 10分钟';
    case 1:
      return '10 ~ 15分钟';
    case 2:
      return '15 ~ 20分钟';
    case 3:
      return '0 ~ 5分钟';
    case 4:
      return '20分钟以上';
  }
}
export function getDisplayPeriod(row) {
  const value = row.display_period;
  switch (value) {
    case -1:
      return '未录入';
    case 0:
      return '白天';
    case 1:
      return '晚上';
  }
}
export function planStatusFormat(row) {
  const status = row.status;
  switch (status) {
    case 0:
      return '修改中';
    case 1:
      return '执行中';
    case 2:
      return '已出单';
  }
}
export function operateFormat(row) {
  const operate = row.operate;
  switch (operate) {
    case 'star':
      return '导入主播基本信息';
    case 'star_cost':
      return '导入主播成本信息';
    case 'display':
      return '导入场次信息';
    case 'product':
      return '导入商品信息';
    case 'brand':
      return '导入品牌信息';
    case 'require_product':
      return '导入品牌需求商品信息';
  }
}

export function shopTypeFormat(row) {
  const status = row.shop_type;
  switch (status) {
    case 0:
      return '无';
    case 1:
      return '淘宝店';
    case 2:
      return '天猫店';
    case 3:
      return '抖音店';
    case 4:
      return '微信视频号';
    default:
      return '--';
  }
}

export function companyTypeFormat(row) {
  const status = row.company_type;
  switch (status) {
    case 0:
      return '无';
    case 1:
      return '同行机构';
    case 2:
      return '广告公司';
    case 3:
      return '品牌TP';
    case 4:
      return '直客';
  }
}

/* 截取字符串，支持中文 */
export function truncateStr(str, resultLength) {
  const reg = /[^\x00-\xff]/g;
  let max;

  if (str.replace(reg, '**').length > resultLength) {
    max = Math.floor(resultLength / 2);

    for (let index = max, strLength = str.length; index < strLength; index++) {
      if (str.substr(0, index).replace(reg, '**').length >= resultLength) {
        return str.substr(0, index);
      }
    }
  }

  return str;
}

/** @deprecated 客户分类列表 */
export const customerClassList = [
  {
    type: 0,
    value: '全部',
  },
  {
    type: 1,
    value: '普通客户',
  },
  {
    type: 2,
    value: '重点客户',
  },
  {
    type: 3,
    value: '战略客户',
  },
  {
    type: 4,
    value: 'KA客户',
  },
  // {
  //   type: 5,
  //   value: '同行机构'
  // },
  // {
  //   type: 6,
  //   value: '广告公司'
  // },
  // {
  //   type: 7,
  //   value: '品牌TP'
  // }
];

// 客户阶段
export const customerLevelList = [
  {
    type: 0,
    value: '-',
  },
  {
    type: 1,
    value: '新增录入',
  },
  {
    type: 2,
    value: '意向客户',
  },
  {
    type: 3,
    value: '执行项目',
  },
  {
    type: 4,
    value: '执行结束',
  },
  {
    type: 5,
    value: '数据入库',
  },
  {
    type: 6,
    value: '项目完成',
  },
];
// 所属部门
export const departmentList = [
  {
    type: 0,
    value: '-',
  },
  {
    type: 1,
    value: '新营销事业部',
  },
  {
    type: 2,
    value: '内容电商事业部',
  },
  {
    type: 3,
    value: '新媒体事业部',
  },
  {
    type: 4,
    value: '研发部',
  },
  {
    type: 5,
    value: '市场公关部',
  },
  {
    type: 6,
    value: '财务部',
  },
  {
    type: 7,
    value: '人力资源部',
  },
  {
    type: 8,
    value: '总经办',
  },
];

// 合作平台
export const cooperationPlatformList = [
  {
    value: '全部',
    type: 0,
  },
  {
    value: '淘宝图文',
    type: 9,
  },
  {
    value: '小红书',
    type: 1,
  },
  {
    value: '微信公众号',
    type: 2,
  },
  {
    value: '新浪微博',
    type: 3,
  },
  {
    value: '淘宝短视频',
    type: 10,
  },
  {
    value: '抖音',
    type: 4,
  },
  {
    value: '快手',
    type: 5,
  },
  {
    value: '哔哩哔哩',
    type: 6,
  },
  {
    value: '淘宝直播',
    type: 7,
  },
  {
    value: '一直播',
    type: 8,
  },
  {
    value: '线下场地搭建',
    type: 11,
  },
  {
    value: '线下视觉设计',
    type: 12,
  },
  {
    value: '活动策划执行',
    type: 13,
  },
];

// 合作平台
export const cooperationPlatformListNew = [
  {
    value: '淘宝图文',
    type: 9,
  },
  {
    value: '小红书',
    type: 1,
  },
  {
    value: '微信公众号',
    type: 2,
  },
  {
    value: '新浪微博',
    type: 3,
  },
  {
    value: '淘宝短视频',
    type: 10,
  },
  {
    value: '抖音',
    type: 4,
  },
  {
    value: '快手',
    type: 5,
  },
  {
    value: '哔哩哔哩',
    type: 6,
  },
  {
    value: '淘宝直播',
    type: 7,
  },
  {
    value: '一直播',
    type: 8,
  },
  {
    value: '线下场地搭建',
    type: 11,
  },
  {
    value: '线下视觉设计',
    type: 12,
  },
  {
    value: '活动策划执行',
    type: 13,
  },
  {
    value: '行政采购',
    type: 14,
  },
];

// 店铺类型
/** @deprecated 12 in 3files */
export const shopType = [
  {
    value: '全部',
    type: 0,
  },
  {
    value: '淘宝店',
    type: 1,
  },
  {
    value: '天猫店',
    type: 2,
  },
];

// 公司类型
/** @deprecated 17 in 4 files */
export const companyType = [
  {
    value: '全部',
    type: 0,
  },
  {
    type: 1,
    value: '同行机构',
  },
  {
    type: 2,
    value: '广告公司',
  },
  {
    type: 3,
    value: '品牌TP',
  },
  {
    type: 4,
    value: '直客',
  },
];

export const shopTypeRadio = [
  {
    value: 3,
    text: '抖音店',
  },
  {
    value: 1,
    text: '淘宝店',
  },
  {
    value: 2,
    text: '天猫店',
  },
  {
    value: 4,
    text: '微信视频号',
  },
];

export const companyTypeRadio = [
  {
    value: 1,
    text: '同行机构',
  },
  {
    value: 2,
    text: '广告公司',
  },
  {
    value: 3,
    text: '品牌TP',
  },
  {
    value: 4,
    text: '直客',
  },
];

export const shopTypeList = [
  {
    type: 0,
    value: '-',
  },
  {
    type: 1,
    value: '淘宝店',
  },
  {
    type: 2,
    value: '天猫店',
  },
];

export const companyTypeList = [
  {
    type: 0,
    value: '--',
  },
  {
    type: 1,
    value: '同行机构',
  },
  {
    type: 2,
    value: '广告公司',
  },
  {
    type: 3,
    value: '品牌TP',
  },
  {
    type: 4,
    value: '直客',
  },
];
//工作台-审批类型
export const approvalTypeList = [
  {
    type: 0,
    value: '--',
  },
  {
    type: 1,
    value: '用款申请',
  },
  {
    type: 2,
    value: '退款申请',
  },
  {
    type: 3,
    value: '借款申请',
  },
  {
    type: 4,
    value: '开票申请',
  },
];

// name：曲线图/雷达图 用色顺序
export const lineRadarColors = [
  '#D15CB4',
  '#6090F0',
  '#FF9C69',
  '#59B6DF',
  '#C673F0',
  '#52CCC2',
  '#F0737F',
  '#6FCC66',
  '#DBD26A',
  '#9D73F0',
  '#FAB36E',
  '#A2D160',
  '#D15CB4',
  '#58B89F',
  '#E06C9C',
  '#8873F0',
  '#FA9384',
  '#C251A6',
  '#486DB5',
  '#C77A52',
  '#4185A3',
  '#9557B5',
  '#3C968F',
  '#B55760',
  '#4F9149',
  '#A19A4D',
  '#7657B5',
  '#BF8954',
  '#759645',
  '#964282',
  '#3C7D6C',
  '#A65073',
  '#6556B3',
  '#BF7065',
  '#873874',
];

// name：柱状图/面积图/条形图/环状图/玫瑰图 用色顺序
export const barPieLoopColors = [
  '#6090F0',
  '#FF9C69',
  '#52CCC2',
  '#59B6DF',
  '#C673F0',
  '#D15CB4',
  '#F0737F',
  '#DBD26A',
  '#FAB36E',
  '#A2D160',
  '#6FCC66',
  '#58B89F',
  '#8873F0',
  '#FA9384',
  '#9D73F0',
  '#E06C9C',
  '#C251A6',
];
//饼图
export const PieRadarColors = [
  '#1E8DFF',
  '#FFBF00',
  '#10C0D3',
  '#9273F8',
  '#FE9C25',
  '#00B942',
  '#FFCD39',
  '#FF829D',
  '#00A3FF',
  '#3AD08E',
  '#F1DC2F',
  '#845EF7',
  '#FF7F00',
  '#B3DC12',
  '#009999',
  '#2877FF',
  '#D977F2',
  '#FFC073',
  '#768FF3',
  '#81E5B1',
  '#BAC8FF',
  '#E599F8',
  '#E7E275',
  '#FF7E7E',
  '#F7A0B8',
  '#49C6F1',
  '#B197FC',
  '#53D66F',
  '#FF97AD',
  '#FDD866',
];
export function getFirstAvatarName(name) {
  for (const char of name) {
    if ('\u4e00' <= char && char <= '\u9fa5') {
      return char;
    }
  }
  return name[0];
}
