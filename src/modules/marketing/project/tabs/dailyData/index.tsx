import { defineComponent } from '@vue/composition-api';
import CalendarPage from '@/modules/commonBusiness/calendar/index.vue';
import { GetCoopDailyReport, PostSaveCoopDailyProject } from '@/services/live.project';
import { useRouter } from '@/use/vue-router';
export default defineComponent({
  props: {},
  components: {
    CalendarPage,
  },
  setup(props) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const query = (begin: number, end: number, project_id: string) => {
      return GetCoopDailyReport(begin, end, project_id);
    };
    const save = (data: any) => {
      return PostSaveCoopDailyProject({
        ...data,
        project_id,
      }).then(res => {
        if (!res.data.success) throw new Error(res.data.message);
        return res;
      });
    };
    return {
      query,
      save,
    };
  },
  render() {
    return (
      <calendar-page
        props={{
          query: this.query,
          save: this.save,
          type: 'market',
        }}
      />
    );
  },
});
