/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-25 15:32:36
 */
import { useRouter } from '@/use/vue-router';
import { getToken } from '@/utils/token';
import { defineComponent, ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

export default defineComponent({
  setup(props, ctx) {
    const dialogVisible = ref<boolean>(false);
    const formRef = ref<ElForm | undefined>(undefined);
    const dataForm = ref<{ date: string[] }>({
      date: [],
    });

    const pickMinDate = ref<Date | undefined>(undefined);
    const router = useRouter();
    const project_id = router.currentRoute.params?.id;
    const methods = {
      close: () => {
        dialogVisible.value = false;
      },
      save: () => {
        formRef.value?.validate(valid => {
          if (valid) {
            ctx.emit('save');
            dialogVisible.value = false;
            window.open(
              `/api/settlement/download_kol_schedule_v2?project_id=${project_id}&start_date=${
                dataForm.value.date[0]
              }&end_date=${dataForm.value.date[1]}&Authorization=${getToken()}`,
              '_blank',
            );
          }
        });
      },
      show: () => {
        formRef.value?.clearValidate();
        dialogVisible.value = true;
      },
      onDateBlur: () => {
        pickMinDate.value = undefined;
      },
    };

    const pickerOptions = {
      onPick: ({ minDate }: { minDate: Date }) => {
        pickMinDate.value = minDate;
      },
      disabledDate(time: Date) {
        if (pickMinDate.value) {
          const max_moment = moment(pickMinDate.value);
          const min_moment = moment(pickMinDate.value);
          const end_moment = moment(time);
          max_moment.add(30, 'days');
          min_moment.add(-30, 'days');
          return end_moment.isBefore(min_moment) || end_moment.isAfter(max_moment);
        }
        return false;
      },
    };
    watch(
      () => dialogVisible.value,
      newVal => {
        if (!newVal) {
          setTimeout(() => {
            dataForm.value.date = [];
          }, 300);
        }
      },
    );

    return {
      pickerOptions,
      formRef,
      dataForm,
      dialogVisible,
      ...methods,
    };
  },
});
