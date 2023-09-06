import {
  ref,
  defineComponent,
  h,
  watchEffect,
  nextTick,
  computed,
  reactive,
} from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import capsuleGroup from '@/components/Button/capsuleGroup';
import { useRequest } from '@gm/hooks/ahooks';
import { useTableConversionRow } from './use';
import { numberFormat } from '@/utils/formatMoney';
import { useDialog } from '@/use/dialog';
import mergeSplit from './dialog/mergeSplit.vue';
import sessionSetting from './dialog/sessionSetting.vue';
import { RouterNameProjectManage } from '@/const/router';
import {
  query_merge_shop_live_list,
  insert_or_update_shop_live_define_record,
  query_shop_live_define_record,
  update_merge_shop_live_goal_gmv,
  merge_multiple_shop_live,
  merge_shop_live_split,
} from '@/services/live';
import { GetLastUpdateTime } from '@/services/datacenter/shoplive';

enum DateType {
  week = 1,
  month = 2,
  daterange = 3,
}

type Formatter = (text?: any, row?: any, column?: any, idx?: number) => any;

interface Column {
  label: string;
  align?: string;
  prop?: string;
  type?: string;
  formatter?: Formatter;
  sortable?: string;
}

const formatPercentage = (v: any, row: any) => {
  return v !== null ? v + '%' : '--';
};

const formatPrice = (v: any, row: any) => {
  return v ? numberFormat(v / 100, 2) : '--';
};

// const foldMap = ref<Map<any, any[]>>(new Map());

export default defineComponent({
  components: {
    capsuleGroup,
  },
  setup: (props, ctx) => {
    // 时间区间
    const dateType = ref(DateType.week);
    const dateTime = ref<string | string[]>('');
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const business_type: any = router.currentRoute.query.business_type
      ? router.currentRoute.query.business_type.toString()
      : undefined;

    const methods = {
      changeDateType(v = DateType.week) {
        if (v === DateType.daterange) {
          // 默认今天
          dateTime.value = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
          return;
        }
        dateTime.value = moment().format('YYYY-MM-DD');
      },
      getRangeDate(date: string | string[]) {
        if (dateType.value === DateType.week) {
          return (
            moment(date).startOf('week').format('YYYY.MM.DD') +
            '-' +
            moment(date).endOf('week').format('YYYY.MM.DD')
          );
        } else {
          return (
            moment(date).startOf('month').format('YYYY.MM.DD') +
            '-' +
            moment(date).endOf('month').format('YYYY.MM.DD')
          );
        }
      },
      // 获取最后更新时间
      GetLastUpdateTime: useRequest(GetLastUpdateTime, {
        defaultParams: [
          {
            project_id,
            is_from_project: true,
          },
          business_type,
        ],
      }),
      // 查询场次设置
      QueryShopLiveDefineRecordReq: useRequest(query_shop_live_define_record, {
        manual: true,
      }),
      // 更新场次目标GMV
      update_merge_shop_live_goal_gmv: useRequest(update_merge_shop_live_goal_gmv, {
        manual: true,
      }),
      // 场次合并
      merge_multiple_shop_live: useRequest(merge_multiple_shop_live, {
        manual: true,
      }),
      // 场次拆分
      merge_shop_live_split: useRequest(merge_shop_live_split, {
        manual: true,
      }),
    };
    methods.changeDateType();
    // 表格数据

    const formatLink = (v: any, row: any) => {
      return (
        <div style={{ textAlign: 'center' }}>
          <tg-button
            type="link"
            onClick={() => {
              router.push({
                name: RouterNameProjectManage.tiktokLive.project.revisionDetail.sessionReviewDetail,
                query: {
                  project_id: project_id + '',
                  from_project: '1',
                  project_name: router.currentRoute.params.project_name,
                  // shop_live_id: '42750',
                  merge_live_id: row.id,
                },
              });
            }}
          >
            查看详情
          </tg-button>
        </div>
      );
    };
    const query_shop_live_define_record_req = useRequest(query_merge_shop_live_list, {
      manual: true,
      transform: (res: any) => {
        const result = res.map((item: any) => {
          return {
            ...item,
            goal_gmv: item.goal_gmv ? item.goal_gmv / 100 : item.goal_gmv,
            live_start_time: item.live_start_time * 1000,
            live_end_time: item.live_end_time * 1000,
          };
        });
        changeList.value = result;
        return result;
      },
    });
    const edit_Data = reactive<any>({
      field: null,
      value: '',
    });
    const colunm: Column[] = [
      {
        label: '指标/场次',
        prop: 'asset_code',
        formatter: (v, row) => {
          const renderTitle = (row: any, isComplete = false) => {
            if (isComplete) {
              return `${moment(row.live_start_time).format('MM.DD HH:mm')} ~ ${moment(
                row.live_end_time,
              ).format('MM.DD HH:mm')} ${row.live_title ? `(${row.live_title})` : ''}`;
            }
            if (row.live_title) {
              return `${moment(row.live_start_time).format('MM.DD')} (${row.live_title})`;
            } else {
              return (
                <fragments>
                  <span>{moment(row.live_start_time).format('MM.DD HH:mm')}~</span>
                  <span>{moment(row.live_end_time).format('MM.DD HH:mm')}</span>
                </fragments>
              );
            }
          };
          return (
            <div class="header-warp">
              <el-tooltip
                // disabled
                class="item"
                content={renderTitle(row, true)}
                placement="top"
              >
                <div>
                  <div
                    class="text"
                    style={!row.live_title && 'display: flex;flex-direction: column;'}
                  >
                    {renderTitle(row)}
                  </div>
                  <span v-show={row.is_multi_live_merge === 1} class="tag-add">
                    合
                  </span>
                </div>
              </el-tooltip>
            </div>
          );
        },
      },
      {
        label: '目标 (元)',
        prop: 'goal_gmv',
        formatter: (v, row, col, idx) => {
          const field = 'goal_gmv';
          return (
            <div id={`field_${col.prop}_${idx}`}>
              {edit_Data.field === `field_${col.prop}_${idx}` ? (
                <el-input
                  size="mini"
                  value={edit_Data.value}
                  onInput={(e: string) => {
                    // 只能输入数字和小数点
                    const reg = /^\d*\.?\d{0,2}$/;
                    if (!reg.test(e)) {
                      return;
                    }
                    edit_Data.value = e;
                    // set(row, field, e);
                  }}
                  onBlur={() => {
                    edit_Data.field = null;
                    methods.update_merge_shop_live_goal_gmv
                      .runAsync({
                        goal_gmv: edit_Data.value,
                        merge_live_id: row.id,
                      })
                      .then(res => {
                        if (res.data.success) {
                          query_shop_live_define_record_req.reload();
                          ctx.root.$message.success('操作成功');
                        } else {
                          ctx.root.$message.error(res.data.message);
                        }
                      });
                  }}
                />
              ) : (
                <div
                  style="height:28px;line-height:28px;"
                  onDblclick={() => {
                    edit_Data.field = `field_${col.prop}_${idx}`;
                    edit_Data.value = row[field];

                    nextTick(() => {
                      (document.getElementById(`field_${col.prop}_${idx}`) as any)
                        .querySelector('input')
                        .focus();
                    });
                  }}
                >
                  {numberFormat(row[field], 2) ?? (
                    <span style="color:var(--text-four-color)">双击输入填写</span>
                  )}
                </div>
              )}
            </div>
          );
        },
      },
      {
        label: 'GMV (元)',
        prop: 'gmv',
        formatter: (v, row) => {
          return v ? (
            <sapn
              style={
                !row.goal_gmv
                  ? ''
                  : v >= Number(row.goal_gmv * 100 || 0)
                  ? 'color:#20BF55;'
                  : 'color:#ED3434;'
              }
            >
              {numberFormat(v / 100, 2)}
            </sapn>
          ) : (
            '--'
          );
        },
      },
      { label: '场观', prop: 'pv' },
      { label: 'UV', prop: 'uv', sortable: 'follow_flow_ratio' },
      { label: '直播间流量占比', prop: 'feed_flow_ratio', formatter: formatPercentage },
      { label: '短视频流量占比', prop: 'short_video_flow_ratio', formatter: formatPercentage },
      { label: '投放流量占比', prop: 'ad_flow_ratio', formatter: formatPercentage },
      { label: '关注流量占比', prop: 'follow_flow_ratio', formatter: formatPercentage },
      { label: '件单价 (元)', prop: 'pieces_sale_price', formatter: formatPrice },
      { label: '客单价 (人均消费金额:元)', prop: 'customer_sale_price', formatter: formatPrice },
      {
        label: '自然转化率',
        prop: 'pay_watch_ratio',
        sortable: 'product_click_product_watch_ratio',
        formatter: formatPercentage,
      },
      { label: '曝光-进入率(大屏)', prop: 'show_watch_ratio', formatter: formatPercentage },
      { label: '观看-商品曝光率', prop: 'product_watch_watch_ratio', formatter: formatPercentage },
      {
        label: '商品曝光-点击率(人数)',
        prop: 'product_click_product_watch_ratio',
        formatter: formatPercentage,
      },
      { label: '点击成交转化率', prop: 'pay_click_ratio', formatter: formatPercentage },
      { label: '互动率', prop: 'interact_num_ratio', formatter: formatPercentage },
      { label: '转粉率', prop: 'fans_watch_ratio', formatter: formatPercentage },
      { label: '停留 (秒)', prop: 'duration_avg_ecom' },
      { label: '新增粉丝', prop: 'incr_fans_cnt' },
      { label: '新增粉丝团', prop: 'incr_fans_club_cnt' },
      { label: '总GPM', prop: 'gpm', sortable: 'brand_ad_gpm', formatter: formatPrice },
      { label: '直播推荐GPM', prop: 'feed_gpm', formatter: formatPrice },
      { label: '关注GPM', prop: 'follow_gpm', formatter: formatPrice },
      { label: '短视频引流GPM', prop: 'short_video_gpm', formatter: formatPrice },
      { label: '其他GPM', prop: 'others_gpm', formatter: formatPrice },
      { label: '千川GPM', prop: 'qian_chuan_pc_gpm', formatter: formatPrice },
      { label: '随心推GPM', prop: 'sui_xin_tui_gpm', formatter: formatPrice },
      { label: '品牌包GPM', prop: 'brand_ad_gpm', formatter: formatPrice },
      { label: '场次退货率', prop: 'refund_rate', formatter: formatPercentage },
      { label: '粉丝成交占比', prop: 'pay_fans_ratio', formatter: formatPercentage },
      { label: '投放roi', prop: 'ad_roi' },
      { label: '整场roi', prop: 'roi' },
      { label: '人均连带件数', prop: 'avg_order_combination_sale_count' },
      { label: '看播新人占比', prop: 'watch_new_fans_ratio', formatter: formatPercentage },
      { label: '看播老粉占比', prop: 'watch_old_fans_ratio', formatter: formatPercentage },
      { label: '操作', prop: 'caozuo', formatter: formatLink },
    ];
    const temp = ref(false);
    const recordData = computed(() => query_shop_live_define_record_req.data ?? []);
    const init = () => {
      temp.value = !temp.value;
    };
    const tableData = useTableConversionRow({
      columns: colunm,
      data: recordData as any,
    });
    watchEffect(() => {
      temp.value;
      query_shop_live_define_record_req.runAsync(
        {
          project_id,
          start_date:
            dateType.value === DateType.week || dateType.value === DateType.month
              ? moment(methods.getRangeDate(dateTime.value).split('-')[0]).format('YYYY-MM-DD')
              : moment(dateTime.value[0]).format('YYYY-MM-DD'),
          end_date:
            dateType.value === DateType.week || dateType.value === DateType.month
              ? moment(methods.getRangeDate(dateTime.value).split('-')[1]).format('YYYY-MM-DD')
              : moment(dateTime.value[1]).format('YYYY-MM-DD'),
        },
        business_type,
      );
    });
    // 弹框
    const changeList = ref([]);
    const mergeSplitDialog = useDialog({
      props: {
        data: changeList,
      },
      component: mergeSplit,
      title: '场次合并/拆分',
      width: '560px',
      okText: '合并',
      on: {
        submit(row: any) {
          methods.merge_multiple_shop_live
            .runAsync({
              project_id,
              merge_shop_live_ids: row.map((item: any) => item.id),
            })
            .then(res => {
              if (res.data.success) {
                ctx.root.$message.success('操作成功');
                init();
              } else {
                ctx.root.$message.error(res.data.message);
              }
              mergeSplitDialog.close();
            });
        },
        split(row: any) {
          methods.merge_shop_live_split
            .runAsync({
              merge_live_id: row.id,
            })
            .then(res => {
              if (res.data.success) {
                ctx.root.$message.success('操作成功');
                init();
              } else {
                ctx.root.$message.error(res.data.message);
              }
            });
        },
      },
    });
    const sessionSettingDialog = useDialog({
      component: sessionSetting,
      title: '场次设置',
      width: '475px',
      okText: '确定',
      on: {
        submit(row: any) {
          insert_or_update_shop_live_define_record({
            define_list: row,
            project_id,
          }).then(res => {
            if (res.data.success) {
              ctx.root.$message.success('操作成功');
              sessionSettingDialog.close();
              init();
            } else {
              ctx.root.$message.error(res.data.message);
            }
          });
        },
      },
    });
    return {
      dateType,
      project_id,
      business_type,
      dateTime,
      tableData,
      query_shop_live_define_record_req,
      mergeSplitDialog,
      sessionSettingDialog,
      colunm,
      ...methods,
    };
  },
  render() {
    const dateBar = (
      <div class="date-box">
        <capsule-group
          v-model={this.dateType}
          options={[
            { label: '周', value: DateType.week },
            { label: '月度', value: DateType.month },
            { label: '自定义', value: DateType.daterange },
          ]}
          onChange={this.changeDateType}
        />
        <el-date-picker
          key={'syb' + this.dateType}
          v-model={this.dateTime}
          class="mgl-16"
          style="width: 270px;"
          type={
            this.dateType === DateType.week
              ? 'week'
              : this.dateType === DateType.month
              ? 'month'
              : 'daterange'
          }
          format={
            this.dateType === DateType.week
              ? `yyyy第WW周 (${this.getRangeDate(this.dateTime)})`
              : this.dateType === DateType.month
              ? `yyyy年MM月 (${this.getRangeDate(this.dateTime)})`
              : 'yyyy.MM.dd'
          }
          picker-options={{
            disabledDate: (current: any) => {
              const end = moment();
              return current.valueOf() > end.valueOf();
            },
          }}
          size="small"
          clearable={false}
        />
        <span class="updata-date">
          数据更新时间：{moment(this.GetLastUpdateTime.data).format('YYYY.MM.DD HH:mm:ss')}
        </span>
        <div class="btn-box">
          <tg-button
            onClick={() => {
              this.QueryShopLiveDefineRecordReq.runAsync(
                {
                  project_id: this.project_id,
                },
                this.business_type,
              ).then(res => {
                this.sessionSettingDialog.show(res.data.data ?? []);
              });
            }}
          >
            场次设置
          </tg-button>
          <tg-button
            type="primary"
            class="mgl-8"
            onClick={() => {
              this.mergeSplitDialog.show(this.query_shop_live_define_record_req.data ?? []);
            }}
          >
            场次合并/拆分
          </tg-button>
        </div>
      </div>
    );

    return (
      <div class="sessionReview-wrap">
        <div class="date-wrap">{dateBar}</div>
        <div class="bar"></div>
        <div class="container mgt-12" v-loading={this.query_shop_live_define_record_req.loading}>
          <div style="height: 100%; position: relative;">
            {this.query_shop_live_define_record_req.data?.length ? (
              <vxe-table
                show-header={false}
                // highlight-hover-row
                border
                tooltip-config={{
                  theme: 'light',
                }}
                show-overflow
                // scroll-x={{ gt: 30 }}
                // scroll-y={{ gt: 30 }}
                auto-resize={true}
                height={'100%'}
                v-loading={this.loading}
                data={this.tableData.data ?? []}
              >
                <template slot="empty">
                  <empty-common detail-text="暂无数据"></empty-common>
                </template>
                {this.tableData.columns.map(v => (
                  <vxe-column
                    title={v.label}
                    field={v?.prop}
                    fixed={v.fixed}
                    align={v?.prop === 'asset_code' ? 'center' : v.align}
                    headerAlign={v.headerAlign}
                    // min-width={200}
                    width={v.width ? v.width : 135}
                    // minWidth={200}
                    scopedSlots={{
                      default: (item: any) => {
                        const data = this.query_shop_live_define_record_req?.data ?? [];
                        if (item.columnIndex === 0) {
                          // 折叠
                          // if (this.colunm[item.rowIndex]?.sortable) {
                          //   const columns = this.colunm;
                          //   const index = item.rowIndex;
                          //   const $index = item.$rowIndex;
                          //   const sortable = columns[index].sortable;
                          //   return (
                          //     <div
                          //       class="first_column_sort"
                          //       style={'cursor:pointer;'}
                          //       onclick={() => {
                          //         const currentProp = columns[index].prop;
                          //         const foldColumns = foldMap.value.get(currentProp);

                          //         if (!foldColumns) {
                          //           // 折叠
                          //           const endIndex = columns.findIndex(
                          //             (v: any) => v.prop === sortable,
                          //           );
                          //           console.log(index, $index, endIndex, item, 'foldColumns');
                          //           if (endIndex === -1) return;

                          //           foldMap.value.set(
                          //             currentProp,
                          //             item.data.slice($index + 1, endIndex + 1),
                          //           );
                          //           item.data.splice($index + 1, endIndex - $index);
                          //         } else {
                          //           // 展开
                          //           item.data.splice($index + 1, 0, ...foldColumns);

                          //           foldMap.value.delete(currentProp);
                          //         }
                          //       }}
                          //     >
                          //       <fragments>
                          //         <span
                          //           class={'el-icon-arrow-down mgr-6'}
                          //           style={
                          //             foldMap.value.has(columns[index].prop)
                          //               ? 'transform:rotate(-90deg); '
                          //               : 'transform:rotate(0deg);'
                          //           }
                          //           onclick={(e: MouseEvent) => {
                          //             e.stopPropagation();
                          //           }}
                          //         />
                          //       </fragments>
                          //       <span class="first_column">{columns[index].label}</span>
                          //     </div>
                          //   );
                          // }

                          return this.colunm[item.rowIndex]?.label;
                        }
                        if (item.rowIndex === 0 || item.rowIndex === 1) {
                          return (this.colunm[item.rowIndex] as any)?.formatter(
                            undefined,
                            data[item.columnIndex - 1],
                            v,
                            item.columnIndex,
                          );
                        }
                        // if (data[item.rowIndex]) {
                        const farmat = (this.colunm[item.rowIndex] as any)?.formatter;
                        if (farmat) {
                          return farmat(
                            data[item.columnIndex - 1][this.colunm[item.rowIndex].prop as any],
                            data[item.columnIndex - 1],
                            v,
                            item.columnIndex,
                          );
                        }
                        return data[item.columnIndex - 1][this.colunm[item.rowIndex]?.prop as any];
                        // }
                      },
                    }}
                  />
                ))}
              </vxe-table>
            ) : (
              <empty-common class="p-align-center" detail-text="暂无数据"></empty-common>
            )}
          </div>
          {/* <tg-table
            show-header={false}
            height="100%"
            border={true}
            columns={this.tableData.columns}
            data={this.tableData.data}
          >
            <div class="tg-page-empty" slot="empty">
              <empty-common img-height="100" img-width="150" />
            </div>
          </tg-table> */}
        </div>
      </div>
    );
  },
});
