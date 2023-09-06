import { defineComponent, ref } from '@vue/composition-api';
import styles from './index.module.less';
import { Modify_Move_Indicator_Tag, Query_Indicator_Tag } from '@/services/performance';
import { useRequest } from '@gm/hooks/ahooks';
import { Select } from '@gm/component/select';
import { Message } from 'element-ui';
export default defineComponent({
  setup(props, ctx) {
    const reqTag = useRequest(Query_Indicator_Tag, {
      transform(data) {
        return data.map(it => ({
          label: it.name,
          value: it.tag_id,
        }));
      },
    });
    const reqSubmit = useRequest(Modify_Move_Indicator_Tag, { manual: true });
    const tag_id = ref<number>();
    const indicators = ref<NPerformance.Indicators[]>([]);
    const show = (value: NPerformance.Indicators[]) => {
      indicators.value = value;
      console.log('value', value);
    };
    const onSaveBtnClick = () => {
      if (tag_id.value === undefined) {
        Message.error('请选择标签');
        return;
      }
      const params = indicators.value.map(it => ({
        indicator_id: it.id,
        old_tag_id: it.tag_id ?? 0,
        tag_id: tag_id.value as number,
      }));
      reqSubmit.runAsync(params).then(() => {
        Message.success('移动成功');
        ctx.emit('close');
        ctx.emit('submit');
      });
    };
    return { reqTag, tag_id, onSaveBtnClick, show };
  },
  render() {
    return (
      <div class={styles.DialogContainer}>
        <el-form size="mini" show-message={false} hide-required-asterisk={true} labelPosition="top">
          <el-form-item label="标签名称">
            <Select
              popper-class="el-select-popper-mini"
              options={this.reqTag.data as any}
              v-model={this.tag_id}
              style="width:100%"
            />
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
