import {
  computed,
  defineComponent,
  inject,
  onBeforeMount,
  provide,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import getRectHeightData from '@/utils/autoHeight';
import { useList } from './use/detailList';
import { RouterDataCenter } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import Monitor from './dialog/monitor.vue';
import { IHotCommodityParams } from '@/types/tiange/datacenter';

const routes = [
  {
    name: RouterDataCenter.hotSaleMonitor,
    title: '全网热销监控',
  },
  {
    path: '',
    title: '项目详情',
  },
];

export default defineComponent({
  name: 'TgHotSaleMonitorDetail',
  components: {
    Monitor,
  },

  setup(props, ctx) {
    const { tableHeightLogic } = getRectHeightData();
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const project_name = router.currentRoute.params.project_name;
    routes[1].title = project_name;
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const monitorVisible = ref(false);
    provide('project_id', project_id);

    const queryForm = reactive<IHotCommodityParams>({
      project_id: parseInt(project_id, 10),
      date: moment(new Date()).format('YYYY-MM-DD'),
      page_num: 1,
      num: 20,
    });

    const dayStep = ref<number>(0);
    const displayDate = computed(() => {
      const date = new Date();
      date.setDate(date.getDate() + dayStep.value);
      return date;
    });

    const showMonitorDialog = () => {
      monitorVisible.value = true;
    };

    watch(
      () => displayDate.value,
      val => {
        const day = moment(val).format('YYYY-MM-DD');
        queryForm.date = day;
        reload();
      },
    );

    const methods = {
      formatDouble: (num: number) => {
        if (num < 10) {
          return `0${num}`;
        }
        return num;
      },
      onPrevDay: () => {
        methods.getNewDate(-1);
      },
      onNextDay: () => {
        methods.getNewDate(1);
      },
      getNewDate: (step: number) => {
        dayStep.value += step;
      },
    };

    const currentDay = computed(() => {
      return `${displayDate.value.getFullYear()}年${methods.formatDouble(
        displayDate.value.getMonth() + 1,
      )}月${methods.formatDouble(displayDate.value.getDate())}日`;
    });

    const listLogic = useList(ctx);
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.page_num = 1;
      }
      await listLogic.loadData(queryForm);
    };

    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.num = num;
      reload();
    };
    onBeforeMount(() => {
      reload();
    });

    return {
      reload,
      ...tableHeightLogic,
      queryForm,
      handleCurrentChange,
      handlePageSizeChange,
      ...listLogic,
      ...methods,
      currentDay,
      monitorVisible,
      showMonitorDialog,
    };
  },
});
