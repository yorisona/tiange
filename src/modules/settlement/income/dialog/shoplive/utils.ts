/** 店播 业务结算 工具函数 */

import { AdjustInfo } from '@/types/tiange/finance/settlement';
import { downloadFileFromBlob } from '@/utils/func';
import { getToken } from '@/utils/token';
import { SetupContext } from '@vue/composition-api';
import Decimal from 'decimal.js';

/** 手工调整金额 计算 */
const calcTotalAdjustAmount = (adjust_info: AdjustInfo[] | undefined) => {
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

/** 淘宝 佣金 计算
 * 佣金 = 种草金额 * (1-退货率) * 佣金比例
 */
export const calcTaobaoCommissionAmount = (
  form_recommend_amount: string | undefined,
  form_refund_rate: string | undefined,
  form_commission_rate: string | undefined,
) => {
  /** 种草金额 */
  const recommend_amount = new Decimal(
    form_recommend_amount && form_recommend_amount !== '' ? form_recommend_amount : '0.00',
  );
  /** 退货率 */
  const refund_rate = new Decimal(
    form_refund_rate && form_refund_rate !== '' ? form_refund_rate : '0.00',
  );
  /** 佣金比例 */
  const commission_rate = new Decimal(
    form_commission_rate && form_commission_rate !== '' ? form_commission_rate : '0.00',
  );

  const result = recommend_amount
    .mul(new Decimal(100).sub(refund_rate).div(100))
    .mul(commission_rate)
    .div(100)
    .toFixed(2);

  return result.toString();
};

/** 淘宝 总结算金额
 * 总结算金额 = 服务费 + 佣金 + 总手工调账金额
 */
export const calcTaobaoTotalAmount = (
  adjust_info: AdjustInfo[] | undefined,
  service_amount: string | undefined,
  commission: string | undefined,
) => {
  /** 总 手工调账金额 */
  const total_adjust_amount = calcTotalAdjustAmount(adjust_info);

  return new Decimal(service_amount && service_amount !== '' ? service_amount : '0.00')
    .add(commission && commission !== '' ? commission : '0.00')
    .add(total_adjust_amount && total_adjust_amount !== '' ? total_adjust_amount : '0');
};

/**
 * 抖音 模块
 */

/** 抖音 总结算金额 */
export const calcDouyinTotalAmount = (
  adjust_info: AdjustInfo[] | undefined,
  commission: string | undefined,
  service_amount = 0,
) => {
  /** 总 手工调账金额 */
  const total_adjust_amount = calcTotalAdjustAmount(adjust_info);
  const amount = Number(commission || 0) + service_amount;
  return new Decimal(amount).add(
    total_adjust_amount && total_adjust_amount !== '' ? total_adjust_amount : '0',
  );
};

/** 抖音 佣金 计算
 * 佣金 = 佣金比例 * 销售金额
 */
export const calcDouyinCommissionAmount = (
  form_sale_amount: string | undefined,
  form_commission_rate: string | undefined,
) => {
  /** 销售金额 */
  const sale_amount = form_sale_amount && form_sale_amount !== '' ? form_sale_amount : '0.00';

  /** 佣金比例 */
  const commission_rate =
    form_commission_rate && form_commission_rate !== '' ? form_commission_rate : '0.00';

  return new Decimal(sale_amount).mul(new Decimal(commission_rate).div(100)).toFixed(2).toString();
};

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

export const commonForm = (ctx: SetupContext) => {
  /** 下载文件 */
  const downloadFileHandler = (urlString: string) => {
    fetch(urlString, requestOptions).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();
          const filename = decodeURIComponent(
            urlString.split('/')[urlString.split('/').length - 1],
          );
          downloadFileFromBlob(data, filename);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };
  return { downloadFileHandler };
};
