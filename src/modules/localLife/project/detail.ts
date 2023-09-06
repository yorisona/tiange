import { defineComponent, inject, onBeforeMount, provide, ref } from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';
import { LiveProject } from '@/types/tiange/live.project';
import { GetLiveProjectDetail } from '@/services/live.project';
import { usePermission } from '@/use/permission';
import { useRouter } from '@/use/vue-router';
import { QueryInProjectTeam } from '@/services/live';

export default defineComponent({
  props: {
    /** 项目ID */
    id: {
      type: Number,
      required: true,
    },
    tab: {
      type: String,
    },
    calendar: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id =
      router.currentRoute.params.project_id ||
      router.currentRoute.params.id ||
      router.currentRoute.query.id + '';
    const permission = usePermission();
    const loading = ref<boolean>(false);
    const inProject = ref<boolean | undefined>(undefined);

    const project = ref<LiveProject | undefined>(undefined);

    const routes = [
      {
        name: RouterNameProjectManage.live.project.list,
        title: '项目管理',
      },
      {
        path: '',
        title: '项目详情',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    provide('project', project);
    /** 供项目结算专用以区分项目类型 */
    provide('live_project', project);
    // 注入项目详情
    provide('project3in1', project);

    const methods = {
      queryInProjectTeam: async () => {
        loading.value = true;
        const res = await QueryInProjectTeam(project_id, E.project.BusinessType.locallife);
        loading.value = false;
        if (res.data.success) {
          inProject.value = res.data.data.in_project ? true : false;
          if (inProject.value) {
            methods.getDetail();
          }
        }
      },
      getDetail: async () => {
        const { data: response } = await GetLiveProjectDetail(
          project_id,
          E.project.BusinessType.locallife,
        );
        project.value = response.data;
        //存入本地项目详情
        localStorage.setItem('project3Live', JSON.stringify(project));
      },
    };

    onBeforeMount(async () => {
      // tabs.checkedTab.value = ctx.root.$route.params.tab
      await methods.queryInProjectTeam();
    });
    const editProjectReload = () => {
      methods.getDetail();
    };
    return {
      editProjectReload,
      loading,
      project,
      inProject,
      routes,
      permission,
      ...methods,
    };
  },
});
