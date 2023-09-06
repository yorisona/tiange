import { defineComponent, ref } from '@vue/composition-api';
import { Query_Daily_Infos_News_NoAuth } from '@/services/daily_infos';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import { RouterNameExternal } from '@/const/router';
type IFormData = TG.HttpListResultType<typeof Query_Daily_Infos_News_NoAuth> & { count?: number };
const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
const today = moment();
export default defineComponent({
  beforeRouteUpdate(to, form, next) {
    next();
    this.date = moment(to.query.date as any);
    this.query();
  },
  setup(props, ctx) {
    const formData = ref<IFormData[]>([] as any);
    const router = useRouter();

    const onSaveBtnClick = async () => {
      ctx.emit('close');
    };
    const list = ref<any[]>([]);
    const date = ref(moment(router.currentRoute.query.date as any));
    const query = () => {
      Query_Daily_Infos_News_NoAuth({
        num: 1000000,
        news_time: date.value.format('YYYY-MM-DD'),
      }).then(res => {
        list.value = res.data.data.data;
      });
    };

    query();

    const changeDate = (num: number) => {
      const target = date.value.clone().add('day', num).format('YYYY-MM-DD');
      router.replace({
        name: RouterNameExternal.dailyInformation.default,
        query: {
          date: target,
        },
      });
    };

    const jumpToDetail = (id: string) => {
      router.push({
        name: RouterNameExternal.dailyInformation.detail,
        query: {
          id,
        },
      });
    };
    return {
      onSaveBtnClick,
      formData,
      date,
      list,
      changeDate,
      query,
      jumpToDetail,
    };
  },
  render() {
    const { date, list, changeDate, jumpToDetail } = this;
    return (
      <div class="dialog-container">
        <div class="scale-body">
          <div class="header">
            <div class="header-title">每日资讯</div>
            <div class="header-options">
              <div class="left" onclick={() => changeDate(-1)}>
                <tg-icon name="ico-arrow-left" />
              </div>
              <div class="date">
                <span class="year">{date.format('YYYY.MM.DD')}</span>
                <span class="week">星期{weekMap[date.day()]}</span>
              </div>
              <div class="right" onclick={() => changeDate(1)}>
                <tg-icon name="ico-arrow-right" />
              </div>
            </div>
          </div>
          <div class="content">
            {list.map(item => {
              const newsTime = moment(item.news_time);
              let time;
              if (newsTime.isSame(today, 'day')) {
                time = newsTime.format('HH:mm');
              } else {
                time = newsTime.format('MM-DD HH:mm');
              }
              return (
                <div class="new">
                  <div class="new-footer">
                    <div class="time">{time}</div>
                  </div>
                  <div class="title" onclick={() => jumpToDetail(item.id)}>
                    {item.title}
                  </div>
                  <div class="new-content">{item.content}</div>
                  <div class="line" />
                </div>
              );
            })}
            {list.length === 0 && <empty-common class="empty" />}
          </div>
        </div>
      </div>
    );
  },
});
