import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { useRequest } from '@gm/hooks/ahooks';
import InputLimit from '@/utils/inputLimit';
import { update_end_project } from '@/services/live';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  setup(props, ctx) {
    const formRef = ref<ElForm>();
    const id = ref<number>();
    const formData = ref<{ cycle_day?: number | string }>({
      cycle_day: undefined,
    });
    const saveReq = useRequest(update_end_project, { manual: true });
    const { business_type } = useProjectBaseInfo();
    const methods = {
      show(data: any) {
        id.value = data.id;
      },
      onSaveBtnClick() {
        formRef.value?.validate(async valid => {
          if (valid) {
            const res = await saveReq.runAsync(
              id.value,
              {
                ...formData.value,
              },
              business_type.value || E.project.BusinessType.douyin,
            );
            if (res.data.success) {
              ctx.emit('close');
              ctx.emit('submit');
            }
          }
        });
      },
    };
    return { formRef, formData, saveReq, ...methods };
  },
  render() {
    const { formData } = this;
    return (
      <div class="tg-live-prolong-liquidation-period">
        <el-form label-width="68px" ref="formRef" props={{ model: formData }} size="mini">
          <el-form-item
            label="延长日期："
            prop="cycle_day"
            rules={[
              {
                required: true,
                message: '请输入延长天数',
                trigger: ['blur'],
              },
            ]}
          >
            <el-input
              maxlength={8}
              placeholder="请输入延长天数"
              v-model={formData.cycle_day}
              onInput={(val: string) => {
                const newVal = InputLimit.Interger(val);
                formData.cycle_day = newVal;
              }}
            ></el-input>
          </el-form-item>
        </el-form>
        <tg-mask-loading visible={this.saveReq.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
