/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-23 13:23:52
 */
import { defineComponent, ref } from '@vue/composition-api';
import { CTRDetailQueryForm, CTRDetailRefType } from '../../type';
import displayTrendChart from './chart/index.vue';
import SceneContrast from '@/modules/datacenter/ctr/dialog/scene.contrast.vue';
import { wait } from '@/utils/func';
import { QueryShiftGroupCtrShopLive } from '@/services/datacenter';
import { CtrQueryParams, ShiftGroupCtrShopLive } from '@/types/tiange/datacenter';
import ChangeTip from '@/modules/datacenter/ctr/components/changeTip/index.vue';
import moment from 'moment';
import hardcover from '@/assets/img/datacenter/hardcover.png';
import lighting from '@/assets/img/datacenter/lighting.png';
import seat from '@/assets/img/datacenter/seat.png';
import display from '@/assets/img/datacenter/display.png';
import patch from '@/assets/img/datacenter/patch.png';
import tint from '@/assets/img/datacenter/tint.png';

export default defineComponent({
  components: {
    displayTrendChart,
    SceneContrast,
    ChangeTip,
  },
  setup(props, ctx) {
    const refMethods: CTRDetailRefType = {
      reload(queryForm: CTRDetailQueryForm) {
        const [start_date, end_date] = queryForm.dates;

        const params: CtrQueryParams = {
          project_id: queryForm.project_id,
          shift_id: queryForm.shift_id,
          start_date,
          end_date,
        };
        methods.queryShiftGroupCtrShopLive(params);
      },
    };

    const chartData = ref<ShiftGroupCtrShopLive[]>([]);
    const isShowDialog = ref(false);
    const loading = ref(false);
    const selectRow: any = ref([]);
    const methods = {
      sessionClick(index: number) {
        isShowDialog.value = true;
        selectRow.value = chartData.value[index].shop_live_list;
      },
      onHide() {
        isShowDialog.value = false;
      },
      async queryShiftGroupCtrShopLive(params: CtrQueryParams) {
        loading.value = true;
        const [res] = await wait(300, QueryShiftGroupCtrShopLive(params));
        loading.value = false;
        if (res.data.success) {
          chartData.value = res.data.data;
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请稍后重试');
        }
      },
    };
    const tipImg = [hardcover, lighting, seat, display, patch, tint];

    const tipsData = (live: ShiftGroupCtrShopLive) => {
      const changeTips: any[] = [];
      (live.shop_live_list ?? []).forEach((el, elIndex) => {
        (el.change_tips ?? []).forEach((tip, tipIndex) => {
          changeTips.push({
            coord: [elIndex, 0],
            name: `${tip.change_tip}`,
            value: tip.change_tip,
            symbolOffset: [0, -10 * tipIndex - 7],
            symbol: `image://${tipImg[tip.change_tip - 1]}`,
          });
        });
      });
      return changeTips.reverse();
    };

    return {
      tipsData,
      ...tipsData,
      selectRow,
      loading,
      chartData,
      isShowDialog,
      ...methods,
      ...refMethods,
    };
  },
  render() {
    return (
      <div class="display-trend-page-container" v-loading={this.loading}>
        {this.chartData.map((el, index) => {
          return (
            <div
              class="chat-container"
              style={index === 0 ? '' : 'margin-top: 24px;'}
              key={`${moment().milliseconds()}-${el.shift_id}-${index}`}
            >
              <div style="padding: 24px 30px 0">
                <span style="font-weight: 600;">{el.shift_name}</span>
                <tg-button
                  style="margin-left: 10px; font-size: 12px"
                  type="link"
                  onClick={() => {
                    this.sessionClick(index);
                  }}
                >
                  场景对比
                </tg-button>
              </div>
              <displayTrendChart
                index={index}
                percentage={true}
                style="margin-top: 24px;"
                originDataList={el.shop_live_list ?? []}
                date={(el.shop_live_list ?? []).map(live => {
                  const date = moment((live.live_start_time ?? 0) * 1000).format('MM.DD');
                  return date;
                })}
                list={[
                  {
                    name: '进入率 (人数)',
                    type: 'line',
                    smooth: true,
                    data: (el.shop_live_list ?? []).map(live => live.exposure_watch_ucnt_ratio),
                    markPoint: {
                      // symbol: `image://${this.hardcover}`,
                      symbolSize: [12, 17],
                      label: {
                        show: false,
                        // formatter:'{c}%'
                      },
                      data: this.tipsData(el),
                      // data: [
                      //   { coord: [1, 0], name: '15', value: 16, symbolOffset: [0, '-20%'] },
                      //   {
                      //     coord: [1, 0],
                      //     name: '15',
                      //     value: 16,
                      //     symbolOffset: [0, '-10%'],
                      //   },
                      //   {
                      //     coord: [1, 0],
                      //     name: '15',
                      //     value: 16,
                      //     symbolOffset: [0, '0'],
                      //     itemStyle: { color: 'red' },
                      //   },
                      // ],
                    },
                  },
                  {
                    name: '进入率 (人次)',
                    type: 'line',
                    smooth: true,
                    data: (el.shop_live_list ?? []).map(live => live.exposure_watch_times_ratio),
                    markPoint: {
                      // symbol: `image://${this.hardcover}`,
                      symbolSize: [12, 17],
                      label: {
                        show: false,
                        // formatter:'{c}%'
                      },
                      data: this.tipsData(el),
                      // data: [
                      //   { coord: [1, 0], name: '15', value: 16, symbolOffset: [0, '-20%'] },
                      //   {
                      //     coord: [1, 0],
                      //     name: '15',
                      //     value: 16,
                      //     symbolOffset: [0, '-10%'],
                      //   },
                      //   {
                      //     coord: [1, 0],
                      //     name: '15',
                      //     value: 16,
                      //     symbolOffset: [0, '0'],
                      //     itemStyle: { color: 'red' },
                      //   },
                      // ],
                    },
                  },
                ]}
              ></displayTrendChart>
              {/* <div style="position: absolute; right: 26.53%; bottom: 30px;">123</div> */}
              {(el.shop_live_list ?? []).length > 0 && (
                <change-tip style="position: absolute; left: 400px; bottom: 30px;"></change-tip>
              )}
            </div>
          );
        })}
        {this.chartData.length === 0 && (
          <div class="chart-empty">
            <empty-common detail-text="暂无数据"></empty-common>
          </div>
        )}

        <scene-contrast
          list={this.selectRow}
          visiable={this.isShowDialog}
          on-closeAction={this.onHide}
        ></scene-contrast>
      </div>
    );
  },
});
