/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-24 11:34:26
 */

import { TableColumn } from '@/types/vendor/column';
import { computed, ref, SetupContext } from '@vue/composition-api';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import { QueryS2B2CDouyinSessionReport } from '@/services/commonBusiness/project';
import { DisplayDailyData, DisplayDailyDataList } from '@/types/tiange/commonBusiness/project';
import { formatAmount } from '@/utils/string';
import Decimal from 'decimal.js';
type Col = TableColumn<{ row: DisplayDailyData }>;
// interface UseTableParams {

// }

// export const useTable = (payload: UseTableParams) => {
export const useTable = (ctx: SetupContext) => {
  const router = useRouter();
  const dateFormat = 'yyyy-MM-DD';
  const loading = ref<boolean>(false);
  const tableData = ref<DisplayDailyDataList | undefined>(undefined);

  const baseInfoClassName = 'base-info-head';
  const dataScreenClassName = 'data-screen-head';
  const flowTargetClassName = 'flow-target-head';
  const interaactiveTargetClassName = 'interactive-target-head';
  const productTargetClassName = 'product-target-head';
  const tradeTargetClassName = 'trade-target-head';
  const viewerClassName = 'viewer-head';
  const dealClassName = 'deal-head';

  const showRadio = (val: number | undefined): string => {
    if (val === undefined || val === null) {
      return '';
    }
    if (val < 0) {
      return '--';
    }
    const str = val ? new Decimal(val).mul(new Decimal(100)).toFixed(2) : '0';
    return `${str}%`;
  };
  const showInt = (val: number | undefined): string => {
    if (val === undefined || val === null) {
      return '';
    }
    if (val < 0) {
      return '--';
    }
    const str = val ? formatAmount(val, 'None', true) : '0';
    return str;
  };
  const showPrice = (val: number | undefined): string => {
    if (val === undefined || val === null) {
      return '';
    }
    if (val < 0) {
      return '--';
    }
    const str = val ? formatAmount(val / 100, 'None') : '0';
    return str;
  };
  // 基础信息

  const baseInfoColumns = computed<Col[]>(() => [
    {
      label: '开播时间',
      width: 126,
      align: 'center',
      className: baseInfoClassName,
      formatter: ({ row }) =>
        row.live_room_start_time ? moment(row.live_room_start_time).format('yyyy.MM.DD HH:mm') : '',
    },
    {
      label: '结束时间',
      width: 126,
      align: 'center',
      className: baseInfoClassName,
      formatter: ({ row }) =>
        row.live_room_end_time ? moment(row.live_room_end_time).format('yyyy.MM.DD HH:mm') : '',
    },
    {
      label: '直播时长',
      width: 102,
      align: 'right',
      headerAlign: 'center',
      className: baseInfoClassName,
      formatter: ({ row }) => (row.live_duration_str ? row.live_duration_str : ''),
    },
    {
      label: '是否有效直播',
      width: 92,
      align: 'center',
      className: baseInfoClassName,
      formatter: ({ row }) => {
        if (row.is_valid_live_room === null || row.is_valid_live_room === undefined) {
          return '';
        }
        return row.is_valid_live_room ? '是' : '否';
      },
    },
  ]);
  // 数据大屏
  const dataScreenColumns = computed<Col[]>(() => [
    {
      label: '直播间成交金额 (元)',
      width: 130,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showPrice(row.gmv),
    },
    {
      label: '曝光-观看率',
      width: 88,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showRadio(row.watch_cnt_show_ratio),
    },
    {
      label: '人均看播时长 (秒)',
      width: 118,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showInt(row.avg_watch_duration),
    },
    {
      label: '分钟评论次数',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showInt(row.comment_num_minute),
    },
    {
      label: '千次观看转化 (元)',
      width: 126,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showPrice(row.gpm),
    },
    {
      label: '观看-成交转化率',
      width: 112,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showRadio(row.watch_pay_ucnt_ratio),
    },
    {
      label: '成交老粉占比',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showRadio(row.old_fans_pay_ucnt_ratio),
    },
    {
      label: '退款金额占比',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showRadio(row.real_refund_amt_ratio),
    },
    {
      label: '成交人数',
      width: 68,
      align: 'right',
      headerAlign: 'center',
      className: dataScreenClassName,
      formatter: ({ row }) => showInt(row.pay_ucnt),
    },
  ]);
  // 流量指标
  const flowTargetColumns = computed<Col[]>(() => [
    {
      label: '平均在线人数',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: flowTargetClassName,
      formatter: ({ row }) => showInt(row.avg_online_person),
    },
    {
      label: '最高在线人数',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: flowTargetClassName,
      formatter: ({ row }) => showInt(row.max_online_person),
    },
    {
      label: '累计观看人数',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: flowTargetClassName,
      formatter: ({ row }) => showInt(row.cumulative_watch_person),
    },
    {
      label: '直播间浏览量',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: flowTargetClassName,
      formatter: ({ row }) => showInt(row.room_user_views),
    },
    {
      label: '直播间爆光人数',
      width: 110,
      align: 'right',
      headerAlign: 'center',
      className: flowTargetClassName,
      formatter: ({ row }) => showInt(row.room_watch_person),
    },
    {
      label: '直播间爆光次数',
      width: 104,
      align: 'right',
      headerAlign: 'center',
      className: flowTargetClassName,
      formatter: ({ row }) => showInt(row.room_watch_times),
    },
  ]);
  // 互动指标
  const interactiveTargetColumns = computed<Col[]>(() => [
    {
      label: '新增粉丝数',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showInt(row.incr_new_fans_num),
    },
    {
      label: '转粉率',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showRadio(row.new_fans_rate),
    },
    {
      label: '人均观看时长 (秒)',
      width: 126,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showInt(row.avg_watch_duration),
    },
    {
      label: '新加团人数',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showInt(row.incr_new_add_group_person),
    },
    {
      label: '加团率',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showRadio(row.add_group_rate),
    },
    {
      label: '评论次数',
      width: 70,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showInt(row.comment_num),
    },
    {
      label: '点赞次数',
      width: 70,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showInt(row.thumb_num),
    },
    {
      label: '分享次数',
      width: 70,
      align: 'right',
      headerAlign: 'center',
      className: interaactiveTargetClassName,
      formatter: ({ row }) => showInt(row.share_num),
    },
  ]);
  // 商品指标
  const productTargetColumns = computed<Col[]>(() => [
    {
      label: '带货商品数',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      className: productTargetClassName,
      formatter: ({ row }) => showInt(row.product_nums),
    },
    {
      label: '商品爆光人数',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: productTargetClassName,
      formatter: ({ row }) => showInt(row.product_watch_person),
    },
    {
      label: '商品点击人数',
      width: 92,
      align: 'right',
      headerAlign: 'center',
      className: productTargetClassName,
      formatter: ({ row }) => showInt(row.product_click_person),
    },
    {
      label: '商品点击率 (次数)',
      width: 128,
      align: 'right',
      headerAlign: 'center',
      className: productTargetClassName,
      formatter: ({ row }) => showRadio(row.product_click_nums_rate),
    },
    {
      label: '商品点击率 (人数)',
      width: 128,
      align: 'right',
      headerAlign: 'center',
      className: productTargetClassName,
      formatter: ({ row }) => showRadio(row.product_click_person_rate),
    },
  ]);
  // 交易指标
  const tradeTargetColumns = computed<Col[]>(() => [
    {
      label: '客单价 (元)',
      width: 90,
      align: 'right',
      headerAlign: 'center',
      className: tradeTargetClassName,
      formatter: ({ row }) => showPrice(row.per_customer_price),
    },
    {
      label: '看播成交转化率 (人数)',
      width: 152,
      align: 'right',
      headerAlign: 'center',
      className: tradeTargetClassName,
      formatter: ({ row }) => showRadio(row.watch_pay_ucnt_ratio),
    },
    {
      label: '直播间成交人数',
      width: 104,
      align: 'right',
      headerAlign: 'center',
      className: tradeTargetClassName,
      formatter: ({ row }) => showInt(row.pay_ucnt),
    },
    {
      label: '点击成交转化率 (人数)',
      width: 152,
      align: 'right',
      headerAlign: 'center',
      className: tradeTargetClassName,
      formatter: ({ row }) => showRadio(row.click_to_trade_person_rate),
    },
    {
      label: '点击成交转化率 (次数)',
      width: 152,
      align: 'right',
      headerAlign: 'center',
      className: tradeTargetClassName,
      formatter: ({ row }) => showRadio(row.click_to_trade_num_rate),
    },
    {
      label: '看播成交转化率 (次数)',
      width: 152,
      align: 'right',
      headerAlign: 'center',
      className: tradeTargetClassName,
      formatter: ({ row }) => showRadio(row.watch_to_trade_num_rate),
    },
  ]);
  // 用户画像-看播用户
  const viewerColumns = computed<Col[]>(() => [
    {
      label: '粉丝占比',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.fans_distribution?.fans),
    },
    {
      label: '非粉丝占比',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.fans_distribution?.un_fans),
    },
    {
      label: '女性占比',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.gender_distribution?.female),
    },
    {
      label: '年龄层18-23',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.age_distribution?.['18-23']),
    },
    {
      label: '年龄层24-30',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.age_distribution?.['24-30']),
    },
    {
      label: '年龄层31-40',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.age_distribution?.['31-40']),
    },
    {
      label: '年龄层41-50',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => showRadio(row.watch_user?.age_distribution?.['41-50']),
    },
    {
      label: 'TOP1省份',
      width: 84,
      align: 'center',
      //   headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => {
        if (
          row.watch_user?.fans_distribution?.fans &&
          row.watch_user?.fans_distribution?.fans < 0
        ) {
          return '--';
        }
        const str = row.watch_user?.province_distribution_sorted?.[0]?.[0];
        return str ? str : '';
      },
    },
    {
      label: '占比',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: viewerClassName,
      formatter: ({ row }) => {
        if (
          row.watch_user?.fans_distribution?.fans &&
          row.watch_user?.fans_distribution?.fans < 0
        ) {
          return '--';
        }
        return showRadio(row.watch_user?.province_distribution_sorted?.[0]?.[1]);
      },
    },
  ]);
  // 用户画像-成交用户
  const dealColumns = computed<Col[]>(() => [
    {
      label: '粉丝占比',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.fans_distribution?.fans),
    },
    {
      label: '非粉丝占比',
      width: 80,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.fans_distribution?.un_fans),
    },
    {
      label: '女性占比',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.gender_distribution?.female),
    },
    {
      label: '年龄层18-23',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.age_distribution?.['18-23']),
    },
    {
      label: '年龄层24-30',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.age_distribution?.['24-30']),
    },
    {
      label: '年龄层31-40',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.age_distribution?.['31-40']),
    },
    {
      label: '年龄层41-50',
      width: 100,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => showRadio(row.pay_user?.age_distribution['41-50']),
    },
    {
      label: 'TOP1省份',
      width: 84,
      align: 'center',
      //   headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => {
        if (row.pay_user?.fans_distribution?.fans && row.pay_user?.fans_distribution?.fans < 0) {
          return '--';
        }
        const str = row.pay_user?.province_distribution_sorted?.[0]?.[0];
        return str ? str : '';
      },
    },
    {
      label: '占比',
      width: 72,
      align: 'right',
      headerAlign: 'center',
      className: dealClassName,
      formatter: ({ row }) => {
        if (row.pay_user?.fans_distribution?.fans && row.pay_user?.fans_distribution?.fans < 0) {
          return '--';
        }
        return showRadio(row.pay_user?.province_distribution_sorted?.[0]?.[1]);
      },
    },
  ]);
  // 带货分
  const bringGoodsGradeColumns = computed<Col[]>(() => [
    {
      label: '带货口碑分',
      width: 84,
      align: 'right',
      headerAlign: 'center',
      className: baseInfoClassName,
      formatter: ({ row }) => {
        const val = row.seller_score?.score.value;
        if (val === null || val === undefined) {
          return '';
        }
        if (val < 0) {
          return '--';
        }
        return val ? val : 0;
      },
    },
  ]);

  const methods = {
    async queryS2B2CDouyinSessionReport(currentDate: moment.Moment | undefined) {
      const tempDate = currentDate ?? moment();
      const params = {
        begin_time: tempDate.clone().startOf('M').format(dateFormat),
        end_time: tempDate.clone().endOf('M').format(dateFormat),
        project_id: router.currentRoute.params.id,
        group: 'live',
      };
      loading.value = true;
      const res = await QueryS2B2CDouyinSessionReport(params);
      setTimeout(() => {
        loading.value = false;
      }, 300);
      if (res.data.success) {
        tableData.value = res.data.data;
        ctx.emit('dataUpdate', {
          date: tableData.value.update_time,
        });
      } else {
        ctx.root.$message.error(res.data.message ?? '获取场次数据失败');
      }
    },
    reload(currentDate: moment.Moment | undefined) {
      methods.queryS2B2CDouyinSessionReport(currentDate);
    },
  };

  return {
    loading,
    tableData,
    baseInfoClassName,
    dataScreenClassName,
    flowTargetClassName,
    interaactiveTargetClassName,
    productTargetClassName,
    tradeTargetClassName,
    viewerClassName,
    dealClassName,
    baseInfoColumns,
    dataScreenColumns,
    flowTargetColumns,
    interactiveTargetColumns,
    productTargetColumns,
    tradeTargetColumns,
    viewerColumns,
    dealColumns,
    bringGoodsGradeColumns,
    ...methods,
  };
};
