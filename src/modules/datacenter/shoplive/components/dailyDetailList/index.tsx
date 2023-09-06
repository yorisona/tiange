import { formatAmount } from '@/utils/string';
import {
  computed,
  defineComponent,
  h,
  PropType,
  ref,
  watch,
  inject,
  Ref,
  set,
} from '@vue/composition-api';
import { ShopLiveDailyReport } from '@/services/datacenter/shoplive';
import { LiveProject } from '@/types/tiange/live.project';
import { BusinessTypeEnum } from '@/types/tiange/common';

export enum ProfitLossKeyType {
  /** 项目 */
  project_name = 'project_name',
  /** 项目组 */
  department_name = 'department_name',
  /** 目标gmv */
  goal_gmv = 'goal_gmv',
  /** 完成gmv */
  gmv = 'gmv',
  /** 视频号gmv */
  wechat_video_gmv = 'wechat_video_gmv',
  /** 橱窗GMV */
  showcase_gmv = 'showcase_gmv',
  /** 短视频GMV */
  shortvideo_gmv = 'shortvideo_gmv',
  /** 其它GMV
   */
  others_gmv = 'others_gmv',
  /** 小店GMV */
  dp_gmv = 'dp_gmv',
  /** 目标完成度 */
  gmv_completion_rate = 'gmv_completion_rate',
  /** 小店目标完成度 */
  dp_goal_gmv_percent = 'dp_goal_gmv_percent',
  /** 直播时长 */
  live_duration = 'live_duration',
  /** 总UV */
  uv = 'uv',
  /** 单UV价值 */
  gmv_per_uv = 'gmv_per_uv',
  /** 最高在线 */
  max_uv = 'max_uv',
  /** 平均停留时长 */
  avg_stay = 'avg_stay',
  /** 直播增粉 */
  new_fans_count = 'new_fans_count',
  /** 曝光进入绿 */
  watch_cnt_show_ratio = 'watch_cnt_show_ratio',
  /** 进入购买率 */
  watch_pay_ucnt_ratio = 'watch_pay_ucnt_ratio',
  /** 投放金额 */
  cost = 'cost',
  /** 广告ROI */
  ad_live_roi = 'ad_live_roi',
  /** 整体ROI */
  roi = 'roi',
  /** 当前退款率 */
  refund_order_rate = 'refund_order_rate',
  /** 当前退款金额 */
  refund_order_amount = 'refund_order_amount',
  /** 当前净销额 */
  net_sales_amount = 'net_sales_amount',
  // 查看详情
  project_id = 'project_id',
  /** 当前净销额 */
  total_amount = 'net_sales_amount',
}

interface SortForm {
  key: ProfitLossKeyType | undefined;
  type: 'ascending' | 'descending' | undefined;
}

interface ProjectItemModel {
  key: ProfitLossKeyType;
  name: string;
  hidden?: boolean;
  value?: (number | string)[];
  formatter?: (val: any, _?: any) => any;
}

export default defineComponent({
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    day_arr: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    department_id: {
      type: Number,
    },
    is_total: {
      type: Boolean,
      default: false,
    },
    // selectedColIndex: {
    //   type: Number,
    // }
  },
  setup(props, ctx) {
    const injectProject =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    const projectItems = ref<ProjectItemModel[]>([
      {
        key: ProfitLossKeyType.project_name,
        name: props.is_total ? '指标/日期' : '项目',
        formatter: val => {
          return h('tg-textPopover', {
            props: {
              text: val,
              maxWidth: 115,
            },
          });
        },
      },
      {
        key: ProfitLossKeyType.department_name,
        name: '项目组',
        value: [],
        formatter: val => {
          return h('tg-textPopover', {
            props: {
              text: val,
              maxWidth: 115,
            },
          });
        },
      },
      {
        key: ProfitLossKeyType.goal_gmv,
        name: '目标GMV (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.dp_gmv,
        // name: props.is_total ? '小店GMV (元)' : '完成GMV (元)',
        name: '总GMV (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        // 小店目标完成度
        key: ProfitLossKeyType.dp_goal_gmv_percent,
        name: '目标完成度',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? `${val}%` : val;
        },
      },
      {
        key: ProfitLossKeyType.gmv,
        name: '直播GMV (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.showcase_gmv,
        // name: props.is_total ? '小店GMV (元)' : '完成GMV (元)',
        name: '橱窗GMV (元)',
        hidden:
          injectProject.value &&
          injectProject.value?.business_type !== BusinessTypeEnum.douyin &&
          injectProject.value?.business_type !== BusinessTypeEnum.taobaopick &&
          injectProject.value?.business_type !== BusinessTypeEnum.supplyChain,
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.shortvideo_gmv,
        // name: props.is_total ? '小店GMV (元)' : '完成GMV (元)',
        name: '短视频GMV (元)',
        hidden:
          injectProject.value &&
          injectProject.value?.business_type !== BusinessTypeEnum.douyin &&
          injectProject.value?.business_type !== BusinessTypeEnum.taobaopick &&
          injectProject.value?.business_type !== BusinessTypeEnum.supplyChain,
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.others_gmv,
        // name: props.is_total ? '小店GMV (元)' : '完成GMV (元)',
        name: '其它GMV (元)',
        hidden:
          injectProject.value &&
          injectProject.value?.business_type !== BusinessTypeEnum.douyin &&
          injectProject.value?.business_type !== BusinessTypeEnum.taobaopick &&
          injectProject.value?.business_type !== BusinessTypeEnum.supplyChain,
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.wechat_video_gmv,
        name: '视频号GMV (元)',
        hidden:
          injectProject.value &&
          injectProject.value?.business_type !== BusinessTypeEnum.douyin &&
          injectProject.value?.business_type !== BusinessTypeEnum.taobaopick &&
          injectProject.value?.business_type !== BusinessTypeEnum.supplyChain,
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.live_duration,
        name: '直播时长 (分钟)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? (val / 60).toFixed(2) : val;
        },
      },
      {
        key: ProfitLossKeyType.uv,
        name: '总UV',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val, 'None', true) : val;
        },
      },
      {
        key: ProfitLossKeyType.gmv_per_uv,
        name: '单UV价值 (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.max_uv,
        name: '最高在线',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val, 'None', true) : val;
        },
      },
      {
        key: ProfitLossKeyType.avg_stay,
        name: '平均停留时长 (秒)',
        value: [],
        formatter: val => {
          return val;
        },
      },
      {
        key: ProfitLossKeyType.new_fans_count,
        name: '直播增粉',
        value: [],
        formatter: val => {
          return val;
        },
      },
      {
        key: ProfitLossKeyType.watch_cnt_show_ratio,
        name: '曝光进入率',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? `${val}%` : val;
        },
      },
      {
        key: ProfitLossKeyType.watch_pay_ucnt_ratio,
        name: '进入购买率',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? `${val}%` : val;
        },
      },
      {
        key: ProfitLossKeyType.cost,
        name: '投放金额 (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.ad_live_roi,
        name: '广告ROI',
        value: [],
        formatter: val => {
          return val;
        },
      },
      {
        key: ProfitLossKeyType.roi,
        name: '整体ROI',
        value: [],
        formatter: val => {
          return val;
        },
      },
      {
        key: ProfitLossKeyType.refund_order_rate,
        name: '当前退款率',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? `${val}%` : val;
        },
      },
      {
        key: ProfitLossKeyType.refund_order_amount,
        name: '当前退款金额 (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
      {
        key: ProfitLossKeyType.net_sales_amount,
        name: '当前净销额 (元)',
        value: [],
        formatter: val => {
          return val !== null && val !== undefined ? formatAmount(val / 100, 'None') : val;
        },
      },
    ]);
    if (props.is_total === false)
      projectItems.value.push({
        key: ProfitLossKeyType.project_id,
        name: '查看详情',
        value: [],
        formatter: (val, _) => {
          return h(
            'a',
            {
              style: {
                fontSize: '12px',
              },
              on: {
                click: () => {
                  const $router = ctx.root.$router;
                  const routeUrl = $router.resolve({
                    path: '/datacenter/projectDetail/' + val,
                    query: {
                      project_name: _.project_name,
                      start_date: props.day_arr,
                    },
                  });
                  window.open(routeUrl.href, '_blank');
                },
              },
            },
            '查看详情',
          );
        },
      });
    if (props.is_total) {
      projectItems.value.splice(1, 1);
    }
    const shouldRefreshIndex = ref(false);
    const selectedColIndex = ref<number>(0);
    const selectedData = ref<any | undefined>((props.data ?? [])[0]);

    const sortForm = ref<SortForm>({
      key: undefined,
      type: undefined,
    });

    const tableData = computed(() => {
      let sortedArr = [...(props.data ?? [])];
      if (props.is_total) {
        sortedArr.splice(sortedArr.length - 1, 1);
        (props.day_arr || []).map((item: string, index: number) => {
          if (sortedArr.length > index) {
            sortedArr[index].day_name = item;
          }
        });
      }
      const type = sortForm.value.type;
      const key = sortForm.value.key;
      if (key && type) {
        sortedArr = sortedArr.sort((el1: any, el2: any) => {
          const val1 = el1[key];
          const val2 = el2[key];
          if (val1 === null && val2 === null) {
            return 0;
          } else if (val1 === null) {
            return type === 'ascending' ? 1 : -1;
          } else if (val2 === null) {
            return type === 'ascending' ? -1 : 1;
          }
          return type === 'ascending' ? val2 - val1 : val1 - val2;
        });
      }
      return sortedArr;
      // return props.data
    });
    const totalData = computed(() => {
      const sortedArr = [...(props.data ?? [])];
      if (props.is_total) {
        sortedArr.splice(0, sortedArr.length - 1);
      }
      return sortedArr;
      // return props.data
    });
    const day_list = computed(() => {
      return props.day_arr || [];
    });
    const methods = {
      onSortClick(el: ProjectItemModel) {
        const type = sortForm.value.type;
        if (type === undefined) {
          sortForm.value.key = el.key;
          sortForm.value.type = 'ascending';
        } else if (type === 'ascending') {
          if (sortForm.value.key === el.key) {
            sortForm.value.key = el.key;
            sortForm.value.type = 'descending';
          } else {
            sortForm.value.key = el.key;
            sortForm.value.type = 'ascending';
          }
        } else {
          if (sortForm.value.key === el.key) {
            sortForm.value.key = undefined;
            sortForm.value.type = undefined;
          } else {
            sortForm.value.key = el.key;
            sortForm.value.type = 'ascending';
          }
        }
        // ctx.emit('colClick', selectedColIndex.value, tableData.value[selectedColIndex.value]);
      },
      onColClick(index: number, _: any) {
        selectedColIndex.value = index;
        selectedData.value = tableData.value[index];
        ctx.emit('selectChanged', selectedData.value);
        // ctx.emit('colClick', index, el);
      },
    };
    watch(
      () => tableData.value,
      () => {
        const finder = tableData.value.findIndex(
          (el: any) => el.project_id === selectedData.value?.project_id,
        );
        if (finder >= 0 && !shouldRefreshIndex.value) {
          selectedColIndex.value = finder;
          selectedData.value = tableData.value[finder];
        } else {
          selectedColIndex.value = 0;
          selectedData.value = tableData.value[0];
        }
        shouldRefreshIndex.value = false;
        ctx.emit('selectChanged', selectedData.value);
      },
    );
    watch(
      () => props.department_id,
      () => {
        shouldRefreshIndex.value = true;
      },
    );
    /* 表格编辑 */
    const clickCellColumn = ref('');
    const onInputBlur = (params: any) => {
      ShopLiveDailyReport(params).then(res => {
        console.log('res', res);
        if (res.data.success) {
          ctx.emit('refresh');
          ctx.root.$message.success('修改成功');
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };
    projectItems.value = projectItems.value.filter(el => el.hidden !== true);
    return {
      day_list,
      totalData,
      selectedColIndex,
      sortForm,
      projectItems,
      tableData,
      ...methods,
      clickCellColumn,
      onInputBlur,
      injectProject,
    };
  },
  render() {
    return (
      <div class="tg-daily-detail-list-container">
        {this.tableData.length > 0 ? (
          <div class="body">
            <div class="left">
              <div class="left-bg"></div>
              {this.projectItems.map((el, idx) => {
                return (
                  <div class={idx === 0 ? 'header' : 'cell'}>
                    {idx < 2 ? (
                      <div>{el.name}</div>
                    ) : (
                      <div
                        style="display: flex; cursor: pointer; justify-content: space-between;"
                        on-click={() => this.onSortClick(el)}
                      >
                        <div>{el.name}</div>
                        <div class="sort-container">
                          <i
                            style={
                              this.sortForm.key === el.key && this.sortForm.type === 'descending'
                                ? 'color: #2877ff'
                                : ''
                            }
                            class="el-icon-caret-left sort-icon"
                          ></i>
                          <i
                            style={
                              this.sortForm.key === el.key && this.sortForm.type === 'ascending'
                                ? 'color: #2877ff'
                                : ''
                            }
                            class="el-icon-caret-right sort-icon"
                          ></i>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              class={this.is_total && this.day_arr.length > 10 ? 'center mgRight' : 'center'}
              // style={`grid-template-columns: repeat(${this.tableData.length}, 120px);`}
            >
              {this.tableData.map((col: any, colIdx: number) => {
                const allowEditing =
                  this.injectProject?.business_type === BusinessTypeEnum.douyin ||
                  this.injectProject?.business_type === BusinessTypeEnum.supplyChain ||
                  this.injectProject?.business_type === BusinessTypeEnum.locallife
                    ? ['gmv', 'wechat_video_gmv']
                    : ['gmv'];
                return (
                  <div
                    selected={this.is_total === false && this.selectedColIndex === colIdx}
                    class="col"
                    on-click={() => this.onColClick(colIdx, col)}
                    key={colIdx}
                  >
                    {this.projectItems.map((row, rowIdx) => {
                      let spanStyle = '';
                      if (col.is_rest) {
                        if (rowIdx === 2) {
                          const height = 32 * 17;
                          spanStyle = `height: ${height}px; max-height: ${height}px; line-height: ${height}px; display: flex; align-items: center; justify-content: center; border-bottom: none;`;
                        } else if (rowIdx > 2) {
                          spanStyle = `display: none`;
                        }
                      }
                      return (
                        <div
                          class={rowIdx === 0 ? 'header' : 'cell'}
                          style={spanStyle}
                          key={`${colIdx}-${rowIdx}`}
                          on-dblclick={() => {
                            console.log(this.injectProject, 'this.injectProject');
                            if (
                              (row.key === ProfitLossKeyType.gmv &&
                                (this.injectProject?.business_type === BusinessTypeEnum.douyin ||
                                  this.injectProject?.business_type ===
                                    BusinessTypeEnum.locallife ||
                                  this.injectProject?.business_type ===
                                    BusinessTypeEnum.supplyChain)) ||
                              (row.key === ProfitLossKeyType.wechat_video_gmv &&
                                (this.injectProject?.business_type === BusinessTypeEnum.douyin ||
                                  this.injectProject?.business_type ===
                                    BusinessTypeEnum.taobaopick ||
                                  this.injectProject?.business_type ===
                                    BusinessTypeEnum.locallife ||
                                  this.injectProject?.business_type ===
                                    BusinessTypeEnum.supplyChain))
                            ) {
                              set(
                                this.tableData[colIdx],
                                row.key + '_copy',
                                String(this.tableData[colIdx][row.key] / 100 || ''),
                              );
                              console.log(this.tableData[colIdx], 'this.tableData[colIdx]');

                              this.clickCellColumn = `${rowIdx}-${colIdx}`;
                            }
                            // if (
                            //   this.injectProject?.business_type !== BusinessTypeEnum.douyin &&
                            //   this.injectProject?.business_type !== BusinessTypeEnum.locallife &&
                            // )
                            //   return;
                            // set(
                            //   this.tableData[colIdx],
                            //   row.key + '_copy',
                            //   String(this.tableData[colIdx][row.key] / 100 || ''),
                            // );
                            // console.log(this.tableData[colIdx], 'this.tableData[colIdx]');
                            //
                            // this.clickCellColumn = `${rowIdx}-${colIdx}`;
                          }}
                        >
                          {rowIdx === 0 && this.is_total ? (
                            <div>{this.tableData[colIdx].day_name || colIdx}</div>
                          ) : col.is_rest ? (
                            rowIdx === 2 ? (
                              <div style="font-size: 56px; color: rgba(60,82,105,0.20);">休</div>
                            ) : (
                              <div>{row.formatter?.(col[row.key], col)}</div>
                            )
                          ) : // <div>{row.formatter?.(col[row.key], col)}</div>
                          this.clickCellColumn === `${rowIdx}-${colIdx}` &&
                            allowEditing.includes(row.key) ? (
                            <el-input
                              v-focus
                              v-model={this.tableData[colIdx][row.key + '_copy']}
                              size="mini"
                              class="inputCell"
                              key={`${rowIdx}-${colIdx}`}
                              onInput={(value: string) => {
                                const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value) as any;

                                this.tableData[colIdx][row.key + '_copy'] = match ? match[0] : '';
                              }}
                              onBlur={() => {
                                this.clickCellColumn = '';

                                const params = {
                                  project_id: this.tableData[colIdx].project_id,
                                  date: this.tableData[colIdx].date.replace(/-/g, ''),
                                  ...allowEditing.reduce((prev, next) => {
                                    const cData = this.tableData[colIdx];
                                    const amount =
                                      cData[row.key === next ? next + '_copy' : next] || 0;
                                    return {
                                      ...prev,
                                      [next]: row.key === next ? amount : +amount / 100,
                                    };
                                  }, {}),
                                  // [row.key]: this.tableData[colIdx][row.key + '_copy'] || 0,
                                };
                                const str =
                                  this.tableData[colIdx][row.key] === null
                                    ? ''
                                    : this.tableData[colIdx][row.key];
                                console.log(this.tableData[colIdx], str, 'sss');

                                if (this.tableData[colIdx][row.key + '_copy'] !== str) {
                                  this.onInputBlur(params);
                                }
                              }}
                              v-key-enter={() => {
                                this.clickCellColumn = '';
                                // const params = {
                                //   project_id: this.tableData[colIdx].project_id,
                                //   date: this.tableData[colIdx].date,
                                //   [row.key]: this.tableData[colIdx][row.key],
                                // };
                                // this.onInputBlur(params);
                              }}
                            />
                          ) : (
                            <div>{row.formatter?.(col[row.key], col)}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              {this.is_total && this.day_arr.length < 10 && (
                <div>
                  {this.totalData.map((col: any, colIdx: number) => {
                    return (
                      <div
                        selected={this.is_total === false && this.selectedColIndex === colIdx}
                        class="col"
                        on-click={() => this.onColClick(colIdx, col)}
                        key={colIdx}
                      >
                        {this.projectItems.map((row, rowIdx) => {
                          let spanStyle = '';
                          if (col.is_rest) {
                            if (rowIdx === 2) {
                              const height = 32 * 17;
                              spanStyle = `height: ${height}px; max-height: ${height}px; line-height: ${height}px; display: flex; align-items: center; justify-content: center; border-bottom: none;`;
                            } else if (rowIdx > 2) {
                              spanStyle = `display: none`;
                            }
                          }
                          return (
                            <div
                              class={rowIdx === 0 ? 'header' : 'cell'}
                              style={spanStyle}
                              key={`${colIdx}-${rowIdx}`}
                            >
                              {rowIdx === 0 && this.is_total && this.day_list.length > colIdx ? (
                                <div>合计</div>
                              ) : col.is_rest ? (
                                rowIdx === 2 ? (
                                  <div style="font-size: 56px; color: var(--text-third-color);">
                                    休
                                  </div>
                                ) : (
                                  <div>{row.formatter?.(col[row.key], col)}</div>
                                )
                              ) : (
                                <div>{row.formatter?.(col[row.key], col)}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {this.is_total && this.day_arr.length > 10 && (
              <div class="right">
                <div class="right-bg"></div>
                {this.totalData.map((col: any, colIdx: number) => {
                  return (
                    <div
                      selected={this.is_total === false && this.selectedColIndex === colIdx}
                      class="col"
                      on-click={() => this.onColClick(colIdx, col)}
                      key={colIdx}
                    >
                      {this.projectItems.map((row, rowIdx) => {
                        let spanStyle = '';
                        if (col.is_rest) {
                          if (rowIdx === 2) {
                            const height = 32 * 17;
                            spanStyle = `height: ${height}px; max-height: ${height}px; line-height: ${height}px; display: flex; align-items: center; justify-content: center; border-bottom: none;`;
                          } else if (rowIdx > 2) {
                            spanStyle = `display: none`;
                          }
                        }
                        return (
                          <div
                            class={rowIdx === 0 ? 'header' : 'cell'}
                            style={spanStyle}
                            key={`${colIdx}-${rowIdx}`}
                          >
                            {rowIdx === 0 && this.is_total && this.day_list.length > colIdx ? (
                              <div>合计</div>
                            ) : col.is_rest ? (
                              rowIdx === 2 ? (
                                <div style="font-size: 56px; color: rgba(60,82,105,0.20);">休</div>
                              ) : (
                                <div>{row.formatter?.(col[row.key], col)}</div>
                              )
                            ) : (
                              <div>{row.formatter?.(col[row.key], col)}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div
            class="empth"
            style="height: 300px; display: flex; justify-content: center; align-items: center;"
          >
            <empty-common detail-text="暂无数据"></empty-common>
          </div>
        )}
      </div>
    );
  },
});
