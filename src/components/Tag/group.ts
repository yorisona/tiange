/**
 * 标签组
 * @author  Jerry <superzcj_001@163.com>
 * @since   2021-01-25
 */
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import TgTag from './tag';
import { getChromeVersion } from '@/utils/browser';
import { ComponentValue } from '@/types/base/component';
import { VNode } from 'vue';
import { getRandomHash } from '@/utils/string';

const version = getChromeVersion();

interface TagType {
  id: ComponentValue;
  value: string;
}

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
      type: Array as PropType<Array<string | TagType>>,
      default: () => [] as string[],
    },
  },
  setup(props, ctx) {
    const isClassFallback = computed(() => (version === false || version >= 84 ? '' : 'fallback'));

    const tagList = computed<VNode[]>(() =>
      props.tags
        .map(el =>
          typeof el === 'string'
            ? { id: `${el}_${Date.now() % 1000}_${getRandomHash(4)}`, value: el }
            : el,
        )
        .map(({ id, value }) =>
          h(TgTag, {
            attrs: {
              content: value,
              theme: props.theme,
            },
            key: id,
          }),
        ),
    );

    return { isClassFallback, tagList };
  },
  render() {
    const tagGroupClass = ['tg-tag-group', this.isClassFallback];

    return h('div', { class: tagGroupClass }, this.tagList as VNode[]);
  },
});
