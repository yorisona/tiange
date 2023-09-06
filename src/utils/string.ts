/**
 * 字符串处理
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-03 14:30:38
 */
import { REG_NATURAL_NUMBER, REG_REMOVE_PREFIX_ZERO, REG_RMEOVE_NON_DIGITAL } from '@/const/regexp';
import Money, { MoneyUnit } from './money';
import Decimal from 'decimal.js';
import { getToken } from './token';

/**
 * 判断字符串是否为空串
 * undefined / 纯空格均算
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-03 14:31:59
 * @param {string|undefined} str 字符串
 */
export const isEmptyStr = (str: string | undefined) => `${str ?? ''}`.trim() === '';

/**
 * 如果是空串，以默认内容填充
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-03 14:32:47
 * @param {string|undefined} str 待处理字符串
 * @param {string} fill 默认填充内容，默认值 '--'
 */
export const fillEmptyStr = (str: string | undefined, fill = '--') =>
  isEmptyStr(str) ? fill : str;

/**
 * ```
 * 数字输入处理
 * 1. 整数位数: 不限
 * 2. 小数位数: 2
 * 3. 移除前导 0
 * 4. 若无输入则返回空字符串
 * ```
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-28 16:37:04
 * @param   {string} value 输入值
 */
export const getPositiveNumber = (value: string) =>
  (REG_NATURAL_NUMBER.exec(
    value.replace(REG_RMEOVE_NON_DIGITAL, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
  ) ?? [''])[0];

/**
 * ```
 * 数字输入处理
 * 1. 整数位数: 不限
 * 2. 小数位数: 2
 * 4. 若无输入则返回空字符串
 * ```
 * @param   {string} value 输入值
 */
export const getPositiveNumberHaveZero = (value: string) => {
  return (REG_NATURAL_NUMBER.exec(value.replace(REG_RMEOVE_NON_DIGITAL, '')) ?? [''])[0];
};

const money = new Money();

/**
 * 金额显示格式化
 *
 * @param {string|number} amount 输入值
 * @param {string|'None'} prefix 前缀，None：无前缀；默认 ¥
 * @param {boolean} noDecimal 数据本身是否有小数
 */
export const formatAmount = (
  amount: string | number,
  prefix: string | 'None' = '¥',
  noDecimal = false,
) => {
  let tempAmount = amount;
  const parAmount = parseFloat(`${tempAmount}`);
  if (isNaN(parAmount)) {
    tempAmount = 0;
  }
  let tempAmountStr = '';
  if (noDecimal) {
    tempAmountStr = money.addThousand(`${tempAmount}`);
  } else {
    tempAmountStr = `${money.format(parseFloat(`${tempAmount}`), MoneyUnit.Yuan)}`;
  }
  if (prefix === 'None') {
    return tempAmountStr;
  } else {
    return `${prefix}${tempAmountStr}`;
  }
};

export const formatAmountWithoutPrefix = (amount: string | number) => {
  let tempAmount = amount;
  const parAmount = parseFloat(`${tempAmount}`);
  if (isNaN(parAmount)) {
    tempAmount = 0;
  }
  return `${money.format(parseFloat(`${tempAmount}`), MoneyUnit.Yuan)}`;
};

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * 生成随机字符串
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-25 13:13:22
 */
export const getRandomHash = (length = 6) =>
  new Array(length)
    .fill(0)
    .map(() => chars[Math.trunc(Math.random() * chars.length)])
    .join();

/**
 * 获取字符串长度(汉字算作2个字符)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-01 13:42:26
 */
export const strlen = (str: string) =>
  str
    .split('')
    .map(ch => ch.charCodeAt(0))
    .map(chCode => (chCode >= 0 && chCode <= 128 ? 1 : 2))
    .reduce((acc, cur) => acc + cur, 0);

/**
 * levenshtein距离
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-15 14:12:34
 */
export const levenshtein = (stra: string, strb: string): number => {
  const lena = stra.length;
  const lenb = strb.length;
  const subarray = new Array(lenb + 1).fill(0).map(() => 0);
  const matrix: number[][] = new Array(lena + 1).fill('').map(() => subarray.map(el => el));

  for (let index = 1; index <= lena; index++) matrix[index][0] = index;
  for (let index = 1; index <= lenb; index++) matrix[0][index] = index;
  for (let ii = 1; ii <= lena; ii++) {
    for (let jj = 1; jj <= lenb; jj++) {
      if (stra[ii - 1] === strb[jj - 1]) {
        matrix[ii][jj] = matrix[ii - 1][jj - 1];
      } else {
        matrix[ii][jj] =
          Math.min(matrix[ii - 1][jj - 1], Math.min(matrix[ii][jj - 1], matrix[ii - 1][jj])) + 1;
      }
    }
  }

  return matrix[lena][lenb];
};

/**
 * decimal 转带千分位的字符串，默认返回 0.00
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-27 13:45:46
 */
export const Decimal2String = (number: Decimal) => {
  if (!number) {
    return '0.00';
  }
  const number_str = number.toString();
  const result = /(?<signal>-?)(?<integer>\d*)(?:\.(?<decimal>\d{0,2}))?/gu.exec(number_str);
  if (result === null) {
    return '0.00';
  } else {
    if (result.groups === undefined) {
      return '0.00';
    } else {
      const { signal, integer, decimal } = result.groups as {
        signal?: string;
        integer?: string;
        decimal?: string;
      };
      return [
        signal,
        (integer ?? '')
          .padStart(Math.ceil((integer ?? '').length / 3) * 3, '0')
          .replace(/(?=(?!^)(\d{3})+$)/g, ',')
          .replace(/^0+(?=(?!^)\d)/g, ''),
        '.',
        (decimal ?? '00').padEnd(2, '0'),
      ].join('');
    }
  }
};
const reg_cn =
  /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/u;

/** 大写字母在macOS下14px默认字体的字宽(计算用参考) */
const uppercase_letter_width = [
  9.203125, 9.484375, 10.203125, 9.890625, 8.921875, 8.078125, 10.484375, 10.09375, 3.328125, 7.25,
  9.671875, 8.234375, 12.359375, 10.078125, 10.75, 9, 10.75, 9.46875, 8.859375, 8.671875, 10,
  8.953125, 13.03125, 8.921875, 9.28125, 8.75,
];

/** 小写字母在macOS下14px默认字体的字宽(计算用参考) */
const lowercse_letter_width = [
  7.828125, 8.21875, 7.671875, 8.21875, 7.78125, 5.234375, 8.28125, 7.796875, 3.59375, 3.75,
  7.40625, 3.296875, 11.984375, 7.828125, 8.21875, 8.21875, 8.21875, 5.125, 7.078125, 4.984375,
  7.84375, 6.75, 10.578125, 7.140625, 6.953125, 6.828125,
];

/**
 * 计算(实际显示的)字符串长度
 * ```
 * 主要场景是计算表格单元格内显示文本长度
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-31 11:45:21
 */
export const get_length_of_string = (str: string | null | undefined, font_size = 12) =>
  (str ? `${str}` : '')
    .split('')
    .map(el => {
      if (/[a-z]/.test(el)) {
        return (font_size * lowercse_letter_width[el.charCodeAt(0) - 97]) / 14;
      } else if (/[A-Z]/.test(el)) {
        return (font_size * uppercase_letter_width[el.charCodeAt(0) - 65]) / 14;
      } else if (/-/.test(el)) {
        return (font_size * 8) / 14;
      } else if (/1/.test(el)) {
        return font_size * 0.601;
      } else if (/[/]/.test(el)) {
        return font_size * 0.402;
      } else if (/7/.test(el)) {
        return font_size * 0.547;
      } else if (/[02-689]/.test(el)) {
        return font_size * 0.601;
      } else if (/\.|,/.test(el)) {
        return 4;
      } else if (reg_cn.test(el)) {
        return font_size;
      } else {
        return font_size;
      }
    })
    .reduce((acc, cur) => acc + cur, 0);

/**
 * 根据指定长度折叠字符串内容
 * ```
 * 必定折叠内容并在字符串尾部附加"..."
 * "..."算在折叠后字符串长度内
 * ```
 * @param {string} str 待折叠字符串
 * @param {number} string_length_max 长度上限
 */
export const get_folded_text = (str: string, string_length_max: number) => {
  const chars = str.split('');
  const left_chars: string[] = [];
  const max_length = get_length_of_string(new Array(string_length_max).fill('〇').join(''));
  while (get_length_of_string(left_chars.join('') + '...') <= max_length && chars.length > 0) {
    left_chars.push(chars.shift() ?? '');
  }

  return left_chars.join('') + '...';
};

/**
 * 限制字符串长度
 * ```
 * ! 建议使用函数 `get_limited_length_string`
 * 字符串长度超长则折叠并附加"..."
 * 若字符串未超长则原样返回
 * ```
 * @param {string} str 待处理字符串
 * @param {number} string_length_max 长度上限 默认10(汉字)宽
 */
export const limit_string_length = (str: string, string_length_max = 10) => {
  const len = get_length_of_string(str);
  const len_max = get_length_of_string(new Array(string_length_max).fill('〇').join(''));

  return len <= len_max ? str : get_folded_text(str, string_length_max);
};

/**
 * 限制字符串长度
 * ```
 * 返回对象
 * {
 *
 * // 文本是否被折叠
 * is_foled: boolean;
 * // 原始文本
 * text: string;
 * // 折叠后
 * folded_text: string;
 * }
 * ```
 * @param {string} str 待处理字符串
 * @param {number} string_length_max 长度上限 默认10(汉字)宽
 */
export const get_limited_length_string = (
  str: string,
  string_length_max = 10,
): {
  /** 文本是否被折叠 */
  is_folded: boolean;
  /** 原始文本 */
  text: string;
  /** 折叠后文本，若不需要折叠则等同原始文本 */
  folded_text: string;
} => {
  const len = get_length_of_string(str);
  const len_max = get_length_of_string(new Array(string_length_max).fill('〇').join(''));

  const is_folded = len > len_max;

  return {
    is_folded,
    text: str,
    folded_text: is_folded ? get_folded_text(str, string_length_max) : str,
  };
};

/**
 * 取字符串内第一个字/字母，汉字优先
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-15 14:06:38
 */
export const get_first_letter_cn_first = (str: string) => {
  const cn_letter_only = str.replace(/\w+/gu, '');
  return cn_letter_only.split('')[0] || str.replace(/\W+/gu, '').split('')[0];
};

/**
 * 取字符串中指定字符出现次数
 * @param str 需要统计的字符串
 * @param keys 统计哪个字符
 */
export const theMost = (str: string, keys: string) => {
  const obj: any = [...str].reduce((res: any, cry) => {
    res[cry] ? res[cry]++ : (res[cry] = 1);
    return res;
  }, {});
  return obj[keys];
};

/**
 * 根据总结算金额、是否含税和税率计算 含税金额、不含税金额和税额
 * tax_included_amount:  含税金额
 * tax_excluded_amount: 不含税金额
 * tax_amount:  税额
 */
export const get_tax_amount_info = (
  total_settle_amount: string | number,
  is_include_tax: number,
  tax_rate: string | number,
) => {
  const taxRate = new Decimal(tax_rate).div(new Decimal(100));
  const totalSettleAmount = new Decimal(total_settle_amount);
  let tax_included_amount: Decimal;
  let tax_excluded_amount: Decimal;
  let tax_amount: Decimal;
  if (is_include_tax === 1) {
    //  含税
    tax_included_amount = totalSettleAmount;
    tax_excluded_amount = totalSettleAmount.div(new Decimal(1).add(taxRate));
    tax_amount = totalSettleAmount.sub(tax_excluded_amount);

    // tax_amount = totalSettleAmount.mul(taxRate);
    // tax_excluded_amount = totalSettleAmount.sub(tax_amount);
    // tax_included_amount = totalSettleAmount;
  } else {
    //  不含税
    tax_excluded_amount = totalSettleAmount;
    tax_amount = totalSettleAmount.mul(taxRate);
    tax_included_amount = totalSettleAmount.add(tax_amount);

    // tax_excluded_amount = totalSettleAmount;
    // tax_included_amount = totalSettleAmount.div(new Decimal(1).sub(taxRate));
    // tax_amount = tax_included_amount.sub(totalSettleAmount);
  }
  return {
    tax_included_amount: tax_included_amount.toFixed(2),
    tax_excluded_amount: tax_excluded_amount.toFixed(2),
    tax_amount: tax_amount.toFixed(2),
  };
};

export const imgTokenUrl = (url: string | undefined) => {
  if (!url) {
    return undefined;
  }
  if (url.indexOf('?') >= 0) {
    return `${url}&Authorization=${getToken()}`;
  }
  return `${url}?Authorization=${getToken()}`;
};

export const transformSecond = (val: number | null | undefined) => {
  if (val === undefined || val === null) {
    return '--';
  }
  if (val === 0) {
    return '0';
  }
  let time_str = '';
  const hour = parseInt(`${val / 60 / 60}`, 10);
  const minite = parseInt(`${(val - hour * 60 * 60) / 60}`, 10);
  const second = parseInt(`${val - hour * 60 * 60 - minite * 60}`, 10);
  if (hour >= 1) {
    time_str = `${hour}小时`;
  }
  if (minite >= 1) {
    time_str = `${time_str}${minite}分`;
  }
  if (second >= 1) {
    time_str = `${time_str}${second}秒`;
  }
  return time_str;
};

/**
 * 获取url参数
 * @param url
 * @returns {key:value}
 */
export const getUrlParams = (url: string) => {
  // 通过 ? 分割获取后面的参数字符串
  const urlStr = url.split('?')[1];
  // 创建空对象存储参数
  const obj: any = {};
  // 再通过 & 将每一个参数单独分割出来
  const paramsArr = urlStr.split('&');
  for (let i = 0, len = paramsArr.length; i < len; i++) {
    // 再通过 = 将每一个参数分割为 key:value 的形式
    const arr = paramsArr[i].split('=');
    obj[arr[0]] = arr[1];
  }
  return obj;
};
