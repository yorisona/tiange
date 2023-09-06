import { defineComponent, ref } from '@vue/composition-api';
import { formatAmount } from '@/utils/string';
import { columns, prepayModel, prepayQueryForm, statusTypeOption } from '../use/index';
import { useDialog } from '@/use/dialog';
import prePayAudit from '../dialog/prePayAudit.vue';
import reverseIndex from '../dialog/reverse.vue';
import { ListGenerallyTemplate } from '@gm/templates/list';
import { usePagination } from '@gm/hooks/ahooks';
import { QueryDepositRecevied } from '@/services/finance';

type KeyOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type NumericKeyOf<T> = KeyOfType<T, number>;
interface total_amount_type {
  total_income_amount: number;
  total_refund_amount: number;
  total_register_amount: number;
  total_un_income_amount: number;
  total_un_write_off_amount: number;
  total_write_off_amount: number;
}

const checkDialog = defineComponent({
  setup: () => {
    const formData = ref<any>({});
    const show = (value: object) => {
      formData.value = value;
    };
    return { show, formData };
  },
  render() {
    return (
      <div>
        <div style="padding:24px 12px;display:grid;grid-template-columns: 65px 1fr;">
          <span style="text-align: right;">审核意见：</span>
          <span>
            {this.formData?.status === 2
              ? this.formData?.audit_reason
              : this.formData?.reverse_audit_reason}
          </span>
        </div>
        <div style="display: flex;justify-content: center;align-items: center;height: 50px;background-color: #f4f8ff;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;">
          <tg-button size="mini" onClick={() => this.$emit('close')}>
            关闭
          </tg-button>
        </div>
      </div>
    );
  },
});

export default defineComponent({
  name: 'registerList',
  setup: (props, ctx) => {
    const isHideReversed = ref(true);
    const initQueryForm = (): prepayQueryForm => {
      return {
        business_type: undefined,
        project_name: undefined,
        deposit_received_status: undefined,
        is_hide_reverse_data: 1,
      };
    };
    const checkReasonDialog = useDialog({
      component: checkDialog,
      width: '300px',
      title: '查看审核意见',
      footer: false,
      // okText: '确定',
      on: {
        submit() {},
      },
    });
    const prePayAuditDialog = useDialog({
      component: prePayAudit,
      width: '350px',
      title: '预收审核',
      footer: false,
      on: {
        submit() {
          query.reload();
        },
      },
    });
    const reverseDialog = useDialog({
      component: reverseIndex,
      width: '288px',
      title: '单据冲销',
      footer: false,
      on: {
        submit() {
          query.reload();
        },
      },
    });
    const queryForm = ref<prepayQueryForm>(initQueryForm());

    const tableData = ref<any[]>([]);

    const query = usePagination(QueryDepositRecevied, {
      transform: (res: any) => {
        statistics_data.value = res.total_amount;
        return res.data;
      },
      defaultParams: [{ page_num: 1, num: 20 }, { ...queryForm.value }],
    });
    const statistics_data = ref<total_amount_type>({} as any);
    const summaryMethod = ({ columns }: any) => {
      if (!query.data?.length) return [];
      const TOTAL_FIELD_MAP = new Map<
        NumericKeyOf<typeof columns>,
        NumericKeyOf<total_amount_type>
      >([
        ['登记金额 (元)', 'total_register_amount'],
        ['到账金额 (元)', 'total_income_amount'],
        ['未到账金额 (元)', 'total_un_income_amount'],
        ['已核销金额 (元)', 'total_write_off_amount'],
        ['未核销金额 (元)', 'total_un_write_off_amount'],
        ['退款金额 (元)', 'total_refund_amount'],
      ]);
      const res: Array<string | number> = [];
      columns.map((column: any) => {
        if (column.label === '预收编号') {
          res.push('合计');
        } else if (TOTAL_FIELD_MAP.has(column.label)) {
          const key = TOTAL_FIELD_MAP.get(column.label);
          const value = statistics_data.value[key as NumericKeyOf<total_amount_type>];
          res.push(formatAmount(value / 100 || 0, 'None'));
        } else {
          res.push('--');
        }
      });
      return res;
    };
    const rowClick = (row: prepayModel, type = 1) => {
      switch (type) {
        case 2:
          prePayAuditDialog.show(row);
          break;
        case 3:
          reverseDialog.show(row);
          break;
        default:
          checkReasonDialog.show(row);
      }
    };
    const config = {
      reset: () => {
        queryForm.value = initQueryForm();
        queryForm.value.is_hide_reverse_data = isHideReversed.value ? 1 : undefined;
      },
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
      isHideReversed,
      rowClick,
      query,
      config,
      statusTypeOption,
      prePayAuditDialog,
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
    return (
      <ListGenerallyTemplate
        columns={columns}
        service={this.query}
        v-model={this.queryForm}
        config={this.config}
      >
        <el-form-item label="项目名称：">
          <el-input
            style="width: 100%"
            v-model={this.queryForm.project_name}
            placeholder="请输入项目名称"
            v-key-enter={this.query}
          />
        </el-form-item>
        <el-form-item label="业务类型：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.business_type}
            class="prepay-select"
            placeholder="请选择业务类型"
            style="width: 180px"
          >
            <el-option label="全部" value={undefined} key={undefined}></el-option>
            {this.projectTypeOption
              .filter(el => el.value !== 1)
              .map((el, index) => {
                return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
              })}
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态：">
          <el-select
            popper-class="el-select-popper-mini"
            v-model={this.queryForm.deposit_received_status}
            class="prepay-select"
            placeholder="请选择审核状态"
            style="width: 100%"
          >
            <el-option label="全部" value={undefined} key={undefined}></el-option>
            {this.statusTypeOption.map((el, index) => {
              return <el-option label={el.label} value={el.value} key={index + 1}></el-option>;
            })}
          </el-select>
        </el-form-item>
        <div class="reverse-div" slot="otherBtns" style="line-height: 28px;">
          <el-checkbox
            v-model={this.isHideReversed}
            on-change={() => {
              this.queryForm.is_hide_reverse_data = this.isHideReversed ? 1 : undefined;
              this.query.pagination.reQuery(this.queryForm);
            }}
            size="small"
          >
            <span>隐藏已冲销数据</span>
          </el-checkbox>
        </div>
      </ListGenerallyTemplate>
    );
  },
});
