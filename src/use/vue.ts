import { ref, Ref, UnwrapRef, h } from '@vue/composition-api';
window.h = h;
const _prototype = { $createElement: h };
export const useState = <T>(
  defaultValue: T,
): [Ref<UnwrapRef<T>>, (newValue: UnwrapRef<T>) => void] => {
  const state = ref<T>(defaultValue);
  return [
    state,
    newValue => {
      state.value = newValue;
    },
  ];
};

export const render = (fn: any) => {
  return (...args: any[]): ReturnType<typeof fn> => {
    return fn.apply(_prototype, args);
  };
};

export const Fragments = {
  name: 'Fragments',
  functional: true,
  render(h: any, context: any) {
    return context.scopedSlots && context.scopedSlots.default && context.scopedSlots.default();
  },
};
