import { computed, defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ITemplateConfig, ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { Select, FunctionSelect } from '@gm/component/select';
import { SignTypeOptions } from '@/types/tiange/contract';
import { VNode } from 'vue';
import { TgTableColumn } from '@/types/vendor/column';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import ImageViewer from '@/components/Image/ImageViewer';
import { urlAppendToken } from '@/utils/token';
import scrap from './dialog/scrap.vue';
import { Confirm } from '@/use/asyncConfirm';
import allocation from './dialog/allocation';
import repair from './dialog/repair.vue';
import managementEdit from './dialog/managementEdit.vue';
import {
  QueryFixedAssetList,
  InsertOrUpdateFixedAsset,
  ApplyForFixedAssetAllocationRecord,
  ApplyForFixedAssetMaintenanceRecord,
  ApplyForFixedAssetScrappedRecord,
  FixedAssetReceiveLockOrUnlock,
} from '@/services/fixedAssets';
import { useComonOptions, assetManagementList } from '@/modules/fixedAssets/use';
import print from './dialog/print.vue';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';

export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<assetManagementList>[] = [
      // 选择框
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
        align: 'right',
        label: '不含税金额 (元)',
        minWidth: 110,
        prop: 'tax_excluded_amount',
        dataType: {
          type: 'money',
          unit: 100,
          toFixed: 2,
        },
      },
      {
        align: 'right',
        label: '税额 (元)',
        minWidth: 100,
        prop: 'tax_amount',
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
      // {
      //   align: 'center',
      //   label: '保修到期日期',
      //   minWidth: 100,
      //   prop: 'warranty_deadline',
      //   dataType: {
      //     type: 'date',
      //   },
      // },
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
        label: '最后使用日期',
        minWidth: 100,
        prop: 'last_used_date',
        dataType: {
          type: 'date',
        },
      },
      {
        label: '操作',
        width: 120,
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
          row.is_allow_edit &&
            addButns('编辑', () => {
              ManagementEditDialogIsShowTable.value = true;
              isDisabled.value = false;
              ManagementEditDialog.update({
                title: '编辑',
              }).show(JSON.parse(JSON.stringify(row)));
            });
          row.is_allow_allocation &&
            addButns('分配', () => {
              AllocationDialog.show(JSON.parse(JSON.stringify(row)));
            });
          row.is_allow_maintenance &&
            addButns('维修', () => {
              RepairDialog.show(JSON.parse(JSON.stringify(row)));
            });
          row.is_allow_scrapped &&
            addButns('报废', () => {
              ScrapDialog.show({
                ...JSON.parse(JSON.stringify(row)),
                scrapped_amount: undefined,
                scrapped_type: undefined,
              });
            });
          row.is_allow_lock &&
            addButns('锁定', () => {
              Confirm('是否锁定该资产？').then(() => {
                FixedAssetReceiveLockOrUnlock({
                  asset_id_list: [row.id],
                  lock_or_unlock: 1,
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
          row.is_allow_unlock &&
            addButns('解锁', () => {
              Confirm('是否解锁该资产？').then(() => {
                FixedAssetReceiveLockOrUnlock({
                  asset_id_list: [row.id],
                  lock_or_unlock: 0,
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
          addButns('查看', () => {
            isDisabled.value = true;
            ManagementEditDialogIsShowTable.value = true;
            ManagementEditDialog.update({
              title: '查看',
            }).show(JSON.parse(JSON.stringify(row)));
          });
          addButns('打印', () => {
            PrintDialog.show(row);
          });

          return <div>{btns}</div>;
        },
      },
    ];
    const otherQueryFrom = ref({
      purchaseDate: [],
      lastDate: [],
      showScrap: true,
    }); // 其他查询条件
    const initQueryForm = (): any => {
      return {
        asset_code: undefined, // 资产编号
        current_project_id: undefined, // 费用承担项目ID
        status: undefined, // 1: 闲置 2: 锁定 3: 在用 4: 维修 5: 报废 (可选值 : 1, 2, 3, 4, 5)
        asset_name: undefined, // 名称
        asset_class: undefined, // 资产分类ID
        asset_type: undefined, // 资产类型ID
        current_user_id: undefined, // 使用人ID
        current_department_id: undefined, // 费用承担部门ID
        is_filter_scrapped: computed(() => (otherQueryFrom.value.showScrap ? 1 : 0)), // 是否显示报废
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
    const ManagementEditDialogIsShowTable = ref(false);
    const isDisabled = ref(false);
    const ManagementEditDialog = useDialog({
      component: managementEdit,
      props: {
        isShowTable: ManagementEditDialogIsShowTable,
        isDisabled: isDisabled,
      },
      width: '593px',
      footer: false,
      title: '编辑',
      okText: '保存',
      on: {
        submit(row: any) {
          submitFunc(InsertOrUpdateFixedAsset, row, ManagementEditDialog, '操作成功', '操作失败');
        },
        print(row: any) {
          PrintDialog.show(row);
        },
      },
    });
    // 打印
    const PrintDialog = useDialog({
      component: print,
      width: '458px',
      title: '打印',
      okText: '打印',
      on: {
        submit(row: any) {},
      },
    });
    // 分配
    const AllocationDialog = useDialog({
      component: allocation,
      width: '350px',
      title: '分配',
      on: {
        submit({ asset_id_list, department_id, project_id, user_id }: any) {
          submitFunc(
            ApplyForFixedAssetAllocationRecord,
            {
              asset_id_list,
              department_id,
              project_id,
              user_id,
            },
            AllocationDialog,
            '操作成功',
            '操作失败',
          );
        },
      },
    });
    // 报废
    const ScrapDialog = useDialog({
      component: scrap,
      width: '787px',
      title: '报废',
      on: {
        submit(row: any) {
          // submitFunc(ApplyForFixedAssetScrappedRecord, row, ScrapDialog, '操作成功', '操作失败');
          ApplyForFixedAssetScrappedRecord(row).then(res => {
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
    // 维修
    const RepairDialog = useDialog({
      component: repair,
      width: '550px',
      title: '维修',
      on: {
        submit(row: any) {
          submitFunc(
            ApplyForFixedAssetMaintenanceRecord,
            row,
            RepairDialog,
            '操作成功',
            '操作失败',
          );
        },
      },
    });
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetList, {
      manual: true,
    });
    const selected = ref<assetManagementList[]>([]);
    const config: ITemplateConfig = {
      auto: true,
      reset: () => {
        queryForm.value = initQueryForm();
        otherQueryFrom.value = {
          purchaseDate: [],
          lastDate: [],
          showScrap: true,
        };
      },
      showExport: true,
      exportURL: '/api/fixed_asset/export_fixed_asset',
      table: {
        border: true,
        selectionChange: (value: assetManagementList[]) => {
          selected.value = value;
        },
      },
    };
    const { assetClassOption, assetTypeOption } = useComonOptions();
    const beforeMerchantUpload = (config: any) => ValidationFileUpload({ excel: true })(config);

    return {
      saleContractTypeOptions: [...SignTypeOptions],
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      columns,
      otherQueryFrom,
      ManagementEditDialog,
      ManagementEditDialogIsShowTable,
      assetClassOption,
      assetTypeOption,
      isDisabled,
      ScrapDialog,
      selected,
      beforeMerchantUpload,
      AllocationDialog,
      RepairDialog,
      PrintDialog,
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
        <el-form-item label="使用人：">
          <FunctionSelect
            style="width: 100%"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={queryForm.current_user_id}
            otherParams={{ is_contain_goumee: true }}
            placeholder="请选择使用人"
            ref="projectSelect"
          />
        </el-form-item>
        <el-form-item label="状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={queryForm.status}
            v-auto-placeholder
            options={
              otherQueryFrom.showScrap
                ? E.fixedassets.FixedAssetStatusOption.filter(v => v.value !== 5)
                : E.fixedassets.FixedAssetStatusOption
            }
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
        <div slot="btnLine" style="display:flex;align-items:center;">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            on-click={() => {
              this.ManagementEditDialogIsShowTable = false;
              this.isDisabled = false;
              this.ManagementEditDialog.update({ title: '新增资产' }).show();
            }}
          >
            新增资产
          </tg-button>
          <tg-button
            class="mgl-6"
            on-click={() => {
              if (!this.selected.length) return this.$message.warning('请选择资产');
              this.AllocationDialog.show({
                id: this.selected.map(v => v.id),
              });
            }}
          >
            批量分配
          </tg-button>
          <tg-button
            class="mgl-6"
            on-click={() => {
              if (!this.selected.length) return this.$message.warning('请选择资产');
              this.RepairDialog.show(JSON.parse(JSON.stringify(this.selected)));
            }}
          >
            批量维修
          </tg-button>
          <tg-button
            class="mgl-6"
            on-click={() => {
              if (!this.selected.length) return this.$message.warning('请选择资产');
              this.ScrapDialog.show(JSON.parse(JSON.stringify(this.selected)));
            }}
          >
            批量报废
          </tg-button>
          <tg-button
            class="mgl-6"
            on-click={() => {
              if (!this.selected.length) return this.$message.warning('请选择资产');
              Confirm('是否锁定该资产？').then(() => {
                FixedAssetReceiveLockOrUnlock({
                  asset_id_list: this.selected.map(v => v.id),
                  lock_or_unlock: 1,
                }).then(res => {
                  if (res.data.success) {
                    this.$message.success('操作成功');
                    query.reload();
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              });
            }}
          >
            批量锁定
          </tg-button>
          <tg-button
            class="mgl-6"
            on-click={() => {
              if (!this.selected.length) return this.$message.warning('请选择资产');
              this.PrintDialog.show(JSON.parse(JSON.stringify(this.selected)));
            }}
          >
            批量打印
          </tg-button>
          <tg-upload
            action="/api/fixed_asset/import_fixed_asset_excel"
            data={{ storage: 2 }}
            show-file-list={false}
            beforeUpload={this.beforeMerchantUpload}
            success={(res: { data: any; success: boolean; message: string }) => {
              if (res && res.success) {
                this.$message.success(res.message);
                query.reload();
              } else {
                this.$message.error(res.message);
              }
            }}
          >
            <tg-button class="mgl-6">导入资产</tg-button>
          </tg-upload>
          <el-checkbox
            class="mgl-24"
            v-model={otherQueryFrom.showScrap}
            onChange={() => {
              query.runAsync(
                {
                  page_num: 1,
                  num: query.pagination.num,
                },
                {
                  ...queryForm,
                },
              );
            }}
          >
            隐藏资产报废
          </el-checkbox>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
