import { defineComponent, ref, nextTick } from '@vue/composition-api';
import { Query_Daily_Infos_News_NoAuth } from '@/services/daily_infos';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';
import { RouterNameExternal } from '@/const/router';
const today = moment();
export default defineComponent({
  beforeRouteUpdate(to, form, next) {
    next();
    this.query(to.query.id as any);
  },
  setup(props, ctx) {
    const formData = ref<any>({} as any);
    const prev = ref(0);
    const next = ref(0);
    const router = useRouter();
    const currentId = ref(0);

    const onSaveBtnClick = async () => {
      ctx.emit('close');
    };
    const list = ref<any[]>([]);
    const date = ref(moment(router.currentRoute.query.date as any));
    const query = (id: number) => {
      Query_Daily_Infos_News_NoAuth({
        id,
      }).then((res: any) => {
        if (res.data.data.data.length === 0) throw new Error('资讯不存在');
        formData.value = res.data.data.data[0] as any;
        prev.value = res.data.data.previous;
        next.value = res.data.data.next;
        currentId.value = formData.value.id;
        queryList(moment(formData.value.grab_time).format('YYYY-MM-DD'));
      });
    };
    const currentDate = ref('');
    const queryList = (date: string) => {
      currentDate.value = date;
      Query_Daily_Infos_News_NoAuth({
        news_time: date,
        num: 1000,
      }).then((res: any) => {
        const data: any[] = res.data.data.data;
        list.value = data;
        nextTick(() => {
          const dom: HTMLElement = document.querySelector(
            `.new[data-id="${currentId.value}"]`,
          ) as HTMLElement;
          const container = document.querySelector('.side .content');
          if (!dom || !container) return;
          container.scrollTop = dom.offsetTop - 10;
        });
      });
    };
    const jumpToList = () => {
      router.push({
        name: RouterNameExternal.dailyInformation.default,
        query: {
          date: currentDate.value,
        },
      });
    };

    query(router.currentRoute.query.id as any);

    const changeDate = (num: number) => {
      const target = date.value.clone().add('day', num).format('YYYY-MM-DD');
      router.replace({
        name: RouterNameExternal.dailyInformation.default,
        query: {
          date: target,
        },
      });
    };

    const jumpToDetail = (id: any) => {
      router.replace({
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
      jumpToList,
      next,
      prev,
      currentId,
    };
  },
  render() {
    const { formData, prev, next, jumpToDetail, list, jumpToList, currentId } = this;
    return (
      <div class="dialog-container">
        <div class="dialog-container-body">
          <div class="news-body">
            <div class="header">
              <div class="title">{formData.title}</div>
              <div class="description">
                <span>来源：</span>
                <span class="form">{formData.source}</span>
                <span class="empty" />
                <i class="el-icon-time" />
                <span class="time">{formData.news_time}</span>
              </div>
            </div>
            <div class="content">{formData.content}</div>
            <div class="source">
              {formData.origin_url && (
                <a href={formData.origin_url} target="_blank">
                  [查看原文]
                </a>
              )}
            </div>
          </div>
          <div class="side">
            <div class="hot-news">
              <div class="hot-news-title">每日资讯</div>
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
                    <div class="new" data-id={item.id}>
                      <div class="new-footer">
                        <div class="time">{time}</div>
                      </div>
                      <div
                        class={`title ${item.id === currentId && 'active'}`}
                        onclick={() => jumpToDetail(item.id)}
                      >
                        {item.title}
                      </div>
                      <div class="line" />
                    </div>
                  );
                })}
              </div>
              {list.length === -1 && (
                <div class="more" onClick={jumpToList}>
                  查看更多
                </div>
              )}
            </div>
          </div>
        </div>
        {(prev !== 0 || next !== 0) && (
          <div class="footer">
            <div class="btns">
              <button disabled={prev === 0} onClick={() => jumpToDetail(prev)}>
                上一篇
              </button>
              <button disabled={next === 0} onClick={() => jumpToDetail(next)}>
                下一篇
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
});
