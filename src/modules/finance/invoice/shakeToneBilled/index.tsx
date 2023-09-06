import { defineComponent, ref } from '@vue/composition-api';
// import { customerColumns, prepayQueryForm, dataConversion, any } from '../use/index';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { QueryBuyinCpsInvoice } from '@/services/finance/invoice';
import { Select } from '@gm/component/select';
// import { formatAmount } from '@/utils/string';
import { usePermission } from '@/use/permission';
import { TgTableColumn } from '@/types/vendor/column';
import { ExportList } from '@/modules/datacenter/competitor/use';
import ImageViewer from '@/components/Image/ImageViewer';
import { getToken } from '@/utils/token';
const JWT_TOKEN = getToken();

export default defineComponent({
  name: 'registerList',
  setup: (props, ctx) => {
    const permission = usePermission();
    const initQueryForm = (): any => {
      return {
        bill_id: undefined,
        order_id: undefined,
        income_company_name: undefined,
        bill_status: undefined,
        approval_status: undefined,
        batch_no: undefined,
        invoice_status: undefined,
      };
    };
    // prepayQueryForm
    const queryForm = ref<any>(initQueryForm());
    const tableData = ref<any[]>([]);

    const query = usePagination(QueryBuyinCpsInvoice);
    const rowClick = (row: any) => {
      console.log('----', row);
    };
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      exportURL: '/api/financial/export_buyin_cps_invoice',
      table: {
        border: true,
      },
    };
    const columns: TgTableColumn<any>[] = [
      {
        label: '账单 ID',
        minWidth: 160,
        align: 'left',
        prop: 'bill_id',
        // formatter: row => payable_uid_render(row, false),
      },
      {
        label: '订单 ID',
        align: 'left',
        prop: 'order_ids',
        minWidth: 160,
        // 'show-overflow-tooltip': true,
        formatter: row => {
          if (!row.order_ids) return '--';
          return (
            // <div v-ellipsis={'160px'}>{row.order_ids}</div>
            <fragments>
              <span v-show={row.order_ids && row.order_ids.length > 17}>
                <el-popover trigger="hover" popper-class="workorder-problem-desc">
                  <div>{row.order_ids}</div>
                  <span slot="reference">{row.order_ids.substr(0, 17) + '...'}</span>
                </el-popover>
              </span>
              <span v-show={row.order_ids && row.order_ids.length < 17}>{row.order_ids}</span>
            </fragments>
          );
        },
      },
      {
        label: '账单日期',
        minWidth: 180,
        align: 'center',
        prop: 'bill_date',
        // formatter: row => {
        //   return row.bill_date ? moment(row.bill_date).format('YYYY.MM.DD') : '--';
        // },
      },
      {
        label: '商家企业名称',
        minWidth: 200,
        align: 'left',
        prop: 'income_company_name',
        'show-overflow-tooltip': true,
      },
      {
        label: '开票金额 (元)',
        align: 'right',
        minWidth: 120,
        prop: 'bill_amount',
      },
      {
        label: '开票状态',
        minWidth: 110,
        align: 'center',
        prop: 'bill_status_name',
      },
      {
        label: '开票批次号',
        minWidth: 160,
        align: 'left',
        prop: 'batch_no',
        'show-overflow-tooltip': true,
      },
      {
        label: '审核状态',
        minWidth: 110,
        align: 'center',
        prop: 'approval_status_name',
      },
      {
        label: '发票文件',
        minWidth: 80,
        align: 'center',
        formatter: row => {
          if (!row.invoice_file?.length) return '--';
          const url = `${row.invoice_file[0]}?Authorization=${JWT_TOKEN}`;
          return (
            <tg-icon
              class="invoiceImageView"
              name="ico-fapiao"
              style="width: 16px;height: 16px;cursor: pointer;color: #6a7b92;"
              onClick={() => {
                const hasPDF = /\.pdf\?.+$|\.pdf\??$/.test(url);
                if (hasPDF) {
                  window.open(url);
                } else {
                  ImageViewer.show(row.invoice_file);
                }
              }}
            ></tg-icon>
          );
        },
        // formatter: row => {
        //   return row.invoice_file?.length
        //     ? row.invoice_file?.map((v: any, i: number) => (
        //         <img
        //           onClick={() => {
        //             ImageViewer.show(row.invoice_file, i);
        //           }}
        //           src={v}
        //           alt=""
        //         />
        //       ))
        //     : '--';
        // },
      },
      {
        label: '发票状态',
        minWidth: 110,
        align: 'center',
        prop: 'invoice_status_name',
      },
      {
        label: '操作',
        // fixed: 'right',
        align: 'center',
        formatter: row => {
          // 冲销记录不可再核销
          return (
            <span
              v-show={permission.shake_tone_billed_export ? true : false}
              onClick={() => {
                ExportList({ id: row.id }, config.exportURL);
              }}
              style="color: var(--theme-color);cursor: pointer;"
            >
              导出开票
            </span>
          );
        },
      },
    ];
    return {
      rowClick,
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      tableData,
      columns,
      permission,
    };
  },
  render() {
    const keyEnter = () =>
      this.query.run(
        {
          page_num: 1,
          num: this.query.pagination.num,
        },
        this.queryForm,
      );

    return (
      <ListGenerallyTemplate
        columns={this.columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="账单ID：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.bill_id}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="订单ID：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.order_id}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="商家企业名称：" label-width={'85px'}>
          <el-input
            style="width: 100%"
            v-model={this.queryForm.income_company_name}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="开票状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.bill_status}
            v-auto-placeholder
            options={[
              { value: 0, label: '未提交' },
              { value: 1, label: '已提交' },
            ]}
          />
        </el-form-item>
        <el-form-item label="审核状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.approval_status}
            v-auto-placeholder
            options={[
              { value: 0, label: '待提交' },
              { value: 1, label: '审核中' },
              { value: 2, label: '审核通过' },
              { value: 3, label: '审核驳回' },
              { value: 4, label: '缴费成功' },
            ]}
          />
        </el-form-item>
        <el-form-item label="开票批次号：" label-width={'75px'}>
          <el-input
            style="width: 100%"
            v-model={this.queryForm.batch_no}
            v-auto-placeholder
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="发票状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.invoice_status}
            v-auto-placeholder
            options={[
              { value: 0, label: '未核销' },
              { value: 1, label: '已核销' },
              { value: 2, label: '异常' },
            ]}
          />
        </el-form-item>
        <tg-button
          type="primary"
          slot="btnLine"
          v-show={this.permission.shake_tone_billed_export ? true : false}
          onClick={() => {
            ExportList(this.queryForm, this.config.exportURL);
          }}
        >
          批量导出开票
        </tg-button>
      </ListGenerallyTemplate>
    );
  },
});
