.
<template>
  <div
    style="
      display: flex;
      height: 360px;
      position: relative;
      overflow: hidden;
      justify-content: center;
    "
  >
    <div class="flowSource-box" style="width: 356px; margin-top: 10px">
      <div
        v-if="osunBurstData && osunBurstData.length > 0"
        style="
          width: 560px;
          height: 390px;
          margin: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        "
      >
        <div
          class="flowSource-echart-box"
          style="padding-left: 50px; width: 234px; height: 320px; position: relative"
        >
          <sunburst
            itemName="直播间观看次数"
            style="width: 234px; height: 234px; position: absolute"
            :loading="sunBurstLoading"
            :series="{ data: osunBurstData, children: osunBurstChildrenData }"
            @selectParamClick="selectClick"
            :showTip="false"
          ></sunburst>
          <div
            style="
              background: transparent;
              width: 50px;
              height: 50px;
              border-radius: 100px;
              position: absolute;
              cursor: pointer;
              margin-top: 92px;
              margin-left: 92px;
              z-index: 3;
            "
            @click="onClickAllColor"
          ></div>
        </div>
      </div>
      <div v-else style="width: 320px; height: 320px; margin: auto; padding-top: 120px">
        <empty-common :imgWidth="200" :imgHeight="100" />
      </div>
    </div>
    <div
      v-loading="sunBurstDetailLoading"
      class="sundetail-wrap"
      style="margin-left: -108px; width: 585px; height: 100%; display: flex"
    >
      <div>
        <div class="toptrianglediv"></div>
        <div class="bottomtrianglediv"></div>
      </div>
      <div class="sundetail">
        <div class="echartTitle" style="font-weight: 400; margin: 24px 0 12px 0; width: 400px">
          <span style="display: inline-block"> 流量来源：{{ select_flow_name || '--' }} </span>
          <span style="display: inline-block; margin-left: 48px">
            直播间观看次数：{{
              sunBurstDetail || watch_cnt
                ? formatAmount(
                    Number(sunBurstDetail ? sunBurstDetail.watch_cnt : watch_cnt).toFixed(0),
                    'None',
                    true,
                  )
                : '--'
            }}
          </span>
        </div>
        <div v-if="sunBurstDetail && sunBurstDetail.watch_cnt !== null">
          <div class="detailspan" style="margin-bottom: 4px">流量承接分析</div>
          <div class="echartTitle" style="margin-left: 0px; margin-bottom: 12px; width: 440px">
            <span class="detailtitle">
              平均观看时长： {{ getSecondsabe(sunBurstDetail.avg_watch_duration, 0, '秒') }}
            </span>
            <span class="detailtitle" style="margin-left: 18px">
              观看互动率：{{ getSecondsabe(sunBurstDetail.watch_interact_ratio, 2, '%') }}
            </span>
          </div>
          <div class="detailspan" style="margin-bottom: 4px">流量转化分析</div>
          <div class="echartTitle" style="margin-left: 0px; margin-bottom: 12px; width: 440px">
            <span class="detailtitle">
              成交金额：¥ {{ formatAmount((sunBurstDetail.pay_amt || 0) / 100, 'None') }}
            </span>
            <span class="detailtitle" style="margin-left: 18px">
              客单价：¥ {{ formatAmount((sunBurstDetail.cnt_unit_amt || 0) / 100, 'None') }}
            </span>
          </div>
          <div class="echartTitle" style="margin-left: 0px; margin-bottom: 12px; width: 440px">
            <span class="detailtitle">
              成交次数：{{
                formatAmount(Number(sunBurstDetail.pay_cnt || 0).toFixed(0), 'None', true)
              }}
            </span>
            <span class="detailtitle" style="margin-left: 18px">
              观看-成交转化率：{{ sunBurstDetail.watch_pay_ratio }}%
            </span>
          </div>
        </div>
        <div v-else style="margin-top: 18px">
          <!--<div style="height: 38px; color: #a4b2c2; margin-bottom: 6px">
                {{ select_flow_type_name === '付费流量' ? '付费流量暂不提供流量分析' : '' }}
              </div>-->
          <div style="margin-right: 50px; margin-top: 60px">
            <empty-common style="width: 260px; margin: auto" :imgWidth="200" :imgHeight="100" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectosunBurstData.length > 0" class="el-props">
      <div
        style="
          width: 100%;
          text-align: left;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          align-items: center;
        "
      >
        <div v-for="item in getOption" :key="item.name" style=":inline-block ">
          <div
            style="
              display: inline-block;
              width: 80px;
              height: 14px;
              line-height: 14px;
              padding-right: 6px;
            "
            :style="{
              width:
                selectosunBurstData.length > 6
                  ? '80px'
                  : selectosunBurstData.length === 1
                  ? '180px'
                  : '120px',
            }"
          >
            <span
              style="
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-top: 1px;
                border-radius: 2px;
              "
              :style="{ background: item.itemStyle.color }"
            ></span>
            <tg-textPopover
              :text="item.name"
              style="
                display: inline-block;
                margin-left: 4px;
                color: #343f4c;
                font-size: 12px;
                width: 56px;
              "
              :style="{
                width:
                  selectosunBurstData.length > 6
                    ? '56px'
                    : selectosunBurstData.length === 1
                    ? '150px'
                    : '90px',
              }"
              :maxWidth="
                selectosunBurstData.length > 6 ? 56 : selectosunBurstData.length === 1 ? 150 : 90
              "
            ></tg-textPopover>
          </div>
        </div>
        <div
          v-if="selectosunBurstData.length > select_show_size"
          style="display: flex; justify-content: flex-start; align-items: center"
        >
          <i
            class="el-icon-caret-left sort-icon"
            :class="select_show_index === 1 ? 'disable' : ''"
            @click="
              () => {
                select_show_index = select_show_index === 1 ? 1 : select_show_index - 1;
              }
            "
          ></i>
          <span style="padding: 0 4px">{{ select_show_index }}/{{ get_total_num() }}</span>
          <i
            class="el-icon-caret-right sort-icon"
            :class="select_show_index === get_total_num() ? 'disable' : ''"
            @click="
              () => {
                select_show_index =
                  select_show_index < get_total_num() ? select_show_index + 1 : select_show_index;
              }
            "
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import {
  GetShopLiveFlowProjectSunburstList,
  GetShopLiveFlowProjectPercentSunbursDetail,
} from '@/services/datacenter/shoplive';
// import { useRouter } from '@/use/vue-router';
import { useSunburstColors } from '@/modules/finance/managementDashboard/tabs/dashboard/use/useColors';
import { formatAmount } from '@/utils/string';
import sunburst from '@/modules/datacenter/shoplive/components/dailyDetailSunburst/index.vue';
// import moment from 'moment';
export default defineComponent({
  components: {
    sunburst,
  },
  props: {
    shop_live_id: {
      type: Number,
      default: 0,
    },
    merge_shop_live_id: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const sunBurstLoading = ref(false);
    // const router = useRouter();
    // const project_id = parseInt(
    //   router.currentRoute.params.id || router.currentRoute.query.id + '',
    //   10,
    // );
    const sunBurstData = ref<any[] | undefined>(undefined);
    const osunBurstData = ref<any>([]);
    const osunBurstChildrenData = ref<any>([]);
    // const sunburstTotalAmount = ref();
    const flow_type = ref<any>(undefined);
    const select_flow_name = ref<any>('');
    const watch_cnt = ref<any>('');
    const selectosunBurstData = ref<any>([]);
    const select_flow_type_name = ref('');
    const sunBurstDetailLoading = ref(false);
    const select_flow = ref<any>(undefined);
    const sunBurstDetail = ref<any>(undefined);
    const getOneProjectDetail = () => {
      // const select_str = props.analyseType === 1 ? 'w' : 'M';
      // const start_time = '2023-07-11';
      // const end_time = '2023-07-11';

      sunBurstDetailLoading.value = true;
      GetShopLiveFlowProjectPercentSunbursDetail({
        // start_date: start_time,
        // end_date: end_time,
        // statistics_cycle: props.analyseType === 1 ? 2 : 3,
        // is_from_project: true,
        // project_id: project_id,
        // shop_live_id: props.shop_live_id,
        flow_source: select_flow.value,
        flow_type: flow_type.value,
        merge_shop_live_id: props.merge_shop_live_id,
      }).then(({ data }) => {
        sunBurstDetailLoading.value = false;
        if (data.success) {
          sunBurstDetail.value = JSON.stringify(data.data) === '{}' ? undefined : data.data;
        } else {
          sunBurstDetail.value = undefined;
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    const init = () => {
      GetShopLiveFlowProjectSunburstList({
        // start_date: '2023-07-11',
        // end_date: '2023-07-11',
        // statistics_cycle: props.analyseType === 1 ? 2 : 3,
        // statistics_cycle: 1,
        is_from_project: false,
        // project_id: project_id,
        // shop_live_id: props.shop_live_id,
        merge_shop_live_id: props.merge_shop_live_id,
      }).then(({ data }) => {
        sunBurstLoading.value = false;
        if (data.success) {
          sunBurstData.value = data.data;
          selectosunBurstData.value = [];
          osunBurstChildrenData.value = [];
          osunBurstData.value = (sunBurstData.value || [])
            .filter((el: any) => {
              return (el.source_data || []).find((subEl: any) => (subEl.value || 0) > 0);
            })
            .map((el: any, index: number) => {
              if (index === 0) {
                flow_type.value = el.flow_type;
                select_flow_name.value = el.flow_type_name;
                select_flow_type_name.value = el.flow_type_name;
                watch_cnt.value = el.sum_flow;
                getOneProjectDetail();
              }
              const children = ref<any>([]);
              (el.source_data || []).map((subEl: any, subElIndex: number) => {
                if ((subEl.value || 0) > 0) {
                  children.value.push({
                    name: subEl.source_name,
                    itemStyle: { color: useSunburstColors[index]?.children[subElIndex] },
                    key: subEl.source_key,
                    value: subEl.value,
                    superName: el.flow_type_name,
                  });
                }
              });
              return {
                name: el.flow_type_name,
                itemStyle: {
                  color: useSunburstColors[index]?.color,
                },
                key: el.flow_type,
                value: el.sum_flow,
                children: children.value,
              };
            });
          (sunBurstData.value || [])
            .filter((el: any) => {
              return (el.source_data || []).find((subEl: any) => (subEl.value || 0) > 0);
            })
            .map((el: any, index: number) => {
              (el.source_data || []).map((subEl: any, subElIndex: number) => {
                if ((subEl.value || 0) > 0) {
                  osunBurstChildrenData.value.push({
                    name: subEl.source_name,
                    itemStyle: {
                      color: useSunburstColors[index]?.children[subElIndex],
                    },
                    key: subEl.source_key,
                    value: subEl.value,
                    superName: el.flow_type_name,
                  });
                }
              });
            });
          selectosunBurstData.value = osunBurstData.value;
        } else {
          sunBurstData.value = [];
          osunBurstData.value = [];
          osunBurstChildrenData.value = [];
          sunBurstDetail.value = undefined;
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    const getSecondsabe = (val: string | number | null, index: number, unit: string) => {
      return typeof val === 'string'
        ? val
        : formatAmount(Number(val || 0).toFixed(index), 'None', index === 0) + unit;
    };
    const onClickAllColor = () => {
      selectosunBurstData.value = osunBurstData.value;
      select_flow.value = undefined;
      init();
    };
    const selectClick = (param: any) => {
      watch_cnt.value = param.data.value || '';
      select_flow_name.value = param.data.name;
      select_flow_type_name.value = param.data.name;
      selectosunBurstData.value = [];
      if (!param.data.children) {
        select_flow.value = param.data.key;
        flow_type.value = undefined;
        select_flow_type_name.value = param.data.superName || '';
        selectosunBurstData.value = [param.data];
        getOneProjectDetail();
      } else {
        selectosunBurstData.value = param.data.children || [];
        select_flow.value = undefined;
        flow_type.value = param.data.key;
        getOneProjectDetail();
      }
    };
    init();
    const select_show_size = ref(5);
    const select_show_index = ref(1);
    const get_total_num = () => {
      const total_num = selectosunBurstData.value.length;
      const i = Number((total_num / select_show_size.value).toFixed(0) || 0);
      return i * select_show_size.value >= selectosunBurstData.value.length ? i : i + 1;
    };
    const getOption = computed(() => {
      return selectosunBurstData.value.slice(
        (select_show_index.value - 1) * select_show_size.value,
        select_show_index.value * select_show_size.value,
      );
    });
    // watch(
    //   () => props.shop_live_id,
    //   () => {
    //     init();
    //   },
    // );
    return {
      sunBurstLoading,
      sunBurstData,
      osunBurstData,
      osunBurstChildrenData,
      selectosunBurstData,
      select_flow_name,
      select_flow_type_name,
      watch_cnt,
      sunBurstDetailLoading,
      sunBurstDetail,
      select_flow,
      formatAmount,
      getSecondsabe,
      onClickAllColor,
      selectClick,
      get_total_num,
      select_show_index,
      select_show_size,
      getOption,
    };
  },
});
</script>

<style lang="scss" scoped>
.toptrianglediv {
  margin-top: 96px;
  width: 172px;
  background-color: var(--border-line-div-color);
  height: 1px;
  transform: rotate(-60deg);
}
.bottomtrianglediv {
  width: 172px;
  margin-top: 148px;
  margin-left: 0px;
  height: 1px;
  background-color: var(--border-line-div-color);
  transform: rotate(-120deg);
}
.sundetail {
  width: 416px;
  border-bottom: 1px solid var(--border-line-div-color);
  border-top: 1px solid var(--border-line-div-color);
  border-right: 1px solid var(--border-line-div-color);
  height: 298px;
  margin-right: 12px;
  margin-left: -43px;
  margin-top: 22px;
  padding-left: 24px;
}
.detailspan {
  height: 32px;

  font-weight: 400;
  font-size: 12px;
  color: var(--text-second-color);
  line-height: 32px;
}
.detailtitle {
  display: inline-block;
  text-align: left;
  padding-left: 18px;
  width: 181px;
  height: 40px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-color);
  line-height: 40px;
  background: #f5f5f5;
  border: 0 solid var(--border-line-div-color);
  border-radius: 2px;
}
.line-one {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 1;
  margin-left: 6px;
  flex: 1;
}
.el-props {
  width: 530px;
  font-size: 12px;
  color: #343f4c;
  overflow: hidden;
  flex: 1;
  margin: 10px auto;
  position: absolute;
  bottom: -10px;
  left: 88px;
}
.sort-icon {
  cursor: pointer;
}
</style>
