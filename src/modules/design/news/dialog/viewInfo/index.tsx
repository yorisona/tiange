import { defineComponent, ref } from '@vue/composition-api';

import { Query_Daily_Infos_News } from '@/services/daily_infos';
type IFormData = TG.HttpListResultType<typeof Query_Daily_Infos_News> & { count?: number };
export default defineComponent({
  setup(props, ctx) {
    const show = (value: any) => {
      formData.value = value;
      console.log('showValue', value);
    };

    const formData = ref<IFormData>({} as any);

    const onSaveBtnClick = async () => {
      ctx.emit('close');
    };

    return {
      onSaveBtnClick,
      show,
      formData,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="dialog-container">
        <div class="header">
          <div class="title">{formData.title}</div>
          <div class="description">
            <span class="label">来源：</span>
            <span class="form">{formData.source}</span>
            <span class="empty" />
            <i class="el-icon-time" />
            <span class="time">{formData.news_time}</span>
          </div>
        </div>
        <div class="content">{formData.content}</div>
        {formData.source_url && (
          <a class="source" href={formData.source_url} target="_blank">
            [查看原文]
          </a>
        )}
      </div>
    );
  },
});
