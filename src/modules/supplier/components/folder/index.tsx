import { defineComponent, SetupContext } from '@vue/composition-api';

export default defineComponent({
  name: 'Fold',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx: SetupContext) {
    return {};
  },
  render() {
    return (
      <span class="folder-box">
        {this.show ? '收起更多筛选' : '展开更多筛选'}
        {this.show ? (
          <tgIcon name="ico-arrow-up" style="font-size: 17px;margin-top: 1px;margin-left: 2px" />
        ) : (
          <tgIcon name="ico-arrow-down" style="font-size: 15px;margin-top: 1px;margin-left: 2px" />
        )}
      </span>
    );
  },
});
