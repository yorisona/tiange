/**
 * 客户合同 - 列表
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-24 11:32:52
 */
import { GetStatisticsContractLawList } from '@/services/contract';
import { ContractQueryParams, SignTypeMap } from '@/types/tiange/contract';
import { computed, h, ref, SetupContext } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { DefText } from '@/components/DefText/dt';
import { render } from '@/use/vue';
import { usePermission } from '@/use/permission';
import { BusinessTypeEnum, BusinessTypeMap } from '@/types/tiange/common';
import { max_length_of_column } from '@/utils/table';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { Decimal2String, get_limited_length_string } from '@/utils/string';
// import Decimal from 'decimal.js';
import { usePageJump } from '@/utils/pageJump';
import Decimal from 'decimal.js';
import { format as DateTimeFormat } from '@/utils/time';
import moment from 'moment';

type Col = TableColumn<any>;

export const useList = render((ctx: SetupContext) => {
  /** 列表加载中 */

  const { jumpProjectDetail } = usePageJump();
  const loading = ref(false);
  const total = ref(0);

  /** 客户合同数据列表 */
  const list = ref<any[]>([]);
  /** 加载数据 */
  const loadData = async (payload: ContractQueryParams) => {
    list.value = [];
    loading.value = true;
    payload.contract_status = 2;
    const { data: response } = await GetStatisticsContractLawList(payload);
    loading.value = false;
    if (response.success) {
      list.value = response.data.data.map((item: any) => {
        const pay_type = item.pay_type;
        item.getMoneytype = '';
        item.contractMoney = '';
        item.contractCommission = '';
        item.contractOtherMoney = '';
        if (pay_type === 1) {
          item.getMoneytype = '固定服务费';
          item.contractMoney =
            item.contract_amount || item.contract_amount === 0
              ? '￥' + Decimal2String(new Decimal(item.contract_amount))
              : '--';
        } else if (pay_type === 2) {
          item.getMoneytype = '服务费+佣金';
          const zhubovalue = item.anchor_commission_rate
            ? item.contract_commission_rate + '%(主播)'
            : '';
          const goumeivalue =
            item.ourself_commission_rate || Number(item.ourself_commission_rate) !== 0
              ? item.ourself_commission_rate + '%(构美)'
              : '';
          const money =
            item.contract_amount || item.contract_amount === 0
              ? '￥' + Decimal2String(new Decimal(item.contract_amount))
              : '';
          item.contractMoney = money;
          if (goumeivalue || zhubovalue) {
            item.contractCommission = goumeivalue ? goumeivalue + '+' + zhubovalue : zhubovalue;
          } else {
            const value =
              item.contract_commission_rate || item.contract_commission_rate === 0
                ? item.contract_commission_rate + '%'
                : '';
            item.contractCommission = value;
          }
        } else if (pay_type === 3) {
          item.getMoneytype = '纯佣金';
          const zhubovalue = item.anchor_commission_rate
            ? item.contract_commission_rate + '%(主播)'
            : '';
          const goumeivalue =
            item.ourself_commission_rate || Number(item.ourself_commission_rate) !== 0
              ? item.ourself_commission_rate + '%(构美)'
              : '';
          if (goumeivalue || zhubovalue) {
            item.contractCommission = goumeivalue ? zhubovalue + '+' + goumeivalue : zhubovalue;
          } else {
            const value =
              item.contract_commission_rate || item.contract_commission_rate === 0
                ? item.contract_commission_rate + '%'
                : '';
            item.contractCommission = value;
          }
        } else if (pay_type === 0 || pay_type) {
          item.getMoneytype = '其它';
          item.contractOtherMoney = '--';
        } else {
          item.getMoneytype = '--';
          item.contractOtherMoney =
            item.contract_amount || item.contract_amount === 0
              ? '￥' + Decimal2String(new Decimal(item.contract_amount))
              : '--';
        }
        return item;
      });
      total.value = response.data.total;
    } else {
      ctx.root.$message({
        type: 'warning',
        message: response.message ?? '查询合同失败，稍后重试',
        duration: 2000,
        showClose: true,
      });
    }
  };

  const permission = usePermission();

  const contract_type_formatter = (row: any) =>
    row.contract_type === 1 || row.contract_type === 2 || row.contract_type === 5
      ? '客户合同'
      : '供应商合同';

  const contract_type_column_max_width = max_length_of_column(
    list,
    '合同类别',
    contract_type_formatter,
  );

  /** 合同编号渲染函数 */
  /** 合同编号渲染函数 */
  const contract_info_render = <T extends boolean>(row: any, text_only: T) => {
    const { contract_uid } = row;

    if (text_only) {
      // 此处加的 '字数补丁' 是在纯文本条件下用来代替合同类型标签的
      // 宽度相等
      return contract_uid;
    }

    const refNode = h('div', [h('span', [contract_uid])]);

    return refNode as TableColumnRenderReturn<T>;
  };

  /** 合同编号最大宽度 */
  const contract_type_max_length = max_length_of_column(list, '合同编号', contract_info_render);

  /** 公司名称渲染函数 */
  const company_name_render = <T extends boolean>(
    row: any,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row.company_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 12);

    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: data,
            },
          },
          [h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };
  /** 公司名称渲染函数 */
  const company_name_max_length = max_length_of_column(list, '公司名称', company_name_render);
  /** 项目名称渲染函数 */
  const project_name_render = <T extends boolean>(
    row: any,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const data = row.project_name || '--';
    const { is_folded, folded_text } = get_limited_length_string(data, 12);
    return text_only || !is_folded
      ? (h(
          'span',
          {
            class: ['hover-link', 'empty-data-line'],
            on: {
              click: (event: MouseEvent) => {
                jumpProjectDetail(row.business_type, {
                  project_id:
                    row.business_type === BusinessTypeEnum.marketing
                      ? row.cooperation_id
                      : row.project_id,
                  newWindow: true,
                });
              },
            },
          },
          [folded_text],
        ) as TableColumnRenderReturn<T>)
      : (h(
          'el-popover',
          {
            props: {
              placement: 'top',
              trigger: 'hover',
              content: data,
            },
          },
          [
            h(
              'span',
              {
                class: ['hover-link', 'empty-data-line'],
                on: {
                  click: (event: MouseEvent) => {
                    jumpProjectDetail(row.business_type, {
                      project_id:
                        row.business_type === BusinessTypeEnum.marketing
                          ? row.cooperation_id
                          : row.project_id,
                      newWindow: true,
                    });
                  },
                },
                slot: 'reference',
              },
              [folded_text],
            ),
          ],
        ) as TableColumnRenderReturn<T>);
  };
  /** 列设置 */
  const columns = computed<Col[]>(() => [
    {
      prop: 'row',
      label: '项目名称',
      fixed: 'left',
      minWidth: 180,
      formatter: row => project_name_render(row, false),
    },
    {
      label: '业务类型',
      fixed: 'left',
      minWidth: 100,
      align: 'center',
      formatter: row =>
        row.business_type !== undefined ? BusinessTypeMap.get(row.business_type) ?? '--' : '--',
    },
    {
      label: '合同类别',
      fixed: 'left',
      align: 'center',
      minWidth: contract_type_column_max_width.value,
      formatter: contract_type_formatter,
    },
    {
      prop: 'row',
      label: '合同编号',
      minWidth: contract_type_max_length.value,
      formatter: row => contract_info_render(row, false),
    },
    {
      label: '签约类型',
      minWidth: 100,
      align: 'center',
      formatter: (row: any) => {
        return SignTypeMap.get(row.sign_type) || '--';
      },
    },
    {
      prop: 'company_name',
      label: '公司名称',
      minWidth: company_name_max_length.value,
      formatter: row => company_name_render(row, false),
    },
    {
      label: '合作期限',
      width: 206,
      align: 'center',
      formatter: (row: any) => {
        let endDateTimeStr = '';
        if (
          row.coop_start_date !== null &&
          (row.coop_end_date === null || row.coop_end_date === 0)
        ) {
          endDateTimeStr = '长期有效';
        } else {
          endDateTimeStr = row.coop_end_date
            ? DateTimeFormat(moment(parseInt(row.coop_end_date, 10) * 1000).valueOf(), 'YYYY-mm-dd')
            : '';
        }
        const startDateTimeStr = row.coop_start_date
          ? DateTimeFormat(moment(parseInt(row.coop_start_date, 10) * 1000).valueOf(), 'YYYY-mm-dd')
          : '';
        const arr: any = [startDateTimeStr, endDateTimeStr];
        const timestr =
          arr
            .filter((el: any) => el !== null)
            .join('～')
            .replace(/-/g, '.') || DefText();
        return timestr;
      },
    },
    {
      label: '费用类型',
      width: 130,
      align: 'center',
      formatter: (row: any) => row.getMoneytype ?? DefText(),
    },
    {
      label: '合同金额',
      align: 'left',
      minWidth: 200,
      formatter: row => {
        const arr = [];
        if (row.contractMoney) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-third-color)',
                  },
                },
                [row.contractCommission ? '服务费：' : '固定服务费：'],
              ),
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractMoney ?? '--'],
              ),
            ]),
          );
        }
        if (row.contractCommission) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-third-color)',
                  },
                },
                ['佣金：'],
              ),
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractCommission ?? '--'],
              ),
            ]),
          );
        }
        if (row.contractOtherMoney) {
          arr.push(
            h('div', [
              h(
                'span',
                {
                  style: {
                    color: 'var(--text-color)',
                  },
                },
                [row.contractOtherMoney ?? '--'],
              ),
            ]),
          );
        }
        return arr.length > 0 ? arr : '--';
      },
    },
    {
      label: '结算金额 (元)',
      align: 'right',
      minWidth: 160,
      formatter: row => {
        const money =
          row.settlement_amount || row.settlement_amount === 0
            ? Decimal2String(new Decimal(row.settlement_amount))
            : '--';
        return money;
      },
    },
    {
      label: '已付/已收金额 (元)',
      align: 'right',
      minWidth: 160,
      formatter: row => {
        const money =
          row.received_or_paid_amount || row.received_or_paid_amount === 0
            ? Decimal2String(new Decimal(row.received_or_paid_amount))
            : '--';
        return money;
      },
    },
    {
      label: '发票核销金额 (元)',
      align: 'right',
      minWidth: 160,
      formatter: row => {
        const money =
          row.invoice_write_off_amount || row.invoice_write_off_amount === 0
            ? Decimal2String(new Decimal(row.invoice_write_off_amount))
            : '--';
        return money;
      },
    },
    {
      label: '是否收回',
      minWidth: 100,
      align: 'center',
      formatter: (row: any) => {
        if (row.is_recycled) {
          return '是';
        } else {
          return '否';
        }
      },
    },
  ]);
  return {
    list,
    loading,
    loadData,
    total,
    columns,
    permission,
  };
});
