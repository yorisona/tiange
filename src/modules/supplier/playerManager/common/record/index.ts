/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-25 11:45:55
 */
import { defineComponent, ref, computed } from '@vue/composition-api';
import type { TableColumn } from '@/types/vendor/column';
import moment from 'moment';
import { GetAnchorKeyInfoLog } from '@/services/supplier';
import {
  AnchorKeyInfoLogForm,
  AnchorKeyInfoLogModel,
  AnchorKeyInfoLogParams,
  AnchorKeyType,
} from '@/types/tiange/supplier';

export default defineComponent({
  setup(props, ctx) {
    const initFilterForm = (total = 0): AnchorKeyInfoLogForm => {
      const now_moment = moment();
      const min_moment = moment().add(-4, 'days');
      const format_str = 'yyyy-MM-DD';
      return {
        add_by_name: undefined,
        flower_name: undefined,
        real_name: undefined,
        num: 20,
        page_num: 1,
        total: total,
        dates: [min_moment.format(format_str), now_moment.format(format_str)],
      };
    };
    const pickMinDate = ref<Date | undefined>(undefined);

    const dialogVisible = ref<boolean>(false);

    const filterForm = ref<AnchorKeyInfoLogForm>(initFilterForm());

    const list = ref<AnchorKeyInfoLogModel[]>([]);
    const columns = computed<TableColumn<AnchorKeyInfoLogModel>[]>(() => [
      {
        label: '序号',
        align: 'center',
        width: 100,
        formatter: (row, col, cell, index) => `${index + 1}`,
      },
      {
        label: '操作人',
        align: 'center',
        width: 190,
        formatter: row => (row.add_by_name ? row.add_by_name : '--'),
      },
      {
        label: '查看时间',
        align: 'center',
        width: 200,
        formatter: row => (row.gmt_create ? row.gmt_create : '--'),
      },
      {
        label: '查看主播',
        align: 'center',
        width: 254,
        formatter: row => {
          const flower_name = row.flower_name ? row.flower_name : '--';
          const real_name = row.real_name ? row.real_name : '--';
          return `${flower_name}（${real_name}）`;
        },
      },
      {
        label: '查看信息',
        align: 'center',
        minWidth: 209,
        formatter: row => {
          switch (row.search_type) {
            case AnchorKeyType.Wechat:
              return '微信号';
            case AnchorKeyType.Phone:
              return '手机号';
            default:
              return '--';
          }
        },
      },
    ]);

    const pickerOptions = ref({
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker: any) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: '最近一个月',
          onClick(picker: any) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
            picker.$emit('pick', [start, end]);
          },
        },
        {
          text: '最近三个月',
          onClick(picker: any) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 89);
            picker.$emit('pick', [start, end]);
          },
        },
      ],
      onPick: ({ minDate }: { minDate: Date }) => {
        pickMinDate.value = minDate;
      },
      disabledDate(time: Date) {
        if (pickMinDate.value) {
          const max_moment = moment(pickMinDate.value);
          const min_moment = moment(pickMinDate.value);
          const end_moment = moment(time);
          max_moment.add(30 * 3 - 1, 'days');
          min_moment.add(-30 * 3 + 1, 'days');
          return end_moment.isBefore(min_moment) || end_moment.isAfter(max_moment);
        }
        return false;
      },
    });

    const methods = {
      close: () => {
        dialogVisible.value = false;
      },
      show: () => {
        methods.onResetClick();
        dialogVisible.value = true;
      },
      onQueryClick: () => {
        filterForm.value.page_num = 1;
        methods.getAnchorKeyInfoLog();
      },
      onResetClick: () => {
        filterForm.value = initFilterForm(filterForm.value.total);
        methods.getAnchorKeyInfoLog();
      },
      onSizeChange: (num: number) => {
        filterForm.value.num = num;
        methods.getAnchorKeyInfoLog();
      },
      onCurrentChange: (page_num: number) => {
        filterForm.value.page_num = page_num;
        methods.getAnchorKeyInfoLog();
      },
      onDateBlur: () => {
        pickMinDate.value = undefined;
      },
      getAnchorKeyInfoLog: async () => {
        const params: AnchorKeyInfoLogParams = {
          end_time: filterForm.value.dates?.[1],
          start_time: filterForm.value.dates?.[0],
          add_by_name: filterForm.value.add_by_name,
          flower_name: filterForm.value.flower_name,
          real_name: filterForm.value.real_name,
          num: filterForm.value.num,
          page_num: filterForm.value.page_num,
        };

        const res = await GetAnchorKeyInfoLog(params);
        if (res.data.success) {
          filterForm.value.total = res.data.data.total;
          list.value = res.data.data.data;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
    };
    return {
      filterForm,
      list,
      columns,
      dialogVisible,
      pickerOptions,
      ...methods,
    };
  },
});
