import { TgTableColumn } from '@/types/vendor/column';
import { h, ref } from '@vue/composition-api';
// import { recruitmentStatusColor } from './common';

export type Col = TgTableColumn<M.anchorRecruitment.AnchorRecruitmentModel>;
export const useColumns = () => {
  // 日期列
  const dateColumn = ref<Col>({
    align: 'center',
    label: '日期',
    minWidth: 90,
    prop: 'create_date',
    dataType: {
      type: 'date',
    },
  });
  // 项目列
  const projectColumn = ref<Col>({
    align: 'left',
    'show-overflow-tooltip': true,
    label: '项目',
    prop: 'project_name',
    minWidth: 120,
  });
  // 负责人
  const principalColumn = ref<Col>({
    align: 'center',
    'show-overflow-tooltip': true,
    label: '负责人',
    prop: 'project_counterpart_name',
    minWidth: 100,
  });
  // 招募状态
  const recruitmentStatusColumn = ref<Col>({
    align: 'center',
    label: '招募状态',
    prop: 'recruit_status',
    minWidth: 80,
    formatter: row => {
      return E.supplier.RecruitmentStatusMap.get(row.recruit_status) || '--';
      // const statusStr = E.supplier.RecruitmentStatusMap.get(row.recruit_status) || '--';
      // return h(
      //   'div',
      //   {
      //     style: {
      //       color: recruitmentStatusColor(row.recruit_status),
      //     },
      //   },
      //   statusStr,
      // );
    },
  });
  // 花名
  const userNameColumn = ref<Col>({
    align: 'center',
    label: '花名',
    minWidth: 140,
    prop: 'anchor_flower_name',
    showOverflowTooltip: true,
    formatter: row => {
      return `${row.anchor_flower_name} (${row.anchor_real_name})`;
    },
  });
  // 合作内容
  const cooperationContentColumn = ref<Col>({
    align: 'center',
    label: '合作内容',
    minWidth: 100,
    prop: 'cooperation_class',
    formatter: row => {
      return E.supplier.RecruitmentCooperationContentMap.get(row.cooperation_class) || '--';
    },
  });
  // 合作情况
  const cooperationSituationColumn = ref<Col>({
    align: 'center',
    label: '合作情况',
    minWidth: 100,
    prop: 'cooperation_mode',
    formatter: row => {
      return E.supplier.RecruitmentCooperationModeMap.get(row.cooperation_mode) || '--';
    },
  });
  // 合作费用
  const cooperationFeeColumn = ref<Col>({
    align: 'left',
    label: '合作费用',
    showOverflowTooltip: true,
    minWidth: 100,
    prop: 'cooperation_cost_describe',
  });
  // 推荐人
  const referorColumn = ref<Col>({
    align: 'center',
    label: '推荐人',
    minWidth: 100,
    prop: 'referrer_name',
  });
  // 商务费用
  const businessFeeColumn = ref<Col>({
    align: 'right',
    label: '商务费用 (元)',
    minWidth: 140,
    prop: 'business_cost',
    dataType: {
      type: 'money',
      unit: 100,
      toFixed: 2,
    },
  });
  // 其它说明
  const otherExplanationsColumn = ref<Col>({
    align: 'left',
    label: '其它说明',
    minWidth: 150,
    prop: 'comment',
    showOverflowTooltip: true,
    dataType: {
      type: 'text',
    },
  });
  // 服务评价
  const serviceRatingColumn = ref<Col>({
    align: 'center',
    label: '服务评价',
    minWidth: 88,
    prop: 'recruit_satisfaction',
    formatter: row => {
      return E.supplier.RecruitRatisfactionMap.get(row.recruit_satisfaction) || '--';
    },
  });
  return {
    dateColumn,
    projectColumn,
    principalColumn,
    recruitmentStatusColumn,
    userNameColumn,
    cooperationContentColumn,
    cooperationSituationColumn,
    cooperationFeeColumn,
    referorColumn,
    businessFeeColumn,
    otherExplanationsColumn,
    serviceRatingColumn,
  };
};
