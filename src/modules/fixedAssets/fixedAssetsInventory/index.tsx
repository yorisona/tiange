import { computed, defineComponent, ref } from '@vue/composition-api';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { useDialog } from '@/use/dialog';
import initeInventoryDialog from './initiateInventoryDialog.vue';
import {
  QueryFixedAssetInventoryRecord,
  InitiateFixedAssetInventory,
  DeleteFixedAssetInventory,
} from '@/services/fixedAssets';
import { Confirm } from '@/use/asyncConfirm';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<M.fixedAssets.InventoryRecord>[] = [
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '盘点单号',
        prop: 'inventory_code',
        minWidth: 120,
      },
      {
        align: 'center',
        label: '盘点日期',
        minWidth: 100,
        prop: 'initiator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '盘点范围',
        prop: 'inventory_range',
        minWidth: 120,
        // dataType: {
        //   type: 'enum',
        //   enum: E.fixedassets.InventoryRangeMap,
        // },
        formatter: row => {
          const department_list = (row?.relation_data?.department_list || [])
            .map((item: any) => item.department_name)
            .join('、');
          const project_list = (row?.relation_data?.project_list || [])
            .map((item: any) => item.project_name)
            .join('、');
          if (!department_list && !project_list)
            return E.fixedassets.InventoryRangeMap.get(row.inventory_range);
          return (
            <el-popover
              placement="bottom"
              width="250"
              trigger="hover"
              popper-class="popover20230725"
            >
              <div class="grid-wrap">
                <div class="grid-item">
                  <span>部门：</span>
                  <span>{department_list || '--'}</span>
                </div>
                <div class="grid-item">
                  <span>项目：</span>
                  <span>{project_list || '--'}</span>
                </div>
              </div>
              <span type="link" slot="reference" style="cursor: pointer;">
                {E.fixedassets.InventoryRangeMap.get(row.inventory_range)}
              </span>
            </el-popover>
          );
        },
      },
      {
        align: 'center',
        label: '盘点人',
        minWidth: 80,
        prop: 'add_by_name',
      },
      {
        label: '盘点状态',
        align: 'center',
        prop: 'inventory_status',
        // dataType: {
        //   type: 'enum',
        //   enum: E.fixedassets.InventoryStatusMap,
        // },
        formatter: row => {
          return (
            <div class="flex-box20230727">
              <span
                class={[
                  'point',
                  row.inventory_status === E.fixedassets.InventoryStatus.not_returned
                    ? 'process'
                    : 'success',
                ]}
              ></span>
              <span>{E.fixedassets.InventoryStatusMap.get(row.inventory_status)}</span>
            </div>
          );
        },
      },
      {
        align: 'center',
        label: '盘点结果',
        minWidth: 100,
        prop: 'inventory_result',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.InventoryResultMap,
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
          addButns('详情', () => {
            ctx.root.$router.push({
              path: `/fixedAssets/fixedAssetsInventory/detail/` + row.id,
              query: {
                // id: '1',
              },
            });
            console.log(row);
          });
          row.inventory_result === null &&
            addButns('删除', () => {
              Confirm('是否删除该盘点？').then(() => {
                DeleteFixedAssetInventory({
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
    const otherQueryFrom = ref<any>({
      returnTime: [],
    });
    const initQueryForm = (): any => {
      return {
        inventory_code: undefined,
        inventory_range: undefined,
        inventory_status: undefined,
        inventory_result: undefined,
        inventory_start_date: computed(() => {
          return otherQueryFrom.value.returnTime[0];
        }),
        inventory_end_date: computed(() => {
          return otherQueryFrom.value.returnTime[1];
        }),
      };
    };
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetInventoryRecord);
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

    const IniteInventoryDialog = useDialog({
      component: initeInventoryDialog,
      width: '350px',
      title: '发起盘点',
      okText: '发起盘点',
      on: {
        submit(row: any) {
          InitiateFixedAssetInventory(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            IniteInventoryDialog.close();
          });
        },
      },
    });
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      IniteInventoryDialog,
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
        <el-form-item label="盘点单号：">
          <el-input
            v-model={this.queryForm.inventory_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="盘点日期：">
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
        <el-form-item label="盘点范围：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.inventory_range}
            v-auto-placeholder
            options={E.fixedassets.InventoryRangeOption}
          />
        </el-form-item>
        <el-form-item label="盘点状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.sign_type}
            v-auto-placeholder
            options={E.fixedassets.InventoryStatusOption}
          />
        </el-form-item>
        <el-form-item label="盘点结果：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.sign_type}
            v-auto-placeholder
            options={E.fixedassets.InventoryResultOption}
          />
        </el-form-item>
        <div slot="btnLine">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            on-click={() => {
              this.IniteInventoryDialog.show();
            }}
          >
            发起盘点
          </tg-button>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
