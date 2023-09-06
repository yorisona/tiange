/**
 * 处理金额/财务相关
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 17:51:57
 */

/**
 * 金额单位
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 22:32:31
 * @deprecated 推荐使用 `Decimal` 和 `Decimal2String` 来处理精度数字和数字的格式化显示
 */
export const enum MoneyUnit {
  /** 分 */
  Fen = '分',
  /** 元 */
  Yuan = '元',
}

/**
 * 小数点
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 22:41:34
 * @deprecated 推荐使用 `Decimal` 和 `Decimal2String` 来处理精度数字和数字的格式化显示
 */
export const enum DecimalSeparator {
  /** 逗号 \u002C */
  Comma = ',',
  /** 句点 \u002E */
  Dot = '.',
  /** 阿拉伯国家小数点 \u066B */
  ArabicDecimalSeparator = '٫',
}

/**
 * 千分位
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 22:59:25
 * @deprecated 推荐使用 `Decimal` 和 `Decimal2String` 来处理精度数字和数字的格式化显示
 */
export const enum ThousandsSeparator {
  /** 逗号 \u002C */
  Comma = ',',
  /** 句点 \u002E */
  Dot = '.',
  /** 单引号 \u0027 */
  Apostrophe = "'",
  /** 空格 \u0020 */
  Space = ' ',
  /** 间隔符 \u00B7 */
  MiddleDot = '·',
  /** 上句点 \u02D9 */
  DotAbove = '˙',
  /** 阿拉伯国家千分位 \u066C */
  ArabicThousandsSeparator = '٬',
}

/**
 * 格式化选项(内部, 必选)
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 22:32:30
 */
interface PrivateMoneyOptions {
  /** 传入值的单位 */
  unit: MoneyUnit;
  /** 小数点 */
  decimalSeparator: DecimalSeparator;
  /** 千分位 */
  thousandsSeparator: ThousandsSeparator;
}

/**
 * 格式化选项
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 22:32:30
 * @deprecated 推荐使用 `Decimal` 和 `Decimal2String` 来处理精度数字和数字的格式化显示
 */
export type MoneyOptions = Partial<PrivateMoneyOptions>;

/**
 * 格式化选项默认值
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 22:32:29
 */
const defaultMoneyOptions: PrivateMoneyOptions = {
  unit: MoneyUnit.Fen,
  decimalSeparator: DecimalSeparator.Dot,
  thousandsSeparator: ThousandsSeparator.Comma,
};

/**
 * 金额处理类
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-24 18:05:25
 * @deprecated 推荐使用 `Decimal` 和 `Decimal2String` 来处理精度数字和数字的格式化显示
 * @class Money 金额处理类
 * ```
 * 注意
 *   数据库存储用分
 *   界面显示用元
 * ```
 */
export default class Money {
  options: PrivateMoneyOptions = defaultMoneyOptions;

  /**
   * 构造函数 - 初始化配置
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-24 23:07:23
   * ```
   * 推荐使用 `Decimal` 和 `Decimal2String` 来处理
   * 数字和数字的格式化显示
   * ```
   */
  constructor(options: MoneyOptions = {}) {
    this.options = { ...defaultMoneyOptions, ...options };
    if (
      (this.options.decimalSeparator === DecimalSeparator.Comma &&
        this.options.thousandsSeparator === ThousandsSeparator.Comma) ||
      (this.options.decimalSeparator === DecimalSeparator.Dot &&
        this.options.thousandsSeparator === ThousandsSeparator.Dot)
    ) {
      this.warnSeparatorSame();
    }
  }

  private warnSeparatorSame() {
    console.warn(
      `decimal separator "${this.options.decimalSeparator}" and thousands separatorare "${this.options.thousandsSeparator}" can not be same!`,
    );
  }

  /**
   * 添加千分位符号
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-24 23:01:51
   * @param  {string} numericalString 数值字符串
   * @param  {ThousandsSeparator} thousandsSeparator 千分位符号
   */
  addThousand(
    numericalString: string,
    thousandsSeparator: ThousandsSeparator = this.options.thousandsSeparator,
  ): string {
    return numericalString
      .padStart(Math.ceil(numericalString.length / 3) * 3, '0')
      .replace(/(?=(?!^)(\d{3})+$)/g, thousandsSeparator)
      .replace(/^0+(?=(?!^)\d)/g, '');
  }

  /**
   * 格式化金额值为可读字符串
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-24 17:52:47
   * @param {number} money 金额
   * @param {MoneyUnit} unit 单位
   */
  format(money: number, unit: MoneyUnit = this.options.unit): string {
    const sign = Math.sign(money);
    const no_sign_money = Math.abs(money);

    if (unit === MoneyUnit.Fen) {
      const result = /(\d+)(\d{2})/.exec(`${no_sign_money}`.padStart(3, '0'));
      if (result === null) {
        console.warn(`${no_sign_money} is an illegal number`);
      } else {
        const [_, integer, decimal] = result;
        return `${sign < 0 ? '-' : ''}${this.addThousand(integer)}${
          this.options.decimalSeparator
        }${decimal}`;
      }
    } else if (unit === MoneyUnit.Yuan) {
      const result = /(\d+)(?:\.(\d{0,2}))?/.exec(`${no_sign_money}`);

      if (result === null) {
        console.warn(`${no_sign_money} is an illegal number`);
      } else {
        const [_, integer, decimal] = result;
        let decimalStr = decimal || '';
        if (decimalStr.length === 1) {
          decimalStr = decimalStr + '0';
        }
        return `${sign < 0 ? '-' : ''}${this.addThousand(`${integer}`.padStart(3, '0'))}${
          this.options.decimalSeparator
        }${`${decimalStr ?? '00'}`.padEnd(2, '0')}`;
      }
    }

    return '';
  }

  /**
   * 解析字符串为金额值
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-24 17:54:12
   * @param {string} money 金额
   * @param {MoneyUnit} unit 单位
   */
  parse(money: string, unit: MoneyUnit = this.options.unit): number {
    if (unit === MoneyUnit.Fen) {
      if (/^\d+$/g.test(money)) {
        return parseInt(money, 10);
      }
    } else if (unit === MoneyUnit.Yuan) {
      if (/^\d+(\.?\d{,2})?/.test(money)) {
        return parseFloat(money) * 100;
      }
    }

    return 0;
  }

  /**
   * 字符串化金额值
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-24 17:57:36
   * @param {number|string} money 金额
   * @param {MoneyUnit} unit 单位
   */
  stringify(money: number | string, unit: MoneyUnit = this.options.unit): string {
    return `${this.parse(`${money}`, unit)}`;
  }

  /**
   * 元转分
   * 分值需要提交存储
   * 额外处理精度问题
   * 临时解决方案，以后继续优化
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-27 23:50:19
   */
  YuantoFen(money: number): number {
    return parseInt((money * 100).toFixed(3), 10);
  }

  /**
   * 分转元
   * @author Jerry <superzcj_001@163.com>
   * @since  2020-06-27 23:50:26
   */
  FenToYuan(money: number): number {
    return money / 100;
  }
}
