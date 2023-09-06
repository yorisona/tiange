import Vue from 'vue';
import { updateSelectTag } from './select';
import { useEllipsis } from './ellipsis';
import onlyNumber from './num';
import { debounce } from '@/utils/func';
/** 加载自定义指令 */
export const setupDirective = () => {
  /** el-select多选时，默认选择的tag，tag样式禁止删除。 */
  Vue.directive('defaultSelect', {
    inserted(el, bindings) {
      updateSelectTag(el, bindings);
    },
    componentUpdated(el, bindings) {
      updateSelectTag(el, bindings);
    },
  });

  /** 定义一个全局指令 v-only-number 输入数字、小数 max：最大值 min:最小值 precision：保留小数 **/
  Vue.directive('onlyNumber', onlyNumber);

  /** 定义一个全局指令 v-key-enter 自定义事件 - 监听输入键盘，回车事件，传参： 回车调取的方法 */
  Vue.directive('keyEnter', {
    inserted: function (el, binding) {
      //你将指令放在哪里el就是什么
      el.addEventListener('keyup', e => {
        if (e && (e.code === 'Enter' || e.key === 'Enter')) {
          // 获取自定义指令传过来的数组（binding.value）
          const { value } = binding;
          if (value) {
            value();
          }
          e.preventDefault();
          e.stopPropagation();
        }
      });
    },
  });

  /** 定义一个全局指令 v-focus el-input自动聚焦 */
  Vue.directive('focus', {
    inserted: function (el) {
      el.querySelector('input')?.focus(); // 触发标签的事件方法
      el.querySelector('input')?.select();
    },
  });

  /** v-click-outside 点击元素外部触发事件 */
  Vue.directive('click-outside', {
    bind: (el, binding) => {
      // 创建事件处理程序
      const handler = (event: MouseEvent) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          // 调用绑定的方法
          binding.value();
        }
      };
      // 添加事件监听器
      document.addEventListener('click', handler);
      // 保存事件处理程序以便在unbind函数中删除它
      // @ts-ignore
      el._clickOutsideHandler = handler;
    },
    unbind: (el: HTMLElement) => {
      // 删除事件监听器
      // @ts-ignore
      document.removeEventListener('click', el._clickOutsideHandler);
      // @ts-ignore
      delete el._clickOutsideHandler;
    },
  });

  /** 限制文本长度,当超过指定字符数显示省略号,hover显示浮框 */
  /**
   * @param {string | number} value 最大字符数 || 最大宽度(px/%)
   */
  useEllipsis();

  /** 自动获取el-form-item的label,用于输入框或者选择框的placeholder */
  Vue.directive('auto-placeholder', {
    inserted: function (el: HTMLElement) {
      // 获取当前 input 或 select 的父级 el-form-item 元素
      const formItemEl = el.closest('.el-form-item') as HTMLElement;
      if (!formItemEl) {
        console.warn('Can not find parent .el-form-item element');
        return;
      }
      // 根据 class 名称来判断元素类型和提示语
      const promptMap = new Map([
        ['el-input', '请输入'],
        ['el-select', '请选择'],
        ['el-date-editor', '请选择'],
        ['el-textarea', '请输入'],
        ['tg-tree-select-container', '请选择'],
      ]);
      const className = el.classList[0];
      // console.log(className);

      const promptText = promptMap.get(className) || '';
      // 获取父级 el-form-item 元素的 label 值
      let labelText =
        (formItemEl.querySelector('.el-form-item__label') as HTMLElement)?.innerText || '';
      /* 去除冒号 */
      labelText = labelText.replace('：', '');
      // 拼接提示语和 label 值
      const placeholderText = `${promptText}${labelText}`.trim();
      // 设置 input 或 select 元素的 placeholder 值
      el.querySelector<HTMLElement>(
        '.el-input__inner, .el-select__input, .el-textarea__inner',
      )?.setAttribute('placeholder', placeholderText);
    },
  });
  /** el-table触底加载更多 */
  interface LoadMoreConfig {
    bindEl?: string;
    cb: () => void;
    delay?: number;
  }
  Vue.directive('load-more', {
    bind: (el, binding) => {
      console.log(binding, 'bind');
      const { bindEl = '.el-table__body-wrapper', cb, delay = 200 }: LoadMoreConfig = binding.value;

      const selectWrap = el.querySelector(bindEl);
      if (!selectWrap) {
        return;
      }
      const _debounce = debounce(cb, delay);

      selectWrap.addEventListener('scroll', function () {
        const sign = 0.5; // 定义默认的向上滚于页面的高度
        const scrollHeight = selectWrap.scrollHeight; // 获取元素的滚动高度
        const scrollTop = selectWrap.scrollTop; // 获取元素的滚动高度
        const clientHeight = selectWrap.clientHeight; // 获取元素的可见高度
        const scrollDistance = scrollHeight - scrollTop - clientHeight;
        // 判断是否可以滚动
        if (scrollHeight <= clientHeight) {
          return;
        }

        if (scrollDistance <= sign) {
          _debounce();
          console.log('触底了');
        }
      });
    },
  });
};
