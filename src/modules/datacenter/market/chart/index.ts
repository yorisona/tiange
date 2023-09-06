import { defineComponent, ref, watch } from '@vue/composition-api';
import LineEcharts from '../../components/line/index.vue';
import pieEcharts from '../../components/pie/index.vue';
import { GetDataCenterChart } from '@/services/datacenter';
import { numberMoneyFormat } from '@/utils/formatMoney';

export default defineComponent({
  props: {
    currentDate: {
      type: String,
      default: null,
    },
  },
  components: {
    LineEcharts,
    pieEcharts,
  },
  setup(props, ctx) {
    watch(
      () => props.currentDate,
      () => {
        getData();
      },
    );

    const dateLineList = ref<any>([]);
    const dataLineList = ref<any>([]);
    const dataLineLoading = ref<boolean>(true);
    const pieData = ref<any>([]);
    const pieDataLoading = ref<boolean>(true);
    const chartTotal = ref<{ name: string; value: string }[]>([]);
    const getData = () => {
      if (props.currentDate === null) return;
      dataLineLoading.value = true;
      pieDataLoading.value = true;

      GetDataCenterChart({
        business_type: 1,
        the_date: props.currentDate,
        chart_type: 10,
      }).then((res: any) => {
        dataLineLoading.value = false;
        if (res.data.success !== true) return;
        const data = res.data.data;
        dateLineList.value = data.dates;
        dataLineList.value = data.lists.map((item: any) => {
          return {
            smooth: true,
            showSymbol: true,
            type: 'line',
            name: item.project_name,
            data: item.values,
          };
        });
      });

      // 各项目到账金额占比
      GetDataCenterChart({
        business_type: 1,
        the_date: props.currentDate,
        chart_type: 13,
      }).then((res: any) => {
        pieDataLoading.value = false;
        if (res.data.success !== true) return;
        const data = res.data.data;
        pieData.value = data.lists.map((item: any) => {
          return {
            name: item.project_name,
            value: item.values && item.values[0],
          };
        });
      });

      // 数据汇总
      GetDataCenterChart({
        business_type: 1,
        the_date: props.currentDate,
        chart_type: 0,
      }).then((res: any) => {
        if (res.data.success !== true) return;
        const data = res.data.data;
        chartTotal.value = data.map((item: any) => {
          item.name = '到账金额';
          item.value = numberMoneyFormat(item['到账金额'], 2).replace('￥', '');
          return item;
        });
      });
    };
    getData();
    return {
      dateLineList,
      dataLineList,
      dataLineLoading,
      pieData,
      pieDataLoading,
      chartTotal,
    };
  },
});
