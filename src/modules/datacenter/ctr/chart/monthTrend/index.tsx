/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-20 17:54:12
 */
import { defineComponent } from '@vue/composition-api';
import { CTRDetailQueryForm, CTRDetailRefType } from '../../type';

export default defineComponent({
  setup() {
    const refMethods: CTRDetailRefType = {
      reload(queryForm: CTRDetailQueryForm) {
        console.log('month-reload', queryForm);
      },
    };
    const methods = {};
    return {
      ...methods,
      ...refMethods,
    };
  },
  render() {
    return <div class="month-trend-page-container">月度趋势</div>;
  },
});
