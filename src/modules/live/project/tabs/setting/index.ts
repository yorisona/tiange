import { defineComponent, inject } from '@vue/composition-api';
import SubTabs from '@/components/BusinessComponents/SubTabs/index.vue';
import settleAccounts from './settleAccounts/index.vue';
import inventoryMonitoring from './inventoryMonitoring/index.vue';
import { useRouter } from '@/use/vue-router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RouterNameProjectManage } from '@/const/router';
export default defineComponent({
  name: 'TgTabSetting',
  components: { SubTabs, comp1: settleAccounts, comp2: inventoryMonitoring },
  setup(_, ctx) {
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    /** 本地生活 */
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
          title: '项目设置',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    return {};
  },
});
