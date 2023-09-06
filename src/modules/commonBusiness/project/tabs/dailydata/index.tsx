import { computed, defineComponent, inject, ref, Ref } from '@vue/composition-api';
import CalendarPage from '@/modules/commonBusiness/calendar/index.vue';
import { GetDailyReport, PostSaveDailyReport } from '@/services/commonBusiness/project';
import BaseDialog from '@/modules/commonBusiness/project/dialog/daily/base/base.form.vue';
import McnDialog from '@/modules/commonBusiness/project/dialog/daily/mcn/mcn.form.vue';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  props: {},
  components: {
    CalendarPage,
    BaseDialog,
    McnDialog,
  },
  setup(props) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const project =
      inject<Ref<CommonBusinessProjectDetail>>('project') ?? ref<CommonBusinessProjectDetail>();
    // 4: 基地业务 5: 创新项目
    const business_type = computed(() => project.value?.business_type);

    const query = (begin: number, end: number, project_id: string) => {
      const type = business_type.value;
      // @ts-ignore
      return GetDailyReport(begin, end, project_id, type);
    };

    const save = (data: any) => {
      return PostSaveDailyReport({
        ...data,
        business_type: business_type.value,
        project_id,
      }).then((res: any) => {
        if (!res.data.success) throw new Error(res.data.message);
        return res;
      });
    };

    return {
      query,
      save,
      business_type,
    };
  },
  render() {
    return (
      (this.business_type !== undefined && (
        <calendar-page
          props={{
            query: this.query,
            save: this.save,
            type: this.business_type === 4 ? 'base' : 'mcn',
          }}
        />
      )) || <div />
    );
  },
});
