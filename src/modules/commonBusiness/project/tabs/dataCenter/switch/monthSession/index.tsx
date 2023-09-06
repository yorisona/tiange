import { defineComponent, h, PropType } from '@vue/composition-api';
import sessionList from '@/modules/datacenter/mcn/douyin/session.vue';
import moment from 'moment';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  name: 'monthSession',
  components: {
    sessionList,
  },
  props: {
    currentDate: {
      type: Object as PropType<moment.Moment>,
      require: true,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    return {
      project_id,
    };
  },
  render() {
    const { project_id } = this;
    const componentObj = {
      name: 'sessionList',
      props: {
        project_id: project_id,
        is_one_peoject: true,
      },
    };
    return (
      <div>
        {h(componentObj.name, {
          props: componentObj.props,
        })}
        {/* <component is={switchComponents[selectIndex]} currentDate={selectedDate}></component> */}
        {/* {selectIndex === 0 && <daily-data currentDate={selectedDate}></daily-data>}
          {selectIndex === 1 && <display-data currentDate={selectedDate}></display-data>} */}
      </div>
    );
  },
});
