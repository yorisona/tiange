import { PropType, computed, defineComponent, watchEffect } from '@vue/composition-api';
import departmentBar from '@/modules/management/companyDashboard/charts/departmentBar/index.vue';
import { useRequest } from '@gm/hooks/ahooks';
import {
  Query_Operate_Manage_Poject_Operating_Department_Operating_Trend,
  Query_Operate_Manage_Poject_Operating_Project_Operating_Trend,
} from '@/services/management';
import { AxisUnit } from '@/modules/finance/managementDashboard/type';
import { SwitchTabQueryForm } from '../switchTabUse';
import { useRouter } from '@/use/vue-router';
import { RouterManagement } from '@/const/router';
type DataType = 'income' | 'cost' | 'profit';
export default defineComponent({
  components: {
    departmentBar,
  },
  props: {
    queryForm: {
      type: Object as PropType<SwitchTabQueryForm>,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const dataTypeList: { name: string; type: DataType; color: string }[] = [
      {
        name: '收入',
        type: 'income',
        color: '#72C760',
      },
      {
        name: '成本',
        type: 'cost',
        color: '#2877FF',
      },
      {
        name: '利润',
        type: 'profit',
        color: '#EE8532',
      },
    ];
    const reqDepartmentData = useRequest(
      Query_Operate_Manage_Poject_Operating_Department_Operating_Trend,
      {
        manual: true,
      },
    );
    const reqProjectData = useRequest(
      Query_Operate_Manage_Poject_Operating_Project_Operating_Trend,
      {
        manual: true,
      },
    );
    const reqData = computed(() => {
      return props.queryForm?.is_department ? reqProjectData : reqDepartmentData;
    });
    const serieData = computed(() => {
      return dataTypeList.map(el => {
        return {
          name: el.name,
          type: 'bar',
          barMaxWidth: 28,
          barMinWidth: 8,
          barGap: '30%',
          barCategoryGap: '45%',
          itemStyle: {
            color: el.color,
            borderRadius: 2,
          },
          // label: {
          //   show: true,
          //   position: 'top',
          // },
          // data: [{ income: 23345345 }].map((el: any) => {
          //   const income = el.income;
          //   return income !== null && income !== undefined ? income / 100 : null;
          // }),
          data: (reqData.value.data || []).map((item: any) => (item[el.type] || 0) / 100),
        };
      });
    });
    const methods = {
      getType() {
        return props.queryForm?.is_department ? 'department' : 'company';
      },
      getData() {
        const { start_date, end_date, is_department, department_id } = props.queryForm || {};
        if (!start_date || !end_date) return;
        if (is_department && !department_id) return;
        reqData.value.runAsync({ start_date, end_date, department_id }, methods.getType());
      },
      onSelectClick(params: any) {
        const { dataIndex } = params || {};
        const clickData = (reqData.value.data || [])[dataIndex];
        const href = router.resolve({
          name: props.queryForm?.is_department
            ? RouterManagement.projectManagementDashboard
            : RouterManagement.departmentDashboard,
          query: props.queryForm?.is_department
            ? {
                project_id: clickData.project_id,
                project_name: clickData.project_name,
              }
            : {
                department_id: clickData.department_id,
              },
        });
        window.open(href.href, '_blank');
      },
    };
    const yUnit = computed(() => {
      const findItem = (reqData.value.data || []).find((el: any) => {
        const income = Math.abs(el.income ?? 0) / 100;
        const cost = Math.abs(el.cost ?? 0) / 100;
        const profit = Math.abs(el.profit ?? 0) / 100;
        return income > 10000 || cost > 10000 || profit > 10000;
      });
      return findItem ? AxisUnit.wan : AxisUnit.yuan;
    });
    watchEffect(() => {
      methods.getData();
    });
    return {
      yUnit,
      reqData,
      serieData,
      dataTypeList,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-department-overview-page-container">
        <departmentBar
          // trendList={trendList}
          onSelectClick={this.onSelectClick}
          yUnit={this.yUnit}
          style="height: 332px; margin-top: 24px;"
          loading={this.reqData.loading}
          xData={(this.reqData.data || []).map((el: any) =>
            this.queryForm?.is_department ? el.project_name : el.department_name,
          )}
          series={this.serieData}
        ></departmentBar>
      </div>
    );
  },
});
