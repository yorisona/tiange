/**
 * 日历组件 - 工具函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 13:24:05
 */

/**
 * 将整点(0 ~ 24)转成格式化的时分字符串
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-09 13:24:46
 */
export const getHourStr = (hour: number) => `${hour}`.padStart(2, '0') + ':00';
