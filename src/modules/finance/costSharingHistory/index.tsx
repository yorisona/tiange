import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
// import { query_report_management_details } from '@/services/performance';
import { Select } from '@gm/component';
import { TgTableColumn } from '@/types/vendor/column';
import { query_allocated_add_history } from '@/services/finance';
import { urlAppendToken } from '@/utils/token';
type Col = TgTableColumn<any>;
export default defineComponent({
  setup: (props, ctx) => {
    const columns = ref<Col[]>([
      {
        label: '月份',
        align: 'center',
        minWidth: 80,
        prop: 'month',
        dataType: {
          type: 'date',
          format: 'YYYY.MM',
        },
      },
      {
        label: '费用类别',
        align: 'center',
        minWidth: 100,
        prop: 'category',
        dataType: 'text',
        // dataType: {
        //   type: 'enum',
        //   enum: E.mb.GivingAwayStatusMap,
        // },
      },
      {
        label: '金额',
        align: 'right',
        minWidth: 100,
        prop: 'amount',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        label: '操作人员',
        align: 'center',
        minWidth: 100,
        prop: 'add_by_name',
      },
      {
        label: '录入时间',
        align: 'center',
        minWidth: 100,
        prop: 'gmt_created',
        dataType: {
          type: 'date',
          format: 'YYYY.MM.DD HH:mm:ss',
        },
      },
      {
        label: '附件',
        align: 'center',
        width: 80,
        formatter: (row: any) => {
          return (
            row.file_url && (
              <tg-button
                type="link"
                onClick={() => {
                  window.open(urlAppendToken(row.file_url), '_blank');
                }}
              >
                下载
              </tg-button>
            )
          );
        },
      },
    ]);
    const reqList = usePagination(query_allocated_add_history, { manual: true });
    const formData = ref<any>({});
    const config = {
      reset() {
        formData.value = {};
      },
      table: {
        border: true,
      },
    };
    const methods = {
      reload() {
        reqList.runAsync(
          {
            page_num: 1,
            num: reqList.pagination.num,
          },
          {
            ...formData.value,
          },
        );
      },
    };
    onMounted(() => {
      methods.reload();
    });
    return { columns, reqList, formData, config, ...methods };
  },
  render() {
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.reqList}
        value={this.formData}
        config={this.config}
      >
        <el-form-item label="月份：" label-width="36px">
          <el-date-picker
            editable={false}
            v-model={this.formData.month}
            format="yyyy.MM"
            value-format="yyyy.MM"
            type="month"
            placeholder="请选择月份"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="类别：" label-width="36px">
          <Select
            options={E.finance.NewCostSharingTypeOption}
            v-model={this.formData.expense_type_biz_code}
            filterable
            placeholder="请选择类别"
            // remote-method={(name: string) => this.groupOptions.pagination.reQuery({ name })}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
