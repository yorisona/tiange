/**
 * 表格用的函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-01 13:47:21
 */
import { computed, ComputedRef, Ref, h } from '@vue/composition-api';
import { get_length_of_string, strlen, Decimal2String } from './string';
import Decimal from 'decimal.js';

/**
 * 获取字符串数组中最长的字符串长度
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-01 13:53:02
 */
export const getStringArrayLenMax = (list: string[]) => Math.max(0, ...list.map(el => strlen(el)));

/**
 * 根据列数据(近似地)动态计算最大所需列宽
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-01 13:53:40
 * @param   {number} letterWidth 字符宽度 默认7(单字符)
 * @param   {number} compensationWidth 总体补偿宽度 默认15 防止具体场景中计算误差产生的总宽度不够情况
 */
export const getColContentMaxWidth = (list: string[], letterWidth = 7, compensationWidth = 0) =>
  getStringArrayLenMax(list) * letterWidth + compensationWidth;

/**
 * 动态计算列宽的时候根据数据、列标题、渲染函数、列间距给出一个Computed的最大值
 * ```
 * 函数内部额外加了 6px 补偿值防止计算误差为负值 (与 macOS 相比 Windows 需要补偿更多)
 * 若宽度还不足请通过调大 padding 传值来作一定补偿
 * ```
 * @param {Ref<T[]> | ComputedRef<T[]>} data 数据
 * @param {string} title 列标题
 * @param {(row: T, text_only: true) => string} renderFn 自定义渲染函数
 * @param {number} padding 列的左右(预留)间距 默认24 一般不用传值
 */
export const max_length_of_column = <T>(
  data: Ref<T[]> | ComputedRef<T[]>,
  title: string,
  renderFn: ((row: T, text_only: true) => string) | ((row: T) => string),
  padding = 20,
) =>
  computed(
    () =>
      Math.ceil(
        Math.max(
          ...data.value.map(row => get_length_of_string(renderFn(row, true))),
          get_length_of_string(title),
        ),
      ) +
      padding +
      10, // 额外加 6px 补偿值防止计算误差为负值， 若还不足请通过增加padding传值来修正
  );

/** 表格列渲染价格 **/
export const column_render_price = (val: number | string, is_show_unit = true) => {
  let str;
  if (val === '' || val === undefined) str = '--';
  else str = Decimal2String(new Decimal(val ?? 0));
  if (is_show_unit) {
    return h('span', [`￥${str}`]);
  }
  return h('span', [`${str}`]);
};
