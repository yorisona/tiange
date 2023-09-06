import { defineComponent, ref } from '@vue/composition-api';
import { useTemplateManager } from '@/modules/datacenter/multidimensional/commodity/use';
import { isEmpty } from '@/utils/func';
import { Message } from 'element-ui';
import { save_update_multidimensional_statistics_template } from '@/services/datacenter';
import { useRequest } from '@gm/hooks/ahooks';
import { Confirm } from '@/use/asyncConfirm';

type Template = ReturnType<typeof useTemplateManager>;
export default defineComponent({
  setup(props, ctx) {
    const template_name = ref();
    const selected = ref();
    const list = ref([]);
    let template: Template;
    const onSearch = () => {
      selected.value = null;
    };
    const reqSave = useRequest(save_update_multidimensional_statistics_template, {
      manual: true,
      onSuccess(res) {
        template.template_info.name = template_name.value;
        template.template_info.id = res.id;
        Message.success('保存成功');
        ctx.emit('submit');
        ctx.emit('close');
      },
    });
    const dialogSubmit = async () => {
      if (isEmpty(template_name.value)) {
        Message.warning('请填写模板名称');
        return;
      }
      const { formData, list } = template;
      if (list.length === 0) {
        Message.error('您还没有面板');
        return;
      }
      const params = {
        id: template.template_info.id,
        second_cid: formData.category,
        template_name: template_name.value,
        template_config: list.map(item => {
          return {
            latitude_list: item.formData.latitude_list
              .filter(it => !!it)
              .map(it => {
                const spt = it.split('_');
                return {
                  latitude_type: Number(spt[0]),
                  property_id: Number(spt[1]),
                };
              }),
            target_type: item.formData.target_type,
          };
        }),
      };
      params.template_config = params.template_config.filter(it => it.latitude_list.length > 0);

      const res = await save_update_multidimensional_statistics_template(params);

      if (res.data.error_code === 1001) {
        await Confirm('存在重名的模板，是否覆盖?');
        await reqSave.runAsync({ ...params, is_enforcement: 1 });
      } else if (!res.data.success) return Message.error(res.data.message);
      else if (res.data.success) {
        Message.success('保存成功');
        template.template_info.id = res.data.data.id;
        template.template_info.name = template_name.value;

        ctx.emit('submit');
        ctx.emit('close');
      }
    };

    const show = (temp: Template) => {
      template = temp;
      template_name.value = temp.template_info.name;
    };
    return {
      show,
      selected,
      list,
      template_name,
      onSearch,
      dialogSubmit,
    };
  },
  render() {
    return (
      <div class="dialog-template">
        <span class="title">模板名称</span>
        <el-input
          placeholder="请输入模版名称"
          type="textarea"
          rows={3}
          size="mini"
          autosize={false}
          resize={'none'}
          v-model={this.template_name}
        />
      </div>
    );
  },
});
