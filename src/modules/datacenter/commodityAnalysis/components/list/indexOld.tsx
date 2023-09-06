import { defineComponent, ref, nextTick } from '@vue/composition-api';
import {
  useSearch,
  useCommodityGoodsData,
  useTimeline,
} from '@/modules/datacenter/commodityAnalysis/use';
import { TgTableColumn } from '@/types/vendor/column';
import { render } from '@/use/vue';
import Charts from '@/modules/datacenter/components/line/lineCommodity.vue';
import { formatAmount } from '@/utils/string';
export default defineComponent({
  components: {
    'line-charts': Charts,
  },
  setup: render((props: any, ctx: any) => {
    const timeline = useTimeline();
    const goodData = useCommodityGoodsData(ctx, (row: any) => {
      timeline.queryGoods({
        project_id: row.project_id,
        item_id: row.item_id,
      });
    });
    const tableRef = ref<{ setCurrentRow: () => void }>();
    const selectedRow = ref<any>({});
    const lastSearchRow = ref<any>({});
    const projectTableRef = ref<any>();
    const checkList = ref<any>({
      displayHot: true,
      displaySubHot: true,
      displayOther: true,
      displayRadio: '全部',
    });
    useSearch(params => {
      lastSearchRow.value = selectedRow.value = {
        project_id: params.project_id,
        start_date: params.start_date,
        end_date: params.end_date,
      };

      goodData.category_report_query(params).then(() => {
        goodData
          .query_project({
            project_id: selectedRow.value.project_id,
            start_date: selectedRow.value.start_date,
            end_date: selectedRow.value.end_date,
            page_num: 1,
            hot:
              checkList.value.displayOther === true
                ? undefined
                : Number(checkList.value.displayHot),
            second_hot:
              checkList.value.displayOther === true
                ? undefined
                : Number(checkList.value.displaySubHot),
          } as any)
          .then(() => {
            ctx.emit('report', goodData.category_report);
          });
      });
    });
    // 头部表格
    const columns: TgTableColumn<any>[] = [
      {
        label: '一级类目',
        minWidth: '120',
        prop: 'first_cname',
      },
      {
        label: '二级类目',
        minWidth: '130',
        prop: 'second_cname',
        align: 'center',
      },
      {
        label: '款数',
        minWidth: '100',
        prop: 'item_count',
        align: 'center',
      },
      {
        label: '直播销量',
        minWidth: '110',
        prop: 'sale_count',
        align: 'right',
        formatter(row: any) {
          return formatAmount(row.sale_count, '', true);
        },
      },
      {
        label: '直播销售额 (元)',
        minWidth: '136',
        prop: 'gmv',
        align: 'right',
        formatter(row: any) {
          return formatAmount(row.gmv / 100, '');
        },
      },
      {
        label: '店铺销量',
        minWidth: '110',
        prop: 'shop_sale_count',
        align: 'right',
        formatter(row: any) {
          return row.shop_sale_count ? formatAmount(row.shop_sale_count, '', true) : '--';
        },
      },
      {
        label: '店铺销售额 (元)',
        minWidth: '136',
        prop: 'shop_gmv',
        align: 'right',
        formatter(row: any) {
          return row.shop_gmv ? formatAmount(row.shop_gmv / 100, '') : '--';
        },
      },
      {
        label: '点击率',
        minWidth: '80',
        prop: 'click_rate',
        align: 'right',
        dataType: {
          suffix: '%',
        },
      },
      {
        label: '转化率',
        minWidth: '80',
        prop: 'pay_rate',
        align: 'right',
        dataType: {
          suffix: '%',
        },
      },
      {
        label: '上周销量',
        minWidth: '130',
        prop: 'last_week_sale_count',
        align: 'right',
        formatter(row: any) {
          return formatAmount(row.last_week_sale_count, '', true);
        },
      },
      {
        label: '上周销售额 (元)',
        minWidth: '164',
        prop: 'last_week_gmv',
        align: 'right',
        formatter(row: any) {
          return formatAmount(row.last_week_gmv / 100, '');
        },
      },
      {
        label: '累计销量',
        minWidth: '140',
        prop: 'total_sale_count',
        align: 'right',
        formatter(row: any) {
          return formatAmount(row.total_sale_count, '', true);
        },
      },
      {
        label: '累计销售额 (元)',
        minWidth: '140',
        prop: 'total_gmv',
        formatter(row: any) {
          return formatAmount(row.total_gmv / 100, '');
        },
        align: 'right',
      },
      {
        label: '销售趋势',
        minWidth: '116',
        align: 'center',
        dataType: 'money',
        formatter(row: any) {
          return (
            <a
              onclick={(e: Event) => {
                e.stopPropagation();
                e.preventDefault();
                timeline.queryCategory({
                  project_id: row.project_id,
                  cat_id: row.second_cid,
                });
              }}
              style="font-size:12px"
            >
              查看
            </a>
          );
        },
      },
    ];
    const onRowClick = (row: any) => {
      const start_date = selectedRow.value.start_date || lastSearchRow.value.start_date;
      const end_date = selectedRow.value.end_date || lastSearchRow.value.end_date;
      const project_id = selectedRow.value.project_id;
      const { second_cid } = row;
      if (selectedRow.value.id !== row.id) {
        selectedRow.value.id = row.id;
        selectedRow.value.second_cid = second_cid;
      } else {
        selectedRow.value.second_cid = undefined;
        selectedRow.value.id = undefined;
        tableRef.value?.setCurrentRow();
      }
      goodData
        .query_project({
          project_id: project_id,
          start_date: start_date,
          end_date: end_date,
          cat_id: selectedRow.value.second_cid,
          page_num: 1,
          hot:
            checkList.value.displayOther === true ? undefined : Number(checkList.value.displayHot),
          second_hot:
            checkList.value.displayOther === true
              ? undefined
              : Number(checkList.value.displaySubHot),
        })
        .then(() => {
          nextTick(() => {
            ctx.emit('scroll', projectTableRef.value.offsetTop);
          });
        });
    };

    const onCurrentChange = (page_num: number) => {
      const row = selectedRow.value;
      const start_date = selectedRow.value.start_date || lastSearchRow.value.start_date;
      const end_date = selectedRow.value.end_date || lastSearchRow.value.end_date;
      goodData
        .query_project({
          project_id: row.project_id,
          start_date,
          end_date,
          cat_id: row.second_cid,
          page_num,
          hot:
            checkList.value.displayOther === true ? undefined : Number(checkList.value.displayHot),
          second_hot:
            checkList.value.displayOther === true
              ? undefined
              : Number(checkList.value.displaySubHot),
          other:
            checkList.value.displayOther === true
              ? undefined
              : Number(checkList.value.displayOther),
        })
        .then(() => {
          nextTick(() => {
            ctx.emit('scroll', projectTableRef.value.offsetTop);
            const dom = document.querySelector('.project-table .el-table__body-wrapper');
            if (dom) {
              dom.scrollLeft = 0;
            }
          });
        });
    };

    const search = () => {
      return goodData.query_project({
        project_id: selectedRow.value.project_id,
        start_date: selectedRow.value.start_date,
        end_date: selectedRow.value.end_date,
        page_num: 1,
        cat_id: selectedRow.value.second_cid,
        hot: checkList.value.displayOther === true ? undefined : Number(checkList.value.displayHot),
        second_hot:
          checkList.value.displayOther === true ? undefined : Number(checkList.value.displaySubHot),
      } as any);
    };

    const hotHandler = () => {
      return search();
    };

    return {
      columns,
      goodData,
      selectedRow,
      hotHandler,
      onRowClick,
      checkList,
      onCurrentChange,
      timeline,
      tableRef,
      projectTableRef,
      search,
    };
  }),
  render() {
    const pagination = this.goodData.pagination;
    const timeline = this.timeline;
    return (
      <div class="comp">
        <div class="category-table">
          <tg-table
            ref="tableRef"
            highlight-current-row={true}
            onrow-click={this.onRowClick}
            stripe
            border
            maxHeight={318}
            columns={this.columns}
            data={this.goodData.category_report}
            scopedSlots={{
              empty: () => {
                return (
                  <div style="position: static;">
                    <empty-common detail-text="暂无数据" />
                  </div>
                );
              },
            }}
          />
        </div>
        <div class="line" />
        <div style="margin-bottom: 12px">
          <el-radio
            class="hot-check"
            v-model={this.checkList.displayRadio}
            label="全部"
            onChange={() => {
              this.checkList.displayOther = true;
              this.checkList.displayHot = false;
              this.checkList.displaySubHot = false;
              this.page_num = 1;
              this.hotHandler();
            }}
          />
          <el-radio
            class="hot-check"
            v-model={this.checkList.displayRadio}
            label="只显示爆款"
            onChange={() => {
              this.checkList.displayOther = false;
              this.checkList.displayHot = true;
              this.checkList.displaySubHot = false;
              this.page_num = 1;
              this.hotHandler();
            }}
          />
          <el-radio
            class="hot-check"
            v-model={this.checkList.displayRadio}
            label="只显示次爆款"
            onChange={() => {
              this.checkList.displayOther = false;
              this.checkList.displayHot = false;
              this.checkList.displaySubHot = true;
              this.page_num = 1;
              this.hotHandler();
            }}
          />
        </div>
        <div ref="projectTableRef" class="project-table">
          <tg-table
            show-header={false}
            border={true}
            columns={this.goodData.columns}
            data={this.goodData.project_report}
            highlight-current-row
          />
        </div>
        {pagination.total > 0 && (
          <div class="pagination-box">
            <el-pagination
              total={pagination.total}
              page-size={20}
              layout={'total, prev, pager, next'}
              current-page={pagination.page_num}
              oncurrent-change={this.onCurrentChange}
            />
          </div>
        )}
        <el-dialog
          class="tg-dialog-classic el-dialog-center-rewrite"
          width="543px"
          visible={timeline.visible}
          append-to-body={true}
          close-on-click-modal={false}
          close-on-press-escape={false}
          wrapperClosable={false}
          title={timeline.title}
          onClose={timeline.onClose}
        >
          <div class="charts-box">
            <line-charts
              className="line-chart"
              date={timeline.charts.data}
              loading={timeline.loading}
              list={timeline.charts.series}
            />
          </div>
        </el-dialog>
      </div>
    );
  },
});
