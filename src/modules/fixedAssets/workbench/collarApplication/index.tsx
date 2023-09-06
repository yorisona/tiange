import { defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { usePermission } from '@/use/permission';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import application from './dialog/application.vue';
import ImageViewer from '@/components/Image/ImageViewer';
import { urlAppendToken } from '@/utils/token';
import {
  QueryFixedAssetListAllowUse,
  ApplyForFixedAssetReceiveRecord,
} from '@/services/fixedAssets';
import { useComonOptions, assetManagementList } from '@/modules/fixedAssets/use';

export default defineComponent({
  setup: (props, ctx) => {
    const permission = usePermission();
    const columns: TgTableColumn<assetManagementList>[] = [
      {
        type: 'selection',
        width: 50,
        align: 'center',
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
        align: 'left',
        label: '存放地点',
        minWidth: 130,
        prop: 'position_name',
      },
      {
        align: 'center',
        label: '操作',
        width: 100,
        formatter: row => {
          const btns: VNode[] = [];
          const addButns = (txt: string, fuc: Function) => {
            btns.push(
              <tg-button type="link" class="mgl-6" onClick={fuc}>
                {txt}
              </tg-button>,
            );
          };
          addButns('申请领用', () => {
            console.log(row);
            applicationDialog.show(JSON.parse(JSON.stringify(row)));
          });
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
    const applicationDialog = useDialog({
      component: application,
      width: '686px',
      title: '申请',
      on: {
        submit(row: any) {
          const UpdateContractTaxSubjectSmb = useRequest(ApplyForFixedAssetReceiveRecord, {
            manual: true,
          });
          console.log(row, 'rr');

          UpdateContractTaxSubjectSmb.runAsync(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            applicationDialog.close();
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetListAllowUse, {
      defaultPageSize: 50,
    });
    const selected = ref<assetManagementList[]>([]);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      showExport: permission.law_contract_ledger_export ? false : false,
      exportURL: '/api/cont/export_customer_contract',
      table: {
        border: true,
        selectionChange: (value: assetManagementList[]) => {
          selected.value = value;
        },
      },
    };
    const { assetClassOption } = useComonOptions();
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      applicationDialog,
      assetClassOption,
      selected,
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
            options={this.assetClassOption}
          />
        </el-form-item>
        <div slot="btnLine" style="display:flex; align-item:center;">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            on-click={() => {
              this.applicationDialog.show(this.selected);
            }}
          >
            批量领用
          </tg-button>
          <div class="icon-tipBox mgl-24" style="display:flex;align-items: center;">
            <tg-icon name="ico-weibiaoti-11" style="margin-right: 6px; font-size: 14px" />
            <span style="color: var(--text-third-color); font-size: 12px">
              列表中为公司闲置资产，可在列表中选择需要领用的资产，如果需要领用的资产在列表中不存在，需要发起采购申请
            </span>
          </div>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
