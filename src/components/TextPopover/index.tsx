import { computed, defineComponent, onMounted, onUpdated, ref } from '@vue/composition-api';

enum RenderType {
  Text,
  Popover,
}
/**
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-14 10:54:11
 */
export default defineComponent({
  name: 'tgTextPopover',
  props: {
    /** 渲染的文本 **/
    text: {
      type: String,
    },
    /** 默认显示文本 */
    defaultText: {
      type: String,
      default: '--',
    },
    /** 最大显示字符数 */
    limitLength: {
      type: Number,
      default: 10,
    },
    /** 文本最大宽度 */
    maxWidth: {
      type: Number,
      // default: 180
    },
    /** 文本calss */
    textClass: {
      type: String,
    },
  },
  setup(props, ctx) {
    const referenceRef = ref<Element | undefined>(undefined);

    // const { text, defaultText, limitLength, maxWidth } = props;

    const content = computed(() => (props.text ? props.text : props.defaultText));
    const reference = computed(() => {
      if (props.maxWidth) {
        return content.value;
      }
      return content.value.length > props.limitLength
        ? `${content.value.substring(0, props.limitLength)}...`
        : content.value;
    });

    const renderType = ref<RenderType>(RenderType.Text);
    const updateRenderType = () => {
      if (props.maxWidth) {
        const wid = referenceRef.value?.scrollWidth ?? 0;
        if (wid > props.maxWidth && renderType.value !== RenderType.Popover) {
          renderType.value = RenderType.Popover;
        } else if (wid <= props.maxWidth && renderType.value !== RenderType.Text) {
          renderType.value = RenderType.Text;
        }
      } else {
        if (content.value.length <= props.limitLength && renderType.value !== RenderType.Text) {
          renderType.value = RenderType.Text;
        } else if (
          content.value.length > props.limitLength &&
          renderType.value !== RenderType.Popover
        ) {
          renderType.value = RenderType.Popover;
        }
      }
    };

    onMounted(() => {
      updateRenderType();
    });

    onUpdated(() => {
      updateRenderType();
    });

    return {
      content,
      reference,
      referenceRef,
      renderType,
    };
  },
  render() {
    const { content, reference, textClass, renderType, maxWidth } = this;
    return (
      <el-popover
        class="components-text-popover-container"
        open-delay={300}
        placement="top"
        trigger="hover"
        content={content}
        width={230}
        disabled={renderType !== RenderType.Popover}
      >
        <div slot="reference">
          <div ref="referenceRef" class="reference-hidden">
            {content}
          </div>
          <div class={`${textClass} my-line-clamp`} style={{ 'max-width': `${maxWidth}px` }}>
            {reference}
          </div>
        </div>
      </el-popover>
    );
  },
});
