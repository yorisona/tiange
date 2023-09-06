export { defineComponent as defineReactComponent } from '@vue/composition-api';
// mmp 没时间了

// import { defineComponent, Data, PropOptions, PropType } from '@vue/composition-api';
// import { VNode } from 'vue';
// type Prop<T, D = T> = PropOptions<T, D> | PropType<T>;
// type GetType<T> = T extends { type: unknown } ? T['type'] : unknown;
// type GetPropsType<T extends PropOptions<T>> = GetType<T> extends StringConstructor
//   ? string
//   : GetType<T> extends PropType<T>
//   ? T
//   : GetType<T>;
// type ReactProps<T = Data> = {
//   [K in keyof T]: GetPropsType<T[K]>;
// };
// // 把Vue.defineComponent对象类型转换为React版本的类型
// type ReactComponent<T> = (props: ReactProps<T>) => VNode;
