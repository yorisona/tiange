import { defineComponent } from '@vue/composition-api';
import companyDashboard from '@/modules/management/companyDashboard/index.vue';
export default defineComponent({
  components: {
    companyDashboard,
  },
  setup(props, ctx) {
    const methods = {};
    return {
      ...methods,
    };
  },
  render() {
    return (
      <fragments>
        <companyDashboard isDepartment={true}></companyDashboard>
      </fragments>
    );
  },
});
