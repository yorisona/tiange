import { RouterDataCenter } from '../../../const/router';
import { computed, defineComponent, inject, onMounted, ref } from '@vue/composition-api';
import DataSwitch from '../components/switch/index.vue';
import SelectDate from '../components/selectDate/index.vue';
import DataCenterList from '../components/list/index.vue';
import DataCenterChart from './chart/index.vue';
import RelatedProject from '../components/relatedProject/index.vue';
import { GetDataCenterTable } from '../../../services/datacenter';
// import { BusinessType } from '@/const/common';
import { useRouter } from '@/use/vue-router';
import { BusinessType } from '@/const/common';

export default defineComponent({
  components: { DataSwitch, DataCenterList, DataCenterChart, SelectDate, RelatedProject },
  props: {
    /** 项目ID */
    id: {
      type: Number,
      required: true,
    },
    businessType: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    const activeIndex = ref(0);
    const dataList = ref<any>([]);
    const restDates = ref<string[]>([]);
    const routes = ref<any>([]);
    const selectedDateType = ref(0);
    const selectedDateValue = ref('');
    const projectName = ref<any>('');
    const selectDate = (dateType: number, dateValue: string) => {
      selectedDateType.value = dateType;
      selectedDateValue.value = dateValue;
      changeRoutes();
      GetDataCenterTable({
        business_type: props.businessType,
        the_date: dateValue,
        project_id: props.id,
      }).then(res => {
        const data = res.data;
        if (data.success) {
          dataList.value = data.data.data;
          restDates.value = data.data.rest_days;
        }
      });
    };
    const changeRoutes = () => {
      const router = useRouter();
      const { meta } = router.currentRoute;
      const activePath = meta?.activePath;

      const payload = {
        dateType: selectedDateType.value,
        dateValue: selectedDateValue.value,
        businessType: props.businessType,
      };
      let jumpRoute = '';
      let secondName = '';
      switch (activePath) {
        case '/datacenter/overview':
          jumpRoute = RouterDataCenter.dataGeneralization;
          secondName = '数据概况';
          break;
        case '/datacenter/taobao':
          jumpRoute = RouterDataCenter.dataTaobao;
          secondName = '淘宝店播';
          break;
        case '/datacenter/douyin':
          jumpRoute = RouterDataCenter.dataDouyin;
          secondName = '抖音店播';
          break;
        case '/datacenter/area':
          jumpRoute = RouterDataCenter.dataArea;
          secondName = '区域店播';
          break;
        case '/datacenter/mcn':
          jumpRoute = RouterDataCenter.dataMCN;
          secondName = '创新项目';
          break;
        case '/datacenter/taomarket':
          jumpRoute = RouterDataCenter.dataMarket;
          secondName = '整合营销';
          break;
      }
      routes.value = [
        // {
        //   name: jumpRoute,
        //   title: '数据中心',
        //   query: payload,
        // },
        {
          name: jumpRoute,
          title: secondName,
          query: payload,
        },
        {
          path: '',
          title: '项目数据',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes.value);
    };

    const isDouyinData = computed(() => {
      const router = useRouter();
      const { businessType } = router.currentRoute.params;
      return businessType === `${BusinessType.Douyin}`;
    });

    onMounted(() => {
      if (ctx.root.$route.query.projectName !== undefined) {
        projectName.value = ctx.root.$route.query.projectName;
      }
      changeRoutes();
    });
    return {
      isDouyinData,
      activeIndex,
      dataList,
      restDates,
      selectDate,
      selectedDateType,
      projectName,
    };
  },
});
