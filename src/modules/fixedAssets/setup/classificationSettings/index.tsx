import { ref, defineComponent, h } from '@vue/composition-api';
import S from '../commn.module.less';
import EditTable, { ExportData } from '@/components/TableEdit/index';
import EditTableColumn from '@/components/TableEdit/column';
import { Select } from '@gm/component/select';
import { useRequest } from '@gm/hooks/ahooks';
import { QueryFixedAssetClass, InsertOrUpdateFixedAssetClass } from '@/services/fixedAssets';

export default defineComponent({
  components: {
    EditTable,
    EditTableColumn,
  },
  setup(props, ctx) {
    const assetClassData = ref<any[]>([] as any);
    const QueryFixedAssetClassReq = useRequest(QueryFixedAssetClass, {
      manual: true,
    });
    const loading = ref(false);
    const init = () => {
      loading.value = true;
      QueryFixedAssetClassReq.runAsync().then(res => {
        assetClassData.value = res.data.data || [];
        loading.value = false;
      });
    };
    init();
    const EditTableRef = ref<ExportData>(null as any);
    const submit = async () => {
      EditTableRef.value.editActions.saveEditableAll();
      const params = EditTableRef.value.resultData;
      InsertOrUpdateFixedAssetClass(params).then(res => {
        if (res.data.success) {
          ctx.root.$message.success('操作成功');
        } else {
          ctx.root.$message.error(res.data.message);
        }
        init();
      });
    };
    return {
      EditTableRef,
      assetClassData,
      loading,
      init,
      submit,
    };
  },
  render() {
    const { EditTableRef } = this;
    return (
      <div class={[S.classificationSettings]} v-loading={this.loading}>
        <EditTable
          border
          max-height="600"
          ref="EditTableRef"
          class="edit-table"
          data-source={this.assetClassData}
          isAutonomy
        >
          <edit-table-column
            align="left"
            prop="asset_class_code"
            label="分类编码"
            width="180"
            // hasFormItem
            formItemProps={{
              'show-message': false,
            }}
            rules={[{ required: true, trigger: 'blur' }]}
            scopedSlots={{
              edit: ({ row }: any) => {
                return <el-input size="mini" maxlength={6} v-model={row.asset_class_code} />;
              },
            }}
          ></edit-table-column>
          <edit-table-column
            prop="asset_class_name"
            width="180"
            label="分类名称"
            rules={[{ required: true, trigger: 'blur' }]}
            // hasFormItem
            formItemProps={{
              'show-message': false,
            }}
            scopedSlots={{
              edit: ({ row }: any) => {
                return <el-input size="mini" v-model={row.asset_class_name} />;
              },
            }}
          ></edit-table-column>
          <edit-table-column
            width="144"
            prop="annex_is_required"
            label="附件是否必填"
            // hasFormItem
            align="center"
            formItemProps={{
              'show-message': false,
            }}
            rules={[{ required: true, trigger: 'change' }]}
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <div class="tg-table-column__cell--align-center">
                    {row.annex_is_required === 1 ? '是' : '否'}
                  </div>
                );
              },
              edit: ({ row }: any) => {
                return (
                  <Select
                    popper-class="el-select-popper-mini"
                    v-model={row.annex_is_required}
                    placeholder="请选择"
                    options={[
                      { label: '是', value: 1 },
                      { label: '否', value: 0 },
                    ]}
                    clearable={false}
                  />
                );
              },
            }}
          />
          <edit-table-column
            align="center"
            prop="asset_class_age"
            label="资产年限"
            width="100"
            // hasFormItem
            formItemProps={{
              'show-message': false,
            }}
            // rules={[{ required: true, trigger: 'blur' }]}
            scopedSlots={{
              edit: ({ row }: any) => {
                return <el-input size="mini" v-model={row.asset_class_age} />;
              },
            }}
          ></edit-table-column>
          <edit-table-column
            label="操作"
            align="center"
            width="68"
            scopedSlots={{
              default: ({ actions, $index }: any) => {
                return (
                  <div style="display: flex;justify-content: space-around;">
                    <tg-icon
                      class="ico-btn mgr-6"
                      name="ico-icon_bianji"
                      disabled={EditTableRef.resultData.length === 1}
                      onClick={() => actions.startEditable($index)}
                    />
                    <tg-icon
                      class="ico-btn"
                      name="ico-btn-delete"
                      disabled={EditTableRef.resultData.length === 1}
                      onClick={() => {
                        if (EditTableRef.resultData.length === 1) return;
                        actions.deleteRow($index);
                        this.submit();
                      }}
                    />
                  </div>
                );
              },
              edit: ({ actions, $index }: any) => {
                return (
                  <div style="display: flex">
                    <el-button
                      size="mini"
                      type="text"
                      onClick={() => actions.cancelEditable($index)}
                    >
                      取消
                    </el-button>
                  </div>
                );
              },
            }}
          ></edit-table-column>
          <div slot="addBtn">
            <el-button
              onClick={() => {
                EditTableRef.editActions.addRow(
                  {
                    annex_is_required: 0,
                    asset_class_age: undefined,
                    asset_class_code: '',
                    asset_class_name: '',
                  },
                  {
                    isToBottom: true,
                    isEditing: true,
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
        <tg-button
          type="primary"
          class="submit"
          onClick={async () => {
            const validate = await EditTableRef.validate();
            if (validate) {
              this.submit();
            }
          }}
        >
          保存
        </tg-button>
      </div>
    );
  },
});
