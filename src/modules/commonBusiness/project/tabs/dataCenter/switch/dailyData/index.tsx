import { defineComponent, onMounted, PropType, ref, watch } from '@vue/composition-api';
import TgDailyDataTable from '@/modules/commonBusiness/project/tabs/components/dailyDataTable/index.vue';
import moment from 'moment';
import { TableModel } from '../../../components/dailyDataTable';
import {
  PostSaveDailyReport,
  QueryS2B2CDouyinDailyReport,
} from '@/services/commonBusiness/project';
import { S2B2CDouyinDailyReport } from '@/types/tiange/commonBusiness/project';
import { useRouter } from '@/use/vue-router';
import { LiveProjectDailydata } from '@/types/tiange/live.project';

export default defineComponent({
  name: 'DailyData',
  props: {
    currentDate: {
      type: Object as PropType<moment.Moment>,
      require: true,
    },
    business_type: {
      type: Number,
      default: 5,
    },
  },
  components: {
    TgDailyDataTable,
  },
  setup(props, ctx) {
    const router = useRouter();
    const dateFormat = 'yyyy-MM-DD';

    const getTableData = (currentDate: moment.Moment | undefined) => {
      const cloneDate = currentDate?.clone();

      const tempDatas: TableModel[] = [];
      const currentD = cloneDate?.endOf('M').date() ?? 0;

      const loopDate = cloneDate?.startOf('M');

      for (let i = 1; i <= currentD; i++) {
        loopDate?.date(i);
        const tempModel: TableModel = {
          dateNum: i,
          weekDate: loopDate?.format('ddd') ?? '',
          dateMoment: loopDate?.clone(),
          date: undefined,
          gmv: undefined,
          gmv_rate: undefined,
          live_duration: undefined,
          estimated_institution_commission: undefined,
          live_duration_str: undefined,
        };
        tempDatas.push(tempModel);
      }
      return tempDatas;
    };

    const reportData = ref<S2B2CDouyinDailyReport | undefined>(undefined);
    const tableData = ref<TableModel[]>(getTableData(props.currentDate));

    const methods = {
      // 请求日报数据
      async queryS2B2CDouyinDailyReport() {
        const currentDate = props.currentDate ?? moment();
        const begin_time = currentDate.clone().startOf('M').format(dateFormat);
        const end_time = currentDate.clone().endOf('M').format(dateFormat);
        const params = {
          begin_time,
          end_time,
          project_id: router.currentRoute.params.id,
        };
        const res = await QueryS2B2CDouyinDailyReport(params);
        if (res.data.success) {
          reportData.value = res.data.data;
          ctx.emit('dataUpdate', {
            date: reportData.value.update_time,
          });
          tableData.value = tableData.value.map((el, index) => {
            const newModel = reportData.value?.date_list[index];
            if (newModel) {
              return { ...el, ...newModel };
            }
            return { ...el };
          });
        } else {
          ctx.root.$message.error(res.data.message ?? '获取日报数据失败');
        }
      },
      // 保存gmv目标
      async onGmvChanged(row: LiveProjectDailydata) {
        const val = Number(row.gmv || 0);
        if (val <= 0) {
          ctx.root.$message.warning('GMV目标须大于0');
          methods.queryS2B2CDouyinDailyReport();
          return;
        }
        PostSaveDailyReport({
          ...row,
          business_type: props.business_type,
          project_id: router.currentRoute.params.id,
        }).then((res: any) => {
          if (res.data.success) {
            ctx.root.$message.success(res.data.message ?? '保存成功');
          } else {
            ctx.root.$message.error(res.data.message ?? '保存失败');
          }
          methods.queryS2B2CDouyinDailyReport();
        });
      },
    };

    onMounted(() => {
      methods.queryS2B2CDouyinDailyReport();
    });

    watch(
      () => props.currentDate,
      newDate => {
        if (newDate) {
          tableData.value = getTableData(newDate);
          reportData.value = undefined;
          methods.queryS2B2CDouyinDailyReport();
        }
      },
    );

    return {
      reportData,
      tableData,
      ...methods,
    };
  },
  render() {
    const { tableData, reportData } = this;
    return (
      <tg-daily-data-table
        showTableData={tableData}
        totalData={reportData?.total}
        editEnabled={true}
        on-gmvChanged={this.onGmvChanged}
      ></tg-daily-data-table>
    );
  },
});
