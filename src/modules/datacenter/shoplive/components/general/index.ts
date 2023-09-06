/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-29 18:39:01
 */
import { defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import { QueryDepartmentProjectStatistics } from '@/services/datacenter';
import moment from 'moment';
import { formatAmount, transformSecond } from '@/utils/string';
import { wait } from '@/utils/func';

export default defineComponent({
  name: 'generalIndex',
  components: { BaseEcharts },
  props: {
    analyseType: {
      type: Number,
      default: 1,
    },
    selectDate: {
      type: String,
      default: '',
    },
    projectGroundId: {
      type: Number,
      default: 0,
    },
    business_type: {
      type: Number,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const projectList = ref<any[]>([]);
    // setTimeout(() => {
    //   projectList.value.push('23', '5');
    // }, 1000);
    const loading = ref(false);

    const methods = {
      async queryDepartmentProjectStatistics() {
        const select_currentDate = moment(props.selectDate);
        const dateFormat = 'yyyy-MM-DD';
        const selectstr = props.analyseType === 1 ? 'w' : 'M';
        const start_time = select_currentDate.startOf(selectstr).format(dateFormat);
        const end_time = select_currentDate.endOf(selectstr).format(dateFormat);
        loading.value = true;
        const [res] = await wait(
          500,
          QueryDepartmentProjectStatistics({
            third_department_id: props.projectGroundId !== 0 ? props.projectGroundId : undefined,
            start_date: start_time,
            end_date: end_time,
            business_type: props.business_type,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          projectList.value = res.data.data ?? [];
        }
      },
      progressTextFormat(percentage: number | undefined) {
        return percentage ? `${percentage}%` : '0%';
      },
      progressTextColorClass(percentage: number | undefined) {
        const progress = percentage ? percentage : 0;
        return progress < 40 ? 'low' : progress < 100 ? 'medium' : 'high';
        // return progress < 40 ? 'var(--error-color)' : progress < 100 ? 'var(--warning-color)' : '#20BF55';
      },
      formatAmount,
      transformSecond,
    };

    onMounted(() => {
      methods.queryDepartmentProjectStatistics();
    });
    watch(
      () => [props.selectDate, props.projectGroundId, props.business_type],
      () => {
        methods.queryDepartmentProjectStatistics();
      },
    );
    const gotoClick = (row: any) => {
      const $router = ctx.root.$router;
      const routeUrl = $router.resolve({
        path: '/datacenter/projectDetail/' + row.project_id,
        query: {
          project_name: row.project_name,
        },
      });
      window.open(routeUrl.href, '_blank');
    };
    return {
      gotoClick,
      loading,
      projectList,
      ...methods,
    };
  },
});
