import { defineComponent, ref, watch } from '@vue/composition-api';
import LineEcharts from '../../components/line/index.vue';
import pieEcharts from '../../components/pie/index.vue';
import TopFive from '../../components/topFive/index.vue';
import { GetDataCenterChart } from '@/services/datacenter';
import { BusinessType, ChartType } from '@/const/common';
import { numberFormat } from '@/utils/formatMoney';

export default defineComponent({
  components: {
    LineEcharts,
    pieEcharts,
    TopFive,
  },
  props: {
    currentDate: {
      type: String,
      default: null,
    },
  },
  setup(props, ctx) {
    watch(
      () => props.currentDate,
      () => {
        getData();
      },
    );

    const summaryData = ref({});
    const IncomeAmountPercentData = ref([]);
    const IncomeAmountPercentLoading = ref<boolean>(true);
    const IncomeAmountTrend = ref({ date: [], data: [], loading: true });
    const NetSalesAmountTrend = ref({ date: [], data: [], loading: true });
    const CommissonAmountTrend = ref({ date: [], data: [], loading: true });
    const GmvTrend = ref({ date: [], data: [], loading: true });
    const GmvPercentData = ref([]);
    const GmvPercentLoading = ref<boolean>(true);
    const LiveEffectTrend = ref({
      live_add_fans: { date: [], data: [] },
      live_time: { date: [], data: [] },
      top_online: { date: [], data: [] },
      stay_time: { date: [], data: [] },
    });
    const LiveEffectLoading = ref<boolean>(true);

    const defaultTag = ref<string>('live_add_fans');
    const tagList = ref<any>([
      {
        label: '直播增粉',
        value: 'live_add_fans',
      },
      {
        label: '直播时长',
        value: 'live_time',
      },
      {
        label: '同时最高在线人数',
        value: 'top_online',
      },
      {
        label: '用户停留时长',
        value: 'stay_time',
      },
    ]);
    const handleTagFilter = (value: string) => {
      defaultTag.value = value;
    };

    const getData = () => {
      // 汇总数据
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.Summary, // 图表类型
      }).then((res: any) => {
        if (res.data && res.data.success) {
          summaryData.value = res.data.data[0];
        }
      });

      // 到账金额变化
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.IncomeAmount, // 图表类型
      }).then((res: any) => {
        IncomeAmountTrend.value.loading = false;
        if (res.data && res.data.success) {
          IncomeAmountTrend.value.date = res.data.data.dates;
          IncomeAmountTrend.value.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // 各项目到账金额占比
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.IncomeAmountPercent, // 图表类型
      }).then((res: any) => {
        IncomeAmountPercentLoading.value = false;
        if (res.data && res.data.success) {
          IncomeAmountPercentData.value = res.data.data.lists.map((item: any) => {
            const new_item = Object();
            new_item.name = item.project_name ?? '--';
            new_item.value = item.values[0];
            return new_item;
          });
        }
      });

      // 预估净销额趋势
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.NetSalesAmount, // 图表类型
      }).then((res: any) => {
        NetSalesAmountTrend.value.loading = false;
        if (res.data && res.data.success) {
          NetSalesAmountTrend.value.date = res.data.data.dates;
          NetSalesAmountTrend.value.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // 预估佣金趋势
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.CommissionAmount, // 图表类型
      }).then((res: any) => {
        CommissonAmountTrend.value.loading = false;
        if (res.data && res.data.success) {
          CommissonAmountTrend.value.date = res.data.data.dates;
          CommissonAmountTrend.value.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // GMV变化趋势
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.Gmv, // 图表类型
      }).then((res: any) => {
        GmvTrend.value.loading = false;
        if (res.data && res.data.success) {
          GmvTrend.value.date = res.data.data.dates;
          GmvTrend.value.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // 各项目GMV占比
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.GmvPercent, // 图表类型
      }).then((res: any) => {
        GmvPercentLoading.value = false;
        if (res.data && res.data.success) {
          GmvPercentData.value = res.data.data.lists.map((item: any) => {
            const new_item = Object();
            new_item.name = item.project_name ?? '--';
            new_item.value = item.values[0];
            return new_item;
          });
        }
      });

      // 直播增粉
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.NewFansCount, // 图表类型
      }).then((res: any) => {
        LiveEffectLoading.value = false;
        if (res.data && res.data.success) {
          LiveEffectTrend.value.live_add_fans.date = res.data.data.dates;
          LiveEffectTrend.value.live_add_fans.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // 直播时长
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.LiveDuration, // 图表类型
      }).then((res: any) => {
        LiveEffectLoading.value = false;
        if (res.data && res.data.success) {
          LiveEffectTrend.value.live_time.date = res.data.data.dates;
          LiveEffectTrend.value.live_time.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // 同时最高在线人数
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.MaxUv, // 图表类型
      }).then((res: any) => {
        LiveEffectLoading.value = false;
        if (res.data && res.data.success) {
          LiveEffectTrend.value.top_online.date = res.data.data.dates;
          LiveEffectTrend.value.top_online.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });

      // 用户停留时长
      GetDataCenterChart({
        business_type: BusinessType.Taobao, // 业务类型
        the_date: props.currentDate, // 日期或年份数字
        chart_type: ChartType.AvgStay, // 图表类型
      }).then((res: any) => {
        LiveEffectLoading.value = false;
        if (res.data && res.data.success) {
          LiveEffectTrend.value.stay_time.date = res.data.data.dates;
          LiveEffectTrend.value.stay_time.data = res.data.data.lists.map((item: any) => {
            item.name = item.project_name ?? '--';
            item.smooth = true;
            item.showSymbol = true;
            item.type = 'line';
            item.data = item.values;
            return item;
          });
        }
      });
    };

    getData();

    return {
      summaryData,
      IncomeAmountTrend,
      IncomeAmountPercentData,
      IncomeAmountPercentLoading,
      NetSalesAmountTrend,
      CommissonAmountTrend,
      GmvTrend,
      GmvPercentData,
      GmvPercentLoading,
      LiveEffectTrend,
      LiveEffectLoading,

      tagList,
      defaultTag,
      handleTagFilter,
      numberFormat,
    };
  },
});
