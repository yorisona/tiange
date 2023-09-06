/**
 * 一些数学计算函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-02 13:35:01
 */

/**
 * 平均数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-02 13:34:55
 */
export const avg = (numbers: number[]) =>
  numbers.reduce((acc, cur) => acc + cur, 0) / numbers.length;

/**
 * 方差
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-03-02 13:35:15
 */
export const variance = (numbers: number[]) => {
  const numberAvg = avg(numbers);

  return avg(numbers.map(el => (el - numberAvg) ** 2));
};
