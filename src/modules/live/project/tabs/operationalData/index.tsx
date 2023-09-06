import { defineComponent, h, inject, provide, watch } from '@vue/composition-api';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RouterNameProjectManage } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { useRefTabs } from '@/use/tab';
import projectDaily from './tabs/projectDaily.vue';
import operatingData from './tabs/operatingData.vue';
import sessionReview from './tabs/sessionReview.vue';
import goodsAnalysis from './tabs/goodsAnalysis.vue';

export default defineComponent({
  components: {
    projectDaily,
    operatingData,
    sessionReview,
    goodsAnalysis,
  },
  setup(props, ctx) {
    // 时间区间
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    provide('project_id', project_id);
    // 头部路由
    const { isFromLocalLife, isFromLiveDouyin } = useProjectBaseInfo();
    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      const routes = [
        {
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.project.list
            : RouterNameProjectManage.live.project.list,
          title: '项目管理',
        },
        {
          // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.detail.info
            : RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: project_id,
            tab: 'projectInfo',
            liveType: 'calendar',
          },
          title: '项目详情',
        },
        {
          path: '',
          title: '运营数据',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    const { checkedTab, tabs } = useRefTabs(
      [
        { label: '每日明细', value: 'projectDaily' },
        { label: '经营数据', value: 'operatingData' },
        { label: '场次复盘', value: 'sessionReview' },
        // { label: '周月复盘', value: 'weekMonthReview' },
        // { label: '主播分析', value: 'anchorAnalysis' },
        { label: '货盘分析', value: 'goodsAnalysis' },
      ],
      router.currentRoute.query?.tab || 'projectDaily',
    );
    watch(
      () => checkedTab.value,
      val => {
        router.push({
          query: {
            tab: val.toString(),
          },
        });
      },
    );
    // 监听路由变化
    // router.beforeEach((to, from, next) => {});
    return {
      project_id,
      tabs,
      checkedTab: checkedTab as any,
    };
  },
  render() {
    return (
      <div class="tg-datacenter-shoplive">
        <tg-tabs tabs={this.tabs} v-model={this.checkedTab} class="tabs"></tg-tabs>
        <this.checkedTab></this.checkedTab>
      </div>
    );
  },
});
