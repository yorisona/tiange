import { computed, defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { Select, FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { SignTypeOptions } from '@/types/tiange/contract';
import { TgTableColumn } from '@/types/vendor/column';
import { QueryFixedAssetAllocationRecord } from '@/services/fixedAssets';
import { useRequest } from '@gm/hooks/ahooks';
import { QueryFixedAssetType, QueryFixedAssetClass } from '@/services/fixedAssets';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        align: 'center',
        label: '分配单号',
        'show-overflow-tooltip': true,
        minWidth: 150,
        prop: 'allocation_code',
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
        'show-overflow-tooltip': true,
        minWidth: 120,
      },
      {
        align: 'center',
        label: '资产分类',
        prop: 'asset_class_name',
        'show-overflow-tooltip': true,
        minWidth: 100,
      },
      {
        align: 'center',
        label: '规格型号',
        minWidth: 90,
        prop: 'asset_model',
        'show-overflow-tooltip': true,
      },
      {
        align: 'center',
        label: '资产类型',
        minWidth: 110,
        prop: 'asset_type_name',
      },
      {
        align: 'center',
        label: '分配人',
        prop: 'add_by_name',
      },
      {
        align: 'center',
        label: '分配时间',
        minWidth: 100,
        prop: 'initiator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        label: '接收人',
        align: 'center',
        prop: 'user_name',
      },
      {
        align: 'center',
        label: '费用承担部门/项目',
        minWidth: 160,
        'show-overflow-tooltip': true,
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
    ];
    const otherQueryFrom = ref({
      returnTime: [],
    }); // 其他查询条件
    const initQueryForm = () => {
      return {
        asset_name: undefined, // 名称
        initiator_end_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[1];
        }), // 分配时间-结束时间
        asset_class: undefined, // 资产分类ID
        user_id: undefined, // 接受人ID
        current_department_id: undefined, // 费用承担部门ID
        asset_code: undefined, // 资产编号
        add_by: undefined, // 申请人ID
        num: undefined, // 每页展示条数
        initiator_start_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[0];
        }), // 分配时间-开始时间
        asset_type: undefined, // 资产类型ID
        page_num: undefined, // 当前页
        allocation_code: undefined, // 分配单号
      };
    };
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetAllocationRecord);
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
      otherQueryFrom,
      typeOptions: useRequest(QueryFixedAssetType),
      classOptions: useRequest(QueryFixedAssetClass),
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
    const TypeOption =
      this.typeOptions?.data?.map((item: any) => ({
        label: item.asset_type_name,
        value: item.id,
      })) || [];
    const ClassOption =
      this.classOptions?.data?.map((item: any) => ({
        label: item.asset_class_name,
        value: item.id,
      })) || [];
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="分配单号：">
          <el-input
            v-model={this.queryForm.allocation_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="分配人：">
          <FunctionSelect
            style="width:100%"
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            otherParams={{ is_contain_goumee: true }}
            v-model={this.queryForm.add_by}
            placeholder="选择接收人"
            clearable={true}
          />
        </el-form-item>
        <el-form-item label="分配时间：">
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
            clearable={false}
          />
        </el-form-item>
        <el-form-item label="接收人：">
          <FunctionSelect
            style="width:100%"
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            otherParams={{ is_contain_goumee: true }}
            v-model={this.queryForm.user_id}
            placeholder="选择接收人"
            clearable={true}
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
            options={ClassOption}
          />
        </el-form-item>
        <el-form-item label="资产类型：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.asset_type}
            v-auto-placeholder
            options={TypeOption}
          />
        </el-form-item>
        <el-form-item label="承担部门：">
          <department-select
            placeholder="请选择费用承担部门"
            checkOnClickNode={true}
            queryForm={{ is_contain_goumee: true }}
            // disabledLevel={2}
            // levelDisabled={(level: number) => level !== 2}
            levelHidden={(level: number) => level > 3}
            clearable
            v-model={this.queryForm.current_department_id}
          />
        </el-form-item>
      </ListGenerallyTemplate>
    );
  },
});
