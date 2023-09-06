import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import { set, Ref } from '@vue/composition-api';
const defaultExport = {
  // 限制只能输入数字和小数
  IntergerAndDecimals(value: string) {
    const match = /(\d+)$|\d+\.?\d{0,2}/.exec(value);
    return match ? match[0] : '';
    // return value.replace(/[^\d.]/g, '').replace(/(\..{2,2}).+/, '$1');
  },
  // 限制只能输入数字
  Interger(value: string) {
    return value.replace(/[^\d]/g, '');
  },
  // 限制两个数之间
  NumberRange(min: number, max: number) {
    return (value: string): string => {
      const newValue: string = this.IntergerAndDecimals(value);
      if (newValue === '') return newValue;
      const num = Number(newValue);
      if (num < min) return min + '';
      else if (num > max) return max + '';
      else return newValue;
    };
  },
  // 千分位
  Thousands(value: string) {
    if (value === null || value === undefined || value === '') return value;
    value = value + '';
    const match = /^(\d+)(\.\d+$)?$/.exec(value + '');
    if (!match) return value;
    const leftValue = match[1];
    const rightValue = match[2];
    let newValue = leftValue.replace(/(\d{1,3})(?=(\d{3})+$)/g, sp => `${sp},`);
    if (rightValue !== undefined) {
      newValue = `${newValue}${rightValue}`;
    }
    return newValue;
  },
  NineIntergerAndDecimals(value: string) {
    const result = (/(?:0|[1-9]\d{0,8})(?:\.\d{0,2})?/u.exec(
      value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
    ) ?? [''])[0];
    return result;
  },
  EightIntergerAndDecimals(value: string) {
    const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
      value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
    ) ?? [''])[0];
    return result;
  },
};

export default defaultExport;
type FormatMethodName = keyof typeof defaultExport;
export const useFormDataFormat =
  (formdata: Ref<any>) =>
  (field: string, ...args: [FormatMethodName, ...any[]][]) => {
    return (val: string) => {
      let newVal: any = val;
      args.forEach(([key, ...arg]) => {
        newVal = (defaultExport[key] as any)(...arg)(val);
      });
      set(formdata.value, field, newVal);
    };
  };
