import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'SubTabs',
  props: {
    selectIndex: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const index = ref(props.selectIndex);
    return {
      index,
    };
  },
  render(h) {
    const contents = (this.$slots.default || []).filter(
      item => item.data && item.data.attrs && item.data.attrs.name,
    );
    const currentComp = contents[this.index];
    return (
      <div class="tgb-subtabs">
        <div class="tgb-subtabs-header">
          {contents.map((item, key) => {
            return (
              <div
                class={key === this.index ? 'active' : ''}
                key={key}
                onClick={() => (this.index = key)}
              >
                {item?.data?.attrs?.name}
              </div>
            );
          })}
        </div>
        {currentComp}
      </div>
    );
  },
});
