import { defineComponent, inject } from '@vue/composition-api';
import LiveCalendar from '../../components/liveSchedule/index.vue';
import { RouterNameProjectManage } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
export default defineComponent({
  components: { LiveCalendar },

  setup(_, ctx) {
    // const project_id = ctx.root.$route.params.id || '';
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
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
          title: '直播场次',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }

    return {};
  },
});
