import { ref, defineComponent, h } from '@vue/composition-api';
export default defineComponent({
  name: '',
  setup(props, ctx) {
    const reason = ref();
    const contract_id = ref();
    const show = (data: any) => {
      contract_id.value = data;
    };
    const dialogSubmit = () => {
      const data = { contract_id: contract_id.value, message: reason.value };
      ctx.emit('close');
      ctx.emit('submit', data);
    };
    return {
      reason,
      show,
      dialogSubmit,
    };
  },
  render() {
    return (
      <div>
        {/* <el-dialog
          title={'扫描件驳回'}
          class="tg-dialog-classic tg-dialog-vcenter-new tg-public-add-account-container"
          width="400px"
          visible={this.rejectVisible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        > */}
        <el-form
          class=" pd-18"
          props={{ model: this.reason }}
          ref="elFormRef"
          size="small"
          label-width="0"
        >
          <el-form-item
            label=""
            prop="reason"
            // rules={[{ required: true, message: '请填写意见，限50字', trigger: 'blur' }]}
          >
            <el-input
              v-model={this.reason}
              type="textarea"
              style="height: 100px;"
              rows={5}
              maxlength={50}
              placeholder="请填写意见，限50字"
              // on-input={(val: string) => (this.dataForm.reason = val.trim())}
            ></el-input>
          </el-form-item>
        </el-form>
        {/* </el-dialog> */}
        {/* <tg-mask-loading visible={this.rejectLoading} content="正在保存，请稍候..." /> */}
      </div>
    );
  },
});
