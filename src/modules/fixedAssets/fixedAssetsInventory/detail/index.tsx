import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select, FunctionSelect } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import ImageViewer from '@/components/Image/ImageViewer';
import { urlAppendToken } from '@/utils/token';
import scrap from '../../management/dialog/scrap.vue';
import { Confirm } from '@/use/asyncConfirm';
import managementEdit from '../../management/dialog/managementEdit.vue';
import {
  QueryFixedAssetInventoryDetail,
  ProfitFixedAssetInventoryDetail,
  LossFixedAssetInventoryDetail,
  CompleteFixedAssetInventory,
  QueryFixedAssetInventoryRecord,
} from '@/services/fixedAssets';
import { useComonOptions, assetManagementList } from '@/modules/fixedAssets/use';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<assetManagementList>[] = [
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
        'show-overflow-tooltip': true,
        minWidth: 120,
      },
      {
        align: 'center',
        label: '资产分类',
        prop: 'asset_class_name',
        minWidth: 100,
        'show-overflow-tooltip': true,
      },
      {
        align: 'center',
        label: '规格型号',
        'show-overflow-tooltip': true,
        minWidth: 100,
        prop: 'asset_model',
      },
      {
        align: 'center',
        label: '资产类型',
        minWidth: 110,
        'show-overflow-tooltip': true,
        prop: 'asset_type_name',
      },
      {
        align: 'left',
        label: '存放地点',
        minWidth: 130,
        'show-overflow-tooltip': true,
        prop: 'position_name',
      },
      {
        align: 'right',
        label: '单价 (元)',
        minWidth: 100,
        prop: 'unit_price',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        align: 'center',
        label: '状态',
        minWidth: 80,
        prop: 'status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.FixedAssetStatusMap,
        },
      },
      {
        align: 'center',
        label: '费用承担部门/项目',
        'show-overflow-tooltip': true,
        width: 160,
        formatter: row => {
          const department_name = row.current_department_name ? row.current_department_name : '';
          const project_name = row.current_project_name ? '项目：' + row.current_project_name : '';
          if (!department_name && !project_name) return '--';
          return (
            <div style="text-overflow: ellipsis;overflow: hidden;">{`${
              row.current_department_name ? row.current_department_name : ''
            }${row.current_project_name ? '项目：' + row.current_project_name : ''}`}</div>
          );
        },
      },
      {
        align: 'center',
        label: '使用人',
        minWidth: 80,
        prop: 'current_user_name',
      },
      {
        align: 'center',
        label: '预计使用期限 (年)',
        minWidth: 120,
        prop: 'expected_useful_life',
      },
      {
        align: 'center',
        label: '购买日期',
        minWidth: 100,
        prop: 'purchase_date',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        label: '保修到期日期',
        minWidth: 100,
        prop: 'warranty_deadline',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'right',
        label: '折旧金额 (元)',
        minWidth: 100,
        prop: 'depreciation_amount',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        align: 'right',
        label: '账面余额 (元)',
        minWidth: 100,
        prop: 'remaining_amount',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        align: 'center',
        label: '盘点状态',
        minWidth: 100,
        prop: 'inventory_status',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.AssetCountStatusMap,
        },
      },
      {
        label: '操作',
        width: 130,
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
          row.inventory_operation_status === 0 &&
            row.inventory_status === E.fixedassets.AssetCountStatus.diskSurplus &&
            addButns('盘盈处理', () => {
              ManagementEditDialog.update({
                title: '盘盈处理',
              }).show(JSON.parse(JSON.stringify(row)));
            });
          row.inventory_operation_status === 0 &&
            row.inventory_status === E.fixedassets.AssetCountStatus.inventoryLoss &&
            addButns('报废', () => {
              ScrapDialog.show(
                {
                  ...JSON.parse(JSON.stringify(row)),
                  scrapped_amount: undefined,
                  scrapped_type: undefined,
                },
                {
                  scrapped_explain: '资产盘亏',
                },
              );
            });
          return <div>{btns}</div>;
        },
      },
    ];
    const otherQueryFrom = ref({
      purchaseDate: [],
      lastDate: [],
    }); // 其他查询条件
    const initQueryForm = (): any => {
      return {
        inventory_id: ctx.root.$route.params.id,
        asset_code: undefined, // 资产编号
        current_project_id: undefined, // 费用承担项目ID
        status: undefined, // 1: 闲置 2: 锁定 3: 在用 4: 维修 5: 报废 (可选值 : 1, 2, 3, 4, 5)
        asset_name: undefined, // 名称
        asset_class: undefined, // 资产分类ID
        asset_type: undefined, // 资产类型ID
        inventory_status: undefined, // 盘点状态
        current_department_id: undefined, // 费用承担部门ID
        purchase_start_date: computed(() => {
          if (!otherQueryFrom.value.purchaseDate?.length) return undefined;
          return otherQueryFrom.value.purchaseDate[0];
        }),
        purchase_end_date: computed(() => {
          if (!otherQueryFrom.value.purchaseDate?.length) return undefined;
          return otherQueryFrom.value.purchaseDate[1];
        }),
        last_used_start_date: computed(() => {
          if (!otherQueryFrom.value.lastDate?.length) return undefined;
          return otherQueryFrom.value.lastDate[0];
        }),
        last_used_end_date: computed(() => {
          if (!otherQueryFrom.value.lastDate?.length) return undefined;
          return otherQueryFrom.value.lastDate[1];
        }),
      };
    };
    async function submitFunc<T extends (...args: any) => any>(
      request: T,
      data: Parameters<T>[0],
      dialogInstance: any,
      successMsg: string = '操作成功',
      failMsg: string = '操作失败',
    ) {
      const runRequest = useRequest(request, {
        manual: true,
        onFinally: () => {
          dialogInstance.close();
        },
      });
      // TODO: 暂时处理
      // @ts-ignore
      runRequest.runAsync(data).then(res => {
        console.log(dialogInstance, 'res');
        dialogInstance.close();
        if (res.data.success) {
          ctx.root.$message.success(successMsg);
          query.reload();
        } else {
          ctx.root.$message.error(res.data.message || failMsg);
        }
      });
    }
    // 编辑
    const ManagementEditDialog = useDialog({
      component: managementEdit,
      width: '593px',
      title: '编辑',
      okText: '保存',
      footer: false,
      on: {
        submit(row: any) {
          submitFunc(
            ProfitFixedAssetInventoryDetail,
            row,
            ManagementEditDialog,
            '操作成功',
            '操作失败',
          );
        },
      },
    });
    // 报废
    const ScrapDialog = useDialog({
      component: scrap,
      props: {
        showImportBtn: false,
      },
      width: '787px',
      title: '报废',
      on: {
        submit(row: any) {
          LossFixedAssetInventoryDetail({
            ...row,
            inventory_id: ctx.root.$route.params.id,
          }).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
              ScrapDialog.close();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            row.loading.value = false;
          });
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetInventoryDetail, {
      defaultParams: [
        {
          num: 20,
          page_num: 1,
        },
        {
          inventory_id: queryForm.value.inventory_id,
        },
      ],
    });
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
        otherQueryFrom.value = {
          purchaseDate: [],
          lastDate: [],
        };
      },
      showExport: true,
      exportURL: '/api/fixed_asset/export_fixed_asset_inventory_detail',
      table: {
        border: true,
      },
    };
    const { assetClassOption, assetTypeOption } = useComonOptions();
    /* 批量导入 */
    const beforeMerchantUpload = (config: any) => ValidationFileUpload({ excel: true })(config);

    onMounted(() => {
      init();
    });
    const detailData = ref<any>({});
    const init = () => {
      QueryFixedAssetInventoryRecord(
        {
          page_num: 1,
          num: 1000,
        },
        {
          id: ctx.root.$route.params.id,
        },
      ).then(res => {
        if (res.data.success && res.data.data.data.length) {
          detailData.value = res.data.data.data[0];
        }
      });
    };
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      otherQueryFrom,
      ManagementEditDialog,
      assetClassOption,
      assetTypeOption,
      beforeMerchantUpload,
      ScrapDialog,
      detailData,
      init,
    };
  },
  render() {
    const { queryForm, otherQueryFrom, query } = this;
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
        service={query}
        v-model={queryForm}
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
            v-model={queryForm.asset_class}
            v-auto-placeholder
            options={this.assetClassOption}
          />
        </el-form-item>
        <el-form-item label="资产类型：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={queryForm.asset_type}
            v-auto-placeholder
            options={this.assetTypeOption}
          />
        </el-form-item>
        <el-form-item label="状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={queryForm.status}
            v-auto-placeholder
            options={E.fixedassets.FixedAssetStatusOption.filter(
              v =>
                v.value === E.fixedassets.FixedAssetStatus.is_use ||
                v.value === E.fixedassets.FixedAssetStatus.leave_unused,
            )}
          />
        </el-form-item>
        <el-form-item label="承担部门：">
          <department-select
            placeholder="请选择费用承担部门"
            queryForm={{ is_contain_goumee: true }}
            checkOnClickNode={true}
            // disabledLevel={2}
            // levelDisabled={(level: number) => level !== 2}
            levelHidden={(level: number) => level > 3}
            clearable
            v-model={queryForm.current_department_id}
          />
        </el-form-item>
        <el-form-item label="承担项目：">
          <FunctionSelect
            style="width: 100%"
            modeType={EFunctionSelectType.SEARCH_PROFIT_LOSS}
            v-model={queryForm.current_project_id}
            placeholder="请选择费用承担项目"
            ref="projectSelect"
          />
        </el-form-item>
        <el-form-item label="购买日期：">
          <el-date-picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={otherQueryFrom.purchaseDate}
          />
        </el-form-item>
        <el-form-item label="最后日期：">
          <el-date-picker
            style="width: 100%"
            editable={false}
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="~"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={otherQueryFrom.lastDate}
          />
        </el-form-item>
        <el-form-item label="盘点状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={queryForm.inventory_status}
            v-auto-placeholder
            options={E.fixedassets.AssetCountStatusOption}
          />
        </el-form-item>
        <div slot="btnLine" style="display: flex;">
          <tg-upload
            v-show={this.detailData.inventory_result === null}
            action="/api/fixed_asset/import_fixed_asset_inventory_detail_excel"
            data={{ storage: 2, id: this.$route.params.id }}
            show-file-list={false}
            beforeUpload={this.beforeMerchantUpload}
            success={(res: any) => {
              if (!res.success) {
                return this.$message.error(res.message);
              }
              this.init();
              this.query.reload();
            }}
          >
            <tg-button class="mgr-6">盘点导入</tg-button>
          </tg-upload>
          <tg-button
            class="mgr-6"
            v-show={
              this.detailData.inventory_status === E.fixedassets.InventoryStatus.not_returned &&
              this.detailData.inventory_result !== null
            }
            on-click={() => {
              QueryFixedAssetInventoryDetail(
                {
                  page_num: 1,
                  num: 1000,
                },
                {
                  inventory_id: this.$route.params.id,
                  inventory_operation_status: 0,
                  inventory_status: E.fixedassets.AssetCountStatus.inventoryLoss,
                },
              ).then(res => {
                if (res.data.success) {
                  const data = res.data.data.data;
                  if (!data.length) {
                    return this.$message.warning('没有可盘亏处理的资产');
                  }
                  this.ScrapDialog.show(data, {
                    scrapped_explain: '资产盘亏',
                  });
                }
              });
            }}
          >
            批量报废
          </tg-button>
          <tg-button
            v-show={
              this.detailData.inventory_status === E.fixedassets.InventoryStatus.not_returned &&
              this.detailData.inventory_result !== null
            }
            on-click={() => {
              Confirm('确认完成盘点？').then(() => {
                CompleteFixedAssetInventory({
                  id: this.$route.params.id,
                }).then(res => {
                  if (res.data.success) {
                    this.$message.success('操作成功');
                    this.init();
                    this.query.reload();
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              });
            }}
          >
            完成盘点
          </tg-button>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
