import { defineComponent, h, ref } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import { CTRDetailQueryForm, CTRDetailRefType } from '../type';
import LiveScreen from '../dialog/live.screen.vue';
import { LiveScreenType } from '../dialog/live.screen';
import { QueryCtrShopLive } from '@/services/datacenter';
import { CtrListModel, CtrQueryParams } from '@/types/tiange/datacenter';
import SignDialog from '../dialog/sign.vue';
import { PaginationParams } from '@/types/base/pagination';
import { wait } from '@/utils/func';
import moment from 'moment';
import { formatAmount } from '@/utils/string';

type Col = TgTableColumn<CtrListModel>;

export default defineComponent({
  name: 'crtList',
  components: {
    LiveScreen,
    SignDialog,
  },
  setup(props, ctx) {
    const liveScreenRef = ref<LiveScreenType | undefined>(undefined);
    const paginationForm = ref<PaginationParams & CTRDetailQueryForm & { total: number }>({
      num: 20,
      page_num: 1,
      total: 0,
      project_id: undefined,
      dates: [],
      shift_id: undefined,
    });

    const loading = ref(false);

    // const tableData = ref([])
    const tableData = ref<CtrListModel[]>([]);
    const columns = ref<Col[]>([
      {
        label: '场次名称',
        minWidth: 156,
        showOverflowTooltip: true,
        formatter: row => (row.live_title ? row.live_title : '--'),
      },
      {
        label: '直播时间',
        align: 'center',
        minWidth: 292,
        formatter: row => {
          if (row.live_start_time && row.live_end_time) {
            const format = 'yyyy.MM.DD HH:mm:ss';
            const start_time = moment(row.live_start_time * 1000).format(format);
            const end_time = moment(row.live_end_time * 1000).format(format);
            const live_time = `${start_time} ~ ${end_time}`;
            return live_time;
          }
          return '--';
        },
      },
      {
        label: '直播班次',
        minWidth: 90,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => row.shift_name,
      },
      {
        label: '直播销售额 (元)',
        minWidth: 120,
        align: 'center',
        showOverflowTooltip: true,
        formatter: row => row.actual_gmv,
      },
      {
        label: '直播间曝光人数',
        minWidth: 118,
        align: 'right',
        formatter: row => formatAmount(row.room_exposure_ucnt ?? 0, 'None', true),
      },
      {
        label: '直播间进入人数',
        minWidth: 118,
        align: 'right',
        formatter: row => formatAmount(row.room_watch_ucnt ?? 0, 'None', true),
      },
      {
        label: '进入率（人数）',
        minWidth: 118,
        align: 'right',
        formatter: row => `${row.exposure_watch_ucnt_ratio}%`,
      },
      {
        label: '直播间曝光人次',
        minWidth: 118,
        align: 'right',
        formatter: row => formatAmount(row.room_exposure_times ?? 0, 'None', true),
      },
      {
        label: '直播间进入人次',
        minWidth: 118,
        align: 'right',
        formatter: row => formatAmount(row.room_watch_times ?? 0, 'None', true),
      },
      {
        label: '进入率（人次）',
        minWidth: 118,
        align: 'right',
        formatter: row => `${row.exposure_watch_times_ratio}%`,
      },
      {
        label: '直播画面',
        align: 'center',
        minWidth: 118,
        formatter: row => {
          return h('div', { class: 'buttons-lines' }, [
            h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: () => methods.liveCheck(row),
                },
              },
              '查看',
            ),
            h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                on: {
                  click: () => methods.signChange(row),
                },
              },
              '标记变更',
            ),
          ]);
        },
      },
    ]);

    const isShowSignDialog = ref(false);
    const signList: any = ref([]);
    const signId: any = ref(0);

    const refMethods: CTRDetailRefType = {
      reload(queryForm: CTRDetailQueryForm & PaginationParams) {
        const { dates, shift_id, project_id, page_num } = queryForm;
        const [start_date, end_date] = dates;
        if (page_num) {
          paginationForm.value = {
            ...paginationForm.value,
            ...queryForm,
          };
        } else {
          paginationForm.value = {
            ...paginationForm.value,
            ...queryForm,
            page_num: 1,
          };
        }

        const params: CtrQueryParams = {
          start_date,
          end_date,
          num: paginationForm.value.num,
          page_num: paginationForm.value.page_num,
          shift_id,
          project_id,
        };
        methods.queryCtrShopLive(params);
      },
    };
    // const oldQueryParams: any = ref({});
    const methods = {
      liveCheck(listModel: CtrListModel) {
        liveScreenRef.value?.show?.(listModel);
      },
      async queryCtrShopLive(queryParams: CtrQueryParams) {
        // oldQueryParams.value = queryParams;
        loading.value = true;
        const [res] = await wait(500, QueryCtrShopLive(queryParams));
        loading.value = false;
        if (res.data.success) {
          tableData.value = res.data.data.data;
          paginationForm.value.total = res.data.data.total;
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败');
        }
      },
      signChange(item: any) {
        signList.value = item.change_tips || [];
        signId.value = item.id;
        console.log(item.id);
        isShowSignDialog.value = true;
      },
      onHide(isRefresh = false) {
        isShowSignDialog.value = false;
        if (isRefresh) {
          // methods.queryCtrShopLive(oldQueryParams.value);
          refMethods.reload(paginationForm.value);
        }
      },
    };

    return {
      signList,
      signId,
      loading,
      isShowSignDialog,
      columns,
      tableData,
      liveScreenRef,
      paginationForm,
      ...methods,
      ...refMethods,
    };
  },
  render() {
    return (
      <div class="crt-list-page-container">
        <tg-table
          v-loading={this.loading}
          class="ctr-table"
          border
          stripe
          height="calc(100% - 50px)"
          attrs={{ data: this.tableData }}
        >
          {this.columns.map((el, index) => (
            <el-table-column attrs={{ ...el }} key={index}></el-table-column>
          ))}
          <template slot="empty">
            <empty-common detail-text="暂无数据"></empty-common>
          </template>
        </tg-table>
        {this.tableData.length > 0 && (
          <el-pagination
            class="flex-none"
            current-page={this.paginationForm.page_num}
            page-sizes={[20, 30, 50, 100]}
            pageSize={this.paginationForm.num}
            total={this.paginationForm.total}
            oncurrent-change={(page_num: number) => {
              this.paginationForm.page_num = page_num;
              // this.query();
              this.reload(this.paginationForm);
            }}
            onsize-change={(num: number) => {
              this.paginationForm.num = num;
              // this.query();
              this.reload(this.paginationForm);
            }}
            layout="total, prev, pager, next, sizes, jumper"
          />
        )}
        <live-screen ref="liveScreenRef"></live-screen>
        <sign-dialog
          list={this.signList}
          sessionId={this.signId}
          visiableSign={this.isShowSignDialog}
          on-closeAction={this.onHide}
        ></sign-dialog>
      </div>
    );
  },
});
