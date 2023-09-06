export default {
  isEmpty(val: any) {
    if (val === null || val === undefined) return true;
    if (val instanceof Array) return val.length === 0;
    return /^(\s+)?$/.test(val);
  },
  /**
   * // 判断两个浮点数是否相等
   * @param a
   * @param b
   * @param mistake 允许的误差值
   */
  equal(a: number, b: number, mistake: number = Number.EPSILON * Math.pow(2, 2)) {
    return Math.abs(a - b) < mistake;
  },
  // 判断2个浮点数是否小于
  less(a: number, b: number, mistake?: number) {
    if (this.equal(a, b, mistake)) return false;
    return a < b;
  },
  // 判断2个浮点数是否小于等于
  lessEqual(a: number, b: number, mistake?: number) {
    if (this.equal(a, b, mistake)) return true;
    return a < b;
  },
  // 判断2个浮点数是否大于
  greater(a: number, b: number, mistake?: number) {
    if (this.equal(a, b, mistake)) return false;
    return a > b;
  },
  // 判断2个浮点数是否大于等于
  greaterEqual(a: number, b: number, mistake?: number) {
    if (this.equal(a, b, mistake)) return true;
    return a > b;
  },
};
