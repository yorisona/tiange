/*
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: 表格
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 10:38:45
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.ts
 */
import { defineComponent, ref, SetupContext, computed } from '@vue/composition-api';
import DataSwitch from '@/modules/datacenter/components/switch/index.vue';
import SelectDate from '@/modules/datacenter/components/selectDate/index.vue';
import DataCenterList from '@/modules/datacenter/components/list/index.vue';
import DataCenterChart from '../chart/index.vue';
import {
  GetDataCenterTable,
  GetDataCenterChart,
  GetCommonProjectList,
} from '@/services/datacenter';
import { DataCenterTableParams } from '@/types/tiange/datacenter';
import { BusinessType, ChartType } from '@/const/common';
import { RouterDataCenter } from '@/const/router';
import RelatedProject from '@/modules/datacenter/components/relatedProject/index.vue';
import { useRouter } from '@/use/vue-router';
const useList = (ctx: SetupContext) => {
  const tableLoading = ref<boolean>(true);
  const chartLoading = ref<boolean>(false);
  const dataList = ref<string[]>([]);
  const project_list = ref<any>([]);
  // 汇总数据
  const summaryData = ref({});
  // gmv变化趋势
  const gmvData = ref<any>({
    dates: [],
    lists: [],
  });
  // 各项目GMV占比
  const gmvRateData = ref([]);
  // 运营费用趋势
  const operatingData = ref({
    dates: [],
    lists: [],
  });
  // 直播场次变化
  const sessionData = ref({
    dates: [],
    lists: [],
  });
  // 开播主播数变化
  const liverNumData = ref({
    dates: [],
    lists: [],
  });
  const getData = async (payload: DataCenterTableParams) => {
    tableLoading.value = true;
    const { data } = await GetDataCenterTable({ ...payload, platform_type: 2 });
    if (data.success) {
      dataList.value = data.data.data;
    } else {
      ctx.root.$message.error(data.message);
    }
    tableLoading.value = false;
  };
  const getChartData = async (payload: any, types: number[]) => {
    chartLoading.value = true;
    const allChartsPromise = types.map(btype =>
      GetDataCenterChart({
        ...payload,
        platform_type: 2,
        chart_type: btype,
      }),
    );
    const res: any = await Promise.all(allChartsPromise);
    if (res.length > 0) {
      summaryData.value = res[0].data.data; // 汇总数据
      gmvData.value = res[1].data.data; // gmv变化趋势
      if (gmvData.value) {
        gmvData.value.lists = res[1].data.data
          ? res[1].data.data.lists.map((item: any) => {
              return {
                smooth: true,
                showSymbol: true,
                type: 'line',
                name: item.project_name ?? '--',
                data: item.values,
              };
            })
          : [];
      }
      // 各项目GMV占比 value: item.values && item.values[0],
      gmvRateData.value = res[2].data.data
        ? res[2].data.data.lists.map((item: any) => {
            return {
              name: item.project_name ?? '--',
              value: item.values,
            };
          })
        : [];
      operatingData.value = res[3].data.data; // 运营费用趋势
      if (operatingData.value) {
        operatingData.value.lists = res[3].data.data
          ? res[3].data.data.lists.map((item: any) => {
              return {
                smooth: true,
                showSymbol: true,
                type: 'line',
                name: item.project_name ?? '--',
                data: item.values,
              };
            })
          : [];
      }
      sessionData.value = res[4].data.data; // 直播场次变化
      if (sessionData.value) {
        sessionData.value.lists = res[4].data.data
          ? res[4].data.data.lists.map((item: any) => {
              return {
                smooth: true,
                showSymbol: true,
                type: 'line',
                name: item.project_name ?? '--',
                data: item.values,
              };
            })
          : [];
      }
      liverNumData.value = res[5].data.data; // 开播主播数变化
      if (liverNumData.value) {
        liverNumData.value.lists = res[5].data.data
          ? res[5].data.data.lists.map((item: any) => {
              return {
                smooth: true,
                showSymbol: true,
                type: 'line',
                name: item.project_name ?? '--',
                data: item.values,
              };
            })
          : [];
      }
    }
    chartLoading.value = false;
  };
  const getMcnProjectList = async (end_date: string) => {
    const payload = {
      business_type: 5,
      data_type: 2,
      page_num: 1,
      num: 1000000,
      platform_type: 2,
      end_date,
    };
    const { data } = await GetCommonProjectList(payload);
    if (data.success) {
      project_list.value = data.data.data;
      project_list.value.forEach((item: any) => {
        item.title = item.project_name;
      });
    } else {
      ctx.root.$message.error(data.message);
    }
  };
  return {
    getData,
    tableLoading,
    dataList,
    chartLoading,
    getChartData,
    operatingData,
    sessionData,
    liverNumData,
    summaryData,
    gmvData,
    project_list,
    gmvRateData,
    getMcnProjectList,
  };
};
export default defineComponent({
  components: { DataSwitch, DataCenterList, SelectDate, RelatedProject, DataCenterChart },
  setup(_, ctx) {
    const mcnLogic = useList(ctx);
    const activeIndex = ref<number>(0);
    const project_id = ref<any>('');
    const project_id_filter = ref<string>('');
    let theDate = '';
    const selectedDateType = ref(0);
    const handleCheckTab = (activeItem: number) => {
      activeIndex.value = activeItem;
    };
    const project_list_filter = computed(() => {
      if (project_id_filter.value.substr(0, 3).toLocaleUpperCase() === 'MCN') {
        return mcnLogic.project_list.value.filter((item: any) => {
          return item.project_uid.includes(project_id_filter.value.toLocaleUpperCase());
        });
      } else {
        return mcnLogic.project_list.value.filter((item: any) => {
          return item.project_name.includes(project_id_filter.value);
        });
      }
    });
    const selectDate = (dateType: number, dateValue: string) => {
      selectedDateType.value = dateType;
      theDate = dateValue;
      mcnLogic.getData({
        business_type: BusinessType.Mcn,
        the_date: dateValue,
      });
      mcnLogic.getChartData(
        {
          business_type: BusinessType.Mcn,
          the_date: theDate,
        },
        [
          ChartType.Summary,
          ChartType.Gmv,
          ChartType.GmvPercent,
          ChartType.OperatingAmount,
          ChartType.LiveCount,
          ChartType.AnchorCount,
        ],
      );
      mcnLogic.getMcnProjectList(theDate);
    };
    const viewDetail = (project: any) => {
      const router = useRouter();
      const { meta } = router.currentRoute;
      ctx.root.$router.push({
        name:
          meta?.activePath === '/datacenter/overview'
            ? RouterDataCenter.dataGeneralizationProject
            : RouterDataCenter.dataMCNProject,
        params: { id: project.id, businessType: '' + BusinessType.Mcn },
        query: {
          dateType: '' + selectedDateType.value,
          dateValue: theDate,
          projectName: project.title,
        },
      });
    };
    const onEnterPressSearch = () => {
      project_id_filter.value = project_id.value;
    };
    return {
      activeIndex,
      handleCheckTab,
      selectDate,
      selectedDateType,
      project_id,
      onEnterPressSearch,
      viewDetail,
      project_list_filter,
      ...mcnLogic,
    };
  },
});
