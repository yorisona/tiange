import { TableColumn } from '@/types/vendor/column';
import { formatAmount } from '@/utils/string';
import {
  defineComponent,
  ref,
  onMounted,
  h,
  watch,
  onUnmounted,
  inject,
} from '@vue/composition-api';
// import { wait } from '@/utils/func';
import { selectControlPopoverHide } from '@/utils/tree-other';
// import { wait } from '@/utils/func';
import moment from 'moment';
import {
  QueryDouyinItemExportRecord,
  QueryDouyinItemExportRecordStatus,
} from '@/services/workbentch';
import { wait } from '@/utils/func';
import {
  DouyinItemRecordExportModel,
  DouyinItemRecordExportParams,
  DouyinItemRecordStatus,
} from '@/types/tiange/workbench';
// import { getToken } from '@/utils/token';
import { deepClone } from '@/utils/tools';

type MineFilesForm = DouyinItemRecordExportParams & { total: number };

type Col = TableColumn<DouyinItemRecordExportModel>;

export default defineComponent({
  name: 'billingPeriod',
  setup(props, ctx) {
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        total: 0,
      } as MineFilesForm;
    };
    const loading = ref(false);

    const queryForm = ref(initQueryForm());
    const tableData = ref<DouyinItemRecordExportModel[]>([]);
    const timeIntervalToken = ref<number | undefined>(undefined);

    const routes = [
      {
        title: '工作台',
        path: '/workbench',
      },
      {
        title: '我的文件',
        path: '',
      },
    ];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const methods = {
      async queryDouyinItemExportRecordFiles() {
        const { total, ...rest } = queryForm.value;
        loading.value = true;
        const [res] = await wait(
          500,
          QueryDouyinItemExportRecord({
            ...rest,
          }),
        );
        loading.value = false;
        if (res.data.success) {
          queryForm.value.total = res.data.data.total;
          tableData.value = res.data.data.data ?? [];
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      async queryDouyinItemExportRecordFilesStatus(ids: string) {
        const res = await QueryDouyinItemExportRecordStatus({ record_ids: ids });
        if (res.data.success) {
          const data = res.data.data ?? [];
          const cloneTableData = deepClone(tableData.value) as DouyinItemRecordExportModel[];
          data.forEach(el => {
            const findIndex = cloneTableData.findIndex(td => td.id === el.id);
            if (findIndex !== -1) {
              const finderEl = cloneTableData[findIndex];
              cloneTableData[findIndex] = {
                ...finderEl,
                ...el,
              };
            }
          });
          tableData.value = cloneTableData;
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
      onQueryHandler(page = 1) {
        queryForm.value.page_num = page;
        methods.queryDouyinItemExportRecordFiles();
      },
      onResetHandler() {
        queryForm.value = initQueryForm();
        methods.onQueryHandler();
      },
      onDownloadFile(filePath: string) {
        // console.log('🚀 ~ file: index.tsx ~ line 99 ~ onDownloadFile ~ filePath', filePath);
        // window.open(
        //   'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/prod/export_excel/douyin_item_report_2022-09-05_15%3A35%3A29.xlsx?attname=douyin.xlsx',
        // );
        window.open(`${filePath}`, '_blank');
        // const requestOptions = {
        //   headers: {
        //     Authorization: getToken() ?? '',
        //   },
        // };
        // fetch(filePath, requestOptions).then(async response => {
        //   const result = response.clone();
        //   try {
        //     const data = await result.json();
        //     ctx.root.$message.error(data.message);
        //   } catch {
        //     if (response.status === 200) {
        //       const data = await response.blob();
        //       const filename = fileName
        //         ? `${fileName}.xlsx`
        //         : decodeURIComponent(filePath.split('/')[filePath.split('/').length - 1]);
        //       downloadFileFromBlob(data, filename);
        //     } else {
        //       ctx.root.$message.error('下载失败');
        //     }
        //   }
        // });
      },
      clearInterval() {
        if (timeIntervalToken.value) {
          clearTimeout(timeIntervalToken.value);
        }
      },
      formatAmount,
    };

    const columns = ref<Col[]>([
      {
        label: '文件名称',
        minWidth: 150,
        // align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.show_file_name || '--';
        },
      },
      {
        label: '时间周期',
        minWidth: 150,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          if (row.start_date && row.end_date) {
            return `${row.start_date.replace(/-/g, '.')}-${row.end_date.replace(/-/g, '.')}`;
          }
          return '--';
        },
      },
      {
        label: '操作人',
        minWidth: 120,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.user_name || '--';
        },
      },
      {
        label: '生成时间',
        minWidth: 180,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          return row.export_end_date
            ? moment(row.export_end_date * 1000).format('yyyy.MM.DD HH:mm:ss')
            : '--';
        },
      },
      {
        label: '操作',
        minWidth: 180,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => {
          switch (row.status) {
            case DouyinItemRecordStatus.finished: {
              return h(
                'a',
                {
                  domProps: {
                    href: row.export_file_url?.replace(/http:\/\//, 'https://'),
                    download: `${row.show_file_name}.xlsx`,
                    target: '_blank',
                  },
                },
                '下载文件',
              );
              // return h(
              //   'tg-button',
              //   {
              //     props: {
              //       type: 'link',
              //     },
              //     on: {
              //       click: () => {
              //         methods.onDownloadFile(row.export_file_url ?? '');
              //       },
              //     },
              //   },
              //   '下载文件',
              // );
            }
            case DouyinItemRecordStatus.failed: {
              return h(
                'div',
                {
                  class: 'file-status-failed',
                },
                '生成失败',
              );
            }
            case DouyinItemRecordStatus.executing:
            case DouyinItemRecordStatus.watingExecute: {
              return h(
                'div',
                {
                  class: 'file-status-executing',
                },
                [h('i', { class: 'el-icon-loading' }), h('span', '生成中...')],
              );
            }
            default:
              break;
          }
        },
      },
    ]);

    onMounted(async () => {
      methods.onQueryHandler();
    });

    watch(
      () => tableData.value,
      newVal => {
        const ids =
          newVal
            ?.filter(
              el =>
                el.status === DouyinItemRecordStatus.watingExecute ||
                el.status === DouyinItemRecordStatus.executing,
            )
            ?.map(el => el.id) || [];
        methods.clearInterval();
        if (ids?.length) {
          timeIntervalToken.value = setInterval(() => {
            methods.queryDouyinItemExportRecordFilesStatus(ids.join(','));
          }, 3000);
        }
      },
    );

    onUnmounted(() => {
      methods.clearInterval();
    });

    return {
      loading,
      routes,
      tableData,
      columns,
      queryForm,
      selectControlPopoverHide,
      // daylyReportStatistics,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-workbench-download-mine-files-container tg-page-container">
        {/* <section class="query-field">
          <el-form size="small">
            <el-form-item label="账期：">
              <el-date-picker
                style="width: 210px;"
                v-model={this.queryForm.account_month}
                type="month"
                placeholder="请选择月份"
                format="yyyy.MM"
                value-format="yyyy-MM"
                editable={false}
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="" label-width="0">
              <div>
                <tg-button type="primary" on-click={() => this.onQueryHandler()}>
                  查询
                </tg-button>
                <tg-button class="mgl-12" on-click={() => this.onResetHandler()}>
                  重置
                </tg-button>
              </div>
            </el-form-item>
          </el-form>
        </section> */}
        <section class="operator-field">
          <div class="operator-items">
            <div style="display: flex; align-items: center;">
              <tg-icon
                name="ico-icon_tongyong_tishi_xianxing"
                style="font-size: 18px;color: var(--theme-color);margin-right: 2px;"
              ></tg-icon>
              <span style="color: var(--text-third-color); font-size: 12px;">
                为保证报表导出性能，已生成的报表将为你保留30天
              </span>
            </div>
          </div>
        </section>
        <section class="table-field">
          <div style="height: 100%;">
            <el-table stripe border v-loading={this.loading} height="100%" data={this.tableData}>
              {this.columns.map((column, index) => (
                <el-table-column props={{ ...column }} key={index}></el-table-column>
              ))}
              <template slot="empty">
                <empty-common detail-text="暂无数据"></empty-common>
              </template>
            </el-table>
          </div>
        </section>
        {this.tableData.length > 0 && (
          <section class="pagination-field">
            <el-pagination
              current-page={this.queryForm.page_num}
              page-sizes={[20, 30, 50, 100]}
              pageSize={this.queryForm.num}
              total={this.queryForm.total}
              oncurrent-change={(page_num: number) => {
                this.queryForm.page_num = page_num;
                this.onQueryHandler(page_num);
              }}
              onsize-change={(num: number) => {
                this.queryForm.num = num;
                this.onQueryHandler();
              }}
              layout="total, prev, pager, next, sizes, jumper"
            />
          </section>
        )}
      </div>
    );
  },
});
