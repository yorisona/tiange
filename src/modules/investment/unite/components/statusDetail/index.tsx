import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    list: {
      default: () => [],
      type: Array,
    },
  },
  setup() {},
  render() {
    return (
      <div class="status-detail">
        {this.list.map((item: any) => (
          <div class="item">
            <span class="project-name">{item.project_name}：</span>
            {[4].includes(item.status) && <span class="project-status wait-confirm">未确认</span>}
            {[1, 2].includes(item.status) && <span class="project-status confirmed">已确认</span>}
            {[0].includes(item.status) && <span class="project-status wait-confirm">未提交</span>}
          </div>
        ))}
      </div>
    );
  },
});
