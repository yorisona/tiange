import { computed, defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select, FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
// import { usePermission } from '@/use/permission';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { useComonTable, assetManagementList } from '@/modules/fixedAssets/use';
import detail from './dialog/detail.vue';
import {
  QueryFixedAssetReceiveRecord,
  ApproveForFixedAssetReceiveRecord,
} from '@/services/fixedAssets';

interface DataItem {
  add_by: number;
  add_by_name: string;
  department_id: number;
  department_name: string;
  expected_return_date: string;
  file_urls: null;
  gmt_create: string;
  gmt_modified: string;
  id: number;
  initiator_datetime: string;
  modified_by: number;
  modified_by_name: string;
  project_id: null;
  project_name: null;
  receive_code: string;
  receive_status: number;
  remark: null;
  receive_relation_list: assetManagementList[];
}

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<DataItem>[] = [
      {
        align: 'center',
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
        label: '预计归还时间',
        minWidth: 100,
        prop: 'expected_return_date',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '申请人',
        prop: 'add_by_name',
        minWidth: 80,
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
        label: '完成状态',
        align: 'center',
        prop: 'receive_status',
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
        prop: 'receive_relation_list',
        formatter: row => {
          return (
            <el-popover placement="bottom" width="584" trigger="click">
              {useComonTable(row.receive_relation_list)}
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
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          if (row.receive_status === E.fixedassets.ReceiveStatusEnum.not_receive) {
            addButns('发放资产', () => {
              DetailDialog.update({ footer: true }).show(JSON.parse(JSON.stringify(row)));
            });
          } else {
            addButns('查看', () => {
              console.log(row, 'row');

              DetailDialog.update({ footer: false }).show({ ...row });
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
        receive_status: undefined, // 1: 是 0: 否 (可选值 : 1, 0)
        initiator_end_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[1];
        }), // 申请时间-结束时间
        receive_code: undefined, // 领用单号
        initiator_start_date: computed(() => {
          if (!otherQueryFrom.value.returnTime?.length) return undefined;
          return otherQueryFrom.value.returnTime[0];
        }), // 申请时间-开始时间
        add_by: undefined, // 申请人ID
      };
    };
    const DetailDialog = useDialog({
      component: detail,
      width: '686px',
      title: '资产领用',
      // footer: false,
      on: {
        submit(row: {
          asset_relation_list: {
            receive_status: number;
            relation_id: number;
          }[];
          id: number;
        }) {
          const ApproveForFixedAssetReceiveRecordSmb = useRequest(
            ApproveForFixedAssetReceiveRecord,
            {
              manual: true,
            },
          );
          ApproveForFixedAssetReceiveRecordSmb.runAsync(row).then(res => {
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
    const queryForm = ref<{
      receive_status?: '1' | '0'; // 是否接收，可选值：1 - 是，0 - 否
      page_num: number; // 当前页
      initiator_end_date?: string; // 申请时间-结束时间
      receive_code?: string; // 领用单号
      num?: number; // 每页展示条数
      initiator_start_date?: string; // 申请时间-开始时间
      add_by?: number; // 申请人ID
    }>(initQueryForm());

    const query = usePagination(QueryFixedAssetReceiveRecord);
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
        <el-form-item label="申请人：">
          <FunctionSelect
            style="width:100%"
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={this.queryForm.add_by}
            placeholder="选择申请人"
            clearable={true}
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
            v-model={this.otherQueryFrom.returnTime}
          />
        </el-form-item>
        <el-form-item label="完成状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.receive_status}
            v-auto-placeholder
            options={E.fixedassets.AssetCompletionStatusEnumOption}
          />
        </el-form-item>
        {/* <div slot="btnLine">
          <tg-button type="primary" icon="ico-btn-add" on-click={() => {}}>
            批量归还
          </tg-button>
        </div> */}
      </ListGenerallyTemplate>
    );
  },
});
