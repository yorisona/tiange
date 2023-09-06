import * as capi from '@vue/composition-api';

type ApiDefineComponent = typeof capi.defineComponent;
export const defineComponent: ApiDefineComponent = (config: any) => {
  return capi.defineComponent(config);
};
