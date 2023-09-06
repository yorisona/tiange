/*
 * @Author: 肖槿
 * @Date: 2021-11-08 10:20:27
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-04-13 14:59:44
 * @FilePath: \goumee-star-frontend\src\use\finance.ts
 */
/**
 * 财务相关
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
import { ReverseFields } from '@/types/tiange/finance/finance';
import { Settlement } from '@/types/tiange/finance/settlement';

/**
 * 是否冲销结算单
 * @deprecated 请使用 is_reversed_order 通用版本
 */
export const is_reversed_settlement = (order: Settlement) => order.reversed_id !== null;

/** 是否冲销单据(泛型版本) */
export const is_reversed_order = <T extends ReverseFields>(order: T) => order.reversed_id !== null;

/** 若为冲销单据则增加标红样式类 */
// export const get_reversed_classname = <T extends ReverseFields>(row: T) =>
//   is_reversed_order(row) || is_refunded_order(row) ? { class: 'reverse-red' } : {};

/** 若为冲销单据则增加标红样式类 */
export const get_reversed_classname = <T extends Settlement>(row: T) => ({
  class:
    row.reversed_id !== null || row.reverse_id !== null // 冲销单据标红
      ? 'reverse-red'
      : // : row.refunded_id !== null
      row.refunded_id !== null // 退款单据标红
      ? 'reverse-red'
      : (row.refund_amount !== 0 && row.refund_amount !== row.tax_included_amount) ||
        (row.reverse_amount !== 0 && row.reverse_amount !== row.tax_included_amount) //部分退款及冲销标橙
      ? 'reverse-orange'
      : (row.refund_amount !== 0 && row.refund_amount === row.tax_included_amount) ||
        (row.reverse_amount !== 0 && row.reverse_amount !== row.tax_included_amount) //全部退款及冲销标红
      ? 'reverse-red'
      : '',
  // : ''
});
export const is_refunded_order = <T extends ReverseFields>(order: T) => order.refunded_id !== null;
