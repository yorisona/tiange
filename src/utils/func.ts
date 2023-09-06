/**
 * 工具函数
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-12 09:21:28
 */

import { ComponentValue } from '@/types/base/component';
import { urlAppendToken } from '@/utils/token';

/**
 * 将Vue响应式对象转换成一个新的干净的对象
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-12 09:23:29
 * @param {Record<string, unknown>} obj 待转换的Vue响应式对象
 * @return {Record<string, unknown>} cleanObj 干净的对象
 */
export const parse = <T = Record<string, unknown>>(obj: T): T => JSON.parse(JSON.stringify(obj));

type ElmentInArrayFunction<V = any> = [string, V];

/**
 * ObjectMap 函数处理过程中拿到的键值对对象
 * @type {[ string, any ]}
 */
export type ElmentInObjectMapCallback<V> = ElmentInArrayFunction<V>;

/**
 * ObjectMap 函数处理过程中拿到的键值对对象
 * @type {[ string, any ]}
 */
export type ElmentInObjectFilterCallback<V> = ElmentInArrayFunction<V>;

/**
 * 判断是否空数组
 * @param {any} val
 * @return {boolean}
 */
export const isEmptyArray = (val: any): boolean => Array.isArray(val) && val.length === 0;

/**
 * 判断是否对象(非数组)
 * @param {any} val
 * @return {boolean}
 */
export const isObject = (val: any): boolean => typeof val === 'object' && !Array.isArray(val);

/**
 * 判断是否空对象(非数组)
 * @param {any} val
 * @return {boolean}
 */
export const isEmptyObject = (val: any): boolean => isObject(val) && Object.keys(val).length === 0;

/**
 * 判断是否是空白字符串
 * @param val
 */
export const isEmptyString = (val: string) => {
  return /^\s*$/.test(val);
};

/**
 * 判断变量是否为空值
 * 空字符串、空数组、空对象、undefined、null 均判定为空值
 */
export const isEmpty = (val: any): boolean =>
  typeof val === 'number'
    ? false
    : typeof val === 'string'
    ? isEmptyString(val)
    : val === undefined || val === null || isEmptyArray(val) || isEmptyObject(val);

/**
 * 类似 Array.prototype.map 的方式
 * 将一个非数组对象进行映射到新的对象
 * @param {object} obj 待转换的对象
 * @param fn 映射函数
 * @return {object} newObj 新的对象
 *
 * ```
 *  const obj = { a: 1, b: 2 };
 *  const newObj = ObjectMap(obj, ([ key, val ]) => ([ key, val * 2 ]));
 *  // Result: { a: 2, b: 4 }
 * ```
 */
export const ObjectMap = <V = any, T = Record<string, V>, RV = V>(
  obj: T,
  fn: (
    currentValue: ElmentInObjectMapCallback<V>,
    index?: number,
    array?: ElmentInObjectMapCallback<V>[],
  ) => ElmentInObjectMapCallback<RV>,
): Record<string, RV> => Object.fromEntries(Object.entries(obj).map(fn));

/**
 * 类似 Array.prototype.filter 的方式
 * 将一个非数组对象的特定键值对过滤掉
 * @param {object} obj 待转换的对象
 * @param fn 过滤函数
 * @return {object} newObj 新的对象
 */
export const ObjectFilter = <V = any, T = Record<string, V>>(
  obj: T,
  fn: (
    element: ElmentInObjectFilterCallback<V>,
    index: number,
    array: ElmentInObjectFilterCallback<V>[],
  ) => boolean,
): Record<string, V> => Object.fromEntries(Object.entries(obj).filter(fn));

/**
 * 过滤掉对象中空值
 * 返回新对象
 * @param {any} obj
 * @return {any} newObj
 */
export const ObjectFilterEmpty = <V = any, T = Record<string, V>>(obj: T): Record<string, V> => {
  if (obj === undefined) return {};
  return ObjectFilter<V, T>(
    obj,
    <V>([_, value]: ElmentInObjectMapCallback<V>): boolean => !isEmpty(value),
  );
};

/**
 * key -> value object 转 url search params
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-23 14:16:16
 */
export const URLSearchMaker = (params: Record<string, any>): string =>
  new URLSearchParams(Object.entries(params)).toString();

/**
 * 去重
 * 简单数据类型，不包括对象类型
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-01 16:11:33
 */
export const unique = <T = ComponentValue>(list: T[]): T[] => Array.from(new Set(list));

/**
 * 判断给定数据是否存在重复元素
 * 简单数据类型，不包括对象类型
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-01 16:12:35
 */
export const isUnique = <T = any>(list: T[]): boolean => list.length > unique(list).length;

export const parseXML = (domStr: string) => new DOMParser().parseFromString(domStr, 'text/xml');

/**
 * 从对象中找到指定key对应的val
 * 其实是个没用的函数
 * 但是为了防止Ts类型推导不正确报错
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-07 00:52:02
 */
export const ObjectFind = <V = any, T = Record<string, V>>(obj: T, prop: keyof T): any => {
  const [_, val] = Object.entries(obj).find(([key, _]) => key === prop) ?? [];

  return val;
};

/**
 * 将参数数组编码成 base64 字符串的路由参数
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-10 13:56:13
 * @param {Array<string | number>} params 参数数组
 * @return {string}
 */
export function encodeRouterParams(params: Array<string | number>): string {
  return btoa(params.join('_'));
}

/**
 * 将 base64 字符串路由参数解码成参数数组
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-10 13:57:52
 * @param {string} param
 * @return {string[]}
 */
export async function decodeRouterParams(param: string): Promise<string[]> {
  try {
    const ret = atob(param).split('_');
    return Promise.resolve(ret);
  } catch {
    return Promise.resolve([]);
  }
}

/**
 * ```
 * 简单的号码格式化
 * 11位手机号 -> 344格式
 * 10位座机号 -> 343格式
 * 其它不做处理
 * ```
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-27 10:04:31
 */
export const mobileFormat = (mobile: string) => {
  // ***-****-****
  if (/^\d{11}$/.test(mobile)) {
    return mobile.replace(/(\d{3}(?=\d{8})|\d{4})/g, '$1 ');
  }

  // 400-****-***
  if (/^\d{10}$/.test(mobile)) {
    return mobile.replace(/(\d{4}(?=\d{3}$)|\d{3}(?=\d{7}$))/g, '$1 ');
  }

  return mobile;
};

/**
 * 睡眠
 * 等待给定时间
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-09-07 17:09:48
 * @param   {number} time 等待时间 单位 ms
 * @return  {boolean} true---正常运行 false---等待时间过小，未运行直接返回
 */
export const sleep = async (time: number): Promise<boolean> =>
  time > 0 ? new Promise(resolve => setTimeout(() => resolve(true), time)) : Promise.resolve(false);

/**
 * 延迟返回函数
 * ```
 * 延迟返回一个异步函数的结果
 * 接受两个参数，第一个是最低等待时间(time)，第二个是异步函数fn的返回值(PromiseLike)
 * 返回一个数组
 *
 * 如
 * const [ fn_return, sleep_return ] = await wait(500, GetXXX())
 * ```
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-29 14:41:45
 */
export const wait = async <R>(time: number, fn: PromiseLike<R>) =>
  Promise.all([await fn, await sleep(time)]);

/**
 * 实数与闭区间比较
 * ```
 * 给定一个实数和一个闭区间
 * 若实数在区间内则返回本身
 * 否则返回较近的端点
 * ```
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-16 16:51:24
 */
export const between = (num: number, [min, max]: [number, number]) =>
  Math.min(Math.max(num, min), max);

/**
 * 空函数
 * 用做函数参数默认值
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-24 11:08:41
 */
export const emptyFunc = () => void 0;

/**
 * 从 blob 数据下载文件
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-07 11:25:47
 * @param {string} filename 文件名称
 * @param {Blob} blob 数据
 */
export const downloadFileFromBlob = (blob: Blob, filename?: string): void => {
  const elink = document.createElement('a');
  if (filename) {
    elink.download = filename;
  }
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
};

/**
 * 从链接下载文件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 15:09:48
 * @param hasAuth 是否需要授权
 */
export const downloadFileFromLink = (originalLink: string, hasAuth = false, name = '') => {
  /* 判断条件后续可自行添加,务必加上注释 */
  const judgmentMap: ((arg: string[]) => any)[] = [
    //替换oss转发
    ([path]) => [path.replace(/https?:\/\/tiange-oss.goumee.com/gi, '/oss')],
    //截取文件名
    ([link]) => [link, link.substring(link.lastIndexOf('/') + 1, link.length)],
    ([link, filename]) => [link, name ? name : filename],
    ([link, filename]) => [link, (filename = decodeURIComponent(filename))],
    //token
    ([link, filename]) => [hasAuth ? urlAppendToken(link) : link, filename],
    // 下载
    async ([link, filename]) => {
      if (originalLink.includes('.pdf')) {
        // pdf转换URL
        await fetch(link).then(async response => {
          console.log(response);
          // const result = response.clone();
          if (response.status === 200) {
            const data = await response.blob();
            link = URL.createObjectURL(data);
          }
        });
      }
      const elink = document.createElement('a');
      elink.style.display = 'none';
      elink.href = link;
      console.log(link, elink, 'link');

      elink.download = filename;
      elink.target = '_blank';
      document.body.appendChild(elink);
      elink.click();
      document.body.removeChild(elink);
      URL.revokeObjectURL(link);
    },
  ];
  judgmentMap.reduce((a: any, b: any) => b(a), [originalLink]) as any;
};
export const hasPreviewFile = (file: string) => {
  return ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'gif'].some(ext =>
    new RegExp(`\\.${ext}(?:\\?.+)?$`).test(file),
  );
};
export const previewFile = (file: string, hasAuth = false) => {
  let link: any = file;
  if (hasAuth) link = urlAppendToken(link);
  if (
    !(
      file.includes('.png') ||
      file.includes('.jpg') ||
      file.includes('.jpeg') ||
      file.includes('.gif') ||
      file.includes('.pdf')
    )
  ) {
    link = `https://view.officeapps.live.com/op/view.aspx?src=${link}`;
  }

  console.log('link', link);
  const elink = document.createElement('a');
  elink.style.display = 'none';
  elink.href = link;
  elink.target = '_blank';
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
};

/**
 * 获取文件扩展名
 */
export const getFileExtension = (fileName: string): string => {
  const match = /(\.[^.]+)$/.exec(fileName);
  let ext = '';
  if (match) {
    ext = match[1];
  }
  return ext;
};

/**
 * 防抖
 */
export const debounce = function (fn: any, delay: any, immediate = false, resultCallback?: any) {
  let timer: number | null = null;
  let isInvoke = false;
  let resolveFn: Function | null = null;

  const _debounce = function (...args: any[]) {
    return new Promise(resolve => {
      if (timer) clearTimeout(timer);

      resolveFn = resolve;
      if (immediate && !isInvoke) {
        // @ts-ignore
        const result = fn.apply(this, args);
        if (resultCallback) resultCallback(result);
        isInvoke = true;
      } else {
        timer = setTimeout(() => {
          // @ts-ignore
          const result = fn.apply(this, args);
          if (resultCallback) resultCallback(result);
          isInvoke = false;
          timer = null;
          resolveFn?.(result);
        }, delay);
      }
    });
  };

  _debounce.cancel = function () {
    if (timer) clearTimeout(timer);
    timer = null;
    isInvoke = false;
    if (resolveFn) resolveFn();
  };

  return _debounce;
};
