import { defineComponent, inject, Ref, computed, ref, watch } from '@vue/composition-api';
import CalendarPage from './calendar/index.vue';
import { GetShopLiveTargetList } from '@/services/live.project';
import { useRouter } from '@/use/vue-router';
import dailyDetail from '@/modules/live/project/tabs/target/components/dailyDetail/index.vue';
import moment from 'moment';
import { useTarget } from './useTarget';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
export default defineComponent({
  props: {
    year: {
      type: Number,
      default: 2022,
    },
  },
  components: {
    CalendarPage,
    dailyDetail,
  },
  setup(props, ctx) {
    const { business_type: project_business_type } = useProjectBaseInfo();
    const target = useTarget(undefined, project_business_type.value);
    const dailydataList: any = ref([]);
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const dailyDetailDate = ref(moment());
    const loading = ref(true);

    const query = () => {
      loading.value = true;
      GetShopLiveTargetList(newyear.value, project_id, project_business_type.value).then(
        ({ data }) => {
          loading.value = false;
          let comment = '';
          if (data.success && data.data && data.data.length > 0) {
            const arr: any[] = [];

            data.data.map((item: any) => {
              comment = `${comment}${item.comment}`;
              if (item.anchor_id === 0 || item.anchor_id === '0') {
                arr.unshift(item);
              } else {
                arr.push(item);
              }
            });
            dailydataList.value = arr;
          } else {
            dailydataList.value = [
              {
                months: [],
                anchor_id: 0,
                anchor_name: '',
              },
            ];
          }
          ctx.emit('comment', comment);
        },
      );
    };
    const project =
      inject<
        Ref<{ business_type: string; end_date: string; cooperation_type: number } | undefined>
      >('project');
    const business_type = computed(() => {
      return project?.value?.business_type;
    });
    const cooperation_type = computed(() => {
      return project?.value?.cooperation_type;
    });
    const isEdittarget = ref(false);
    const newyear = ref(props.year);
    watch(
      () => props.year,
      next => {
        newyear.value = next;
        dailydataList.value = [];
        /* 日期也修改掉了*/
        dailyDetailDate.value = moment(`${props.year}-${dailyDetailMonth.value + 1}`);
        query();
      },
    );

    const dailyDetailMonth = computed(() => {
      return dailyDetailDate.value.month();
    });
    const onColumnClick = (month: number) => {
      if (month === dailyDetailMonth.value) {
        return false;
      }
      dailyDetailDate.value = moment(`${props.year}-${month + 1}`);
    };

    return {
      target,
      loading,
      query,
      business_type,
      cooperation_type,
      isEdittarget,
      newyear,
      dailydataList,
      onColumnClick,
      dailyDetailDate,
      dailyDetailMonth,
    };
  },
  render() {
    const { target } = this;
    return (
      <div v-loading={target.reqYear.loading}>
        <div class="calender-div">
          <calendar-page />
          <dailyDetail />
        </div>
      </div>
    );
  },
});
