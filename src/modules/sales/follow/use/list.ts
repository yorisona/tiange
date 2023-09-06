/**
 *@description: 销售管理-客户跟进-列表
 *@author: 棠棣
 *@since: 2021/1/20 18:17
 */
import { h, ref, SetupContext } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import {
  CustomerFollowList,
  TaskStatusTypeMap,
  CustomerIntentionMAP,
  TaskStatusTypeEnum,
  SalesFollowQueryParams,
} from '@/types/tiange/sales.follow';
import { BusinessTypeMap } from '@/types/tiange/common';
import { sleep } from '@/utils/func';
import { GetLiveProjectList } from '@/services/sales.follow';

export const useList = (ctx: SetupContext) => {
  const loading = ref(false);
  /** 数据列表 */
  const list = ref<CustomerFollowList[]>([]);
  const total = ref(0);

  const loadData = async (payload: SalesFollowQueryParams) => {
    list.value = [];
    loading.value = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await GetLiveProjectList(payload),
    ]);
    loading.value = false;
    if (response.success) {
      list.value = response.data.data;
      total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  const statusColor = (status?: TaskStatusTypeEnum) => {
    switch (status) {
      case TaskStatusTypeEnum.process:
        return 'color: #FF7A36';
      case TaskStatusTypeEnum.reached:
        return 'color: #3EAF90';
        break;
      default:
        return 'color: #999999';
        break;
    }
  };

  const columns = ref<TableColumn<CustomerFollowList>[]>([
    {
      label: '任务编号',
      align: 'left',
      headerAlign: 'left',
      property: 'mission_no',
      minWidth: 146,
      formatter: (row, column, value) => h('div', { class: 'hover-link' }, [value]),
    },
    {
      label: '客户名称',
      align: 'left',
      headerAlign: 'left',
      property: 'customer_name',
      minWidth: 156,
      formatter: row => {
        if (row.customer_name !== '' && row.customer_name.length > 16) {
          return h('el-popover', { props: { trigger: 'hover' } }, [
            h('div', { class: 'line-clamp-1', slot: 'reference' }, [row.customer_name]),
            h('div', { style: { width: '248px' } }, [row.customer_name]),
          ]);
        } else {
          return h('div', { class: 'line-clamp-1' }, [row.customer_name]);
        }
      },
    },
    {
      label: '客户意向',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
      property: 'customer_intention',
      formatter: row => CustomerIntentionMAP.get(row.customer_intention) ?? '',
    },
    {
      label: '客户经理',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
      property: 'customer_manager',
    },
    {
      label: '客户情况',
      align: 'left',
      headerAlign: 'left',
      minWidth: 188,
      property: 'customer_info',
      formatter: row => {
        if (row.customer_info !== '' && row.customer_info.length > 32) {
          return h('el-popover', { props: { trigger: 'hover' } }, [
            h('div', { class: 'line-clamp-2', slot: 'reference' }, [row.customer_info]),
            h('div', { style: { width: '248px' } }, [row.customer_info]),
          ]);
        } else {
          return row.customer_info
            ? h('div', { class: 'line-clamp-2' }, [row.customer_info])
            : '--';
        }
      },
    },
    {
      label: '跟进日期',
      align: 'left',
      headerAlign: 'left',
      minWidth: 100,
      property: 'follow_time',
      formatter: row => (row.follow_time ? row.follow_time : '--'),
    },
    {
      label: '下次跟进',
      align: 'left',
      headerAlign: 'left',
      minWidth: 100,
      property: 'next_time',
      formatter: row => (row.next_time ? row.next_time : '--'),
    },
    {
      label: '业务类型',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
      property: 'business_type',
      formatter: row => BusinessTypeMap.get(row.business_type) ?? '',
    },
    {
      label: '任务状态',
      align: 'left',
      headerAlign: 'left',
      property: 'status',
      width: 80,
      formatter: row =>
        h('span', { style: statusColor(row.status) }, TaskStatusTypeMap.get(row.status)),
    },
  ]);
  return {
    loadData,
    list,
    loading,
    total,
    columns,
  };
};
