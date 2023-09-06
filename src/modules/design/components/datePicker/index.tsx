import { defineComponent } from '@vue/composition-api';
import Moment from 'moment';
export default defineComponent({
  props: {
    value: {},
  },
  render() {
    const dateValue: any[] = this.value || ([] as any);
    const [value1, value2] = dateValue;
    return (
      <div class="birthday-range-selection">
        <div class="birthday-range-container">
          <el-date-picker
            value={value1}
            popper-class="date-picker-202211040958"
            format={'MM.dd'}
            type="date"
            placeholder="开始"
            editable={false}
            onInput={(val: string) => {
              let transValue: any = Moment(val);
              if (!transValue.isValid()) transValue = '';
              else transValue = transValue.format('YYYY-MM-DD');
              console.log('left', transValue);
              this.$emit('input', [transValue, value2]);
            }}
          />
          <span class="el-range-separator">~</span>
          <el-date-picker
            value={value2}
            type="date"
            format={'MM.dd'}
            placeholder="结束"
            popper-class="date-picker-202211040958"
            editable={false}
            onInput={(val: string) => {
              let transValue: any = Moment(val);
              if (!transValue.isValid()) transValue = '';
              else transValue = transValue.format('YYYY-MM-DD');
              this.$emit('input', [value1, transValue]);
            }}
          />
        </div>
      </div>
    );
  },
});
