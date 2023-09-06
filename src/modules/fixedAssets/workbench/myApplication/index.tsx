import { computed, defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { TgTableColumn } from '@/types/vendor/column';
import { comonColumn } from '@/modules/fixedAssets/use';
import { QueryFixedAssetReceiveRecordSelf } from '@/services/fixedAssets';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        align: 'left',
        label: '领用单号',
        minWidth: 150,
        prop: 'receive_code',
      },
      {
        align: 'center',
        label: '申请时间',
        minWidth: 100,
        prop: 'initiator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '申请状态',
        prop: 'receive_status',
        minWidth: 80,
        dataType: {
          type: 'enum',
          enum: E.fixedassets.ReceiveStatusEnumMap,
        },
      },
      {
        align: 'center',
        label: '经办人',
        minWidth: 80,
        prop: 'modified_by_name',
      },
      {
        align: 'center',
        label: '总金额',
        minWidth: 80,
        prop: 'remaining_amount',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        align: 'center',
        label: '费用承担部门/项目',
        'show-overflow-tooltip': true,
        minWidth: 160,
        formatter: row => {
          const department_name = row.department_name ? row.department_name : '';
          const project_name = row.project_name ? '项目：' + row.project_name : '';
          if (!department_name && !project_name) return '--';
          return (
            <div style="text-overflow: ellipsis;overflow: hidden;">{`${
              row.department_name ? row.department_name : ''
            }${row.project_name ? '项目：' + row.project_name : ''}`}</div>
          );
        },
      },
      {
        label: '备注',
        align: 'left',
        prop: 'remark',
        'show-overflow-tooltip': true,
        minWidth: 160,
      },
      {
        label: '物品清单',
        align: 'center',
        width: 100,
        formatter: row => {
          return (
            <el-popover placement="bottom" width="584" trigger="click">
              <tg-table
                border
                data={row.receive_relation_list}
                columns={[
                  ...comonColumn,
                  {
                    label: '状态',
                    prop: 'receive_status',
                    align: 'center',
                    'show-overflow-tooltip': true,
                    // dataType: {
                    //   type: 'enum',
                    //   enum: E.fixedassets.ReceiveStatusEnumMap,
                    // },
                    formatter: ({ receive_status }: any) => (
                      <span>
                        {receive_status === 0
                          ? '待审批'
                          : receive_status === 1
                          ? '已发放'
                          : '已拒绝'}
                      </span>
                    ),
                  },
                ]}
              ></tg-table>
              <tg-button type="link" slot="reference">
                查看
              </tg-button>
            </el-popover>
          );
        },
      },
    ];
    const dates = ref<any>([]);
    const initQueryForm = (): any => {
      return {
        receive_status: undefined,
        receive_code: undefined,
        initiator_start_date: computed(() => {
          if (!dates.value?.length) return undefined;
          return dates.value[0];
        }),
        initiator_end_date: computed(() => {
          if (!dates.value?.length) return undefined;
          return dates.value[1];
        }),
      };
    };
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetReceiveRecordSelf);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
        dates.value = [];
      },
      table: {
        border: true,
        rowClick(row: any, column: any) {
          // if (column.label === '操作') return;
          // dialogRecruitmentFeedback.show(row, true);
        },
      },
    };
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      queryForm,
      columns,
      dates,
    };
  },
  render() {
    const keyEnter = () =>
      this.query.run(
        {
          page_num: 1,
          num: this.query.pagination.num,
        },
        this.queryForm,
      );
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="领用单号：">
          <el-input
            v-model={this.queryForm.receive_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="申请时间：">
          <el-date-picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.dates}
          />
        </el-form-item>
        <el-form-item label="申请状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.receive_status}
            v-auto-placeholder
            options={E.fixedassets.ReceiveStatusEnumOption.filter(v => v.value !== 2)}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
