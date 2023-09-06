import Vue from 'vue';
import Component from './View.vue';

export default {
  show(urls: string[], index = 0) {
    const appendRoot = document.createElement('div');
    appendRoot.className = 'ImageViewRoot';
    document.body.appendChild(appendRoot);
    const $vue: any = new Vue(Component as any);
    $vue.$on('close', () => {
      document.body.removeChild($vue.$el);
      $vue.$destroy();
    });
    $vue.$mount(appendRoot);
    $vue.show(urls, index);
  },
};
