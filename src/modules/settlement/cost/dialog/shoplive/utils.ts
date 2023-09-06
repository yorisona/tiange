/** 成本结算 店播 工具函数 */

import { AdjustInfo } from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob } from '@/utils/func';
import { getToken } from '@/utils/token';
import { SetupContext } from '@vue/composition-api';
import Decimal from 'decimal.js';

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

/** 手工调整金额 计算 */
export const calcTotalAdjustAmount = (adjust_info: AdjustInfo[] | undefined) => {
  const adjust_info_list = adjust_info ? adjust_info : [];

  const total_adjust_amount = (
    adjust_info_list.length > 0
      ? adjust_info_list.reduce(
          (sum, item) =>
            new Decimal(
              item.adjust_amount && !['', '-', '.', '-.'].includes(item.adjust_amount)
                ? item.adjust_amount
                : '0',
            ).add(sum),
          new Decimal('0'),
        )
      : new Decimal('0')
  ).toString();
  return total_adjust_amount;
};

/** 主播工资 计算 */

// 总结算金额
export const calcShopLiveCostTotalAmount = (
  kol_salary_list: string[],
  adjust_info: AdjustInfo[] | undefined,
) => {
  /** 总 手工调账金额 */
  const total_adjust_amount = calcTotalAdjustAmount(adjust_info);

  const total_salary = kol_salary_list.reduce(
    (sum, item) => new Decimal(item ? item : 0).add(sum),
    new Decimal('0'),
  );

  return total_salary.add(total_adjust_amount);
};

// 时薪 = 单价 * 时长
export const calcHourlyPayment = (unit_price: string | undefined, duration: string | undefined) => {
  const duration_value = new Decimal(duration && duration !== '' ? duration : '0');
  const unit_price_value = new Decimal(unit_price && unit_price !== '' ? unit_price : '0.00');

  return unit_price_value.mul(duration_value).toFixed(2).toString();
};

// 主播工资 = 底薪 和 (净销额 * 提成比例)  取高的    底薪/提成 取最高
export const calcMaxBasicSalaryAndCommission = (
  base_salary: string | undefined,
  sale_amount: string | undefined,
  commision_rate: string | undefined,
) => {
  const commision_rate_value = new Decimal(
    commision_rate && commision_rate !== '' ? commision_rate : '0',
  ).div(100);

  const commision = new Decimal(sale_amount && sale_amount !== '' ? sale_amount : '0.00').mul(
    commision_rate_value,
  );
  const base_salary_value = new Decimal(base_salary && base_salary !== '' ? base_salary : '0.00');

  if (commision.greaterThan(base_salary_value)) {
    return commision.toFixed(2).toString();
  } else {
    return base_salary_value.toFixed(2).toString();
  }
};

// 主播工资 = 底薪 + (净销额 * 提成比例)      底薪 + 提成
export const calcBasicSalaryAddCommission = (
  base_salary: string | undefined,
  sale_amount: string | undefined,
  commision_rate: string | undefined,
) => {
  const commision_rate_value = new Decimal(
    commision_rate && commision_rate !== '' ? commision_rate : 0,
  ).div(100);

  const commision = new Decimal(sale_amount && sale_amount !== '' ? sale_amount : '0.00').mul(
    commision_rate_value,
  );
  const base_salary_value = new Decimal(base_salary && base_salary !== '' ? base_salary : '0.00');

  return commision.add(base_salary_value).toFixed(2).toString();
};

export const commonForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadFileHandler = (urlString: string, filename = '') => {
    fetch(urlString, requestOptions).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();
          let url_filename = urlString.split('/')[urlString.split('/').length - 1];
          try {
            url_filename = decodeURI(url_filename);
          } catch (_) {
            // _
          }
          const download_name = filename !== '' ? filename : url_filename;
          downloadFileFromBlob(data, download_name);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };
  return { downloadFileHandler };
};
