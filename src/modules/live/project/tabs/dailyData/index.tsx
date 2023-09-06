/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-26 17:46:52
 */
import { defineComponent, inject, Ref, computed, h } from '@vue/composition-api';
import CalendarPage from '@/modules/commonBusiness/calendar/index.vue';
import { GetShopLiveDailyReport, PostSaveShopLiveProject } from '@/services/live.project';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  props: {},
  components: {
    CalendarPage,
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const query = (begin: number, end: number) => {
      return GetShopLiveDailyReport(begin, end, project_id);
    };
    const project =
      inject<
        Ref<{ business_type: string; end_date: string; cooperation_type: number } | undefined>
      >('project');
    const business_type = computed(() => {
      return project?.value?.business_type;
    });
    const end_date = computed(() => {
      return project?.value?.end_date;
    });
    const cooperation_type = computed(() => {
      return project?.value?.cooperation_type;
    });
    const save = (data: any, isEnforcement = false) => {
      return PostSaveShopLiveProject({
        ...data,
        project_id,
        net_sales_rate: Number(business_type.value) === 8 ? undefined : data.net_sales_rate,
        is_enforcement: isEnforcement ? 1 : 0,
      }).then(async (res: any) => {
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        if (res.data.error_code === 1001) {
          throw new Error(res.data.message);
        }
        return res;
      });
    };
    return {
      query,
      save,
      business_type,
      cooperation_type,
      end_date,
    };
  },
  render() {
    return (
      <calendar-page
        props={{
          query: this.query,
          save: this.save,
          business_type: this.business_type,
          cooperation_type: this.cooperation_type,
          type: 'base',
          end_date: this.end_date,
        }}
      />
    );
  },
});
