import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { PostCreateUnity, PostStatementUnity } from '@/services/investment';
//'http://feishu.corp.goumee.com/test1/resources/medium_manage/20220424/1650786774/unity-settlement-orders-2022-03-01-1650782605.csv',

export default defineComponent({
  props: {
    is_estimate: {
      type: String,
      default: '1',
    },
    settlement_kind: {
      type: String,
      default: '1',
    },
  },
  setup(prop, ctx) {
    const isStatementAccount = ref(false);
    const dialogState = reactive({
      visible: false,
      saveLoading: false,
    });
    const show = (type = 0) => {
      dialogState.visible = true;
      isStatementAccount.value = type === 1;
    };

    const orderList = ref<string[]>([]);
    const queryParams = ref({
      settlement_date: '',
      order_file: '',
      is_estimate: prop.is_estimate,
      settlement_kind: prop.settlement_kind,
    });
    const closeHandler = () => {
      orderList.value = [];
      queryParams.value.settlement_date = '';
      queryParams.value.order_file = '';
      dialogState.visible = false;
    };
    const saveHandler = async () => {
      const payload = { ...queryParams.value };
      payload.order_file = orderList.value.toString();
      if (!payload.order_file || !payload.settlement_date) {
        ctx.root.$message.warning('请完善资料');
        return;
      }
      dialogState.saveLoading = true;
      try {
        if (isStatementAccount.value) {
          const { data } = await PostStatementUnity({
            settlement_date: payload.settlement_date,
            file_path: payload.order_file,
          });
          if (data.success) {
            ctx.root.$message.success('提交成功');
            closeHandler();
            ctx.emit('success', data.data);
          } else {
            throw new Error(data.message);
          }
        } else {
          const { data } = await PostCreateUnity(payload);
          if (data.success) {
            ctx.root.$message.success('提交成功');
            closeHandler();
            ctx.emit('success', data.data);
          } else {
            throw new Error(data.message);
          }
        }
      } catch (_err: any) {
        ctx.root.$message({
          type: 'warning',
          message: _err || '提交失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      } finally {
        dialogState.saveLoading = false;
      }
    };

    const beforeMerchantUpload = (config: any) =>
      ValidationFileUpload({ csv: true, fileSize: 2048 })(config);
    const beforeStatementUpload = (config: any) =>
      ValidationFileUpload({ csv: true, excel: true, fileSize: 2048 })(config);
    const successMerchantUpload = (res: { data: any; success: boolean; message: string }) => {
      if (res && res.success) {
        orderList.value.push(res.data.source);
      } else {
        ctx.root.$message.error(res.message);
      }
    };

    return {
      beforeStatementUpload,
      isStatementAccount,
      ...toRefs(dialogState),
      closeHandler,
      show,
      saveHandler,
      orderList,
      queryParams,
      successMerchantUpload,
      beforeMerchantUpload,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          class="customer-dialog tg-dialog-vcenter-new"
          visible={this.visible}
          width="404px"
          title={this.isStatementAccount ? '上传对账单' : '手工统一结算'}
          close-on-click-modal={false}
          onClose={() => {
            this.closeHandler();
          }}
        >
          <tg-card padding={18} style="height: 260px;overflow-y: auto;">
            <el-form class="flex-form" size="mini" show-message={false} label-width="100px">
              <el-form-item label="请选择结算周期：" style="margin-right:0">
                <el-date-picker
                  v-model={this.queryParams.settlement_date}
                  type="month"
                  placeholder="请选择结算周期"
                  style="width: 266px"
                  format="yyyy.MM"
                  value-format="yyyy-MM-01"
                />
              </el-form-item>
              <el-form-item label="上传结算文件：" style="margin-right:0">
                {this.isStatementAccount ? (
                  <tg-upload
                    action="/api/resources/upload_file"
                    data={{ type: 'unit_settlement', storage: 2 }}
                    beforeUpload={this.beforeStatementUpload}
                    success={this.successMerchantUpload}
                    show-file-list={false}
                  >
                    <tg-button type="primary" icon="ico-btn-upload">
                      上传附件
                    </tg-button>
                  </tg-upload>
                ) : (
                  <tg-upload
                    show-file-list={false}
                    action="/api/medium/upload_file"
                    beforeUpload={this.beforeMerchantUpload}
                    success={this.successMerchantUpload}
                  >
                    <tg-button icon="ico-upload-lite">上传附件</tg-button>
                  </tg-upload>
                )}
                <upload-file-list
                  style="margin-top:4px"
                  class="invoice-upload-list"
                  v-model={this.orderList}
                />
              </el-form-item>
            </el-form>
          </tg-card>
          <template slot="footer">
            <tg-button
              onClick={() => {
                this.closeHandler();
              }}
            >
              取消
            </tg-button>
            <tg-button
              type="primary"
              onClick={() => {
                this.saveHandler();
              }}
            >
              保存
            </tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="  正在提交，请稍候..." />
      </div>
    );
  },
});
