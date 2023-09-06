import { defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { QueryFixedAssetAmountConfirmMonth } from '@/services/fixedAssets';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<M.fixedAssets.AssetExpenses>[] = [
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '月份',
        prop: 'confirm_date',
        minWidth: 120,
      },
      {
        align: 'right',
        label: '总费用 (元)',
        minWidth: 100,
        prop: 'amount',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        align: 'center',
        label: '状态',
        minWidth: 120,
        formatter: row => {
          return (
            <div class="flex-box20230727">
              <span class={['point', row.status === 0 ? 'process' : 'success']}></span>
              <span>{row.status === 0 ? '未确认' : '已确认'}</span>
            </div>
          );
        },
      },
      {
        label: '操作',
        align: 'center',
        width: 152,
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          addButns('查看', () => {
            ctx.root.$router.push({
              path: `/fixedAssets/fixedAssetsCost/detail/${row.year}-${row.month}`,
              query: {
                id: row.id,
                status: row.status,
              } as any,
            });
          });
          return <div>{btns}</div>;
        },
      },
    ];
    const initQueryForm = (): any => {
      return {
        confirm_date: undefined,
        status: undefined,
      };
    };
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetAmountConfirmMonth);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
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
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
    };
  },
  render() {
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="月份：" label-width={'40px'}>
          <el-date-picker
            v-model={this.queryForm.confirm_date}
            type="month"
            value-format="yyyy-MM"
            format="yyyy 年 第 MM 月"
            placeholder="请选择月份"
          />
        </el-form-item>
        <el-form-item label="状态：" label-width={'40px'}>
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.status}
            v-auto-placeholder
            options={[
              {
                label: '未确认',
                value: 0,
              },
              {
                label: '已确认',
                value: 1,
              },
            ]}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
