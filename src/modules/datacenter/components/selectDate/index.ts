import { defineComponent, watch } from '@vue/composition-api';
import { selectDateConfig } from './selectData';
import { useRouter } from '@/use/vue-router';
import lodash from '@/utils/lodash/custom';

const { debounce } = lodash;

export default defineComponent({
  props: {
    isMcnDouyinDaily: {
      type: Boolean,
      default: false,
      require: false,
    },

    isMonthQuarter: {
      type: Boolean,
      default: false,
      require: false,
    },
    isMonthWeek: {
      type: Boolean,
      default: false,
      require: false,
    },
  },
  setup(props, ctx) {
    const selectDate = selectDateConfig(
      props.isMonthQuarter,
      props.isMcnDouyinDaily || props.isMonthQuarter,
      props.isMonthWeek,
    );
    const router = useRouter();
    const { dateValue } = router.currentRoute.query;
    if (dateValue) {
      if (dateValue.length === 4) {
        selectDate.dateType = 1;
        setTimeout(() => {
          selectDate.dateValue = dateValue;
        });
      } else {
        selectDate.dateValue = dateValue;
      }
    }

    const emit = debounce(() => {
      ctx.emit('selectDate', selectDate.dateType, selectDate.dateValue);
    }, 200);

    emit();
    watch(
      () => {
        return selectDate.dateValue;
      },
      () => {
        emit();
      },
    );
    return {
      selectDate,
    };
  },
});
