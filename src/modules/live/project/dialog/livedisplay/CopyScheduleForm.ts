import { CopShopLiveScheduleService, GetProjectScheduleDetail } from '@/services/live';
import { ProjectScheduleQueryParams, ScheduleType } from '@/types/tiange/live';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useRouter } from '@/use/vue-router';
import { wait } from '@/utils/func';
import { defineComponent, ref } from '@vue/composition-api';
import moment from 'moment';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const GetScheduleDataDetail = async (
  payload: ProjectScheduleQueryParams,
  business_type: number | undefined = E.project.BusinessType.douyin,
) => {
  const [{ data: resp }] = await wait(200, GetProjectScheduleDetail(payload, business_type));
  return resp;
};

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const { business_type } = useProjectBaseInfo();
    const DataForm = ref({
      date_range: [],
      start_date: '',
      end_date: '',
    });

    const resetDataForm = () => {
      DataForm.value = {
        date_range: [],
        start_date: '',
        end_date: '',
      };
    };

    const methods = {
      onClose: () => {
        resetDataForm();
        ctx.emit('close');
        ctx.emit('update:visible', false);
      },
      onSave: async () => {
        const need_continue = ref(1);

        const start_date = DataForm.value.date_range[0];
        const end_date = DataForm.value.date_range[1];
        const copy_to_start_date = DataForm.value.start_date;

        if (
          moment(copy_to_start_date).isBetween(moment(start_date), moment(end_date)) ||
          start_date === copy_to_start_date ||
          end_date === copy_to_start_date
        ) {
          ctx.root.$message.error('时间段不允许有重叠');
          return;
        }

        const respdata = await GetScheduleDataDetail(
          {
            project_id: parseInt(project_id, 10),
            start_date: copy_to_start_date,
            end_date: DataForm.value.end_date.replace(/\./g, '-'),
            schedule_type: ScheduleType.Month,
          },
          business_type.value,
        );

        if (respdata.success) {
          need_continue.value = respdata.data.length > 0 ? 0 : 1;
        } else {
          ctx.root.$message.error('查询排期信息失败，请稍后重试');
          return;
        }
        if (need_continue.value === 0) {
          const cover = await AsyncConfirm(ctx, {
            title: '被覆盖的时间段已存在排班信息，是否覆盖原有排班',
            confirmText: '直接覆盖',
            cancelText: '跳过该日期',
          });
          need_continue.value = cover ? 0 : 1;
        }

        const { data: res } = await CopShopLiveScheduleService(
          project_id,
          start_date,
          end_date,
          copy_to_start_date,
          need_continue.value,
          business_type.value,
        );
        if (res.success) {
          ctx.root.$message.success(res.message);
          ctx.emit('update:visible', false);
          ctx.emit('succeed');
        } else {
          ctx.root.$message.warning(res.message ?? '复制失败，稍后重试');
        }
      },
    };

    const Day30 = 30 * 24 * 3600 * 1000; // 30day
    const timeOptionRange = ref<Date | null>();

    const pickerOptions = ref({
      disabledDate(time: any) {
        const _timeOptionRange: any = timeOptionRange.value;

        const secondNum = Day30;
        if (_timeOptionRange) {
          return (
            time.getTime() > _timeOptionRange.getTime() + secondNum ||
            time.getTime() < _timeOptionRange.getTime() - secondNum
          );
        }
        return false;
      },
      onPick({ minDate, maxDate }: { minDate: Date; maxDate: Date }) {
        if (minDate && !maxDate) {
          timeOptionRange.value = minDate;
        }
        if (maxDate) {
          timeOptionRange.value = null;
        }
      },
    });

    function getNumberOfDays(start: string, end: string) {
      const date1 = new Date(start);
      const date2 = new Date(end);

      // One day in milliseconds
      const oneDay = 1000 * 60 * 60 * 24;

      // Calculating the time difference between two dates
      const diffInTime = date2.getTime() - date1.getTime();

      // Calculating the no. of days between two dates
      const diffInDays = Math.round(diffInTime / oneDay);

      return diffInDays;
    }

    const ChangeCopyToStartDate = (value: string) => {
      if (DataForm.value.date_range) {
        const start_str = DataForm.value.date_range[0];
        const end_str = DataForm.value.date_range[1];
        const daterange = getNumberOfDays(start_str, end_str);

        const copy_start = new Date(value);
        copy_start.setDate(copy_start.getDate() + daterange);
        const end_date = moment(copy_start).format('YYYY.MM.DD');
        DataForm.value.end_date = end_date;
      }
    };

    return { ...methods, DataForm, pickerOptions, ChangeCopyToStartDate };
  },
});
