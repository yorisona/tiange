/**
 * 是否可见变量
 * @author  Jerry <jerry.hz.china@gmail.com>
 */
import { computed, ComputedRef, ref } from '@vue/composition-api';

/**
 * 是否可视的逻辑封装
 *
 * ```
  const {
    // 布尔值，用于二元状态场景，不可修改
    visible,
    // 设置修改visible，接受参数来修改
    setVisible,
    // 切换修改visible，不接受参数，直接根据当前值取反
    toggleVisible,
  } = useVisible();

  // 重命名返回值，满足一个场景中多个布尔值的使用需求
  const {
    visible: xxxVisible,
    setVisible: setXXXVisible,
    toggleVisible: toggleXXXVisible,
  } = useVisible(true); // 传入true来满足初始状态为真的需求
  ```
 */
const useVisible = (
  initialValue = false,
): {
  /** 是否可视 */
  visible: ComputedRef<boolean>;
  /** 设置是否可视 */
  setVisible: (value?: boolean) => boolean;
  /** 切换是否可视 */
  toggleVisible: () => boolean;
} => {
  const visible = ref(initialValue);

  const setVisible = (value = false) => (visible.value = value);

  const toggleVisible = () => (visible.value = !visible.value);

  return {
    visible: computed(() => visible.value),
    setVisible,
    toggleVisible,
  };
};

export default useVisible;
