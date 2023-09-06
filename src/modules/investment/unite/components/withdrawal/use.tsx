import {
  ShopLiveDeleteWithdraw,
  GetShopLiveQueryWithdraw,
  ShopLiveWithdrawWriteOff,
} from '@/services/investment';
import { sleep } from '@/utils/func';
import { TableColumn } from '@/types/vendor/column';
import { SetupContext, reactive, ref, toRefs, h } from '@vue/composition-api';
import { WithdrawWriteOffTypes } from '@/const/options';
import moment from 'moment';
import { numberFormat } from '@/utils/formatMoney';
import ImageViewer from '@/components/Image/ImageViewer';
export interface uniteStruct {
  start_time?: string;
  end_time?: string;
  write_off_status?: string;
  page_num: number;
  num?: number;
}
export const unitedMap = new Map([
  [0, '未提交'],
  [1, '待财务确认'],
  [4, '待项目确认'],
  [2, '已确认'],
  [3, '已退回'],
  [5, '项目不通过'],
]);
export const statusBGColorMaps = new Map([
  [2, 'rgba(0,169,53,0.60);'],
  [1, 'rgba(255,122,54,0.60);'],
  [4, 'rgba(255,122,54,0.60);'],
  [5, '#ed3434'],
  [3, '#ed3434'],
]);
export interface statisticsStruct {
  count_confirmed_pay_amount: number;
  count_unconfirmed_pay_amount: number;
  sum_confirmed_pay_amount: number;
  sum_unconfirmed_pay_amount: number;
}
export interface Unite {
  id: number;
  withdraw_uid: string;
  // 提现公司
  company_name: string;
  // 到账时间
  arrival_date_str: string;
  // 提现金额
  withdraw_amount: string;
  // 收款凭证
  certificate_pic: string;
  // 核销状态
  write_off_status: number;
  // 登记时间
  gmt_create_str: string;
  // 登记人
  add_by_name: string;
  achievement_list: {
    achievement_uid: string;
    project_name: string;
    receivable_uid: string;
    settlement_uid: string;
    write_off_amount: number;
  }[];
}
export type Col = TableColumn<Unite>;

export const useList = (ctx: SetupContext) => {
  const queryParams = ref<uniteStruct>({
    start_time: undefined,
    end_time: undefined,
    write_off_status: undefined,
    page_num: 1,
    num: 20,
  });

  const tableData = reactive<{
    loading: boolean;
    uniteData: [];
    total: number;
  }>({
    loading: false,
    uniteData: [],
    total: 0,
  });
  const statistics_data = ref<{
    count_withdraw: number;
    sum_not_write_off_amount: number;
    sum_withdraw_amount: number;
    sum_write_off_amount: number;
  }>({} as any);
  const columns = ref<Col[]>([
    {
      label: '提现编号',
      prop: 'withdraw_uid',
      minWidth: 188,
      align: 'center',
    },
    {
      label: '提现公司',
      prop: 'company_name',
      minWidth: 208,
      align: 'left',
    },
    {
      label: '到账时间',
      prop: 'arrival_date_str',
      minWidth: 110,
      align: 'center',
      formatter: row => {
        return moment(row.arrival_date_str).format('YYYY.MM.DD');
      },
    },
    {
      label: '提现金额 (元)',
      prop: 'withdraw_amount',
      minWidth: 156,
      align: 'right',
      formatter: row => {
        return numberFormat(Number(row.withdraw_amount || 0), 2, '.', ',');
      },
    },
    {
      label: '收款凭证',
      prop: 'withdraw_uid',
      minWidth: 88,
      align: 'center',
      formatter: row => {
        return (
          <a
            onClick={() => {
              // invoice.showDetail(fixFileToken(row.certificate_pic, false));
              ImageViewer.show([row.certificate_pic]);
            }}
          >
            查看
          </a>
        );
      },
    },
    {
      label: '核销状态',
      prop: 'write_off_status',
      minWidth: 118,
      align: 'center',
      formatter: row => {
        let status;
        let icon: JSX.Element | undefined = <tg-icon name="ico-a-yulaneye2x" />;
        const empty = <div style="margin-top: 2px;line-height: 12px;" class="svg" />;
        const iconPopper = (
          <span style="margin-top: 2px;line-height: 12px;">
            {' '}
            <el-popover
              placement="bottom"
              popper-class="tg-body-container"
              trigger="hover"
              width="600"
              open-delay={500}
            >
              <tg-icon name="ico-a-yulaneye2x" slot="reference" />
              <tg-table className="popper-table-unite" data={row.achievement_list} border stripe>
                <el-table-column
                  label="项目名称"
                  prop="project_name"
                  width="136"
                  align="left"
                  header-align="center"
                  show-overflow-tooltip={true}
                />
                <el-table-column
                  label="结算单号"
                  prop="settlement_uid"
                  align="left"
                  header-align="center"
                  show-overflow-tooltip={true}
                />
                <el-table-column
                  label="应收单号"
                  prop="receivable_uid"
                  align="left"
                  header-align="center"
                  show-overflow-tooltip={true}
                />
                <el-table-column
                  label="核销金额 (元)"
                  prop="write_off_amount"
                  width="120"
                  align="right"
                  header-align="center"
                  show-overflow-tooltip={true}
                  scopedSlots={{
                    default: ({ row }: any) => {
                      const style =
                        row.write_off_amount < 0
                          ? 'color:#ff7a36;text-align:right'
                          : 'text-align:right';
                      return (
                        <div style={style}>
                          {numberFormat(Number(row.write_off_amount || 0), 2, '.', ',')}
                        </div>
                      );
                    },
                  }}
                />
              </tg-table>
            </el-popover>
          </span>
        );
        switch (row.write_off_status) {
          case WithdrawWriteOffTypes.writeoff_no:
            status = <span class="status status-part">未核销</span>;
            icon = empty;
            break;
          case WithdrawWriteOffTypes.writeoff_partial:
            status = <span class="status status-part">部分核销</span>;
            icon = iconPopper;
            break;
          case WithdrawWriteOffTypes.writeoff_yes:
            status = <span class="status">已核销</span>;
            icon = iconPopper;
            break;
          default:
            status = <span>未知状态</span>;
            icon = empty;
        }
        return (
          <div class="status-box">
            {status}
            {icon}
          </div>
        );
      },
    },
    {
      label: '登记时间',
      prop: 'gmt_create_str',
      minWidth: 110,
      align: 'center',
      formatter: row => {
        return moment(row.gmt_create_str).format('YYYY.MM.DD');
      },
    },
    {
      label: '登录人',
      prop: 'add_by_name',
      minWidth: 110,
      align: 'center',
    },
  ]);
  const getUniteData = async (payload: uniteStruct) => {
    tableData.loading = true;
    const { data: response } = await GetShopLiveQueryWithdraw(payload);

    tableData.loading = false;
    if (response.success) {
      tableData.uniteData = response.data.withdraw_infos;
      tableData.total = response.data.total;
      statistics_data.value = response.data.statistics_data;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const deleteUnite = async (id: number) => {
    tableData.loading = true;
    const [_, { data: response }] = await Promise.all([
      await sleep(500),
      await ShopLiveDeleteWithdraw(id),
    ]);

    tableData.loading = false;
    if (response.success) {
      getUniteData(queryParams.value);
      ctx.root.$message.success('删除成功！');
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  const writeOff = async (id: number) => {
    const { data: response } = await ShopLiveWithdrawWriteOff(id);
    if (response.success) {
      ctx.root.$message.success('核销成功！');
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '核销失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };
  return {
    ...toRefs(tableData),
    statistics_data,
    getUniteData,
    deleteUnite,
    queryParams,
    columns,
    writeOff,
  };
};
