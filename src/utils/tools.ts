/*
 * @Author: 肖槿
 * @Date: 2020-04-07 11:57:47
 * @Description: 辅助函数
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-28 14:17:46
 * @FilePath: \goumee-star-frontend\src\utils\tools.ts
 */
/* eslint-disable */

// 格式化时间
export function formatTime(time: number | string | Date, fmt = 'yyyy-MM-dd') {
  // time是秒
  var date = new Date(time);
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        // @ts-ignore
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
      );
  return fmt;
}

// @ts-ignore
export function getPreMonth(time) {
  var date = new Date(time);
  var year = date.getFullYear();
  var month = date.getMonth();
  if (month === 0) {
    year = year - 1;
    month = 12;
  }
  return new Date(`${year}/${month}/1`);
}

// @ts-ignore
export function deepClone(source) {
  const targetObj = source.constructor === Array ? [] : {};
  for (let keys in source) {
    // 遍历目标
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        // 如果值是对象，就递归一下
        // @ts-ignore
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        // @ts-ignore
        targetObj[keys] = deepClone(source[keys]);
      } else {
        // 如果不是，就直接赋值
        // @ts-ignore
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}

// @ts-ignore
export function numberCheck(val, obj, k) {
  const _val = Number(val.target.value);
  if (!isNaN(_val) && _val) {
    if (_val >= 100000000) {
      val.target.value = '99999999.99';
      obj[k] = '99999999.99';
    }
    if (val.target.value.includes('.')) {
      const arr = val.target.value.split('.');
      if (arr[1].length > 2) {
        val.target.value = arr[0] + '.' + arr[1].substr(0, 2);
        obj[k] = arr[0] + '.' + arr[1].substr(0, 2);
      }
    }
  } else {
    val.target.value = '';
    obj[k] = '';
  }
}

// @ts-ignore
export function onlyNumber(val, obj, k) {
  const _val = val.target.value;
  const reg = /^[1-9]\d*$/;
  val.target.value = reg.test(_val) ? _val : '';
  obj[k] = reg.test(_val) ? _val : '';
}

export function onlyNumberAndHundred (val: string, num = 100) {
  const reg = /^[1-9]\d*$/;
  if (reg.test(val)) {
    return parseInt(val) > num ? num : val;
  } else {
    return '';
  }
}

export function inputNumberHandler (val: any, num: number) {
  let _val = val.replace(/\D/g, '');
  if (_val === '') {
    return '';
  } else {
    _val = parseInt(_val, 10);
    if (_val > num) {
      _val = num;
    }
  }
  return _val + '';
};