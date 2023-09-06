/** 旭日图 */
import {
  computed,
  defineComponent,
  onBeforeMount,
  PropType,
  ref,
  watch,
} from '@vue/composition-api';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import Empty from '@/modules/datacenter/components/empty/index.vue';
import { formatAmount } from '@/utils/string';

export default defineComponent({
  name: 'design-sunburst',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    series: {
      type: Object as PropType<{ data: [] }>,
      default: () => {},
    },
    // totalAmount: {
    //   type: Decimal,
    //   default: () => new Decimal(1),
    // },
  },
  components: {
    BaseEcharts,
    Empty,
  },
  setup(props, ctx) {
    const selectedItem = ref<any | undefined>(undefined);
    const legendItems = computed(() => {
      if (!selectedItem.value) {
        return (props.series.data ?? []).map((el: any) => {
          return {
            color: el.itemStyle.color,
            name: el.name,
          };
        });
      }
      const children = selectedItem.value.children ?? [];
      if (!children.length) {
        return [
          {
            color: selectedItem.value.itemStyle.color,
            name: selectedItem.value.name,
          },
        ];
      }
      // if (!children.length) {
      //   const finder: any = (props.series.data ?? []).find((el: any) => {
      //     const finderEl = el.children?.find(
      //       (subEl: any) => subEl.name === selectedItem.value.name,
      //     );
      //     if (finderEl) {
      //       return el;
      //     }
      //   });
      //   return (
      //     finder.children.map((el: any) => {
      //       return {
      //         color: el.itemStyle.color,
      //         name: el.name,
      //       };
      //     }) ?? []
      //   );
      // }
      return children.map((el: any) => {
        return {
          color: el.itemStyle?.color,
          name: el.name,
        };
      });
    });

    const baseOptions = ref({
      tooltip: {
        trigger: 'item',
        // borderWidth: 0,
        formatter(params: any) {
          const data = params.data;
          const title = data.name || '--';

          const listItem = `
            <div style="font-size: 12px; line-height: 16px;">
              <span style="display: inline-block; background-color: ${
                params.color
              }; width: 8px; height: 8px; border-radius: 50%;"></span><span style="display: inline-block; font-weight: 400; color: #606974; margin-left: 6px;">预约量：</span><span style="font-weight: 400; color: var(--text-color);">${formatAmount(
            data.value ?? 0,
            'None',
            true,
          )} 单</span>
            </div>
            `;
          return `
            <div style="margin: 8px; text-align: left;">
              <div style="color: var(--text-color); font-weight: 400; line-height: 18px;">${
                title ? title : '--'
              }</div>
              <div style="margin-top: 18px;">
                ${listItem}
              </div>
            </div>
          `;
        },
      },
      label: {
        fontSize: 10,
      },
      series: {
        type: 'sunburst',
        radius: [0, '98%'],
        sort: undefined,
        label: {
          minAngle: 8,
          width: 50,
          overflow: 'truncate',
        },
        nodeClick: 'none',
        emphasis: {
          focus: 'ancestor',
          label: {
            show: true,
          },
        },
        levels: [
          {},
          {
            r0: '20.69%',
            r: '45%',
            itemStyle: {
              borderWidth: 2,
            },
            label: {
              // rotate: 'tangential',
              show: false,
            },
          },
          {
            r0: '45%',
            r: '70%',
            itemStyle: {
              borderWidth: 2,
            },
            label: {
              // position: 'outside',
              padding: 3,
              silent: false,
              show: true,
              // color: '#fff',
            },
          },
          {
            r0: '70%',
            r: '75%',
            label: {
              position: 'outside',
              padding: 3,
              show: true,
              color: 'var(--text-color)',
              fontSize: 12,
              silent: false,
              // rotate: -25, // 旋转角度
            },
          },
        ],
        data: [],
      },
    });
    const methods = {
      reloadData() {
        methods.reloadPage();
        selectedItem.value = undefined;
        const options = baseOptions.value;
        baseOptions.value.series = { ...options.series, ...props.series };
      },
      onAllClick() {
        selectedItem.value = undefined;
      },
      reloadPage() {
        pagingForm.value.page = 1;
      },
    };
    onBeforeMount(() => {
      methods.reloadData();
    });
    watch(
      () => props.series,
      () => {
        methods.reloadData();
      },
    );
    watch(
      () => selectedItem.value,
      () => {
        methods.reloadPage();
      },
    );
    const selectClick = (param: any) => {
      // if (param.data.children ?? [].length > 0) {
      selectedItem.value = param.data;
      // }
      ctx.emit('selectParamClick', param);
      // console.log(param);
    };

    const pagingForm = ref({
      page: 1,
      pageSize: 9,
    });

    const pageCount = computed(() => {
      return Math.ceil(legendItems.value.length / pagingForm.value.pageSize);
    });

    return {
      selectedItem,
      legendItems,
      selectClick,
      baseOptions,
      pagingForm,
      pageCount,
      ...methods,
    };
  },
  render() {
    const legendFilgerItem = this.legendItems.slice(
      (this.pagingForm.page - 1) * this.pagingForm.pageSize,
      this.pagingForm.page * this.pagingForm.pageSize,
    );
    return (
      <div style="width: 100%; display: flex; justify-content: center" v-loading={this.loading}>
        {(this.series.data?.length || 0) > 0 ? (
          <div style="width: 450px; position: relative;">
            <base-echarts
              options={this.baseOptions}
              onSelectClick={this.selectClick}
            ></base-echarts>
            <div
              style="width: 62px; height: 62px; border-radius: 31px; background-color: transparent; position: absolute; cursor: pointer; top: 114px; left: 114px;"
              on-click={this.onAllClick}
            ></div>
          </div>
        ) : (
          <empty />
        )}
        {(this.series.data?.length || 0) > 0 && (
          <div style="display: flex; margin-left: 45px; flex-direction: column;">
            <div class="legend-list" style="flex: 1; margin-top: 12px;">
              {legendFilgerItem.map((legend: any, index: number) => {
                return (
                  <div
                    style={
                      index === 0
                        ? 'display: flex; align-items: center; height: 16px; line-height: 16px'
                        : 'display: flex; align-items: center; margin-top: 12px; height: 16px; line-height: 16px;'
                    }
                  >
                    <div
                      style={`background: ${legend.color}; width: 12px; height: 12px; border-radius: 2px;`}
                    ></div>
                    <tg-textPopover
                      text={legend.name}
                      style="margin-left: 6px; color: #343F4C; font-size: 12px; width: 70px;"
                      maxWidth={70}
                    ></tg-textPopover>
                    {/* <div
                    class="line-clamp-1"
                    style="margin-left: 6px; color: #343F4C; font-size: 12px; width: 70px;"
                  >
                    {legend.name}
                  </div> */}
                  </div>
                );
              })}
            </div>
            {this.pageCount > 1 && (
              <div style="margin-top: 12px;">
                <i
                  disabled={this.pagingForm.page === 1}
                  class="el-icon-caret-left sort-icon"
                  on-click={() => {
                    if (this.pagingForm.page > 1) {
                      this.pagingForm.page = this.pagingForm.page - 1;
                    }
                  }}
                ></i>
                <span style="padding: 0 4px">{`${this.pagingForm.page}/${this.pageCount}`}</span>
                <i
                  disabled={this.pagingForm.page === this.pageCount}
                  class="el-icon-caret-right sort-icon"
                  on-click={() => {
                    if (this.pagingForm.page < this.pageCount) {
                      this.pagingForm.page = this.pagingForm.page + 1;
                    }
                  }}
                ></i>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
});
