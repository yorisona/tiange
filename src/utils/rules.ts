import { ValidateCallback } from '@/types/vendor/form';

export default {
  // 金额规则 -- 后期自行增加扩充规则, fixed 是限制最多可填写几位
  price(fixed = 2) {
    return (rule: any, value: string, callback: ValidateCallback) => {
      if (isNaN(value as any)) return callback(new Error('无效金额'));
      const reg = /\.(\d+)/g;
      const match = reg.exec(value);
      if (!match) return callback();
      if (match[1].length > 2) return callback(new Error(`只能输入${fixed}位小数`));
      callback();
    };
  },
  // 限制数字的范围 message用来扩展提示
  number_range(min?: number, max = 9999999999999, message = '') {
    return (rule: any, value: number | string, callback: ValidateCallback) => {
      if (isNaN(value as any)) return callback(new Error('无效金额'));
      const numberValue = Number(value);
      if (min !== undefined && numberValue < min)
        return callback(new Error(`${message}金额不能小于${min}`));
      else if (max !== undefined && numberValue > max)
        return callback(new Error(`${message}金额不能大于${max}`));
      callback();
    };
  },
};
