/*
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: 表格
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 10:38:45
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.ts
 */
import { defineComponent, ref, SetupContext, watch } from '@vue/composition-api';
import SelectDate from '@/modules/datacenter/components/selectDate/index.vue';
import { GetCommonDouyinProjectList } from '@/services/datacenter';
import { DataCenterTableParams } from '@/types/tiange/datacenter';
import { BusinessType } from '@/const/common';
import TgDailyDataTable from '@/modules/commonBusiness/project/tabs/components/dailyDataTable/index.vue';
import { QueryS2B2CDouyinDailyReport } from '@/services/commonBusiness/project';
import moment from 'moment';
import { TableModel } from '@/modules/commonBusiness/project/tabs/components/dailyDataTable';
import { S2B2CDouyinDailyReport } from '@/types/tiange/commonBusiness/project';
const useList = (ctx: SetupContext) => {
  const tableLoading = ref<boolean>(true);
  const select_project_id: any = ref(undefined);
  const project_list = ref<any>([]);
  // 汇总数据
  const summaryData = ref({});
  // gmv变化趋势
  const gmvData = ref<any>({
    dates: [],
    lists: [],
  });
  // 各项目GMV占比
  const gmvRateData = ref([]);
  // 运营费用趋势
  const operatingData = ref({
    dates: [],
    lists: [],
  });
  // 直播场次变化
  const sessionData = ref({
    dates: [],
    lists: [],
  });
  // 开播主播数变化
  const liverNumData = ref({
    dates: [],
    lists: [],
  });
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
  const time = new Date();
  const tableData = ref<TableModel[]>(
    getTableData(
      moment(
        time.getFullYear() +
          '-' +
          (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1),
      ),
    ),
  );
  const update_time: any = ref('');
  const getData = async (payload: DataCenterTableParams) => {
    tableLoading.value = true;
    const currentDate = moment(payload.the_date);
    tableData.value = getTableData(moment(payload.the_date));
    const begin_time = currentDate.clone().startOf('M').format(dateFormat);
    const end_time = currentDate.clone().endOf('M').format(dateFormat);
    const params = {
      begin_time,
      end_time,
      project_id: payload.project_id,
    };
    const { data } = await QueryS2B2CDouyinDailyReport(params);
    if (data.success) {
      reportData.value = data.data;
      if (data.data.update_time) {
        const date_moment = moment(data.data.update_time * 1000);
        update_time.value = date_moment.format('yyyy.MM.DD');
      } else {
        update_time.value = undefined;
      }
      tableData.value = tableData.value.map((el, index) => {
        const newModel = reportData.value?.date_list[index];
        if (newModel) {
          return { ...el, ...newModel };
        }
        return { ...el };
      });
    } else {
      ctx.root.$message.error(data.message);
    }
    tableLoading.value = false;
  };
  select_project_id.value = 0;
  const arr: any = [{ id: 0, title: '所有项目', project_name: '所有项目' }];
  project_list.value = arr;
  const getMcnProjectList = async (end_date: string) => {
    const currentDate = moment(end_date);
    const begin_time = currentDate.clone().startOf('M').format(dateFormat);
    const end_time = currentDate.clone().endOf('M').format(dateFormat);
    const params = {
      begin_time,
      end_time,
    };
    const { data } = await GetCommonDouyinProjectList(params);
    if (data.success) {
      const arr: any = [{ id: 0, title: '所有项目', project_name: '所有项目' }];
      arr.push(...data.data.data);
      project_list.value = arr;
      let ishash = false;
      project_list.value.forEach((item: any) => {
        item.title = item.project_name;
        if (select_project_id.value === item.id) {
          ishash = true;
        }
      });
      if (ishash === false) {
        select_project_id.value = 0;
      }
      getData({
        business_type: BusinessType.Mcn,
        project_id: select_project_id.value || undefined,
        the_date: end_date,
      });
    } else {
      ctx.root.$message.error(data.message);
    }
  };

  return {
    update_time,
    select_project_id,
    getData,
    tableData,
    reportData,
    tableLoading,
    operatingData,
    sessionData,
    liverNumData,
    summaryData,
    gmvData,
    project_list,
    gmvRateData,
    getMcnProjectList,
  };
};
export default defineComponent({
  components: { SelectDate, TgDailyDataTable },
  setup(_, ctx) {
    const mcnLogic = useList(ctx);
    const activeIndex = ref<number>(0);
    let theDate = '';
    const selectedDateType = ref(0);
    const handleCheckTab = (activeItem: number) => {
      activeIndex.value = activeItem;
    };
    const selectDate = (dateType: number, dateValue: string) => {
      selectedDateType.value = dateType;
      theDate = dateValue;
      /* mcnLogic.select_project_id.value = 0;
        mcnLogic.getData({
         business_type: BusinessType.Mcn,
         project_id: mcnLogic.select_project_id.value || undefined,
         the_date: dateValue,
       });*/
      mcnLogic.getMcnProjectList(theDate);
    };
    watch(
      () => mcnLogic.select_project_id.value,
      () => {
        mcnLogic.getData({
          business_type: BusinessType.Mcn,
          project_id: mcnLogic.select_project_id.value || undefined,
          the_date: theDate,
        });
      },
    );
    return {
      activeIndex,
      handleCheckTab,
      selectDate,
      selectedDateType,
      ...mcnLogic,
    };
  },
});
