/**
 * 表单相关类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-07 17:07:58
 */

/**
 * 表单校验规则的回调函数
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-24 15:41:01
 */
export interface ValidateCallback {
  (error?: Error): void;
}

/**
 * 表单校验规则类型
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-07 17:53:16
 */
export type FormRuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'any';

/**
 * 校验规则的自定义校验函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-07 17:39:09
 */
export interface FormRuleValidator<R, V> {
  (rule: R, value: V, callback: ValidateCallback): void | Promise<void>;
}

/**
 * 表单校验规则
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-07 16:51:51
 * ``` ts
 * // 使用示例
 * interface FormData {
 *    name: string;
 *    age: number;
 * }
 *
 * const formRules = ref<{ [prop in keyof FormData]?: FormRule<FormData[prop]>|FormRule<FormData[prop]>[] }>({
 *     name: [
 *        ...]
 *     })
 *
 * ```
 */
export interface FormRule<V> {
  /** 类型 default 'string' */
  type?: FormRuleType;
  pattern?: RegExp | string;
  /** Range of type 'string' and 'array' */
  min?: number;
  /** Range of type 'string' and 'array' */
  max?: number;
  /** Length of type 'string' and 'array' */
  len?: number;
  /** possible values of type 'enum' */
  enum?: Array<string | number | boolean | null | undefined>;
  /** 是否必填项 */
  required?: boolean;
  /** 错误信息 */
  message?: string | (() => string);
  /** 自定义校验函数 */
  validator?: FormRuleValidator<FormRule<V>, V>;
  /** 自定义校验函数(异步) */
  asyncValidator?: FormRuleValidator<FormRule<V>, V>;
  /** 校验触发条件 */
  trigger?: string;
}
