import { defineComponent, inject, Ref, ref, watch } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import {
  GetShopLivePutProjectStatisticsList,
  GetShopLivePutMergeStatistics,
} from '@/services/datacenter/shoplive';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import sunburst from '@/modules/datacenter/shoplive/components/sunburst/index.vue';
import lineDiv from '@/modules/datacenter/shoplive/components/put/line.vue';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  name: 'performancePutIndex',
  props: {
    performanceId: {
      type: Number,
      default: 0,
    },
    projectData: {
      type: Object,
      default: () => ({}),
    },
    merge_shop_live_id: {
      type: Number,
    },
  },
  components: {
    BaseEcharts,
    sunburst,
    lineDiv,
  },
  setup(props, ctx) {
    const projectDetail = ref({});
    const searchParams = (inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>) || ref({});
    const project_name = ref('');
    const loudouLoading = ref(false);
    const detail_obj = ref<any>({});
    const { business_type } = useProjectBaseInfo();
    const getOneProjectList = () => {
      loudouLoading.value = true;
      GetShopLivePutProjectStatisticsList(
        {
          is_from_project:
            props.performanceId === 0
              ? searchParams.value.is_from_project || false
              : props.projectData.from_project || false,
          start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
          end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
          project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
          merge_shop_live_id: props.merge_shop_live_id,
        },
        business_type.value,
      ).then(({ data }) => {
        loudouLoading.value = false;
        if (data.success) {
          detail_obj.value = data.data || {};
        } else {
          detail_obj.value = {};
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
      GetShopLivePutMergeStatistics(
        {
          is_from_project:
            props.performanceId === 0
              ? searchParams.value.is_from_project || false
              : props.projectData.from_project || false,
          start_date: props.performanceId === 0 ? searchParams.value.start_date : undefined,
          end_date: props.performanceId === 0 ? searchParams.value.end_date : undefined,
          project_id: props.performanceId === 0 ? searchParams.value.project_id : undefined,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
          merge_shop_live_id: props.merge_shop_live_id,
        },
        business_type.value,
      ).then(({ data }) => {
        if (data.success) {
          projectDetail.value = data.data || {};
        } else {
          projectDetail.value = {};
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    watch(
      () => [searchParams.value, props.performanceId, props.merge_shop_live_id],
      () => {
        project_name.value = '';
        detail_obj.value = {};
        getOneProjectList();
      },
    );
    getOneProjectList();
    return {
      projectDetail,
      project_name,
      formatAmount,
      loudouLoading,
      detail_obj,
    };
  },
});
