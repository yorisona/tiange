import { computed, defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import {
  QueryFixedAssetReturnRecord,
  ApproveForFixedAssetReturnRecord,
} from '@/services/fixedAssets';
import { Select, FunctionSelect } from '@gm/component/select';
// import { usePermission } from '@/use/permission';
import { SignTypeOptions } from '@/types/tiange/contract';
import { TgTableColumn } from '@/types/vendor/column';
import { useComonTable } from '@/modules/fixedAssets/use';
import detail from './dialog/detail.vue';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        align: 'center',
        label: '归还单号',
        minWidth: 150,
        prop: 'return_code',
      },
      {
        align: 'center',
        label: '归还时间',
        minWidth: 100,
        prop: 'initiator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '归还人',
        prop: 'add_by_name',
        minWidth: 120,
      },
      {
        label: '完成状态',
        align: 'center',
        prop: 'return_status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.AssetCompletionStatusEnumMap,
        },
      },
      {
        align: 'center',
        label: '经办人',
        minWidth: 100,
        prop: 'modified_by_name',
      },
      {
        align: 'center',
        label: '资产清单',
        minWidth: 80,
        prop: 'appointment_time',
        formatter: row => {
          return (
            <el-popover placement="bottom" width="584" trigger="click">
              {useComonTable(row.return_relation_list)}
              <tg-button type="link" slot="reference">
                查看
              </tg-button>
            </el-popover>
          );
        },
      },
      {
        label: '操作',
        width: 100,
        align: 'center',
        formatter: row => {
          console.log(row.return_status, 'return_status');

          return (
            <div>
              {row.return_status === E.fixedassets.ReceiveStatusEnum.not_receive ? (
                <tg-button
                  type="link"
                  onClick={() => {
                    DetailDialog.update({ footer: true }).show(JSON.parse(JSON.stringify(row)));
                  }}
                >
                  签收
                </tg-button>
              ) : (
                <tg-button
                  type="link"
                  onClick={() => {
                    DetailDialog.update({ footer: false }).show(JSON.parse(JSON.stringify(row)));
                  }}
                >
                  查看
                </tg-button>
              )}
            </div>
          );
        },
      },
    ];
    const otherQueryFrom = ref({
      returnTime: [],
    }); // 其他查询条件
    const initQueryForm = (): any => {
      return {
        add_by: undefined,
        return_status: undefined,
        return_code: undefined,
        initiator_start_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[0];
        }),
        initiator_end_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[1];
        }),
      };
    };
    const DetailDialog = useDialog({
      component: detail,
      width: '686px',
      title: '资产归还',
      on: {
        submit(row: {
          asset_relation_list: {
            receive_status: number;
            return_status: number;
          }[];
          id: number;
        }) {
          const ApproveForFixedAssetReturnRecordSmb = useRequest(ApproveForFixedAssetReturnRecord, {
            manual: true,
          });
          ApproveForFixedAssetReturnRecordSmb.runAsync(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            DetailDialog.close();
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetReturnRecord);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
        otherQueryFrom.value.returnTime = [];
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
      otherQueryFrom,
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
        <el-form-item label="归还单号：">
          <el-input
            v-model={this.queryForm.return_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="归还人：">
          <FunctionSelect
            style="width:100%"
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={this.queryForm.add_by}
            otherParams={{ is_contain_goumee: true }}
            v-auto-placeholder
            clearable={true}
          />
        </el-form-item>
        <el-form-item label="归还时间：">
          <el-date-picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={this.otherQueryFrom.returnTime}
          />
        </el-form-item>
        <el-form-item label="完成状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.return_status}
            v-auto-placeholder
            options={E.fixedassets.AssetCompletionStatusEnumOption}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
