import Vue, { Component } from 'vue';

interface Params {
  component: Component;
}

interface InStance {
  $vue?: Vue;
  show(...args: any[]): InStance;
  hide(...args: any[]): InStance;
}

let componentIndex = 0;
export const useComponentToBody = (config: Params) => {
  componentIndex++;
  const instance: InStance = {
    show(...args: any[]) {
      const appendRoot = document.createElement('div');
      appendRoot.className = 'ComponentToBody' + componentIndex;
      document.body.appendChild(appendRoot);
      instance.$vue = new Vue(config.component as any);
      const $vue: any = instance.$vue;
      $vue.$on('close', () => {
        document.body.removeChild($vue.$el);
        $vue.$destroy();
      });
      $vue.$mount(appendRoot);
      $vue.show(...args);
      return instance;
    },
    hide() {
      return instance;
    },
  };
  return instance;
};
