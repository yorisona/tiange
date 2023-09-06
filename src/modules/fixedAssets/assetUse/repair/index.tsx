import { computed, defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select, FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import detail from './dialog/detail.vue';
import {
  QueryFixedAssetMaintenanceRecord,
  ApproveForFixedAssetMaintenanceRecord,
} from '@/services/fixedAssets';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        align: 'center',
        label: '维修单号',
        'show-overflow-tooltip': true,
        minWidth: 150,
        prop: 'maintenance_code',
      },
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '资产编号',
        prop: 'asset_code',
        minWidth: 130,
      },
      {
        align: 'left',
        label: '名称',
        prop: 'asset_name',
        minWidth: 120,
      },
      {
        align: 'center',
        label: '资产分类',
        prop: 'asset_class_name',
        minWidth: 80,
      },
      {
        align: 'center',
        label: '规格型号',
        minWidth: 90,
        prop: 'asset_model',
      },
      {
        align: 'center',
        label: '资产类型',
        minWidth: 110,
        prop: 'asset_type_name',
      },
      {
        align: 'center',
        label: '送修人',
        minWidth: 80,
        prop: 'add_by_name',
      },
      {
        align: 'center',
        label: '送修时间',
        minWidth: 100,
        prop: 'initiator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        label: '完成状态',
        align: 'center',
        prop: 'maintenance_status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.AssetCompletionStatusEnumMap,
        },
      },
      {
        label: '操作',
        width: 80,
        align: 'center',
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          if (row.maintenance_status === 0) {
            addButns('操作', () => {
              repairDialog.update({ footer: true }).show(JSON.parse(JSON.stringify(row)));
            });
          } else {
            addButns('查看', () => {
              repairDialog.update({ footer: false }).show({ ...row });
            });
          }
          return <div>{btns}</div>;
        },
      },
    ];
    const otherQueryFrom = ref({
      returnTime: [],
    }); // 其他查询条件
    const initQueryForm = (): any => {
      return {
        asset_code: undefined, // 资产编号
        asset_class: undefined, // 资产分类ID
        maintenance_code: undefined, // 维修单号
        page_num: undefined, // 当前页
        maintenance_status: undefined, // 1: 维修中 2: 维修完成 (可选值 : 1, 2)
        asset_type: undefined, // 资产类型ID
        num: undefined, // 每页展示条数
        asset_name: undefined, // 名称
        add_by: undefined, // 申请人ID
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
    const repairDialog = useDialog({
      component: detail,
      width: '686px',
      title: '维修',
      okText: '确定',
      on: {
        submit(row: { id: number; maintenance_amount: number }) {
          const ApproveForFixedAssetMaintenanceRecordSmb = useRequest(
            ApproveForFixedAssetMaintenanceRecord,
            {
              manual: true,
            },
          );
          ApproveForFixedAssetMaintenanceRecordSmb.runAsync(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            repairDialog.close();
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetMaintenanceRecord);
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
        <el-form-item label="维修单号：">
          <el-input
            v-model={this.queryForm.maintenance_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="送修人：">
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
        <el-form-item label="送修时间：">
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
            v-model={this.queryForm.maintenance_status}
            v-auto-placeholder
            options={E.fixedassets.AssetCompletionStatusEnumOption}
          />
        </el-form-item>
        <el-form-item label="资产编号：">
          <el-input v-model={this.queryForm.asset_code} v-auto-placeholder v-key-enter={keyEnter} />
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model={this.queryForm.asset_name} v-auto-placeholder v-key-enter={keyEnter} />
        </el-form-item>
        <el-form-item label="资产分类：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.asset_class}
            v-auto-placeholder
            options={this.saleContractTypeOptions}
          />
        </el-form-item>
        <el-form-item label="资产类型：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.asset_type}
            v-auto-placeholder
            options={this.saleContractTypeOptions}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
