import { defineComponent, ref, PropType, computed } from '@vue/composition-api';
import moment, { Moment } from 'moment';

export enum EDatePickerType {
  // 季度
  QUARTER = 'quarter',
  // 半年度
  HALF = 'half',
}
const quarter = ['Q1', 'Q2', 'Q3', 'Q4'];
const half = ['上半年', '下半年'];

export const TimeToText = (value: any, type: EDatePickerType) => {
  if (!value) return '';
  const mmt = moment(value);
  const year = mmt.year();
  const momth = mmt.month() + 1;
  const bei = type === EDatePickerType.QUARTER ? 3 : 6;
  const texts = type === EDatePickerType.QUARTER ? quarter : half;
  const word = type === EDatePickerType.QUARTER ? '' : '';
  return `${year}年${word}${texts[Math.ceil(momth / bei) - 1]}`;
};
export default defineComponent({
  props: {
    /** 双向绑定 */
    value: {
      type: Array as PropType<string[] | Moment[]>,
      default: () => [],
    },
    /** 类型:季度0/半季度1 */
    type: {
      type: String as PropType<EDatePickerType>,
      default: () => EDatePickerType.QUARTER,
    },
  },
  setup(props, ctx) {
    const currentYear = computed<Moment>(() => {
      let current = props.value && props.value[0];
      if (!current) {
        current = moment();
      } else {
        current = moment(current);
      }
      return current;
    });
    const currentInputValue = computed(() => {
      const value = props.value && props.value[0];
      return TimeToText(value, props.type);
    });
    const forceUpdate = ref(0);
    const operatorYear = (num: number) => {
      currentYear.value.add(num, 'years');
      forceUpdate.value++;
    };
    const showPopover = ref(false);
    const selectedDate = (index: number) => {
      const result = new Array(2);
      const date = currentYear.value.clone();
      const bei = props.type === EDatePickerType.QUARTER ? 3 : 6;
      date.startOf('year').add(index * bei, 'months');
      result[0] = date.format('YYYY-MM-DD HH:mm:ss');
      result[1] = date
        .add(bei - 1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD HH:mm:ss');
      showPopover.value = false;
      ctx.emit('input', result);
    };
    return {
      forceUpdate,
      currentYear,
      operatorYear,
      showPopover,
      quarter,
      half,
      selectedDate,
      currentInputValue,
    };
  },
  render() {
    // 这里是用于强制更新, 否则moment数据变化不会触发视图更新
    this.forceUpdate;
    return (
      <el-popover trigger="click" width="220" placement="bottom-start" v-model={this.showPopover}>
        <el-input size="small" slot="reference" value={this.currentInputValue}>
          <i slot="prefix" class="el-input__icon el-icon-date" />
        </el-input>
        <div class="date-box">
          <div class="date-box-title">
            <button
              onClick={() => this.operatorYear(-1)}
              type="button"
              class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            />
            <span role="button" class="el-date-picker__header-label">
              {this.currentYear.format('YYYY 年')}
            </span>
            <button
              onClick={() => this.operatorYear(1)}
              type="button"
              class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
            />
          </div>
          <div class="date-box-content">
            {((this.type === EDatePickerType.QUARTER && this.quarter) || this.half).map(
              (text, index) => {
                return (
                  <span key={index} onclick={() => this.selectedDate(index)}>
                    {text}
                  </span>
                );
              },
            )}
          </div>
        </div>
      </el-popover>
    );
  },
});
