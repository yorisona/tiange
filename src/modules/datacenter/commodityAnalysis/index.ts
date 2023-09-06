/*
 * @Author: 肖槿
 * @Date: 2021-11-30 13:26:59
 * @Description: 商品分析
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-03-01 16:16:48
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\commodityAnalysis\index.ts
 */
import { defineComponent, ref, computed, provide, reactive, onMounted } from '@vue/composition-api';
import DataSwitch from '@/modules/datacenter/components/switch/index.vue';
import CompListOld from './components/list/indexOld.vue';
import CompList from './tab/index.vue';
import CompChart from './components/chart/index.vue';
import { CategoryReport, ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import moment from 'moment';
import formatPriceForm from '@/utils/formatData';
import { numberFormat } from '@/utils/formatMoney';
import {
  GetQueryDouyinReportProjects,
  GetCheckDouyinAccess,
  GetSystemCategoryReport,
} from '@/services/datacenter';
import { wait } from '@/utils/func';
const { formatPriceFormYuan } = formatPriceForm;
type accessType = {
  access_url: string;
  has_access: boolean;
};
import { ProjectStatusEnum } from '@/types/tiange/common';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  components: {
    DataSwitch,
    CompList,
    CompChart,
    CompListOld,
  },
  setup(props, ctx) {
    const activeIndex = ref(0);
    const curDate = ref<any>([]);
    const accessObj = ref<accessType>({
      access_url: '',
      has_access: true,
    });
    const handleCheckTab = (activeItem: number) => {
      activeIndex.value = activeItem;
    };
    const component = computed(() => {
      if (activeIndex.value === 0) {
        if (hasNewProject.value === 0) return '';
        else if (hasNewProject.value === 1) return 'CompList';
        else return 'CompListOld';
      } else return 'CompChart';
    });

    const saleTotal = ref<string | null | 0>('');
    const gmvTotal = ref<string>('');
    const searchParams = ref<ITabProps>({
      project_id: undefined,
      start_date: undefined,
      end_date: undefined,
    });
    const searchProjectName = ref<string>('');

    const form = reactive<ITabProps>({
      project_id: undefined,
      start_date: moment() as any,
      end_date: moment() as any,
    });
    const project_list = ref<
      { project_id: string; project_name: string; project_status: number; new_report: boolean }[]
    >([]);
    const hasNewProject = computed(() => {
      const project = project_list.value.find(
        it => it.project_id === searchParams.value.project_id,
      );
      if (project === undefined) return 0;
      else if (project.new_report === true) return 1;
      else return 2;
    });
    provide('searchParams', searchParams);
    provide('searchProjectName', searchProjectName);
    provide('hasNewProject', hasNewProject);

    const queryData = () => {
      return GetQueryDouyinReportProjects().then(res => {
        project_list.value = res.data.data.projects;
        return res.data.data;
      });
    };
    const getAccess = async () => {
      try {
        const {
          data: { data },
        } = await GetCheckDouyinAccess({
          project_id: form.project_id,
        });
        let projectName = '';
        project_list.value.map((item: any) => {
          if (item.project_id === form.project_id) {
            projectName = item.project_name;
          }
        });
        searchParams.value.project_id = form.project_id;
        searchProjectName.value = projectName;
        accessObj.value = data;
        search();
      } catch (error) {
        console.log(error);
      }
    };

    onMounted(() => {
      queryData().then(data => {
        if (form.project_id === undefined) {
          form.project_id = data.default.project_id;
          form.start_date = data.default.date;
          form.end_date = data.default.date;
          curDate.value = [data.default.date, data.default.date];
          search();
          getAccess();
          getDouyinCategoryReport(searchParams.value);
        }
      });
    });

    const pickerOptions = {
      disabledDate(time: Date) {
        return (
          time.getTime() > Date.now() ||
          // time.getTime() < Date.now() - 3600 * 1000 * 24 * 90 ||
          time.getTime() < new Date('2022/01/1 00:00:00').getTime()
        );
      },
    };
    const reset = () => {
      form.project_id = project_list.value[0].project_id;
      curDate.value = [];
    };
    const search = () => {
      const { project_id } = form;
      searchParams.value = {
        project_id,
        start_date: curDate.value[0],
        end_date: curDate.value[1],
      };
      getDouyinCategoryReport(searchParams.value);
    };

    const commodityRef = ref<any>();
    const onScroll = (e: number) => {
      commodityRef.value.scrollTop = e - 66;
    };
    const linkAccess = () => {
      window.open(accessObj.value.access_url);
    };
    const getReport = (res: any) => {
      const salCnt = res.reduce((total: number, current: any) => {
        return (total = total + current.sale_count);
      }, 0);
      const gmvCnt = res.reduce((total: number, current: any) => {
        return (total = total + current.gmv);
      }, 0);
      saleTotal.value = numberFormat(salCnt || 0, 0, '.', ',');
      gmvTotal.value = formatPriceFormYuan(gmvCnt / 100);
    };

    const baseData = ref({
      all_sale_amount: 0,
      all_sale_count: 0,
      all_shop_sale_amount: 0,
      all_shop_sale_count: 0,
    });
    const { business_type } = useProjectBaseInfo();
    const getDouyinCategoryReport = async (payload: CategoryReport) => {
      const [{ data: response }] = await wait(
        500,
        GetSystemCategoryReport(payload, business_type.value),
      );
      if (response.success) {
        const base = response.data;
        baseData.value.all_sale_amount = base.all_sale_amount;
        baseData.value.all_sale_count = base.all_sale_count;
        baseData.value.all_shop_sale_amount = base.all_shop_sale_amount;
        baseData.value.all_shop_sale_count = base.all_shop_sale_count;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };

    return {
      ProjectStatusEnum,
      form,
      linkAccess,
      getReport,
      search,
      reset,
      gmvTotal,
      project_list,
      curDate,
      saleTotal,
      searchParams,
      getAccess,
      pickerOptions,
      accessObj,
      component,
      handleCheckTab,
      activeIndex,
      commodityRef,
      onScroll,
      baseData,
      numberFormat,
      formatPriceFormYuan,
      hasNewProject,
    };
  },
});
