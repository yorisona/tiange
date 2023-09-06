import { VNode } from 'vue';

type style = string | object;
type ReactDefaultCtx<T> = {
  [key: string]: any;
  ['v-model']?: any;
  style?: style;
  props?: {
    [key: string]: any;
    value: any;
    style: style;
    listeners: any;
  } & T;
  data?: {
    model: {
      callback(args): any;
      value: any;
    };
    style?: style;
  };
} & T;

type ReactFn<T> = { props?: any } & ((ctx: ReactDefaultCtx<T>) => VNode);
