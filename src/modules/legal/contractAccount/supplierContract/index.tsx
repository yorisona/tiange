import { defineComponent, ref } from '@vue/composition-api';
import { columns, prepayQueryForm, dataConversion, RootObjectChild } from '../use/index';
import { useDialog } from '@/use/dialog';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { QueryDepositRecevied, UpdateContractTaxSubject } from '@/services/contract';
import { Select } from '@gm/component/select';
import { formatAmount } from '@/utils/string';
import { usePermission } from '@/use/permission';
import { SignTypeOptions } from '@/types/tiange/contract';

type KeyOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type NumericKeyOf<T> = KeyOfType<T, number>;
interface total_amount_type {
  stamp_duty: number;
  approving_amount: number;
  contract_amount: number;
  invoice_amount: number;
  paid_amount: number;
  pending_amount: number;
  received_amount: number;
  uninvoice_amount: number;
  unpay_amount: number;
  unreceived_amount: number;
}

const checkDialog = defineComponent({
  setup: (porps, ctx) => {
    const formData = ref<RootObjectChild>({
      contract_info: {
        tax_subject_type: undefined,
      },
    } as any);
    const show = (value: RootObjectChild) => {
      formData.value = value;
    };
    const onSaveBtnClick = () => {
      ctx.emit('submit', formData.value);
    };
    return { show, formData, onSaveBtnClick };
  },
  render() {
    return (
      <div>
        <div style="padding:24px 12px;display:grid;grid-template-columns: 65px 1fr;align-items: center;">
          <span style="text-align: right;">所属税目：</span>
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.formData.contract_info.tax_subject_type}
            placeholder="请选择所属税目"
            options={E.supplier.TaxItemOption}
          />
        </div>
        {/* <div style="display: flex;justify-content: center;align-items: center;height: 50px;background-color: #f4f8ff;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;">
          <tg-button size="mini" onClick={() => this.$emit('close')}>
            关闭
          </tg-button>
        </div> */}
      </div>
    );
  },
});

export default defineComponent({
  name: 'registerList',
  setup: (props, ctx) => {
    const permission = usePermission();
    const initQueryForm = (): prepayQueryForm => {
      return {
        contract_uid: undefined,
        tax_subject_type: undefined,
        business_type: undefined,
        project_name: undefined,
        sign_type: undefined,
        receipt_status: undefined,
      };
    };
    const checkReasonDialog = useDialog({
      component: checkDialog,
      width: '300px',
      title: '税目设置',
      okText: '保存',
      on: {
        submit(row: RootObjectChild) {
          UpdateContractTaxSubject({
            id: row.contract_info.id,
            tax_subject_type: row.contract_info.tax_subject_type,
          }).then(res => {
            if (res.data.success) {
              checkReasonDialog.close();
              query.reload();
              ctx.root.$message.success('设置成功');
            } else {
              ctx.root.$message.error(res.data.message);
            }
          });
        },
      },
    });
    // prepayQueryForm
    const queryForm = ref<any>(initQueryForm());
    const tableData = ref<any[]>([]);

    const query = usePagination(QueryDepositRecevied, {
      transform: (res: any) => {
        statistics_data.value = res.total_amount_data;
        return dataConversion(res);
      },
    });
    // const numFormat = (num: string) => {
    //   const res = num.toString().replace(/\d+/, function (n) {
    //     // 先提取整数部分
    //     return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
    //       return $1 + ',';
    //     });
    //   });
    //   return res;
    // };
    const statistics_data = ref<total_amount_type>({} as any);
    const summaryMethod = ({ columns }: any) => {
      if (!query.data?.length) return [];
      const TOTAL_FIELD_MAP = new Map<
        NumericKeyOf<typeof columns>,
        NumericKeyOf<total_amount_type>
      >([
        ['印花税', 'stamp_duty'],
        ['合同金额', 'contract_amount'],
        ['已付金额 (元)', 'paid_amount'],
        ['待付金额 (元)', 'pending_amount'],
        ['审批中金额 (元)', 'approving_amount'],
        ['未付金额 (元)', 'unpay_amount'],
        ['已到票金额 (元)', 'invoice_amount'],
        ['未到票金额 (元)', 'uninvoice_amount'],
      ]);
      const res: Array<string | number> = [];

      columns.map((column: any) => {
        if (column.label === '合同编号') {
          res.push('合计');
        } else if (TOTAL_FIELD_MAP.has(column.label)) {
          const key = TOTAL_FIELD_MAP.get(column.label);
          const value = statistics_data.value[key as NumericKeyOf<total_amount_type>];
          res.push(formatAmount(value || 0, 'None'));
        } else {
          res.push('--');
        }
      });
      return res;
    };
    const rowClick = (row: any) => {
      checkReasonDialog.show(row);
    };
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
      },
      showExport: permission.law_contract_ledger_export ? true : false,
      exportURL: '/api/cont/export_provider_contract',
      table: {
        border: true,
        showSummary: true,
        summaryMethod,
        rowClick(row: any, column: any) {
          // if (column.label === '操作') return;
          // dialogRecruitmentFeedback.show(row, true);
        },
      },
    };
    return {
      saleContractTypeOptions: [...SignTypeOptions],
      rowClick,
      query,
      config,
      projectTypeOption: E.project.BusinessTypeOption,
      queryForm,
      tableData,
      columns,
      summaryMethod,
      // dialog,
    };
  },
  render() {
    const columns = this.columns(this);
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
        columns={columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="合同编号：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.contract_uid}
            placeholder="请输入合同编号"
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="所属税目：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.tax_subject_type}
            placeholder="请选择所属税目"
            options={E.supplier.TaxItemOption}
          />
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.project_name}
            placeholder="请输入合同编号"
            v-key-enter={keyEnter}
          />
        </el-form-item>
        <el-form-item label="业务类型：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.business_type}
            placeholder="请选择业务类型"
            options={E.project.BusinessTypeOption}
          />
        </el-form-item>
        <el-form-item label="签约类型：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.sign_type}
            placeholder="请选择签约类型"
            options={this.saleContractTypeOptions}
          />
        </el-form-item>
        {/* <el-form-item label="收款状态：">
          <Select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.receipt_status}
            placeholder="请选择收款状态"
            options={[
              {
                label: '已完成',
                value: 1,
              },
              {
                label: '未完成',
                value: 2,
              },
              {
                label: '部分收款',
                value: 3,
              },
            ]}
          />
        </el-form-item> */}
      </ListGenerallyTemplate>
    );
  },
});
