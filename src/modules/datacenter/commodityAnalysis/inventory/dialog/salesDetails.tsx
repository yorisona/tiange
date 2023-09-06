import { defineComponent, ref, computed } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { SignTypeOptions } from '@/types/tiange/contract';
import { TgTableColumn } from '@/types/vendor/column';
import { QueryShopLiveDouyinItemPlaceOrderDailyStatistics } from '@/services/datacenter';
import moment from 'moment';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        align: 'center',
        label: '日期',
        minWidth: 100,
        prop: 'date',
        dataType: {
          type: 'date',
        },
      },
      {
        label: '销量',
        prop: 'sale_count',
        align: 'right',
      },
      {
        label: '销售GMV (元)',
        align: 'right',
        prop: 'gmv',
        dataType: {
          type: 'money',
          toFixed: 2,
          unit: 100,
        },
      },
      {
        label: '平均销售价 (元)',
        align: 'right',
        prop: 'avg_unit_price',
        dataType: {
          type: 'money',
          toFixed: 2,
          unit: 100,
        },
      },
    ];
    const otherQueryFrom = ref<any>({
      // 近7天
      returnTime: [new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), new Date()],
    });
    const initQueryForm = (): any => {
      return {
        start_date: computed(() => {
          return moment(otherQueryFrom.value.returnTime[0]).format('YYYY-MM-DD');
        }),
        end_date: computed(() => {
          return moment(otherQueryFrom.value.returnTime[1]).format('YYYY-MM-DD');
        }),
        product_id: undefined,
        project_id: undefined,
      };
    };
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryShopLiveDouyinItemPlaceOrderDailyStatistics, {
      manual: true,
      // defaultPageSize: 10000,
      // onSuccess: () => {
      //   query.pagination.total = 0;
      // },
    });
    const config = {
      reset: () => {
        otherQueryFrom.value.returnTime = [];
        query.reload();
      },
      table: {
        border: true,
      },
    };
    const show = ({ project_id, product_id }: any) => {
      queryForm.value.project_id = project_id;
      queryForm.value.product_id = product_id;
      console.log(queryForm.value, 'queryForm.value');

      query.runAsync(
        {
          num: 20,
          page_num: 1,
        },
        {
          ...queryForm.value,
        },
      );
      console.log(query, 'data');
    };
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      otherQueryFrom,
      show,
    };
  },
  render() {
    return (
      <ListGenerallyTemplate
        class="wrap"
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
        // v-load-more={{
        //   delay: 2000,
        //   cb() {
        //     console.log('on');
        //   },
        // }}
      >
        <el-form-item label="日期范围：">
          <el-date-picker
            style="width: 208px"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.otherQueryFrom.returnTime}
            clearable={false}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
