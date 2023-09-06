import { defineComponent, ref } from '@vue/composition-api';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { usePermission } from '@/use/permission';
import { SignTypeOptions } from '@/types/tiange/contract';
import { TgTableColumn } from '@/types/vendor/column';
import {
  QueryFixedAssetWarehousePosition,
  InsertOrUpdateFixedAssetWarehousePosition,
  DeleteFixedAssetWarehousePosition,
} from '@/services/fixedAssets';
import { Confirm } from '@/use/asyncConfirm';

const diglog = defineComponent({
  setup(props, ctx) {
    const formData = ref({
      position_name: '',
    });
    const show = (val: any) => {
      if (val) {
        formData.value = val;
      }
    };
    const close = () => {
      ctx.emit('close');
    };
    const formRef = ref<any>(null);
    const onSaveBtnClick = async () => {
      const formValid = await formRef.value.validate();
      console.log(formValid);

      if (formValid) {
        ctx.emit('submit', formData.value);
      }
    };
    return {
      formData,
      show,
      close,
      formRef,
      onSaveBtnClick,
    };
  },
  render() {
    return (
      <el-form
        ref="formRef"
        style="padding: 18px 0 6px 18px;"
        attrs={{ model: this.formData }}
        inline={true}
      >
        <el-form-item
          label="存放地点："
          rules={[{ required: true, message: '请输入存放地点', trigger: 'blur' }]}
          prop="position_name"
        >
          <el-input
            size="mini"
            style="width: 190px;"
            v-model={this.formData.position_name}
          ></el-input>
        </el-form-item>
      </el-form>
    );
  },
});

export default defineComponent({
  setup: (props, ctx) => {
    const permission = usePermission();
    const columns: TgTableColumn<{
      position_name: string;
      id: number;
    }>[] = [
      {
        align: 'left',
        'show-overflow-tooltip': true,
        label: '存放地点',
        prop: 'position_name',
        minWidth: 130,
      },
      {
        label: '操作',
        width: 200,
        fixed: 'right',
        align: 'center',
        formatter: row => {
          return (
            <div>
              <tg-button
                type="link"
                style="margin-right:30px"
                onClick={() => openDialog.show(JSON.parse(JSON.stringify(row)))}
              >
                编辑
              </tg-button>
              <tg-button
                type="link"
                onClick={() => {
                  Confirm('是否删除该存放地点？').then(() => {
                    DeleteFixedAssetWarehousePosition({
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
                }}
              >
                删除
              </tg-button>
            </div>
          );
        },
      },
    ];
    const openDialog = useDialog({
      component: diglog,
      width: '300px',
      title: '存放地点',
      on: {
        submit(row: any) {
          InsertOrUpdateFixedAssetWarehousePosition(row).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              query.reload();
            } else {
              ctx.root.$message.error(res.data.message);
            }
            openDialog.close();
          });
        },
      },
    });
    const initQueryForm = (): any => {
      return {
        contract_uid: undefined,
        tax_subject_type: undefined,
        business_type: undefined,
        project_name: undefined,
        sign_type: undefined,
        receipt_status: undefined,
      };
    };
    const queryForm = ref<any>(initQueryForm());

    const query = usePagination(QueryFixedAssetWarehousePosition);
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      showExport: permission.law_contract_ledger_export ? true : false,
      exportURL: '/api/cont/export_customer_contract',
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
      openDialog,
    };
  },
  render() {
    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <div slot="btnLine">
          <tg-button
            type="primary"
            icon="ico-btn-add"
            on-click={() => {
              this.openDialog.show();
            }}
          >
            新增
          </tg-button>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
