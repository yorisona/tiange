const toFixedFix = function (nCount: number, prec: number) {
  const kNum = Math.pow(10, prec);
  return `${Math.round(nCount * kNum) / kNum}`;
};

const numberMoneyFormat = (
  number: number,
  decimals: number,
  dec_point?: string,
  thousands_sep?: string,
  is_show_unit = true,
) => {
  /** 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   */
  if (number === 0) {
    return '0.00';
  } else if (!number && number !== 0) {
    return '--';
  } else {
    const _number = `${number}`.replace(/[^0-9+-Ee.]/g, '');
    const nCount = !Number.isFinite(+_number) ? 0 : +_number;
    const prec = !Number.isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
    const dec = typeof dec_point === 'undefined' ? '.' : dec_point;
    const str = (prec ? toFixedFix(nCount, prec) : '' + Math.round(nCount)).split('.');
    const re = /(-?\d+)(\d{3})/;
    while (re.test(str[0])) {
      str[0] = str[0].replace(re, '$1' + sep + '$2');
    }

    if ((str[1] || '').length < prec) {
      str[1] = str[1] || '';
      str[1] += new Array(prec - str[1].length + 1).join('0');
    }
    if (is_show_unit) {
      return `￥${str.join(dec)}`;
    }
    return `${str.join(dec)}`;
  }
};

const numberFormat = (
  number: number,
  decimals = 0,
  dec_point?: string,
  thousands_sep?: string,
  divMultiplier: number = 1,
) => {
  /** 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   */
  if (number === 0) {
    return 0;
  } else if (!number && number !== 0) {
    return null;
  } else {
    const _number = `${+number / divMultiplier}`.replace(/[^0-9+-Ee.]/g, '');
    const nCount = !Number.isFinite(+_number) ? 0 : +_number;
    const prec = !Number.isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
    const dec = typeof dec_point === 'undefined' ? '.' : dec_point;
    const str = (prec ? toFixedFix(nCount, prec) : '' + Math.round(nCount)).split('.');
    const re = /(-?\d+)(\d{3})/;
    while (re.test(str[0])) {
      str[0] = str[0].replace(re, '$1' + sep + '$2');
    }

    if ((str[1] || '').length < prec) {
      str[1] = str[1] || '';
      str[1] += new Array(prec - str[1].length + 1).join('0');
    }

    return `${str.join(dec)}`;
  }
};

const numberPercentFormat = (
  number: number,
  decimals: number,
  dec_point?: string,
  thousands_sep?: string,
) => {
  /** 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   */
  if (number === 0) {
    return '0%';
  } else if (!number && number !== 0) {
    return '--';
  } else {
    const _number = `${number}`.replace(/[^0-9+-Ee.]/g, '');
    const nCount = !Number.isFinite(+_number) ? 0 : +_number;
    const prec = !Number.isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep;
    const dec = typeof dec_point === 'undefined' ? '.' : dec_point;
    const str = (prec ? toFixedFix(nCount, prec) : '' + Math.round(nCount)).split('.');
    const re = /(-?\d+)(\d{3})/;
    while (re.test(str[0])) {
      str[0] = str[0].replace(re, '$1' + sep + '$2');
    }

    if ((str[1] || '').length < prec) {
      str[1] = str[1] || '';
      str[1] += new Array(prec - str[1].length + 1).join('0');
    }

    return `${str.join(dec)}` + '%';
  }
};

export { numberMoneyFormat, numberFormat, numberPercentFormat };
