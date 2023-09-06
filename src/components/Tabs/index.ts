import { PluginObject, VueConstructor } from 'vue';
import Tabs from './tabs';

const install: PluginObject<undefined> = {
  install: (vue: VueConstructor) => {
    vue.component('tg-tabs', Tabs);
  },
};

export default install;
