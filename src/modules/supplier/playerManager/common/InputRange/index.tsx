import { defineComponent, PropType } from '@vue/composition-api';
export default defineComponent({
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    separator: {
      type: String,
      default: '～',
    },
    startPlaceholder: {
      type: String,
    },
    endPlaceholder: {
      type: String,
    },
    maxLength: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  },
  render() {
    return (
      <div class="tg-input-range">
        <el-input
          maxLength={this.maxLength[0]}
          value={this.value[0]}
          placeholder={this.startPlaceholder}
          onInput={(val: string) => {
            const newVal = [...this.value];
            newVal[0] = val;
            this.$emit('input', newVal);
          }}
        />
        <span>{this.separator}</span>
        <el-input
          maxLength={this.maxLength[1]}
          value={this.value[1]}
          placeholder={this.endPlaceholder}
          onInput={(val: string) => {
            const newVal = [...this.value];
            newVal[1] = val;
            this.$emit('input', newVal);
          }}
        />
      </div>
    );
  },
});
