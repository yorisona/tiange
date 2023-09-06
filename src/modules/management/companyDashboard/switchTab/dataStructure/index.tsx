import { computed, defineComponent, ref, PropType, watchEffect } from '@vue/composition-api';
import pie from '@/modules/management/companyDashboard/charts/pie/index.vue';
import { useRequest } from '@gm/hooks/ahooks';
import { Query_Operate_Manage_Poject_Operating_Data_Structure } from '@/services/management';
import { SwitchTabQueryForm } from '../switchTabUse';
import { latitudeOptions, LatitudeValueType } from '@/modules/management/use';
export default defineComponent({
  components: {
    pie,
  },
  props: {
    queryForm: {
      type: Object as PropType<SwitchTabQueryForm>,
    },
  },
  setup(props, ctx) {
    const activedType = ref<LatitudeValueType>(1);
    const pieDateType = [
      {
        name: 'GMV',
        prop: 'gmv',
      },
      {
        name: '营收',
        prop: 'income',
      },
      {
        name: '利润',
        prop: 'revenue',
      },
    ];
    const xRatios = ['20%', '50%', '80%'];
    const reqData = useRequest(Query_Operate_Manage_Poject_Operating_Data_Structure, {
      manual: true,
    });
    const seriesData = computed(() => {
      return pieDateType.map((el, idx) => {
        return {
          name: el.name,
          type: 'pie',
          center: [xRatios[idx], '55%'],
          radius: '50%',
          minAngle: 3, //最小角度
          label: {
            show: true,
            position: 'inner',
            formatter: function (params: any) {
              if (params && params.percent < 10) {
                return '';
              }
              return params.name + '\n' + params.data.percent + '%';
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          emphasis: {
            focus: 'self',
            itemStyle: {
              borderWidth: 2,
            },
          },
          data: (reqData.data?.[el.prop] || [])
            .filter((el: any) => el.value > 0)
            .map((el: any) => ({
              name: el.name,
              percent: el.percent,
              value: el.value / 100,
              children: el.children || [],
            })),
        };
      });
    });
    const methods = {
      getType() {
        return props.queryForm?.is_department ? 'department' : 'company';
      },
      getData() {
        const { start_date, end_date, is_department, department_id, department_level } =
          props.queryForm || {};
        if (!start_date || !end_date) return;
        if (is_department && !department_id) return;
        const activedOption = latitudeOptions.find(el => el.value === activedType.value);
        reqData.runAsync(
          {
            start_date,
            end_date,
            group_by:
              department_level === 3
                ? 'project_id'
                : is_department
                ? 'department_id'
                : !activedType.value
                ? 'business_type'
                : 'department_id',
            // business_type: is_department ? undefined : activedType.value,
            department_ids: is_department ? [department_id || ''] : activedOption?.department_ids,
            not_department_ids: is_department ? undefined : activedOption?.not_department_ids,
            // department_id,
          },
          methods.getType(),
        );
      },
    };

    watchEffect(() => {
      methods.getData();
    });

    return {
      // statisticsLatitude,
      reqData,
      xRatios,
      seriesData,
      latitudeOptions,
      activedType,
      pieDateType,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-data-structure-page-container">
        <pie
          style="height: 338px"
          loading={this.reqData.loading}
          series={this.seriesData}
          originDatas={this.pieDateType.map(el => {
            return (this.reqData.data?.[el.prop] || []).filter((el: any) => el.value > 0);
          })}
        ></pie>
        {this.seriesData.find(el => el.data.length !== 0) && (
          <fragments>
            {this.pieDateType.map((el, idx) => (
              <div
                key={el}
                class="pie-title"
                style={`left: calc(${this.xRatios[idx]} - ${idx === 0 ? '20px' : '17px'} )`}
              >
                {el.name}
              </div>
            ))}
          </fragments>
        )}
        {this.queryForm?.is_department !== true && (
          <div class="statistics-latitude">
            {/*<div*/}
            {/*  actived={this.activedType === undefined}*/}
            {/*  class="item"*/}
            {/*  onClick={() => {*/}
            {/*    this.activedType = undefined;*/}
            {/*  }}*/}
            {/*>*/}
            {/*  全部*/}
            {/*</div>*/}
            {this.latitudeOptions.map(el => {
              return (
                <div
                  actived={this.activedType === el.value}
                  class="item"
                  key={el.value}
                  onClick={() => {
                    this.activedType = el.value;
                  }}
                >
                  {el.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  },
});
