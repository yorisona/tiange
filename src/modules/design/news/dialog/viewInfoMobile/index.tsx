import { defineComponent, ref } from '@vue/composition-api';
import { Query_Daily_Infos_News } from '@/services/daily_infos';
import moment, { Moment } from 'moment';
type IFormData = TG.HttpListResultType<typeof Query_Daily_Infos_News> & { count?: number };
const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
export default defineComponent({
  setup(props, ctx) {
    const show = (value: IFormData[]) => {
      formData.value = value;
      if (value.length > 0) {
        titleData.value = moment(value[0].news_time);
      }
      console.log('showValue', value);
    };

    const formData = ref<IFormData[]>([] as any);
    const titleData = ref<Moment>(moment());

    const onSaveBtnClick = async () => {
      ctx.emit('close');
    };

    return {
      onSaveBtnClick,
      show,
      formData,
      titleData,
    };
  },
  render() {
    const { formData, titleData } = this;
    return (
      <div class="dialog-container">
        <div class="scale-body-container">
          <div class="scale-body">
            <div class="header">
              <div class="left" />
              <div class="date">
                <span class="day">{titleData.date()}</span>
                <span class="year">{titleData.format('YYYY.MM')}</span>
                <span class="week">星期{weekMap[titleData.day()]}</span>
              </div>
              <div class="right" />
            </div>
            <div class="content">
              {formData.map(item => {
                return (
                  <div class="new">
                    <div class="title">{item.title}</div>
                    <div class="new-content">{item.content}</div>
                    <div class="empty" />
                    <div class="new-footer">
                      <div class="form">{item.source}</div>
                      <div class="empty" />
                      <div class="time">{item.news_time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
