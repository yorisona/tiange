import { defineComponent, ref, watch } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { FunctionSelect } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import add from './dialog/add';
import { Confirm } from '@/use/asyncConfirm';
import {
  QueryFixedAssetAmountDetailRecord,
  InsertOrUpdateFixedAssetAmountDetailRecord,
  DeleteFixedAssetAmountDetailRecord,
  ConfirmMonthFixedAssetAmount,
} from '@/services/fixedAssets';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<M.fixedAssets.ExpenseDetails>[] = [
      {
        align: 'center',
        label: '月份',
        minWidth: 100,
        prop: 'confirm_date',
      },
      {
        align: 'left',
        label: '部门',
        prop: 'department_name',
        'show-overflow-tooltip': true,
        minWidth: 150,
      },
      {
        align: 'left',
        label: '项目',
        prop: 'project_name',
        'show-overflow-tooltip': true,
        minWidth: 150,
      },
      {
        align: 'left',
        label: '资产编码',
        prop: 'asset_code',
        'show-overflow-tooltip': true,
        minWidth: 120,
      },
      {
        align: 'left',
        label: '资产名称',
        prop: 'asset_name',
        'show-overflow-tooltip': true,
        minWidth: 120,
      },
      {
        align: 'right',
        label: '金额 (元)',
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
        label: '费用类型',
        minWidth: 80,
        prop: 'expense_type',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.AssetExpenseTypeMap,
        },
      },
      {
        align: 'center',
        label: '更新时间',
        minWidth: 100,
        prop: 'gmt_modified',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '操作人员',
        minWidth: 100,
        prop: 'modified_by_name',
      },
      {
        align: 'center',
        label: '操作',
        width: 152,
        fixed: 'right',
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          !row.status &&
            addButns('编辑', () => {
              addDialog.update({ title: '编辑费用' }).show(row);
              console.log(row);
            });
          !row.status &&
            addButns('删除', () => {
              Confirm('是否删除该条费用？').then(() => {
                DeleteFixedAssetAmountDetailRecord({
                  id: row.id,
                }).then(res => {
                  if (res.data.success) {
                    ctx.root.$message.success('操作成功');
                    query.reload();
                  } else {
                    ctx.root.$message.error(res.data.message);
                  }
                });
              });
            });
          return <div>{btns}</div>;
        },
      },
    ];
    const initQueryForm = (): any => {
      return {
        project_id: undefined,
        confirm_date: ctx.root.$route.params.id,
        department_id: undefined,
      };
    };
    const addDialog = useDialog({
      component: add,
      width: '350px',
      title: '新增费用',
      okText: '保存',
      on: {
        submit(row: any) {
          const InsertOrUpdateFixedAssetAmountDetailRecordSmb = useRequest(
            InsertOrUpdateFixedAssetAmountDetailRecord,
            {
              manual: true,
            },
          );
          InsertOrUpdateFixedAssetAmountDetailRecordSmb.runAsync(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            addDialog.close();
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    const query: any = usePagination(QueryFixedAssetAmountDetailRecord, {
      defaultParams: [
        {
          num: 20,
          page_num: 1,
        },
        {
          confirm_date: queryForm.value.confirm_date,
        },
      ],
    });
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
    const status = ref<any>(ctx.root.$route.query.status);
    const getQueryString = (name: string) => {
      const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      const r = window.location.search.substr(1).match(reg);
      if (r !== null) {
        return unescape(r[2]);
      }
      return null;
    };
    watch(
      () => ctx.root.$route.query.status,
      () => {
        console.log(getQueryString('status'), 'getQueryString');

        status.value = getQueryString('status');
      },
      {
        deep: true,
      },
    );
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      status,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      addDialog,
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
            format="yyyy 年 第 MM 月"
            value-format="yyyy-MM"
            placeholder="请选择月份"
          />
        </el-form-item>
        <el-form-item label="部门：" label-width={'40px'}>
          <department-select
            v-auto-placeholder
            queryForm={{ is_contain_goumee: true }}
            checkOnClickNode={true}
            // disabledLevel={2}
            // levelDisabled={(level: number) => level !== 2}
            levelHidden={(level: number) => level > 3}
            clearable
            v-model={this.queryForm.department_id}
          />
        </el-form-item>
        <el-form-item label="项目：" label-width={'40px'}>
          <FunctionSelect
            style="width:100%;flex: 1;"
            size="mini"
            modeType={EFunctionSelectType.SEARCH_PROFIT_LOSS}
            v-model={this.queryForm.project_id}
            placeholder="请选择项目"
            clearable={true}
          />
        </el-form-item>
        {this.$route.query.status === '0' && (
          <div slot="btnLine" style="display: flex;">
            <tg-button
              type="primary"
              class="mgr-6"
              icon="ico-btn-add"
              on-click={() => {
                this.addDialog.update({ title: '新增费用' }).show();
              }}
            >
              新增
            </tg-button>
            <tg-button
              on-click={() => {
                Confirm('是否确认费用？').then(() => {
                  ConfirmMonthFixedAssetAmount({
                    id: this.$route.query.id,
                  }).then(res => {
                    if (res.data.success) {
                      this.$message.success('操作成功');
                      const path = this.$route.path;
                      this.$router.push({ path, query: { status: '1' } });
                      this.query.reload();
                    } else {
                      this.$message.error(res.data.message);
                    }
                  });
                });
              }}
            >
              费用确认
            </tg-button>
          </div>
        )}
      </ListGenerallyTemplate>
    );
  },
});
