import { ref, defineComponent, h, inject, watch, PropType } from '@vue/composition-api';
import './dataStatistics.less';
import ProgressBar from './modules/progressBar';
import { workingHoursColorMap, interfaceType } from './use';
import { GetUserManHourCardData, GetDepartmentDesignerManHourCardData } from '@/services/design';

export default defineComponent({
  name: 'dataStatistics',
  props: {
    modeType: {
      type: Number as PropType<interfaceType>,
      default: interfaceType.workbench,
    },
  },
  setup(props, ctx) {
    const cardData = ref<M.visualDesignStatistics.UserManHourCardData>(
      {} as M.visualDesignStatistics.UserManHourCardData,
    );
    // const { getUserManHourCardData } = useConfig();
    /* 月份控制 */
    const searchData = inject<any>('searchData');
    const loading = ref(false);
    const RemoteMethodMap: Record<number, any> = {
      [interfaceType.workbench]: (v: any) => {
        loading.value = true;
        GetUserManHourCardData({
          query_month: v?.date,
        }).then(res => {
          loading.value = false;
          if (res.data.success) {
            cardData.value = res.data.data;
          } else {
            cardData.value = {} as M.visualDesignStatistics.UserManHourCardData;
          }
        });
      },
      [interfaceType.manager]: (v: any) => {
        loading.value = true;
        GetDepartmentDesignerManHourCardData({
          query_month: v?.date,
          department_id: v?.department_id,
          user_id: v?.user_id,
        }).then(res => {
          loading.value = false;
          if (res.data.success) {
            cardData.value = res.data.data;
          } else {
            cardData.value = {} as M.visualDesignStatistics.UserManHourCardData;
          }
        });
      },
    };

    const init = async (val: any) => {
      RemoteMethodMap[props.modeType](val);
    };
    watch(searchData.value, val => init(val), { deep: true, immediate: true });
    return {
      cardData,
      loading,
      init,
    };
  },
  render() {
    const { cardData } = this;
    return (
      <div class="dataStatistics_box20230324" v-loading={this.loading}>
        <div class="dataStatistics_box20230324_title">
          <span>完成度</span>
          <span v-show={cardData?.completed?.percent}>
            {cardData?.completed?.hours}h/{cardData?.completed?.percent}%
          </span>
        </div>
        <ProgressBar
          data={[
            {
              label: '已完成',
              percent: cardData?.completed?.percent ?? 0,
            },
          ]}
        />
        <div class="dataStatistics_box20230324_title mgt-16">
          <span>工时占比</span>
        </div>
        <ProgressBar
          data={
            cardData?.man_hour_percent?.map(v => {
              return {
                label: v.man_hour_type_name,
                percent: v.percent,
                color: workingHoursColorMap.get(v.man_hour_type),
              };
            }) ?? []
          }
          scopedSlots={{
            tooltip: (data: any[]) => {
              return (
                <div class="tooltip-box">
                  {data.map(field => {
                    return (
                      <div class="tooltip">
                        <span class="cir" style={{ background: field.color }}></span>
                        {/* <span>{field.label}</span> */}
                        <span>{field.percent}%</span>
                      </div>
                    );
                  })}
                </div>
              );
            },
          }}
        />
        <div class="dataStatistics_box20230324_title mgt-16">
          <span>项目占比</span>
        </div>
        <div class="dataStatistics_box20230324_project_box">
          {cardData?.belong_percent &&
            cardData?.belong_percent?.map(v => (
              <div
                class={['dataStatistics_box20230324_project_box__item']}
                style={{ '--beforeCol': workingHoursColorMap.get(v.man_hour_type) }}
              >
                <span style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 85px;">
                  {v.target_name}
                </span>
                <span>
                  {v.hours}h/{v.percent}%
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  },
});
