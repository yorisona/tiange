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
      <div class="backed-detail">
        {this.list
          .filter((item: any) => item.status === 3)
          .map((item: any) => (
            <div class="item">
              <div class="project-name">{item.project_name}</div>
              <span>不通过原因：</span>
              <span>{item.refuse_reason}</span>
            </div>
          ))}
      </div>
    );
  },
});
