import Vue from 'vue';
import gmMessage from '../gmMessage.vue';

const GmMsg = Vue.extend(gmMessage);
// 1- this.$gmMessage('hello') // 'tip/success/不传' 对勾icon
// this.$gmMessage('hello','tip') // 红色叹号 icon
// this.$gmMessage({
//  content: 'hello',
//  duration: 0/1400/--,
//  type: 'success/tip',
//  showBtn: true
// })

export const install = function (options?: Record<string, any> | string | null, type?: string) {
  // 判断调用时传的参数
  if (options === undefined || options === null) {
    options = { content: '' };
  } else if (typeof options === 'string' || typeof options === 'number') {
    options = { content: options };
    if (type !== undefined && options !== null) {
      options.type = type;
    }
  }
  const instance = new GmMsg({
    data: options,
  }).$mount();

  Vue.nextTick(() => {
    instance.visible = true;
  });
};
