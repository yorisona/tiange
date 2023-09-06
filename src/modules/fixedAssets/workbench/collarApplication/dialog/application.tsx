import { ref, defineComponent, h } from '@vue/composition-api';
import EditTable, { ExportData } from '@/components/TableEdit/index';
import EditTableColumn from '@/components/TableEdit/column';
import { FunctionSelect, Select } from '@gm/component/select';
import { useUserInfo } from '@/use/vuex';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { QueryFixedAssetListAllowUse } from '@/services/fixedAssets';
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
    const formData = ref<any>({
      type: 1,
      file_urls: [],
      approval_user_id: undefined,
      expected_return_date: undefined,
    });
    const show = (val: any | any[]) => {
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
    const QueryFixedAssetListReq = useRequest(QueryFixedAssetListAllowUse, {
      manual: true,
    });
    const onSaveBtnClick = async () => {
      const editTableValid = await EditTable.value.validate();
      if (editTableValid) {
        const listParams = EditTable.value.resultData.map((item: any) => {
          return item.asset_id;
        });
        ctx.emit('submit', {
          ...formData.value,
          asset_id_list: listParams,
        });
      }
    };
    return {
      tableData,
      EditTable,
      formData,
      userInfo,
      show,
      QueryFixedAssetListReq,
      onSaveBtnClick,
    };
  },
  render() {
    const { userInfo, formData } = this;
    return (
      <el-form class="form-wrap">
        <el-form-item>
          <span>申请人：</span>
          <span style="color:var(--text-color)">{userInfo.username}</span>
        </el-form-item>
        <el-form-item style="overflow-y: auto;" class="fill-wrap">
          <span class="label">领用明细：</span>
          <EditTable
            max-height="252"
            border
            ref="EditTable"
            class="edit-table"
            data-source={this.tableData}
            isAutonomy
          >
            <edit-table-column
              align="left"
              prop="asset_code"
              label="资产编号"
              hasFormItem
              minWidth="130"
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
              minWidth="100"
              prop="asset_name"
              label="名称"
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
                          row.asset_model = asset.asset_model;
                          row.asset_type_name = asset.asset_type_name;
                        }
                      }}
                      options={row.nameOption || []}
                    />
                  );
                },
              }}
            />
            <edit-table-column prop="asset_class_name" label="分类" minWidth="100" />
            <edit-table-column
              prop="asset_model"
              label="规格型号"
              width="100"
              show-overflow-tooltip
            />
            <edit-table-column prop="asset_type_name" label="资产类型" />
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
        <el-form-item>
          <span class="label">
            <span style="color:red;">*</span>费用承担：
          </span>
          <div class="costBox">
            <el-radio-group size="mini" v-model={formData.type}>
              <el-radio label={1}>部门</el-radio>
              <el-radio label={2}>项目</el-radio>
            </el-radio-group>
            {formData.type === 1 ? (
              <department-select
                // style="--default-height: 40px"
                style={{ flex: 1 }}
                placeholder="请选择部门*"
                queryForm={{ is_contain_goumee: true }}
                checkOnClickNode={true}
                levelHidden={(level: number) => level > 3}
                clearable
                v-model={this.formData.department_id}
              />
            ) : (
              <FunctionSelect
                style="width:100%;flex: 1;"
                size="mini"
                modeType={EFunctionSelectType.SEARCH_PROFIT_LOSS}
                v-model={this.formData.project_id}
                placeholder="请选择项目"
                clearable={true}
              />
            )}
          </div>
        </el-form-item>
        <el-form-item label="">
          <span class="label">
            <span style="color:red;">*</span>负责人：
          </span>
          <FunctionSelect
            style="width:100%;flex: 1;"
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={this.formData.approval_user_id}
            placeholder="请选择负责人"
            clearable={true}
          />
        </el-form-item>
        <el-form-item>
          <span class="label">
            <span style="color:red;">*</span>申请原因：
          </span>
          <el-input
            type="textarea"
            v-model={formData.remark}
            rows={2}
            placeholder="请输入申请原因"
          />
        </el-form-item>
        <el-form-item>
          <span class="label">预计归还时间：</span>
          <el-date-picker
            size="mini"
            style="width: 100%"
            type="date"
            placeholder="请选择预计归还时间"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model={formData.expected_return_date}
          />
        </el-form-item>
        <el-form-item prop="file_urls">
          <span class="label">附件：</span>
          <div class="upload-box">
            <tg-upload
              class="col-span-full"
              multiple={true}
              action="/api/resources/upload_file"
              data={{ type: 'fixed_asset_receive', storage: 2 }}
              show-file-list={false}
              success={(res: any) => {
                if (!res.success) {
                  this.$message.error(res.message);
                  return;
                }
                formData.file_urls?.push(res.data.source);
              }}
            >
              <tg-button icon="ico-upload-lite" v-model={formData.file_urls}>
                上传附件
              </tg-button>
              <span class="mgl-12" style="color:#ff9434">
                如果申请清单中包括直播设备，需要上传PGC直播设配清单
              </span>
            </tg-upload>
            <upload-file-list v-model={formData.file_urls} />
          </div>
        </el-form-item>
      </el-form>
    );
  },
});
