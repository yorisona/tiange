/**
 * 步骤条组件
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-29 14:21:58
 */
import { PluginObject, VueConstructor } from 'vue';
import { TgStep, TgSteps } from './steps';

const install: PluginObject<undefined> = {
  install: (vue: VueConstructor) => {
    vue.component(TgSteps.name, TgSteps);
    vue.component(TgStep.name, TgStep);
  },
};

export default install;
