import { ref, defineComponent, h } from '@vue/composition-api';
import EditTable, { ExportData } from '@/components/TableEdit/index';
import EditTableColumn from '@/components/TableEdit/column';
import { useUserInfo } from '@/use/vuex';
import { Select } from '@gm/component/select';
import { QueryFixedAssetListAllowReturn } from '@/services/fixedAssets';
import { useRequest } from '@gm/hooks/ahooks';

export default defineComponent({
  components: {
    EditTable,
    EditTableColumn,
  },
  setup(props, ctx) {
    const userInfo = useUserInfo();
    const tableData = ref<any>([]);
    const EditTable = ref<ExportData>(null as any);
    const formData = ref<any>({});
    const show = (val: any) => {
      const creardata = (v: any) => {
        return {
          asset_id: v.id,
          asset_code: v.asset_code,
          asset_name: v.asset_name,
          asset_class_name: v.asset_class_name,
          asset_model: v.asset_model,
          asset_type_name: v.asset_type_name,
          option: [],
          nameOption: [],
        };
      };
      tableData.value = Array.isArray(val) ? val.map(item => creardata(item)) : [creardata(val)];
    };
    const QueryFixedAssetListReq = useRequest(QueryFixedAssetListAllowReturn, {
      manual: true,
    });
    const onSaveBtnClick = async () => {
      const editTableValid = await EditTable.value.validate();
      if (editTableValid) {
        const listParams = EditTable.value.resultData.map((item: any) => {
          return item.asset_id;
        });
        ctx.emit('submit', {
          remark: formData.value.remark,
          asset_id_list: listParams,
        });
      }
    };
    return {
      show,
      tableData,
      EditTable,
      formData,
      userInfo,
      QueryFixedAssetListReq,
      onSaveBtnClick,
    };
  },
  render() {
    const { userInfo, formData } = this;
    console.log(userInfo, '--');

    return (
      <el-form class="form-wrap">
        <el-form-item>
          <span>归还人：</span>
          <span style="color:var(--text-color)">{userInfo.username}</span>
        </el-form-item>
        <el-form-item class="fill-wrap">
          <div class="mgb-6">归还明细：</div>
          <EditTable
            border
            max-height="252"
            ref="EditTable"
            class="edit-table"
            data-source={this.tableData}
            isAutonomy
          >
            <edit-table-column
              align="left"
              prop="asset_code"
              label="资产编号"
              minWidth="130"
              hasFormItem
              formItemProps={{
                'show-message': false,
              }}
              rules={[{ required: true, trigger: 'change' }]}
              scopedSlots={{
                default: ({ row }: any) => {
                  return (
                    <Select
                      size="mini"
                      filterable={true}
                      remote={true}
                      v-model={row.asset_code}
                      placeholder="请输入资产编号"
                      clearable={false}
                      remote-method={(val: string) => {
                        this.QueryFixedAssetListReq.runAsync({} as any, {
                          asset_code: val,
                        }).then(res => {
                          const option = res.data.data.data
                            .map((item: any) => {
                              return { ...item, label: item.asset_code, value: item.id };
                            })
                            .filter((item: any) => {
                              return !this.EditTable.resultData.some(
                                (row: any) => row.asset_id === item.id,
                              );
                            });
                          this.$set(row, 'option', option);
                        });
                      }}
                      onChange={(val: any) => {
                        const asset = row.option.find((item: any) => item.id === val);
                        if (asset) {
                          row.asset_id = asset.id;
                          row.asset_code = asset.asset_code;
                          row.asset_name = asset.asset_name;
                          row.asset_class_name = asset.asset_class_name;
                          row.asset_model = asset.asset_model;
                          row.asset_type_name = asset.asset_type_name;
                        }
                      }}
                      options={row.option || []}
                    />
                  );
                },
              }}
            ></edit-table-column>
            <edit-table-column
              prop="asset_name"
              label="名称"
              show-overflow-tooltip
              rules={[{ required: true, trigger: 'change' }]}
              scopedSlots={{
                default: ({ row, $index }: any) => {
                  return (
                    <Select
                      size="mini"
                      filterable={true}
                      remote={true}
                      v-model={row.asset_name}
                      placeholder="请输入资产名称"
                      clearable={false}
                      remote-method={(val: string) => {
                        this.QueryFixedAssetListReq.runAsync({} as any, {
                          asset_name: val,
                        }).then(res => {
                          const option = res.data.data.data
                            .map((item: any) => {
                              return {
                                ...item,
                                label: `资产编号：${item.asset_code} 名称：${item.asset_name} 分类：${item.asset_class_name} 规格型号：${item.asset_model}`,
                                value: item.id,
                              };
                            })
                            .filter((item: any) => {
                              return !this.EditTable.resultData.some(
                                (row: any) => row.asset_id === item.id,
                              );
                            });
                          this.$set(row, 'nameOption', option);
                        });
                      }}
                      onChange={(val: any) => {
                        const asset = row.nameOption.find((item: any) => item.id === val);
                        if (asset) {
                          row.asset_id = asset.id;
                          row.asset_code = asset.asset_code;
                          row.asset_name = asset.asset_name;
                          row.asset_class_name = asset.asset_class_name;
                        }
                      }}
                      options={row.nameOption || []}
                    />
                  );
                },
              }}
            ></edit-table-column>
            <edit-table-column
              show-overflow-tooltip
              align="center"
              prop="asset_class_name"
              label="分类"
            />
            <edit-table-column
              show-overflow-tooltip
              align="center"
              prop="asset_model"
              label="规格型号"
              width="100"
            />
            <edit-table-column
              show-overflow-tooltip
              align="center"
              prop="asset_type_name"
              label="资产类型"
            />
            <edit-table-column
              label="操作"
              align="center"
              width="48"
              scopedSlots={{
                default: ({ actions, $index }: any) => {
                  return (
                    <tg-icon
                      class="ico-btn"
                      name="ico-btn-delete"
                      disabled={this.EditTable.resultData.length === 1}
                      onClick={() => {
                        if (this.EditTable.resultData.length === 1) return;
                        actions.deleteRow($index);
                        console.log(this.EditTable.resultData, 'actions');
                      }}
                    />
                  );
                },
                edit: ({ actions, $index }: any) => {
                  return (
                    <fragments>
                      <el-button
                        type="primary"
                        class="mgr-8"
                        onClick={() => {
                          actions.saveEditable($index);
                          // @ts-ignore
                          console.log(actions.resultData, this.EditTable.formModel, 'actions');
                        }}
                      >
                        保存
                      </el-button>
                      <el-button type="primary" onClick={() => actions.cancelEditable($index)}>
                        取消
                      </el-button>
                    </fragments>
                  );
                },
              }}
            ></edit-table-column>
            <div slot="addBtn">
              <el-button
                onClick={() => {
                  this.EditTable.editActions.addRow(
                    {},
                    {
                      isToBottom: true,
                      isEditing: false,
                    },
                  );
                }}
                incn="add"
                size="mini"
                type="text"
                icon="el-icon-plus"
                class="add-btn"
              >
                新增
              </el-button>
            </div>
          </EditTable>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model={formData.remark} rows={2} placeholder="请输入备注" />
        </el-form-item>
      </el-form>
    );
  },
});
