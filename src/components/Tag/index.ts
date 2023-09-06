/**
 * 标签/标签组
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-03 11:54:56
 */
import { PluginObject, VueConstructor } from 'vue';
import Tag from './tag';
import TagGroup from './group';

const install: PluginObject<undefined> = {
  install: (vue: VueConstructor) => {
    vue.component(Tag.name, Tag);
    vue.component(TagGroup.name, TagGroup);
  },
};

export default install;
