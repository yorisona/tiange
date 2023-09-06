/**
 * 标签组
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-03 14:22:20
 * @deprecated
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import TgTag from './tag';
import { getChromeVersion } from '@/utils/browser';

const version = getChromeVersion();

export default defineComponent({
  name: 'TgTagGroup',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    /** 主题(当前仅含默认主题) */
    theme: {
      type: String as PropType<'default' | 'gray'>,
      default: 'default',
    },
    /** 选项(标签列表) */
    tags: {
      type: Array as PropType<string[]>,
      default: () => [] as string[],
    },
  },
  setup() {
    const isClassFallback = computed(() => (version === false || version >= 84 ? '' : 'fallback'));

    return { isClassFallback };
  },
  render() {
    const tagGroupClass = ['tg-tag-group', this.isClassFallback];
    /** 标签列表 */
    const tags: string[] = this.tags;

    /** 计算得到标签列表VNodes */
    const nodes = tags
      .map(content => ({
        attrs: {
          content,
          theme: this.theme,
        },
        key: content,
      }))
      .map(props => <TgTag {...props} />);

    return h('div', { class: tagGroupClass }, [...nodes]);
  },
});
