import { defineComponent, ref } from '@vue/composition-api';
import styles from './index.module.less';
import { Save_Indicator_Tag } from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref({
      name: undefined,
      id: undefined,
    });
    const show = (value: any) => {
      if (value) {
        formData.value = {
          name: value.name,
          id: value.tag_id,
        };
      }
    };
    const reqSaveTag = useRequest(Save_Indicator_Tag, { manual: true });
    const onSaveBtnClick = () => {
      if (formData.value.name === undefined) return;
      if (/^\s*$/.test(formData.value.name)) return;
      reqSaveTag.runAsync(formData.value as any).then(() => {
        Message.success('新增成功');
        ctx.emit('close');
        ctx.emit('submit');
      });
    };
    return { formData, onSaveBtnClick, show, reqSaveTag };
  },
  render() {
    return (
      <div class={styles.DialogContainer}>
        <el-form size="mini" show-message={false} hide-required-asterisk={true} labelPosition="top">
          <el-form-item label="标签名称">
            <el-input
              placeholder="请输入标签名称"
              v-model={this.formData.name}
              style="width:100%"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
