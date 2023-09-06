/*
 * @Description: 选项配置文件
 * @Author: 白青
 * @Date: 2019-08-06 16:21:43
 * @LastEditTime: 2021-09-24 14:24:57
 * @LastEditors: Please set LastEditors
 */
import { OptionType } from '@/types/base/advanced';
import { ContractType } from '@/types/tiange/contract';
// 擅长领域
const categoryOptions = [
  {
    value: 1,
    label: '美妆',
  },
  {
    value: 2,
    label: '个护',
  },
  {
    value: 3,
    label: '服饰',
  },
  {
    value: 4,
    label: '美食',
  },
  {
    value: 5,
    label: '母婴',
  },
  {
    value: 6,
    label: '数码',
  },
  {
    value: 7,
    label: '家居',
  },
  {
    value: 8,
    label: '保健',
  },
  {
    value: 9,
    label: '萌宠',
  },
  {
    value: 10,
    label: '箱包',
  },
  {
    value: 11,
    label: '配饰',
  },
];
const displayTypeOptions = [
  {
    value: 0,
    label: '混播',
  },
  {
    value: 1,
    label: '专场',
  },
];

const salesPriceOptions = [
  {
    value: 0,
    label: '0 ~ 100',
  },
  {
    value: 1,
    label: '100 ~ 200',
  },
  {
    value: 2,
    label: '200以上',
  },
];

const fansNumberOptions = [
  {
    value: '0',
    label: '0 ~ 10W',
    min_fans_number: 0,
    max_fans_number: 10,
  },
  {
    value: '1',
    label: '10W ～ 30W',
    min_fans_number: 10,
    max_fans_number: 30,
  },
  {
    value: '3',
    label: '30W ~ 50W',
    min_fans_number: 30,
    max_fans_number: 50,
  },
  {
    value: '5',
    label: '50W ~ 80W',
    min_fans_number: 50,
    max_fans_number: 80,
  },
  {
    value: '8',
    label: '80W以上',
    min_fans_number: 80,
    max_fans_number: '',
  },
];

const mixSpeicalOptions = [
  {
    value: 'mix',
    label: '混播',
  },
  {
    value: 'special',
    label: '专场',
  },
];

const clickTypeOptions = [
  {
    value: 'meizhuang',
    label: '美妆',
  },
  {
    value: 'gehu',
    label: '个护',
  },
  {
    value: 'fushi',
    label: '服饰',
  },
  {
    value: 'meishi',
    label: '美食',
  },
];

const periodStatDimension = [
  {
    value: '每小时观看人数',
    color: '#7484b7',
  },
  {
    value: '每小时观看数',
    color: '#4dcdb1',
  },
  {
    value: '场均观看人数',
    color: '#f895e7',
  },
  {
    value: '场均观看数',
    color: '#ffbf40',
  },
  {
    value: '粉丝精准度',
    color: '#5273d3',
  },
  {
    value: '日均开播场次',
    color: '#d87a80',
  },
  {
    value: '日均开播时长',
    color: '#b6a2de',
  },
  {
    value: '人均点击数',
    color: '#FFB980',
  },
  {
    value: '每小时互动数',
    color: '#d075c4',
  },
  {
    value: '人均互动数',
    color: '#fd936e',
  },
];

const categoryRecentDayDimension = [
  {
    value: '最近15天',
    label: 15,
  },
  {
    value: '最近1个月',
    label: 30,
  },
  {
    value: '最近3个月',
    label: 90,
  },
];
const displayStatDimension = [
  {
    value: '每小时观看人数',
    color: '#4dcdb1',
  },
  {
    value: '每小时观看数',
    color: '#7484b7',
  },
  {
    value: '观看数',
    color: '#b4c4f5',
  },
  {
    value: '观看人数',
    color: '#f895e7',
  },
  {
    value: '时长',
    color: '#5ab1ef',
  },
];

const displayRecentDayDimension = [
  {
    value: '最近7场',
    num: 7,
  },
  {
    value: '最近15场',
    num: 15,
  },
  {
    value: '最近30场',
    num: 30,
  },
  {
    value: '最近90场',
    num: 90,
  },
];
const smallCategoryDaydimension = ['最近15天', '最近1个月', '最近3个月'];

const livePeriodOption = [
  {
    value: 0,
    label: '白天',
  },
  {
    value: 1,
    label: '晚上',
  },
];

const liveDurationOption = [
  {
    value: 3,
    label: '0 ~ 5分钟',
  },
  {
    value: 0,
    label: '5 ~ 10分钟',
  },
  {
    value: 1,
    label: '10 ~ 15分钟',
  },
  {
    value: 2,
    label: '15 ~ 20分钟',
  },
  {
    value: 4,
    label: '20分钟以上',
  },
];

const isPresellOptions = [
  {
    value: 1,
    label: '预售场',
  },
  {
    value: 2,
    label: '预热场',
  },
  {
    value: 0,
    label: '非预售场',
  },
  {
    value: -1,
    label: '未录入',
  },
];
const presellSelectOption = [
  {
    value: 1,
    label: '预售场',
  },
  {
    value: 2,
    label: '预热场',
  },
  {
    value: 0,
    label: '非预售场',
  },
];
const isDisplayOptions = [
  {
    value: 1,
    label: '未出单',
  },
  {
    value: 2,
    label: '已出单',
  },
];
const latestDisplayTimeOptions = [
  {
    value: 7,
    label: '最近一周',
  },
  {
    value: 15,
    label: '最近15天',
  },
  {
    value: 30,
    label: '最近一个月',
  },
];

const contractTypeOptions = [
  {
    value: ContractType.Sales,
    label: '销售合同',
  },
  {
    value: ContractType.Framework,
    label: '框架合同',
  },
];
// 合同类别
const partnerTypeOptions = [
  { value: 1, label: '客户合同' },
  { value: 2, label: '供应商合同' },
];
const saleContractTypeOptions = [
  {
    value: 1,
    label: '销售合同',
  },
  {
    value: 2,
    label: '框架合同',
  },
];
const supplierContractTypeOptions = [
  {
    value: 3,
    label: '采买合同',
  },
  {
    value: 4,
    label: '框架合同',
  },
];

const businessTypeOptions = [
  {
    value: 1,
    label: '营销业务',
  },
  {
    value: 5,
    label: '创新项目',
  },
  {
    value: 3,
    label: '抖音店播',
  },
  {
    value: 2,
    label: '淘宝店播',
  },
  {
    value: 7,
    label: '本地生活',
  },
  {
    value: 8,
    label: '淘宝甄选',
  },
];
const businessNewTypeOptions = [
  {
    value: 1,
    label: '营销业务',
  },
  {
    value: 5,
    label: '创新项目',
  },
  {
    value: 3,
    label: '抖音店播',
  },
  {
    value: 2,
    label: '淘宝店播',
  },
  {
    value: 4,
    label: '区域业务',
  },
  {
    value: 7,
    label: '本地生活',
  },
  {
    value: 9,
    label: '供应链',
  },
  /*  {
    value: 8,
    label: '淘宝甄选',
  },*/
  /* {
    value: 6,
    label: '煜丰投放',
  },
  {
    value: 7,
    label: '个人业务',
  },
  {
    value: 8,
    label: '其它',
  },*/
];
const contractStatusOptions = [
  // {
  //   value: 1,
  //   label: '待审批',
  // },
  {
    value: 2,
    label: '正常',
  },
  {
    value: 4,
    label: '审批中',
  },
  {
    value: 3,
    label: '审批失败',
  },
  {
    value: 5,
    label: '已作废',
  },
];

const supplierContractStatusOptions = [
  {
    value: 2,
    label: '审批成功',
  },
  {
    value: 4,
    label: '审批中',
  },
  {
    value: 3,
    label: '审批失败',
  },
  {
    value: 5,
    label: '已作废',
  },
];

const saleChances = [
  {
    value: 1,
    label: '小红书',
  },
  {
    value: 2,
    label: '微信公众号',
  },
  {
    value: 3,
    label: '新浪微博',
  },
  {
    value: 4,
    label: '抖音',
  },
  {
    value: 5,
    label: '快手',
  },
  {
    value: 6,
    label: '哔哩哔哩',
  },
  {
    value: 7,
    label: '淘宝直播',
  },
  {
    value: 8,
    label: '一直播',
  },
  {
    value: 9,
    label: '淘宝图文',
  },
  {
    value: 10,
    label: '淘宝短视频',
  },
  {
    value: 11,
    label: '线下场地搭建',
  },
  {
    value: 12,
    label: '线下视觉设计',
  },
  {
    value: 13,
    label: '活动策划执行',
  },
];

// 用户审核状态
const userStatus = [
  {
    value: 0,
    label: '待审核',
  },
  {
    value: 1,
    label: '已通过',
  },
  {
    value: 2,
    label: '已禁用',
  },
  {
    value: 4,
    label: '已拒绝',
  },
];
const redioType = [
  {
    value: 1,
    label: '长视频',
  },
  {
    value: 2,
    label: '短视频',
  },
  {
    value: 3,
    label: '直播',
  },
];

/**
 * 项目收款类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 14:11:16
 */
export enum GatherTypes {
  /** 服务费 */
  ServiceCharge = 1,
  /** 佣金 */
  Commission,
  /** 其他 */
  Other,
  Refund = 5,
}
// 提现核销状态
export enum WithdrawWriteOffTypes {
  // 未核销
  writeoff_no = 0,
  // 部分核销
  writeoff_partial = 1,
  // 已核销
  writeoff_yes = 2,
}
export const WithdrawWriteOffOptions: OptionType<WithdrawWriteOffTypes>[] = [
  { label: '未核销', value: WithdrawWriteOffTypes.writeoff_no },
  { label: '部分核销', value: WithdrawWriteOffTypes.writeoff_partial },
  { label: '已核销', value: WithdrawWriteOffTypes.writeoff_yes },
];
/**
 * 项目收款类型Map
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-14 14:12:35
 */
export const GatherTypeMap = new Map([
  [GatherTypes.ServiceCharge, '服务费'],
  [GatherTypes.Commission, '佣金'],
  [GatherTypes.Other, '其他'],
  [GatherTypes.Refund, '退款'],
]);

// 项目收款类型
const gatherTypeOptions: OptionType<GatherTypes>[] = [
  { label: '服务费', value: GatherTypes.ServiceCharge },
  { label: '佣金', value: GatherTypes.Commission },
  { label: '其他', value: GatherTypes.Other },
  { label: '退款', value: GatherTypes.Refund },
];

// 收款方式
const gatherWayOptions: OptionType<number>[] = [
  { label: 'V任务', value: 1 },
  { label: '支付宝', value: 2 },
  { label: '对公银行', value: 3 },
  { label: '预收款', value: 6 },
];
// 通用业务中使用
const gatherWayOptionsCommon: OptionType<number>[] = [
  ...gatherWayOptions,
  { label: '阿里妈妈', value: 4 },
  { label: '巨量百应', value: 5 },
];
const anchorTypeOptions: OptionType<number>[] = [
  { label: '网络营销师', value: 1 },
  { label: '练习生', value: 2 },
];
export {
  anchorTypeOptions,
  gatherWayOptions,
  gatherTypeOptions,
  categoryOptions,
  salesPriceOptions,
  fansNumberOptions,
  mixSpeicalOptions,
  clickTypeOptions,
  periodStatDimension,
  categoryRecentDayDimension,
  displayStatDimension,
  displayRecentDayDimension,
  smallCategoryDaydimension,
  livePeriodOption,
  liveDurationOption,
  displayTypeOptions,
  isPresellOptions,
  isDisplayOptions,
  latestDisplayTimeOptions,
  presellSelectOption,
  contractTypeOptions,
  supplierContractTypeOptions,
  contractStatusOptions,
  supplierContractStatusOptions,
  saleChances,
  userStatus,
  redioType,
  businessTypeOptions,
  businessNewTypeOptions,
  saleContractTypeOptions,
  partnerTypeOptions,
  gatherWayOptionsCommon,
};
