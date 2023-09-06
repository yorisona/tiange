import { defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
// import { formatAmount } from '@/utils/string';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import returnDialog from './dialog/return.vue';
import Style from './dialog/common.module.less';
import transferDialog from './dialog/transfer';
import ImageViewer from '@/components/Image/ImageViewer';
import { urlAppendToken } from '@/utils/token';
import {
  QueryUsedFixedAssetList,
  UpdateSelfFixedAssetPositionSelf,
  ApplyForFixedAssetReturnRecord,
  ApplyForFixedAssetAllocationRecordSelf,
} from '@/services/fixedAssets';
import { useComonOptions } from '@/modules/fixedAssets/use';

const editDialog = defineComponent({
  name: 'editDialog',
  setup(props, ctx) {
    const formData = ref<any>({
      warehouse_position: undefined,
      id: undefined,
    });
    const show = (val: any) => {
      formData.value = { ...val };
    };
    const { AssetWarehousePositionOption } = useComonOptions();
    const onSaveBtnClick = async () => {
      ctx.emit('submit', formData.value);
    };
    return { show, onSaveBtnClick, formData, AssetWarehousePositionOption };
  },
  render() {
    return (
      <el-form class="form-wrap" inline={true} style="padding:24px 18px 24px">
        <el-form-item label="存放地点：" class={['form-item-warp', Style.formItemWarp]}>
          <Select
            popper-class="el-select-popper-mini"
            style={{ width: '100%' }}
            v-model={this.formData.warehouse_position}
            placeholder="请选择存放地点"
            options={this.AssetWarehousePositionOption}
            clearable={false}
          />
        </el-form-item>
      </el-form>
    );
  },
});

export default defineComponent({
  name: 'registerList',
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      {
        type: 'selection',
        width: 50,
        align: 'center',
        selectable: (row: any) => {
          return row.status === E.fixedassets.FixedAssetStatus.is_use;
        },
      },
      {
        align: 'center',
        label: '图片',
        minWidth: 110,
        formatter: (row: any) => {
          return (
            <img
              src={urlAppendToken(row?.image)}
              alt=""
              style="width: 80px; height: 80px; cursor: pointer;border-radius: 2px;vertical-align: middle;"
              onClick={() => {
                ImageViewer.show([urlAppendToken(row?.image)]);
              }}
            />
          );
        },
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
        'show-overflow-tooltip': true,
        prop: 'asset_name',
        minWidth: 120,
      },
      {
        align: 'center',
        label: '分类',
        prop: 'asset_class_name',
        minWidth: 100,
      },
      {
        align: 'center',
        label: '规格型号',
        minWidth: 90,
        'show-overflow-tooltip': true,
        prop: 'asset_model',
      },
      {
        align: 'left',
        label: '存放地点',
        minWidth: 130,
        prop: 'position_name',
      },
      {
        align: 'center',
        label: '资产类型',
        minWidth: 110,
        prop: 'asset_type_name',
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
        align: 'center',
        label: '领用日期',
        minWidth: 100,
        prop: 'start_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        label: '状态',
        align: 'center',
        prop: 'return_status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.ReturnStatusEnumMap,
        },
      },
      {
        label: '操作',
        width: 120,
        fixed: 'right',
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
          if (row.status === E.fixedassets.FixedAssetStatus.is_use) {
            addButns('编辑', () => {
              EditDialog.show({
                ...row,
                asset_id_list: [row.id],
              });
            });
            addButns('归还', () => {
              ReturnDialog.show(JSON.parse(JSON.stringify(row)));
            });
            addButns('调拨', () => {
              TransferDialog.show({
                ...row,
                asset_id_list: [row.id],
              });
            });
          }
          return <div>{btns}</div>;
        },
      },
    ];
    const initQueryForm = (): any => {
      return {
        asset_code: undefined,
        asset_name: undefined,
        asset_class: undefined,
      };
    };
    const ReturnDialog = useDialog({
      component: returnDialog,
      width: '650px',
      title: '归还',
      on: {
        submit(row: any) {
          const UpdateContractTaxSubjectSmb = useRequest(ApplyForFixedAssetReturnRecord, {
            manual: true,
          });
          UpdateContractTaxSubjectSmb.runAsync(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            ReturnDialog.close();
          });
        },
      },
    });
    const EditDialog = useDialog({
      component: editDialog,
      width: '300px',
      title: '编辑',
      on: {
        submit(row: any) {
          console.log(row, 'row');
          UpdateSelfFixedAssetPositionSelf({
            asset_id_list: row.asset_id_list,
            warehouse_position: row.warehouse_position,
          }).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            EditDialog.close();
          });
        },
      },
    });
    const TransferDialog = useDialog({
      component: transferDialog,
      width: '350px',
      title: '调拨',
      on: {
        submit(row: any) {
          console.log(row, 'row');
          ApplyForFixedAssetAllocationRecordSelf(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            TransferDialog.close();
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());
    const tableData = ref<any[]>([]);

    const query = usePagination(QueryUsedFixedAssetList, {
      defaultPageSize: 50,
    });
    const selected = ref<any[]>([]);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      table: {
        border: true,
        selectionChange: (value: any[]) => {
          selected.value = value;
        },
      },
    };
    const { assetClassOption } = useComonOptions();
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      queryForm,
      tableData,
      columns,
      assetClassOption,
      ReturnDialog,
      selected,
      EditDialog,
      TransferDialog,
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
        <el-form-item label="资产编号：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.asset_code}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="名称：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.asset_name}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="资产分类：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.asset_class}
            v-auto-placeholder
            options={this.assetClassOption}
          />
        </el-form-item>
        <div slot="btnLine">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            disabled={this.selected.length === 0}
            on-click={() => {
              const ids = this.selected.map(item => item.id);
              this.EditDialog.show({
                asset_id_list: ids,
              });
            }}
          >
            批量编辑
          </tg-button>
          <tg-button
            type="primary"
            class="mgl-6"
            icon="ico-btn-add"
            disabled={this.selected.length === 0}
            on-click={() => {
              this.ReturnDialog.show(this.selected);
            }}
          >
            批量归还
          </tg-button>
          <tg-button
            type="primary"
            class="mgl-6"
            icon="ico-btn-add"
            disabled={this.selected.length === 0}
            on-click={() => {
              const ids = this.selected.map(item => item.id);
              this.TransferDialog.show({
                asset_id_list: ids,
              });
            }}
          >
            批量调拨
          </tg-button>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
