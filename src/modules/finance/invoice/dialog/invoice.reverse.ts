/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-21 11:40:09
 */
/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-08-20 10:14:42
 */

import { FinanceInvoice, ProjectUIDData } from '@/types/tiange/finance/invoice';
import { TableColumn } from '@/types/vendor/column';
import { Decimal2String } from '@/utils/string';
import { computed, defineComponent, h, PropType, ref, watch } from '@vue/composition-api';
import { ProjectTypes } from '@/types/tiange/finance/invoice';
import Decimal from 'decimal.js';
import { QueryProjectUID, QuerySettlementList, WriteOffInvoice } from '@/services/finance/invoice';
import { Settlement, SettlementStatus } from '@/types/tiange/finance/settlement';
import moment from 'moment';
import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { ReverseStatus } from '@/types/tiange/finance/finance';

interface WriteOffSettlement extends Settlement {
  typein_write_off_amount: string | number | undefined;
}

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
    },
    invoice: {
      type: Object as PropType<FinanceInvoice>,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);

    const write_off_list = ref<WriteOffSettlement[]>([]);
    // const invoice_reverse_list = ref<Settlement[]>([]);
    const project_type = ref<string | undefined>(undefined);
    const select_project = ref<number | undefined>(undefined);
    const default_invoice = computed(() => props.invoice);
    const not_reverse_amount = computed(() =>
      new Decimal(default_invoice.value?.total_amount ?? 0).sub(
        new Decimal(default_invoice.value?.write_off_amount ?? 0),
      ),
    );
    const invoce_type = computed(() =>
      default_invoice.value?.invoice_type === 1 ? '销售发票' : '采购发票',
    );
    const project_uid = ref<string | undefined>(undefined);
    const project_uid_list = ref<ProjectUIDData[]>([]);
    const project_query_loading = ref<boolean>(false);

    const settlement_list = ref<Settlement[]>([]);

    const isNegative = computed(() => {
      const total_amount = props.invoice?.total_amount ? props.invoice?.total_amount : 0;
      return total_amount < 0;
    });

    const settlementColumns = computed<TableColumn<Settlement>[]>(() => [
      {
        label: '结算编号',
        minWidth: 160,
        formatter: row => row.settlement_uid,
      },
      {
        label: '结算周期',
        minWidth: 197,
        formatter: row =>
          [row.start_date, row.end_date]
            .map(el => moment(el * 1000).format('YYYY.MM.DD'))
            .join(' ~ '),
      },
      {
        label: '结算公司',
        minWidth: 221,
        formatter: row => (row.company_name ? row.company_name : '--'),
      },
      {
        label: '含税结算金额 (元)',
        minWidth: 140,
        align: 'right',
        formatter: row => methods.decimal2String(row.tax_included_amount, ''),
      },
      {
        label: '税率',
        minWidth: 55,
        align: 'center',
        formatter: row => `${row.tax_rate ?? 0}%`,
      },
      {
        label: '税额 (元)',
        minWidth: 128,
        align: 'right',
        formatter: row => methods.decimal2String(row.tax_amount, ''),
      },
      {
        label: '不含税金额 (元)',
        minWidth: 138,
        align: 'right',
        formatter: row => methods.decimal2String(row.tax_excluded_amount, ''),
      },
      {
        label: '未开票金额 (元)',
        minWidth: 138,
        align: 'right',
        formatter: row => methods.decimal2String(methods.not_write_off_amount(row), ''),
      },
      {
        label: '操作',
        minWidth: 62,
        align: 'center',
        formatter: row =>
          h(
            'tg-button',
            {
              props: {
                type: 'link',
              },
              class: 'settlement-add',
              on: {
                click: () => {
                  methods.settlement_add_action(row);
                },
              },
            },
            ['添加'],
          ),
      },
    ]);

    const invoiceReverseColumns = computed<TableColumn<any>[]>(() => [
      {
        label: '结算编号',
        minWidth: 160,
        formatter: row => row.settlement_uid,
      },
      {
        label: '结算公司',
        minWidth: 220,
        formatter: row => (row.company_name ? row.company_name : '--'),
      },
      {
        label: '结算金额 (元)',
        minWidth: 134,
        align: 'right',
        formatter: row => methods.decimal2String(row.tax_included_amount, ''),
      },
      {
        label: '税率',
        minWidth: 55,
        align: 'center',
        formatter: row => `${row.tax_rate ?? 0}%`,
      },
      {
        label: '税额 (元)',
        minWidth: 125,
        align: 'right',
        formatter: row => methods.decimal2String(row.tax_amount, ''),
      },
      {
        label: '不含税金额 (元)',
        minWidth: 125,
        align: 'right',
        formatter: row => methods.decimal2String(row.tax_excluded_amount, ''),
      },
      {
        label: isNegative.value ? '已开票金额 (元)' : '未开票金额 (元)',
        minWidth: 125,
        align: 'right',
        formatter: row => methods.decimal2String(methods.not_write_off_amount(row), ''),
      },
    ]);

    const methods = {
      cancel: () => {
        ctx.emit('update:visible', false);
      },
      sure: async () => {
        if (write_off_list.value.length === 0) {
          ctx.root.$message.warning('请添加需核销的结算编号');
          return;
        }
        if (!methods.is_all_typein()) {
          ctx.root.$message.warning('请先完善所有核销发票金额的填写');
          return;
        }
        if (methods.is_typein_zero()) {
          ctx.root.$message.warning('输入的核销发票金额不能为0');
          return;
        }
        if (!methods.validateAllWriteOffAmount()) {
          if (isNegative) {
            ctx.root.$message.error('所有结算单的核销发票金额合计小于等于发票未核销金额');
          } else {
            ctx.root.$message.error('所有结算单的核销发票金额合计不能小于发票未核销金额');
          }
        } else {
          const result = await AsyncConfirm(ctx, {
            title: '确认发票核销吗？',
            content: '发票一旦核销后不可以进行修改，是否确定核销？',
            confirmText: '确认',
            cancelText: '取消',
          });
          if (result) {
            methods.write_off_amount_request();
          }
        }
      },
      is_all_typein: () => {
        const findItem = write_off_list.value.find(el => {
          if (
            el.typein_write_off_amount === undefined ||
            el.typein_write_off_amount === null ||
            el.typein_write_off_amount === ''
          ) {
            return true;
          } else {
            return false;
          }
        });
        return findItem ? false : true;
      },
      is_typein_zero: () => {
        const findItem = write_off_list.value.find(
          el => el.typein_write_off_amount === '0' || el.typein_write_off_amount === 0,
        );
        return findItem ? true : false;
      },
      settlement_add_action: (settlement: Settlement) => {
        const findItem = write_off_list.value.find(
          el => el.settlement_uid === settlement.settlement_uid,
        );
        if (findItem) {
          return;
        }
        // invoice_reverse_list.value.push(settlement);
        write_off_list.value.push({ ...settlement, typein_write_off_amount: undefined });
      },
      invoice_reverse_delete_action: (index: number) => {
        // invoice_reverse_list.value.splice(index, 1);
        write_off_list.value.splice(index, 1);
      },
      decimal2String: (str: number | string | Decimal | undefined, prefix = '￥') => {
        return `${prefix}${Decimal2String(new Decimal(str ?? '0'))}`;
      },
      /** 查询项目列表 */
      queryProjectUIDList: async (keyword: string) => {
        if (!project_type.value) return;
        if (keyword) {
          project_query_loading.value = true;
          const res = await QueryProjectUID({
            project_type: project_type.value ?? '',
            project_uid: undefined,
            project_name: keyword,
          });
          project_query_loading.value = false;
          if (res.data.success) {
            project_uid_list.value = res.data.data;
          } else {
            ctx.root.$message.error(res.data.message ?? '查询失败，请稍后重试');
          }
        } else {
          project_uid_list.value = [];
        }
      },
      querySettlementList: async (project_uid: string) => {
        const res = await QuerySettlementList(
          props.invoice?.invoice_type === 1 ? 'income' : 'cost',
          {
            num: 1000,
            page_num: 1,
            settlement_kind: default_invoice.value?.invoice_type ?? 0,
            project_type: project_type.value ?? '',
            search_type: '2',
            search_value: project_uid ?? '',
            is_confirmed: 1,
            no_confirmed_reverse: 1,
            invoice_write_off_type: isNegative.value ? 2 : 1,
            is_tmp: 0,
            is_estimate: 0,
          },
        );
        if (res.data.success) {
          settlement_list.value = res.data.data.data.filter(
            el =>
              (!el.reverse_id ||
                (el.reverse_id && el.reverse_status !== ReverseStatus.confirmed)) &&
              !el.reversed_id &&
              !el.is_tmp &&
              !el.is_estimate &&
              el.status === SettlementStatus.confirmed &&
              !methods.not_write_off_amount(el).equals(new Decimal(0)),
          );
          ctx.root.$message.success(res.data.message ?? '核销结算成功');
        } else {
          ctx.root.$message.error(res.data.message ?? '查询失败，请稍后重试');
        }
      },
      //  未开票金额
      not_write_off_amount: (settlement: Settlement) => {
        if (isNegative.value) {
          //  负票
          return new Decimal(settlement.write_off_amount);
        } else {
          return new Decimal(settlement.tax_included_amount ?? 0).sub(
            new Decimal(settlement.write_off_amount ?? 0),
          );
        }
      },
      projectUidChange: (newVal: string) => {
        if (!newVal) {
          settlement_list.value = [];
          return;
        }
        methods.querySettlementList(newVal);
      },
      projectTypeChanged: () => {
        if (project_uid.value) {
          project_uid.value = undefined;
        }
        project_uid_list.value = [];
        settlement_list.value = [];
      },
      // 退款金额修改
      writeOffAmountInput: (value: string, index: number) => {
        if (isNegative.value) {
          //  负票
          const newVal = (/^-(0|[1-9]\d{0,11})?(?:\.\d{0,2})?/u.exec(
            value.replace(REG_REMOVE_PREFIX_ZERO, ''),
          ) ?? [''])[0];
          const settlement = write_off_list.value[index];
          const newValDecimal = new Decimal(newVal ? (newVal === '-' ? '0' : newVal) : 0);
          const write_off_amount = new Decimal(
            settlement.write_off_amount ? settlement.write_off_amount : 0,
          );
          if (
            Math.abs(newValDecimal.toNumber()) <=
              methods.not_write_off_amount(settlement).toNumber() &&
            newValDecimal.lessThanOrEqualTo(write_off_amount)
          ) {
            settlement.typein_write_off_amount = newVal;
          }
          // if (newValDecimal.lessThanOrEqualTo(write_off_amount)) {
          // //   settlement.typein_write_off_amount = newVal;
          // // }
        } else {
          const newVal = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
            value.replace(REG_REMOVE_PREFIX_ZERO, ''),
          ) ?? [''])[0];
          const newValDecimal = new Decimal(newVal ? newVal : 0);
          const settlement = write_off_list.value[index];
          const settlement_write_off_amount = methods.not_write_off_amount(settlement);
          if (
            newValDecimal.lessThanOrEqualTo(not_reverse_amount.value) &&
            newValDecimal.lessThanOrEqualTo(settlement_write_off_amount)
          ) {
            settlement.typein_write_off_amount = newVal;
          }
        }
      },
      validateAllWriteOffAmount: () => {
        let total_write_off_amount = new Decimal(0);
        write_off_list.value.forEach(el => {
          total_write_off_amount = new Decimal(
            el.typein_write_off_amount ? el.typein_write_off_amount : 0,
          ).add(total_write_off_amount);
        });
        return isNegative.value
          ? total_write_off_amount.greaterThanOrEqualTo(not_reverse_amount.value)
          : total_write_off_amount.lessThanOrEqualTo(not_reverse_amount.value);
      },
      write_off_amount_request: async () => {
        if (!props.invoice?.id) return;
        const write_off_amount_list = write_off_list.value.map(el => {
          return {
            settlement_id: el.id,
            write_off_amount: el.typein_write_off_amount,
          };
        });
        saveLoading.value = true;
        const res = await WriteOffInvoice(props.invoice?.id, write_off_amount_list);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '核销发票成功');
          ctx.emit('success');
        } else {
          ctx.root.$message.error(res.data.message ?? '核销失败，请稍后重试');
        }
      },
      settlement_list_class_name: ({ row, rowIndex }: { row: Settlement; rowIndex: number }) => {
        const settlement = settlement_list.value[rowIndex];
        const finder = write_off_list.value.find(el => el.id === settlement.id);
        return finder ? 'table-row-hidden' : 'tbale-row-show';
      },
    };

    watch([() => props.visible], ([newVisiable]) => {
      if (newVisiable) {
        write_off_list.value = [];
        settlement_list.value = [];
        project_uid_list.value = [];
        // invoice_reverse_list.value = [];
        project_type.value = undefined;
        project_uid.value = undefined;
      }
    });

    return {
      saveLoading,
      write_off_list,
      select_project,
      project_type,
      settlement_list,
      // invoice_reverse_list,
      settlementColumns,
      invoiceReverseColumns,
      ...methods,
      default_invoice,
      not_reverse_amount,
      invoce_type,
      ProjectTypes,
      project_uid,
      project_uid_list,
      project_query_loading,
    };
  },
});
