/**
 * 标签/标签组
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-24 16:16:01
 */
import { PluginObject, VueConstructor } from 'vue';
import Label from './label';
import LabelGroup from './labelGroup';

const install: PluginObject<undefined> = {
  install: (vue: VueConstructor) => {
    vue.component(Label.name, Label);
    vue.component(LabelGroup.name, LabelGroup);
  },
};

export default install;
