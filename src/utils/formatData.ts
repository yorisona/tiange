import Money, { MoneyUnit } from '@/utils/money';
import { formatAmount } from '@/utils/string';

const money = new Money();
const emptyCode = '--';
export const FD = {
  isEmpty(value: any) {
    if (value === null || value === undefined || value === '') return true;
    else if (value instanceof Array && value.length <= 0) return true;
    else if (value === emptyCode) return true;
    return false;
  },
  /**
   * 格式化数据, 拼接字符
   * @param value
   * @param appendChar 追加的字符串
   * @param prefixChar 补充的字符串
   */
  formatEmpty(value: any, appendChar?: string, prefixChar?: string): string {
    if (FD.isEmpty(value)) return emptyCode;
    let result = value;
    if (appendChar !== undefined) {
      result = `${result}${appendChar}`;
    }
    if (prefixChar !== undefined) {
      result = `${prefixChar}${result}`;
    }
    return result;
  },
  /**
   * 格式化时间格式字符串, 替换 - 为 .
   * @deprecated 可以直接用 moment(xxx).format
   *  **/
  formatTime(value: string): string {
    try {
      if (value === null || value === undefined || value === '') return '--';
      return value.replace(/-/g, '.');
    } catch (val: any) {
      return value;
    }
  },
  formatPrice(value: any, uint: MoneyUnit = MoneyUnit.Fen, hasSymbol = true) {
    try {
      if (value === null || value === undefined || value === '') return '--';
      const formatValue = money.format(money.parse(value, uint));
      return hasSymbol ? `￥${formatValue}` : formatValue;
    } catch (val: any) {
      return value;
    }
  },
  /**
   * 格式化金额数字
   * @param value
   * @param fixed 保留几位小数
   * @param hasSymbol 是否前缀补上金额字符
   * @param unit 单位, 金额除以单位
   */
  formatPriceFormYuan(value: any, fixed = 2, hasSymbol = true, unit = 1) {
    if (FD.isEmpty(value)) return emptyCode;
    try {
      value = value / unit;
      let result: any = value;
      if (value > 10000) {
        value = parseInt(String((value / 10000) * 100), 10);
        result = formatAmount((value / 100).toFixed(fixed), 'None', fixed === 0) + 'w';
        // result = (value / 100).toFixed(fixed) + 'w';
      } else {
        // today whotao say , after RMB 都保留 fixed 位数
        value = parseInt(String((value || 0) * 100), 10);
        result = formatAmount((value / 100).toFixed(fixed), 'None', fixed === 0);
      }
      if (hasSymbol) {
        result = `￥${result}`;
      }
      return result;
    } catch (val: any) {
      return value;
    }
  },
  formatPriceToThousand(value: any, fixed = 2, hasSymbol = true, isZoreFixed = false) {
    try {
      if (value === null || value === undefined || value === '') return '--';
      let result = value;
      if (value > 10000) {
        value = parseInt(String((value / 10000) * 100), 10);
        result = (value / 100).toFixed(fixed) + 'w';
      } else {
        // today whotao say , after RMB 都保留 fixed 位数
        value = parseInt(String((value || 0) * 100), 10);
        result = (value / 100 - 0).toFixed(fixed);
        if (isZoreFixed) {
          result = (value / 100 - 0).toFixed(0);
        }
      }
      if (hasSymbol) {
        result = `￥${result}`;
      }
      return result;
    } catch (val: any) {
      return value;
    }
  },
  formatPriceToThousandformatAmount(value: any, fixed = 2, hasSymbol = true, isZoreFixed = false) {
    try {
      if (value === null || value === undefined || value === '') return '--';
      let result = value;
      if (value > 10000) {
        value = parseInt(String((value / 10000) * 100), 10);
        result = formatAmount((value / 100).toFixed(2), 'None') + 'w';
      } else {
        // today whotao say , after RMB 都保留 fixed 位数
        value = parseInt(String((value || 0) * 100), 10);
        result = formatAmount((value / 100 - 0).toFixed(fixed), 'None');
        if (isZoreFixed) {
          result = (value / 100 - 0).toFixed(0);
        }
      }
      if (hasSymbol) {
        result = `￥${result}`;
      }
      return result;
    } catch (val: any) {
      return value;
    }
  },
  /**
   * 转化数字格式, w , 亿 为但
   * @param num
   * @param point
   */
  tranNumber(num: any, point = 2) {
    if (num === null || num === undefined || num === '') return '--';
    if (!(num >= 0)) {
      if (!num) {
        return '-';
      }
      return num;
    }
    num = num + '';
    const numStr = num.toString();
    const numStrNoPoint = numStr.split('.')[0];
    const len = numStrNoPoint.length;
    /* else if (len > 8) {
      // 大于8位数是亿
      const decimal = numStrNoPoint.substring(
        numStrNoPoint.length - 8,
        numStrNoPoint.length - 8 + point,
      );
      return parseFloat(parseInt(numStrNoPoint / 100000000 + '', 10) + '.' + decimal) + '亿';
    }*/
    // 一万以内直接返回
    if (len < 5) {
      return numStr;
    } else if (len > 4) {
      // 大于4位数是一万 (以1W分割 1W以下全部显示)
      const decimal = numStrNoPoint.substring(
        numStrNoPoint.length - 4,
        numStrNoPoint.length - 4 + point,
      );
      return parseFloat(parseInt(numStrNoPoint / 10000 + '', 10) + '.' + decimal) + 'w';
    }
  },

  /**
   * 格式化金额数字,  默认超度超了, 变成w, 且千分位分隔
   * **/
  formatMoney(value: any, fixed?: number, unit = 1, prefixChar?: string) {
    if (this.isEmpty(value)) return emptyCode;
    value = value / unit;
    const hasMoreThanTenThousand = value > 10000;
    if (hasMoreThanTenThousand) {
      value = value / 10000;
    }
    if (fixed !== undefined) {
      value = Number(value).toFixed(fixed);
    }
    value = this.formatThrousandths(value, ',');
    if (hasMoreThanTenThousand) {
      value = this.formatEmpty(value, 'w');
    }
    if (prefixChar !== undefined) value = this.formatEmpty(value, undefined, prefixChar);

    return value;
  },

  /**
   * 格式化数字为千分位
   * @param value
   * @param fixed 保留小数
   * @param thousandsSeparator
   */
  formatThrousandths(value: any, thousandsSeparator = ',') {
    let result = String(value);
    const match = /^(\d+)(\.\d+)?$/.exec(result);
    if (match) {
      result = match[1]
        .replace(/(?=(?!^)(\d{3})+$)/g, thousandsSeparator)
        .replace(/^0+(?=(?!^)\d)/g, '');
      if (match[2] !== undefined) {
        result = `${result}${match[2]}`;
      }
    }
    return result;
  },
};
export const formatData = FD;
export default formatData;
