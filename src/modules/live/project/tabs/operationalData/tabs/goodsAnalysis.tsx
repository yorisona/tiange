import { ref, defineComponent, h } from '@vue/composition-api';
import { useRouter } from '@/use/vue-router';
import moment from 'moment';
import capsuleGroup from '@/components/Button/capsuleGroup';
import weekMonthSalesAnalysis from '@/modules/datacenter/commodityAnalysis/weekMonthSalesAnalysis/index.vue';
import setSales from '@/modules/datacenter/shoplive/components/commodity/module/setSales.vue';
import oneSales from '@/modules/datacenter/shoplive/components/commodity/module/oneSales.vue';

enum DateType {
  date = 0,
  week = 1,
  month = 2,
}
// const DateTypeMap = {
//   [DateType.week]: 'week',
//   [DateType.month]: 'month',
//   [DateType.day]: '自定义',
// };

export default defineComponent({
  components: {
    capsuleGroup,
    weekMonthSalesAnalysis,
    setSales,
    oneSales,
  },
  setup(props, ctx) {
    // 时间区间
    const dateType = ref(DateType.week);
    const dateTime = ref<string | string[]>(moment().format('YYYY-MM-DD'));
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const methods = {
      getRangeDate(date: string | string[]) {
        if (dateType.value === DateType.week) {
          return (
            moment(date).startOf('week').format('YYYY.MM.DD') +
            '-' +
            moment(date).endOf('week').format('YYYY.MM.DD')
          );
        } else {
          return (
            moment(date).startOf('month').format('YYYY.MM.DD') +
            '-' +
            moment(date).endOf('month').format('YYYY.MM.DD')
          );
        }
      },
    };
    return {
      dateType,
      project_id,
      dateTime,
      ...methods,
    };
  },
  render() {
    // const { project_id } = this;

    // const dateBar = (
    //   <div class="date-box">
    //     <capsule-group
    //       v-model={this.dateType}
    //       options={[
    //         { label: '日', value: DateType.date },
    //         { label: '周', value: DateType.week },
    //         { label: '月', value: DateType.month },
    //       ]}
    //       onChange={this.changeDateType}
    //     />
    //     <el-date-picker
    //       key={'syb' + this.dateType}
    //       v-model={this.dateTime}
    //       class="mgl-16"
    //       style="width: 250px;"
    //       type={
    //         this.dateType === DateType.week
    //           ? 'week'
    //           : this.dateType === DateType.month
    //           ? 'month'
    //           : 'date'
    //       }
    //       format={
    //         this.dateType === DateType.week
    //           ? `yyyy第WW周(${this.getRangeDate(this.dateTime)})`
    //           : this.dateType === DateType.month
    //           ? `yyyy年MM月(${this.getRangeDate(this.dateTime)})`
    //           : 'yyyy年MM月dd日'
    //       }
    //       picker-options={{
    //         disabledDate: (current: any) => {
    //           const end = moment();
    //           return current.valueOf() > end.valueOf();
    //         },
    //       }}
    //       size="small"
    //       // placeholder={formData.type === 1 ? '选择年' : '选择月'}
    //       clearable={false}
    //     />
    //   </div>
    // );
    return (
      <div class="goodsAnalysis-wrap">
        {/* <div class="date-wrap">{dateBar}</div>
        <div class="bar"></div> */}
        <weekMonthSalesAnalysis
          isFromGoodsAnalysis={true}
          extendsData={{
            project_id: this.project_id,
          }}
        >
          <head-lines class="head-lines mgt-24 mgb-20 pdl-18" titleFont="14" title="成套销售排行" />
          <setSales />
          <head-lines class="head-lines mgt-24 mgb-20 pdl-18" titleFont="14" title="单款连带排行" />
          <oneSales class="mgb-32" />
        </weekMonthSalesAnalysis>
      </div>
    );
  },
});
