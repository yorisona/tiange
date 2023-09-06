/*
 * @Author: 肖槿
 * @Date: 2022-04-24 10:23:11
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-05-14 10:22:42
 * @FilePath: \goumee-star-frontend\src\modules\investment\unite\useUnite.ts
 */
import { GetUnitySettlements, PostDeleteUnity } from '@/services/investment';
import { sleep } from '@/utils/func';
import { TableColumn } from '@/types/vendor/column';
import { numberFormat } from '@/utils/formatMoney';
import { SetupContext, reactive, ref, toRefs, h } from '@vue/composition-api';
import statusDetail from './components/statusDetail/index.vue';
import backedDetail from './components/backedDetail/index.vue';
import { VNode } from 'vue';
export interface uniteStruct {
  settlement_date_start?: string;
  settlement_date_end?: string;
  status?: string;
  is_estimate: string;
  page_num: number;
  num: number;
  settlement_kind?: number;
}
export const unitedMap = new Map([
  [0, '未提交'],
  [1, '待财务确认'],
  [4, '待项目确认'],
  [2, '已确认'],
  [3, '已退回'],
  [5, '项目不通过'],
]);
export const statusBGColorMaps = new Map([
  [0, 'rgba(60,82,105,0.60);'],
  [1, '#FF955F'],
  [2, '#33BA5D'],
  [3, '#F04B4B'],
  [4, '#FF955F'],
  [5, '#F04B4B'],
]);
export interface statisticsStruct {
  count_confirmed_pay_amount: number;
  count_unconfirmed_pay_amount: number;
  sum_confirmed_pay_amount: number;
  sum_unconfirmed_pay_amount: number;
}
export interface Unite {
  settlement_date: string; // 结算周期
  total_gmv: number; // 订单总GMV (元)
  project_num: number; // 项目数
  commission_amount: number; // 预估佣金金额 (元)
  status: number; // 状态
  confirm_by: string; // 财务确认人
  confirm_date: string; // 财务确认时间
  id: number;
  settled_tech_service_fee: number; // 技术服务费
  project_details?: [];
}
export type Col = TableColumn<Unite>;

export const useList = (ctx: SetupContext) => {
  const queryParams = ref<uniteStruct>({
    settlement_date_start: undefined,
    settlement_date_end: undefined,
    status: undefined,
    is_estimate: '1',
    page_num: 1,
    num: 20,
  });

  const tableData = reactive<{
    loading: boolean;
    uniteData: [];
    total: number;
  }>({
    loading: false,
    uniteData: [],
    total: 0,
  });
  const columns = ref<Col[]>([
    {
      label: '结算周期',
      minWidth: 168,
      align: 'center',
      headerAlign: 'center',
      formatter: (unite: Unite) => unite.settlement_date.replace(/-/gi, '.'),
    },
    {
      label: '订单总GMV (元)',
      minWidth: 168,
      align: 'right',
      headerAlign: 'right',
      formatter: (unite: Unite) => numberFormat(unite.total_gmv, 2, '.', ','),
    },
    {
      label: '结算项目数',
      prop: 'project_num',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      label: '预估佣金金额 (元)',
      minWidth: 168,
      align: 'right',
      headerAlign: 'right',
      formatter: (unite: Unite) => numberFormat(unite.commission_amount, 2, '.', ','),
    },
    {
      label: '状态',
      prop: 'project_num',
      align: 'center',
      headerAlign: 'center',
      minWidth: 133,
      formatter: (unite: Unite) => {
        const { status, project_details } = unite;
        const bgcolor = statusBGColorMaps.get(status);
        const iconStyle = `display: inline-block;margin-top:6px; border-radius: 50%; width: 6px;height: 6px;background: ${bgcolor};`;
        const status_str = unitedMap.get(status) ?? '--';
        const strComp = h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'center',
              paddingLeft: '25px',
              cursor: project_details ? 'pointer' : '',
            },
            slot: 'reference',
          },
          [
            h('div', {
              style: iconStyle,
            }),
            h(
              'div',
              {
                style: 'padding-left:5px; display: inline-block;width:80px;text-align:left',
              },
              [status_str],
            ),
          ],
        );
        const popoverComp = h(
          'el-popover',
          {
            attrs: {
              placement: 'right',
              width: 200,
              trigger: 'hover',
              popperClass: 'unit-popover',
            },
          },
          [
            h(
              'div',
              {
                style: { cursor: 'pointer' },
              },
              [
                h(status === 5 ? backedDetail : statusDetail, {
                  attrs: {
                    list: project_details,
                  },
                }),
              ],
            ),
            strComp,
          ],
        );
        let textArr: VNode;
        if (project_details) {
          textArr = popoverComp;
        } else {
          textArr = strComp;
        }
        return textArr;
      },
    },
    {
      label: '财务确认人',
      align: 'center',
      headerAlign: 'center',
      minWidth: 128,
      formatter: unite => unite.confirm_by ?? '--',
    },
    {
      label: '财务确认时间',
      align: 'center',
      headerAlign: 'center',
      minWidth: 142,
      formatter: (unite: Unite) =>
        unite.confirm_date ? unite.confirm_date.replace(/-/gi, '.') : '--',
    },
  ]);
  const getUniteData = async (payload: uniteStruct) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetUnitySettlements(payload),
    ]);

    tableData.loading = false;
    if (response.success) {
      tableData.uniteData = response.data.data;
      tableData.total = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const deleteUnite = async (id: number) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await PostDeleteUnity(id),
    ]);

    tableData.loading = false;
    if (response.success) {
      getUniteData(queryParams.value);
      ctx.root.$message.success('删除成功！');
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  return {
    ...toRefs(tableData),
    getUniteData,
    deleteUnite,
    queryParams,
    columns,
  };
};
export const useAutomatic = (ctx: SetupContext) => {
  const queryParams = ref<uniteStruct>({
    settlement_date_start: undefined,
    settlement_date_end: undefined,
    status: undefined,
    is_estimate: '0',
    page_num: 1,
    num: 20,
  });

  const tableData = reactive<{
    loading: boolean;
    uniteData: [];
    total: number;
  }>({
    loading: false,
    uniteData: [],
    total: 0,
  });
  const columns = ref<Col[]>([
    {
      label: '结算周期',
      minWidth: 168,
      align: 'center',
      headerAlign: 'center',
      formatter: (unite: Unite) => unite.settlement_date.replace(/-/gi, '.'),
    },
    {
      label: '佣金 (元)',
      minWidth: 168,
      align: 'right',
      headerAlign: 'right',
      formatter: (unite: Unite) => numberFormat(unite.commission_amount, 2, '.', ','),
    },
    {
      label: '技术服务费  ',
      minWidth: 168,
      align: 'right',
      headerAlign: 'right',
      formatter: (unite: Unite) => numberFormat(unite.settled_tech_service_fee, 2, '.', ','),
    },
    {
      label: '结算项目数',
      prop: 'project_num',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      label: '状态',
      prop: 'project_num',
      align: 'center',
      headerAlign: 'center',
      minWidth: 133,
      formatter: (unite: Unite) => {
        const { status, project_details } = unite;
        const bgcolor = statusBGColorMaps.get(status);
        const iconStyle = `display: inline-block;margin-top:6px; border-radius: 50%; width: 6px;height: 6px;background: ${bgcolor};`;
        const status_str = unitedMap.get(status) ?? '--';
        const strComp = h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'center',
              paddingLeft: '25px',
              cursor: project_details ? 'pointer' : '',
            },
            slot: 'reference',
          },

          [
            h('div', {
              style: iconStyle,
            }),
            h(
              'div',
              {
                style: 'padding-left:5px; display: inline-block;width:80px;text-align:left',
              },
              [status_str],
            ),
          ],
        );
        const popoverComp = h(
          'el-popover',
          {
            attrs: {
              placement: 'right',
              width: 200,
              trigger: 'hover',
              popperClass: 'unit-popover',
            },
          },
          [
            h(
              'div',
              {
                style: { cursor: 'pointer' },
              },
              [
                h(status === 5 ? backedDetail : statusDetail, {
                  attrs: {
                    list: project_details,
                  },
                }),
              ],
            ),
            strComp,
          ],
        );
        let textArr: VNode;
        if (project_details) {
          textArr = popoverComp;
        } else {
          textArr = strComp;
        }
        return textArr;
      },
    },
    {
      label: '财务确认人',
      align: 'center',
      headerAlign: 'center',
      minWidth: 128,
      formatter: unite => unite.confirm_by ?? '--',
    },
    {
      label: '财务确认时间',
      align: 'center',
      headerAlign: 'center',
      minWidth: 142,
      formatter: (unite: Unite) =>
        unite.confirm_date ? unite.confirm_date.replace(/-/gi, '.') : '--',
    },
  ]);
  const getUniteData = async (payload: uniteStruct) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetUnitySettlements(payload),
    ]);

    tableData.loading = false;
    if (response.success) {
      tableData.uniteData = response.data.data;
      tableData.total = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const deleteUnite = async (id: number) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await PostDeleteUnity(id),
    ]);

    tableData.loading = false;
    if (response.success) {
      getUniteData(queryParams.value);
      ctx.root.$message.success('删除成功！');
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  return {
    ...toRefs(tableData),
    getUniteData,
    deleteUnite,
    queryParams,
    columns,
  };
};

export const useCostLogic = (ctx: SetupContext) => {
  const queryParams = ref<uniteStruct>({
    settlement_date_start: undefined,
    settlement_date_end: undefined,
    status: undefined,
    is_estimate: '1',
    page_num: 1,
    num: 20,
    settlement_kind: 2,
  });

  const tableData = reactive<{
    loading: boolean;
    uniteData: [];
    total: number;
  }>({
    loading: false,
    uniteData: [],
    total: 0,
  });
  const columns = ref<Col[]>([
    {
      label: '结算周期',
      minWidth: 168,
      align: 'center',
      headerAlign: 'center',
      formatter: (unite: Unite) => unite.settlement_date.replace(/-/gi, '.'),
    },
    {
      label: '主播佣金 (元)',
      minWidth: 168,
      align: 'right',
      headerAlign: 'right',
      formatter: (unite: Unite) => numberFormat(unite.commission_amount, 2, '.', ','),
    },

    {
      label: '结算项目数',
      prop: 'project_num',
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      label: '状态',
      prop: 'project_num',
      align: 'center',
      headerAlign: 'center',
      minWidth: 133,
      formatter: (unite: Unite) => {
        const { status, project_details } = unite;
        const bgcolor = statusBGColorMaps.get(status);
        const iconStyle = `display: inline-block;margin-top:6px; border-radius: 50%; width: 6px;height: 6px;background: ${bgcolor};`;
        const status_str = unitedMap.get(status) ?? '--';
        const strComp = h(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'center',
              paddingLeft: '25px',
              cursor: project_details ? 'pointer' : '',
            },
            slot: 'reference',
          },
          [
            h('div', {
              style: iconStyle,
            }),
            h(
              'div',
              {
                style: 'padding-left:5px; display: inline-block;width:80px;text-align:left',
              },
              [status_str],
            ),
          ],
        );
        const popoverComp = h(
          'el-popover',
          {
            attrs: {
              placement: 'right',
              width: 200,
              trigger: 'hover',
              popperClass: 'unit-popover',
            },
          },
          [
            h(
              'div',
              {
                style: { cursor: 'pointer' },
              },
              [
                h(status === 5 ? backedDetail : statusDetail, {
                  attrs: {
                    list: project_details,
                  },
                }),
              ],
            ),
            strComp,
          ],
        );
        let textArr: VNode;
        if (project_details) {
          textArr = popoverComp;
        } else {
          textArr = strComp;
        }
        return textArr;
      },
    },
    {
      label: '财务确认人',
      align: 'center',
      headerAlign: 'center',
      minWidth: 128,
      formatter: unite => unite.confirm_by ?? '--',
    },
    {
      label: '财务确认时间',
      align: 'center',
      headerAlign: 'center',
      minWidth: 142,
      formatter: (unite: Unite) =>
        unite.confirm_date ? unite.confirm_date.replace(/-/gi, '.') : '--',
    },
  ]);
  const getUniteData = async (payload: uniteStruct) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetUnitySettlements(payload),
    ]);

    tableData.loading = false;
    if (response.success) {
      tableData.uniteData = response.data.data;
      tableData.total = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const deleteUnite = async (id: number) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await PostDeleteUnity(id),
    ]);

    tableData.loading = false;
    if (response.success) {
      getUniteData(queryParams.value);
      ctx.root.$message.success('删除成功！');
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  return {
    ...toRefs(tableData),
    getUniteData,
    deleteUnite,
    queryParams,
    columns,
  };
};
