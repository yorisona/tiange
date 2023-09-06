import { defineComponent, reactive } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import { GetSettlementList } from '@/services/finance/settlement';
import { Message } from 'element-ui';
import moment from 'moment';
import { formatAmount } from '@/utils/string';
import { busType } from '@/modules/finance/report/reportType';
export default defineComponent({
  setup: (props, ctx) => {
    const columns: TgTableColumn<any>[] = [
      { type: 'selection', width: 32, className: 'selection' },
      {
        label: '项目名称',
        minWidth: 116,
        prop: 'project_name',
        showOverflowTooltip: true,
      },
      {
        label: '项目类型',
        minWidth: 110,
        prop: 'business_type',
        align: 'center',
        formatter: (row: any) => {
          return busType.get(row.business_type);
        },
      },
      { label: '结算单号', minWidth: 140, prop: 'settlement_uid', align: 'center' },
      {
        label: '结算周期',
        minWidth: 168,
        align: 'center',
        formatter: (row: any) => {
          const start = moment(row.start_date * 1000).format('YYYY.MM.DD');
          const end = moment(row.end_date * 1000).format('YYYY.MM.DD');
          return (
            <div>
              {start} ～ {end}
            </div>
          );
        },
      },
      {
        label: '结算金额 (元)',
        minWidth: 120,
        align: 'right',
        prop: 'tax_included_amount',
        formatter: row => {
          let style = '';
          if (row.tax_included_amount < 0) {
            style = 'color:var(--error-color)';
          }
          return <span style={style}>{formatAmount(row.tax_included_amount, 'None')}</span>;
        },
      },
      {
        label: '未开票金额 (元)',
        minWidth: 120,
        prop: '',
        align: 'right',
        formatter: row => {
          let settlement_amount: any = row.tax_included_amount;
          const write_off_amount: any = row.write_off_amount;
          if (row.has_refund_settlement === 1) {
            settlement_amount = row.tax_included_amount - row.refund_amount;
          }
          const maxNum = settlement_amount - write_off_amount;

          return formatAmount(maxNum, 'None');
        },
      },
    ];
    const tableData = reactive({
      data: [] as any[],
      loading: false,
    });

    let selectedRow: any[] = [];

    const onSaveBtnClick = () => {
      if (selectedRow.length === 0) {
        Message.warning('未选择记录');
        return;
      }
      ctx.emit('close');
      ctx.emit('select', selectedRow);
    };
    const show = (id: string) => {
      selectedRow.length = 0;
      query(id);
    };

    const query = (search_value: string) => {
      tableData.loading = true;
      GetSettlementList('customer_company', {
        search_value,
        num: 1000,
        page_num: 1,
        no_reverse: 1,
        settlement_kind: 1,
        search_type: 6,
        is_tmp: 0,
        is_estimate: 0,
        status: 2,
        invoice_write_off_type: 1,
      } as any)
        .then(res => {
          tableData.loading = false;
          tableData.data = res.data.data.data;
        })
        .catch(() => {
          tableData.loading = false;
        });
    };
    const selectionChange = (select: any) => {
      selectedRow = select;
    };
    return {
      selectionChange,
      columns,
      tableData,
      onSaveBtnClick,
      show,
    };
  },
  render() {
    return (
      <div class="quick-add-container">
        <tg-table
          onselection-change={this.selectionChange}
          columns={this.columns}
          data={this.tableData.data}
          stripe
          border
          v-loading={this.tableData.loading}
          height={'100%'}
        />
      </div>
    );
  },
});
