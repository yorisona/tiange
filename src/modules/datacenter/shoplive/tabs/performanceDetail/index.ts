import { computed, defineComponent, inject, ref } from '@vue/composition-api';
import shopIndex from '@/modules/datacenter/shoplive/components/performance/shop/index.vue';
import performanceFlowIndex from '@/modules/datacenter/shoplive/components/performance/flow/index.vue';
import performanceCrowdIndex from '@/modules/datacenter/shoplive/components/performance/crowd/index.vue';
import commentaryIndex from '@/modules/datacenter/shoplive/components/performance/commentary/index.vue';
import performancePutIndex from '@/modules/datacenter/shoplive/components/performance/put/index.vue';
import performanceIndex from '@/modules/datacenter/shoplive/components/performance/index.vue';
import { useRefTabs } from '@/use/tab';
import { useRouter } from '@/use/vue-router';
import { RouterDataCenter } from '@/const/router';

export default defineComponent({
  name: 'performanceDetail',
  components: {
    performanceIndex,
    shopIndex,
    performanceFlowIndex,
    performanceCrowdIndex,
    performancePutIndex,
    commentaryIndex,
  },
  setup(props, ctx) {
    const router = useRouter();
    const from_project: boolean = router.currentRoute.query.from_project === '1';
    const routes = [
      { title: '品牌中心', name: RouterDataCenter.shopLive },
      {
        title: '项目详情',
        name: RouterDataCenter.dataItemDetail,
        params: {
          id: router.currentRoute.query.project_id,
        },
      },
      { title: '场次复盘' },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);

    const performanceId = router.currentRoute.params.id;
    console.log('performanceId', performanceId);

    const selectIndex = ref(0);
    const switchComponents = [
      shopIndex.name,
      performanceFlowIndex.name,
      performanceCrowdIndex.name,
      performancePutIndex.name,
      commentaryIndex.name,
    ];
    const tabs = useRefTabs(
      computed(() => {
        const tabList = [
          {
            label: '商品',
            value: 0,
          },
        ];
        tabList.push({
          label: '流量',
          value: 1,
        });
        tabList.push({
          label: '粉丝',
          value: 2,
        });
        tabList.push({
          label: '投放',
          value: 3,
        });
        tabList.push({
          label: '批注',
          value: 4,
        });
        return tabList;
      }),
      selectIndex,
    );

    const project_name = router.currentRoute.query.project_name;
    const projectData = ref<any>({
      from_project: from_project,
      project_id: Number(router.currentRoute.query.project_id),
      project_name: project_name,
    });
    const getProjectDeatil = (val: any) => {
      projectData.value = val;
      projectData.value.project_id = Number(router.currentRoute.query.project_id);
      projectData.value.project_name = project_name;
      projectData.value.from_project = from_project;
      console.log('projectData', projectData.value);
    };
    const updata = ref(false);
    const upDataProjectDeatil = () => {
      updata.value = !updata.value;
    };
    return {
      updata,
      upDataProjectDeatil,
      projectData,
      getProjectDeatil,
      ...tabs,
      performanceId,
      switchComponents,
      selectIndex,
      fixed: false,
    };
  },
  mounted() {
    this.onRefresh();
    window.addEventListener('scroll', this.fixedActiveBtn, true);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.fixedActiveBtn, true);
  },
  methods: {
    fixedActiveBtn(e: any) {
      const scrollTop =
        e.target.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
      const classname = String(e.target.className || '');
      if (scrollTop === 0 && this.fixed === true) {
        return;
      }
      /*
      if (this.fixed === false && scrollTop === 0) {
        this.selectFixed = false;
        return;
      }*/
      if (
        classname.indexOf('el-table') < 0 &&
        classname.indexOf('main-table') < 0 &&
        classname.indexOf('el-props') < 0 &&
        classname.indexOf('el-scrollbar__wrap') < 0
      ) {
        scrollTop >= 700 ? (this.fixed = true) : (this.fixed = false);
        scrollTop >= 700 ? (this.selectFixed = true) : (this.selectFixed = false);
      }
      if (this.fixed === false || scrollTop === 0) {
        this.selectFixed = false;
        return;
      }
    },
    onTabChange(item: { label: string; value: number }) {
      this.selectIndex = item.value;
      if (this.fixed) {
        this.$nextTick(() => {
          const container: any = document.getElementsByClassName('performance-div');
          container[0].scrollTop = 720;
          container[0].scrollLeft = 0;
        });
      }
    },
    onRefresh() {
      const container: any = document.getElementsByClassName('performance-div');
      container[0].scrollTop = 0;
      container[0].scrollLeft = 0;
    },
  },
});
