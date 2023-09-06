import { PostVerify_use_sea_scan } from '@/services/contract';
import { UseSealsModel } from '@/types/tiange/legal';
import { defineComponent, ref } from '@vue/composition-api';

interface ScanFileApprovalForm {
  id: number | undefined;
  suggestion: string | undefined;
}

export interface ScanFileApprovalType {
  show: (flow: any) => void;
}

export default defineComponent({
  name: 'ScanFileApproval',
  setup(props, ctx) {
    const initForm = (): ScanFileApprovalForm => {
      return {
        id: undefined,
        suggestion: undefined,
      };
    };

    const visible = ref(false);
    const saveLoading = ref(false);
    const scanFileApprovalForm = ref(initForm());
    const refMethods: ScanFileApprovalType = {
      show(data: UseSealsModel) {
        scanFileApprovalForm.value.id = data.id;
        visible.value = true;
      },
    };

    const methods = {
      onCloseHandler() {
        visible.value = false;
      },
      onSaveHandler() {
        methods.PostVerify_use_sea_scan(2);
      },
      onRejectHandler() {
        methods.PostVerify_use_sea_scan(3);
      },
      async PostVerify_use_sea_scan(status: 2 | 3) {
        saveLoading.value = true;
        const res = await PostVerify_use_sea_scan({
          approval_id: scanFileApprovalForm.value.id,
          status,
          message: scanFileApprovalForm.value.suggestion,
        });
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '驳回成功');
          methods.onCloseHandler();
          ctx.emit('save');
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
    };
    return {
      saveLoading,
      scanFileApprovalForm,
      visible,
      ...refMethods,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title="审核"
          class="tg-dialog-classic tg-dialog-vcenter-new tg-legal-scan-file-approval-container"
          width="340px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form size="small" label-width="0">
            <el-form-item label="">
              <el-input
                style="width: 100%;"
                type="textarea"
                show-word-limit={true}
                v-model={this.scanFileApprovalForm.suggestion}
                placeholder="请填写意见，限50字"
                maxlength={50}
              ></el-input>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <tg-button type="primary" onClick={this.onSaveHandler}>
              通过
            </tg-button>
            <tg-button onClick={this.onRejectHandler}>驳回</tg-button>
            <tg-button onClick={this.onCloseHandler}>取消</tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
