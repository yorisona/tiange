/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-10-12 17:59:34
 */
import { defineComponent, ref, computed, onBeforeMount, inject, Ref } from '@vue/composition-api';
import calendar from './calendar.vue';
import LiveList from './liveList.vue';
import TgBtnCapsule from '@/components/Button/capsule';
import CopyScheduleForm from '@/modules/live/project/dialog/livedisplay/CopyScheduleForm.vue';
import liveDisplayAddDialog from '@/modules/live/display/dialog/live.display.add.vue';
import { useRouter } from '@/use/vue-router';
import { RouterNameProjectManage } from '@/const/router';
import { usePermission } from '@/use/permission';
import { LiveProject } from '@/types/tiange/live.project';
import downloadSchedule from '@/modules/live/project/dialog/downloadSchedule/index.vue';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  components: {
    calendar,
    TgBtnCapsule,
    LiveList,
    CopyScheduleForm,
    liveDisplayAddDialog,
    downloadSchedule,
  },
  setup(props, ctx) {
    const Permission = usePermission();

    const CalendarRef = ref<{ reloadData: () => void } | undefined>(undefined);
    const LiveListRef = ref<{ reloadData: () => void } | undefined>(undefined);
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const project = inject<Ref<LiveProject | undefined> | undefined>('project', undefined);
    const studioInfo = computed(() => {
      return {
        studio_id: project?.value?.studio_id,
        studio_name: project?.value?.studio_name,
      };
    });
    const business_type = computed(() => {
      return project?.value?.business_type;
    });

    const CopyScheduleFormVisible = ref(false);

    const monthStep = ref<number>(0);
    const displayDate = computed(() => {
      const date = new Date();
      date.setMonth(date.getMonth() + monthStep.value, 1);
      return date;
    });
    const selectDates = ref<string[] | undefined>(undefined);

    const start_date = computed(() => {
      return (selectDates.value ?? [])[0];
    });
    const end_date = computed(() => {
      return (selectDates.value ?? [])[1];
    });

    const liveDisplayType = ref<'calendar' | 'list'>('calendar');
    const currentTitle = computed(() => {
      return `${displayDate.value.getFullYear()}年${methods.formatMonth(
        displayDate.value.getMonth() + 1,
      )}月`;
    });
    const methods = {
      onCapsuleClick: (btn: 'left' | 'right') => {
        if (btn === 'left') {
          liveDisplayType.value = 'calendar';
        } else {
          liveDisplayType.value = 'list';
        }
        const { isFromLocalLife, isFromSupplyChain, isFromLiveDouyin } = useProjectBaseInfo();
        if (isFromLocalLife.value || isFromSupplyChain.value || isFromLiveDouyin.value) {
          return;
        }
        ctx.root.$router.replace({
          name: RouterNameProjectManage.live.project.detail,
          params: {
            id: `${project_id}`,
            tab: router.currentRoute.params.tab,
            liveType: liveDisplayType.value,
          },
        });
      },
      onPrevMonth: () => {
        methods.getNewDate(-1);
      },
      onNextMonth: () => {
        methods.getNewDate(1);
      },
      getNewDate: (step: number) => {
        monthStep.value += step;
      },
      formatMonth: (month: number) => {
        if (month < 10) {
          return `0${month}`;
        }
        return month;
      },
    };

    const CopyLiveScheduleHandler = () => {
      // 复制排期
      CopyScheduleFormVisible.value = true;
    };
    const handleCopyScheduleSucceedAction = () => {
      CalendarRef.value?.reloadData();
      LiveListRef.value?.reloadData();
    };

    const liveDisplayAddDialogVisible = ref(false);
    const AddLiveDisplayHandler = () => {
      // 新增场次
      liveDisplayAddDialogVisible.value = true;
    };

    const handleSaveSucceedAction = () => {
      //
      liveDisplayAddDialogVisible.value = false;
      CalendarRef.value?.reloadData();
      LiveListRef.value?.reloadData();
    };
    const handleCloseAction = () => {
      liveDisplayAddDialogVisible.value = false;
    };

    onBeforeMount(() => {
      const liveType = ctx.root.$route.params.liveType ?? 'calendar';
      if (liveType === 'calendar') {
        liveDisplayType.value = 'calendar';
      } else if (liveType === 'list') {
        liveDisplayType.value = 'list';
      }
    });

    const downloadScheduleRef = ref<{ show: () => void } | undefined>(undefined);
    const onDownloadScheduleClick = () => {
      downloadScheduleRef.value?.show();
    };
    /** 本地生活 */
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    const live_display_save = isFromSupplyChain.value
      ? Permission.supply_edit_shop_live
      : isFromLocalLife.value
      ? Permission.local_life_display_save
      : Permission.live_display_save;
    return {
      live_display_save,
      Permission,
      handleCopyScheduleSucceedAction,
      liveDisplayAddDialogVisible,
      handleSaveSucceedAction,
      CopyScheduleFormVisible,
      CopyLiveScheduleHandler,
      AddLiveDisplayHandler,
      handleCloseAction,
      studioInfo,
      project_id,
      liveDisplayType,
      currentTitle,
      ...methods,
      displayDate,
      selectDates,
      start_date,
      end_date,
      CalendarRef,
      LiveListRef,
      downloadScheduleRef,
      onDownloadScheduleClick,
      business_type: business_type,
    };
  },
});
