import { ref, defineComponent, h } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import EditTable, { ExportData } from '@/components/TableEdit/index';
import EditTableColumn from '@/components/TableEdit/column';
import { useRequest } from '@gm/hooks/ahooks';
import { QueryallowScrapped } from '@/services/fixedAssets';

export default defineComponent({
  components: {
    EditTable,
    EditTableColumn,
  },
  props: {
    showImportBtn: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, ctx) {
    const loading = ref(false);
    const formData = ref({
      file_urls: [] as any[],
      other_scrapped_reason: '',
      scrapped_reason: undefined,
      scrapped_explain: '',
      remark: '',
    });
    const tableData = ref<any>([]);
    const formRef = ref<any>(null);
    const show = (val: any, formVal: any) => {
      console.log(val, 'val');
      const createTableItem = (item: any) => ({
        asset_id: item.id,
        asset_code: item.asset_code,
        asset_name: item.asset_name,
        asset_class_name: item.asset_class_name,
        scrapped_amount: item.scrapped_amount,
        scrapped_type: item.scrapped_type,
        option: [
          {
            label: item.asset_code,
            value: item.id,
          },
        ],
        nameOption: [
          {
            label: item.asset_name,
            value: item.id,
          },
        ],
      });
      if (formVal) {
        formData.value = {
          ...formData.value,
          ...formVal,
        };
      }
      if (val instanceof Array) {
        tableData.value = val.map(createTableItem);
      } else {
        tableData.value.push(createTableItem(val));
      }
      console.log(tableData.value, 'tableData.value');
    };
    const close = () => {
      ctx.emit('close');
    };
    const onSaveBtnClick = async () => {
      const formValid = await formRef.value.validate();
      const editTableValid = await EditTable.value.validate();
      if (formValid && editTableValid && !loading.value) {
        const listParams = EditTable.value.resultData.map((item: any) => {
          return {
            asset_id: item.asset_id,
            scrapped_amount: item.scrapped_amount,
            scrapped_type: item.scrapped_type,
          };
        });
        loading.value = true;
        ctx.emit('submit', {
          ...formData.value,
          loading,
          scrapped_relation_list: listParams,
        });
      }
    };
    /* 批量导入 */
    const beforeMerchantUpload = (config: any) => ValidationFileUpload({ excel: true })(config);
    const successMerchantUpload = (res: { data: any; success: boolean; message: string }) => {
      if (res && res.success) {
        const _userIds = tableData.value.map((v: any) => v.id);
        tableData.value.push(
          ...res.data.data
            .filter((v: any) => !_userIds.includes(v.id))
            .map((v: any) => {
              return {
                ...v,
                asset_id: v.id,
              };
            }),
        );
      } else {
        ctx.root.$message.error(res.message);
      }
    };
    const EditTable = ref<ExportData>(null as any);
    const QueryFixedAssetListReq = useRequest(QueryallowScrapped);
    return {
      formData,
      EditTable,
      tableData,
      show,
      close,
      beforeMerchantUpload,
      successMerchantUpload,
      onSaveBtnClick,
      formRef,
      QueryFixedAssetListReq,
      loading,
    };
  },
  render() {
    const { formData } = this;

    return (
      <el-form
        ref="formRef"
        class="form-wrap"
        label-width="67px"
        attrs={{ model: formData }}
        v-loading={this.loading}
      >
        <el-form-item
          label="报废原因："
          prop="scrapped_reason"
          rules={{ required: true, trigger: 'change', message: '选择报废原因' }}
        >
          <Select
            popper-class="el-select-popper-mini"
            style={{ width: '268px' }}
            v-model={this.formData.scrapped_reason}
            v-auto-placeholder
            options={E.fixedassets.reasonForScrappingOption}
            clearable={false}
          />
        </el-form-item>
        {this.formData.scrapped_reason === 5 && (
          <el-form-item
            key="other_scrapped_reason"
            label="其他原因："
            prop="other_scrapped_reason"
            rules={{ required: true, trigger: 'blur', message: '请输入其他原因' }}
          >
            <el-input
              style="flex:1;"
              type="textarea"
              rows={2}
              v-model={this.formData.other_scrapped_reason}
              maxlength={100}
              show-word-limit
              v-auto-placeholder
            />
          </el-form-item>
        )}
        <el-form-item
          label="报废说明："
          prop="scrapped_explain"
          rules={{ required: true, trigger: 'change', message: '请输入报废说明' }}
        >
          <el-input
            style="flex:1;"
            v-model={this.formData.scrapped_explain}
            type="textarea"
            rows={2}
            maxlength={100}
            show-word-limit
            v-auto-placeholder
          />
        </el-form-item>
        <el-form-item label="报废明细：">
          <div class="detail-box">
            <div class="flex-align" v-show={this.showImportBtn}>
              <tg-upload
                action="/api/fixed_asset/analysis_fixed_asset_import_excel/scrapped"
                data={{ storage: 2 }}
                show-file-list={false}
                beforeUpload={this.beforeMerchantUpload}
                success={this.successMerchantUpload}
              >
                <tg-button class="mgr-12" icon="ico-upload-lite">
                  批量导入
                </tg-button>
              </tg-upload>
              {/* <a
                class="download"
                // target="_blank"
                href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/%E8%A6%81%E4%BF%AE%E6%94%B9%E6%9D%83%E9%99%90%E7%9A%84%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx"
                download
              >
                下载模板
              </a> */}
            </div>
          </div>
        </el-form-item>
        <el-form-item label-width="0">
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
              width="170px"
              label="资产编号"
              hasFormItem
              formItemProps={{
                'show-message': false,
              }}
              rules={[{ required: true, trigger: 'change' }]}
              scopedSlots={{
                default: ({ row, $index }: any) => {
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
              minWidth="130"
              show-overflow-tooltip
              rules={[{ required: true, trigger: 'change' }]}
              scopedSlots={{
                default: ({ row, $index }: any) => {
                  return (
                    <Select
                      size="mini"
                      filterable={true}
                      remote={true}
                      v-model={row.asset_id}
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
                                label: `资产编号：${item.asset_code} 名称：${item.asset_name} 分类：${item.asset_class_name}`,
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
            />
            <edit-table-column prop="asset_class_name" label="分类" />
            <edit-table-column
              minWidth="125"
              hasFormItem
              formItemProps={{
                'show-message': false,
              }}
              rules={[
                {
                  required: true,
                  validator: (rule: any, value: any, callback: any) => {
                    const threshold = 0; // 设置阈值'
                    if (!value) return callback(new Error('金额必须大于0'));
                    if (parseFloat(value) <= threshold) {
                      callback(new Error('金额必须大于0'));
                    } else {
                      callback();
                    }
                  },
                  trigger: 'bulr',
                },
              ]}
              prop="scrapped_amount"
              label="报废金额 (元)"
              scopedSlots={{
                default: ({ row, $index }: any) => {
                  return (
                    <el-input
                      size="mini"
                      // v-number-validation={{ decimalPlaces: 2, threshold: 0 }}
                      v-only-number={{ precision: 2, min: 1 }}
                      v-model={row['scrapped_amount']}
                      v-auto-placeholder
                    />
                  );
                },
              }}
            />
            <edit-table-column
              prop="scrapped_type"
              label="报废类型"
              minWidth="100"
              hasFormItem
              formItemProps={{
                'show-message': false,
              }}
              rules={[{ required: true, trigger: 'change' }]}
              scopedSlots={{
                default: ({ row }: any) => {
                  return (
                    <Select
                      popper-class="el-select-popper-mini"
                      v-model={row.scrapped_type}
                      v-auto-placeholder
                      options={E.fixedassets.ScrappedTypeEnumOption}
                      clearable={false}
                    />
                  );
                },
              }}
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
                      }}
                    />
                  );
                },
              }}
            ></edit-table-column>
            <div slot="addBtn">
              <el-button
                onClick={() => {
                  this.EditTable.editActions.addRow(
                    {
                      asset_id: undefined,
                      asset_code: '',
                      asset_name: '',
                      asset_class_name: '',
                      scrapped_amount: undefined,
                      scrapped_type: undefined,
                      option: [],
                    },
                    {
                      isToBottom: true,
                      isEditing: false,
                    },
                  );
                  console.log(this.EditTable.resultData, 'this.EditTable.resultData');
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
        <el-form-item
          label="附件："
          prop="file_urls"
          rules={{ required: true, trigger: 'change', message: '请上传附件' }}
        >
          <div class="upload-box">
            <tg-upload
              class="col-span-full"
              multiple={true}
              action="/api/resources/upload_file"
              data={{ type: 'fixed_asset_scrapped', storage: 2 }}
              show-file-list={false}
              beforeUpload={(config: any) => {
                return ValidationFileUpload({ fileSize: 10 })(config);
              }}
              limit={10}
              success={(res: any) => {
                if (!res.success) {
                  this.$message.error(res.message);
                  return;
                }
                formData.file_urls?.push(res.data.source);
              }}
            >
              <tg-button
                icon="ico-upload-lite"
                disabled={formData.file_urls?.length === 10 ? true : false}
                v-model={formData.file_urls}
              >
                上传附件
              </tg-button>
              <span class="mgl-12" style="color:#888888">
                上限10个文件，最大10M
              </span>
            </tg-upload>
            <upload-file-list class="file-box" ellipsis={'400px'} v-model={formData.file_urls} />
          </div>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            style="flex:1;"
            type="textarea"
            rows={2}
            v-model={this.formData.remark}
            maxlength={100}
            show-word-limit
            v-auto-placeholder
          />
        </el-form-item>
      </el-form>
    );
  },
});
