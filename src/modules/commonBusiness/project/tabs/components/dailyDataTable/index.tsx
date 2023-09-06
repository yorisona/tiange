import { computed, defineComponent, h, onMounted, PropType, ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { ElInput } from 'element-ui/types/input';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
import {
  S2B2CDouyinDailyReportDateInfo,
  S2B2CDouyinDailyReportTotalInfo,
} from '@/types/tiange/commonBusiness/project';

type DailyDataCol = TableColumn<TableModel>;
export interface TableModel extends S2B2CDouyinDailyReportDateInfo {
  dateNum: number;
  weekDate: string;
  dateMoment: moment.Moment | undefined;
}

export default defineComponent({
  name: 'TgDailyDataTable',
  props: {
    showTableData: {
      type: Array as PropType<TableModel[]>,
    },
    totalData: {
      type: Object as PropType<S2B2CDouyinDailyReportTotalInfo>,
    },
    editEnabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const gmvTarget = computed(() => props.totalData?.gmv_goal);
    const tableData = computed<TableModel[]>(() => props.showTableData ?? []);
    const resizeBool = ref<boolean>(false);
    const columns = computed<DailyDataCol[]>(() => [
      {
        prop: 'dateNum',
        align: 'center',
        fixed: 'left',
        resizable: false,
        width: 156,
        formatter: row => {
          return h(
            'div',
            {
              style:
                'height: 32px; line-height: 32px; display: flex; align-items: center; justify-content: center;',
            },
            [
              h('span', { class: 'date-day' }, `${row.dateNum}`),
              h('span', { class: 'date-week' }, row.weekDate),
            ],
          );
        },
      },
      {
        label: 'GMV (元)',
        prop: 'dateNum',
        align: 'right',
        headerAlign: 'center',
        resizable: false,
        minWidth: 120,
        formatter: row => {
          let divClass = 'table-cell-container';
          let content = undefined;
          if (row.dateMoment?.isAfter(moment(), 'day')) {
            divClass = divClass + ' ' + 'empty';
          } else {
            content = row.gmv ? formatAmount(row.gmv, 'None') : '0';
          }
          return h('div', { class: divClass }, content);
        },
      },
      {
        label: '目标累计完成度',
        prop: 'dateNum',
        align: 'right',
        headerAlign: 'center',
        resizable: false,
        minWidth: 120,
        formatter: row => {
          let divClass = 'table-cell-container';
          let content = undefined;
          if (row.dateMoment?.isAfter(moment(), 'day')) {
            divClass = divClass + ' ' + 'empty';
          } else {
            content =
              row.gmv_rate === undefined || row.gmv_rate === null ? '--' : `${row.gmv_rate}%`;
          }
          return h('div', { class: divClass }, content);
        },
      },
      {
        label: '直播时长',
        prop: 'dateNum',
        align: 'right',
        headerAlign: 'center',
        resizable: false,
        minWidth: 120,
        formatter: row => {
          let divClass = 'table-cell-container';
          let content = undefined;
          if (row.dateMoment?.isAfter(moment(), 'day')) {
            divClass = divClass + ' ' + 'empty';
          } else {
            content = row.live_duration_str ? row.live_duration_str : '--';
          }
          return h('div', { class: divClass }, content);
        },
      },
      {
        label: '预估佣金收入 (元)',
        prop: 'dateNum',
        align: 'right',
        headerAlign: 'center',
        resizable: false,
        minWidth: 120,
        formatter: row => {
          let divClass = 'table-cell-container';
          let content = undefined;
          if (row.dateMoment?.isAfter(moment(), 'day')) {
            divClass = divClass + ' ' + 'empty';
          } else {
            content = row.estimated_institution_commission
              ? formatAmount(row.estimated_institution_commission / 100, 'None')
              : '0';
          }
          return h('div', { class: divClass }, content);
        },
      },
    ]);
    const clickDate = ref('');
    const editGmvInput = ref<ElInput | undefined>(undefined);
    const old_gmv = ref('');
    const methods = {
      onChange(row: any) {
        const val = String(row.gmv);
        const match = /(\d+)$|\d+\.?\d{0,2}/.exec(val);
        row.gmv = match ? match[0] : '';
      },
      onInputBlur(row: any) {
        clickDate.value = '';
        if (old_gmv.value !== String(row.gmv || '')) {
          old_gmv.value = String(row.gmv || '');
          ctx.emit('gmvChanged', row);
        }
      },
      getSummaries(param: any) {
        const { columns, _ } = param;
        return columns.map((column: DailyDataCol, index: number) => {
          switch (index) {
            case 0:
              return '合计';
            case 1:
              return props.totalData?.gmv ? formatAmount(props.totalData.gmv, 'None') : '0';
            case 2:
              return props.totalData?.gmv_rate === undefined || props.totalData?.gmv_rate === null
                ? '--'
                : `${props.totalData?.gmv_rate}%`;
            case 3:
              return props.totalData?.live_duration_str ? props.totalData?.live_duration_str : '--';
            case 4:
              return props.totalData?.estimated_institution_commission
                ? formatAmount(props.totalData.estimated_institution_commission / 100, 'None')
                : '0';
            case 5:
              return props.totalData?.gmv_goal
                ? formatAmount(props.totalData.gmv_goal, 'None', true)
                : '0';
            default:
              return '--';
          }
        });
      },
      formatAmount,
    };
    onMounted(() => {
      setTimeout(() => {
        window.onresize = () => {
          resizeBool.value = true;
        };
      }, 500);
    });
    return {
      old_gmv,
      editGmvInput,
      clickDate,
      resizeBool,
      gmvTarget,
      tableData,
      columns,
      ...methods,
    };
  },
  render() {
    const { columns, tableData, gmvTarget, resizeBool, editEnabled } = this;
    const gmvTargetStr = this.formatAmount(gmvTarget || '0', 'None', true);
    return (
      <div class="daily-data-table-component">
        <el-table
          class={resizeBool ? 'table-left resize' : 'table-left'}
          data={tableData}
          height="100%"
          border
          stripe
          show-summary
          summary-method={this.getSummaries}
        >
          <template slot="empty">
            <empty-common detail-text="暂无数据" />
          </template>
          {columns.map((el: DailyDataCol, index) => {
            if (el.label !== 'GMV (元)' || editEnabled === false) {
              return <el-table-column props={{ ...el }} key={index} />;
            } else {
              return (
                <el-table-column
                  props={{ ...el }}
                  key={index}
                  resizable={false}
                  scopedSlots={{
                    default: ({ row, column }: any) => {
                      if (row.date === this.clickDate) {
                        return (
                          <div class="table-cell-container el-input-div">
                            <el-input
                              v-key-enter={() => {
                                this.onInputBlur(row);
                              }}
                              v-focus
                              ref="editGmvInput"
                              key={row.date}
                              v-model={row.gmv}
                              size="mini"
                              onInput={this.onChange(row)}
                              onBlur={() => this.onInputBlur(row)}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div
                            class="table-cell-container ee"
                            on-dblclick={() => {
                              if (editEnabled) {
                                this.clickDate = row.date;
                                this.old_gmv = String(row.gmv || '');
                              }
                            }}
                          >
                            {row.gmv && row.gmv !== '0' ? formatAmount(row.gmv, 'None') : '0'}
                          </div>
                        );
                      }
                    },
                  }}
                />
              );
            }
          })}
        </el-table>
        <el-table
          class="table-right"
          data={[{}]}
          height="100%"
          border
          show-summary
          sum-text={gmvTargetStr}
        >
          <el-table-column resizable={false} label="GMV目标 (元)" minWidth="183" align="center">
            {
              <fragments>
                <div class={gmvTarget ? 'gmv-target' : 'gmv-target-none'}>
                  {gmvTarget !== null ? gmvTargetStr : ''}
                </div>
              </fragments>
            }
          </el-table-column>
        </el-table>
      </div>
    );
  },
});
