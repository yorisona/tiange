/**
 * 金额对齐
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-15 18:03:36
 */

export const MoneyAlign = {
  /**
   * 获取列设置
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-12-15 18:08:52
   */
  getColSetting: (width?: number) => ({
    align: process.env.VUE_APP_MONEY_ALIGN_STYLE,
    headerAlign: process.env.VUE_APP_MONEY_ALIGN_STYLE,
    ...(width !== undefined ? { width } : {}),
  }),
};
