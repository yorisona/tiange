/**
 * 标签组
 */
import { computed, defineComponent, h, PropType, ref } from '@vue/composition-api';
import { Label } from '@/types/components/label';
import { ComponentValue } from '@/types/base/component';
import TgLabel from './label';
import { getChromeVersion } from '@/utils/browser';

const version = getChromeVersion();

export default defineComponent({
  name: 'TgLabelGroup',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    /** 选中状态 */
    value: {
      type: [String, Number] as PropType<ComponentValue>,
      required: true,
    },
    /** 选项(标签列表) */
    options: {
      type: Array as PropType<Label[]>,
      default: () => [] as Label[],
    },
    /** 标签组名称 */
    label: {
      type: String,
    },
    /** 是否支持展开，收起 */
    isMore: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isClassFallback = computed(() => (version === false || version >= 84 ? '' : 'fallback'));
    const show = ref(false);

    return { isClassFallback, show };
  },
  render() {
    const labelGroupClass = ['tg-label-group', this.isClassFallback];
    /** 标签列表 */
    const options: Label[] = this.options;

    /** 计算得到标签列表VNodes */
    const nodes = options
      .map(label => ({
        attrs: {
          ...label,
          checked: label.value === this.value,
        },
        on: {
          click: (value: ComponentValue) => {
            this.$emit('change', value);
          },
        },
        key: label.value,
      }))
      .map(props => <TgLabel {...props} />);

    let moreDom;
    let tgLabelItemsClass = 'tg-label-group-items';
    if (this.isMore) {
      moreDom = (
        <div
          class="tg-label-group-more"
          onClick={() => {
            this.show = !this.show;
            this.$emit('openChange');
          }}
        >
          <span style="display: flex">
            {this.show ? '收起' : '展开'}
            {this.show ? (
              <tgIcon
                name="ico-arrow-up"
                style="font-size: 17px;margin-top: 1px;margin-left: 2px"
              />
            ) : (
              <tgIcon
                name="ico-arrow-down"
                style="font-size: 15px;margin-top: 1px;margin-left: 2px"
              />
            )}
          </span>
        </div>
      );
      if (!this.show) {
        tgLabelItemsClass = `${tgLabelItemsClass} tg-label-group-items-hide`;
      }
    }

    return h('div', { class: labelGroupClass }, [
      h('div', { class: 'tg-label-group-label' }, [this.$slots.label ?? `${this.label}`, '：']),
      h('div', { class: tgLabelItemsClass }, [...nodes]),
      moreDom,
    ]);
  },
});
