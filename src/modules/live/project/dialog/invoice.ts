import Vue from 'vue';
import invoice from './invoice.view';
export default {
  showDetail(url: string): Promise<void> {
    return new Promise(resolve => {
      const appendRoot = document.createElement('div');
      document.body.appendChild(appendRoot);
      const $vue: any = new Vue(invoice as any);
      $vue.img = url;
      $vue.$on('close', () => {
        document.body.removeChild($vue.$el);
        $vue.$destroy();
        resolve();
      });
      $vue.$mount(appendRoot);
    });
  },
};
