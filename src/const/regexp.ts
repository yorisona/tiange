/**
 * 常用正则
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 17:12:24
 */

/** 正则: 自然数 */
export const REG_NATURAL_NUMBER = /\d+(?:\.\d{0,2})?|\.\d{0,2}/u;

/**
 * 正则: 自然数
 * ```
 * 严格模式，严格匹配首尾
 * ```
 */
export const REG_NATURAL_NUMBER_STRICT = /^(?:\d+(?:\.\d{0,2})?|\.\d{0,2})$/u;

/**
 * 正则: 正数
 * ```
 * 为确保正确匹配到正数
 * 不匹配0 / 0. / 0.0 / 0.00 / .0 / .00 等 0值场景
 * 该正则不能用于输入过程校验
 * ```
 */
export const REG_POSITIVE_NUMBER = /\+?(?:[1-9]\d+(?:\.\d{0,2})?|0\.(?:[1-9]\d?|\d[1-9]))/u;

/** 正则: 匹配移除非(数字|小数点) */
export const REG_RMEOVE_NON_DIGITAL = /[^.\d]+/gu;

/** 正则: 匹配移除前导0 */
export const REG_REMOVE_PREFIX_ZERO = /^0(?=\d)/u;

/** 正则: 0值 允许2位小数和省略整数部分 */
export const REG_ZERO = /^0?(?:\.0{0,2})?$/u;

/** 正则: 输入时的自然数 */
export const REG_INPUT_NATURAL_NUMBER = /(?<int>0|[1-9]\d*)(?:\.(?<dec>\d{0,2}))?/u;

/**
 * 正则: 正数
 * ```
 * 严格模式，严格匹配首尾
 *
 * 为确保正确匹配到正数
 * 不匹配0 / 0. / 0.0 / 0.00 / .0 / .00 等 0值场景
 * 该正则不能用于输入过程校验
 * ```
 */
export const REG_POSITIVE_NUMBER_STRICT =
  /^\+?(?:[1-9]\d*(?:\.\d{0,2})?|0\.(?:[1-9]\d?|\d[1-9]))$/u;

/**
 * 纯数字字符串
 * ```
 * 即字符范围 0123456789
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-25 10:45:51
 */
export const REG_ONLY_DIGITAL = /^\d+$/u;

/**
 * 判断是否网址(掘金上找的)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-22 19:19:54
 * @see {@link https://juejin.cn/post/6844903846766968845}
 */
export const REG_URL =
  /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/;

/**
 * 纳税人识别号
 * ```
 * 依据国家相应法律法规文件等给出
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-08 11:19:44
 */
export const REG_TAX_ID = /^(?:\d{17}[\dxX]\w{0,2}|\d{15}|\d{8}[\dA-Z]{10}|[CWJHMT]\d{16}[\dxX])$/;
