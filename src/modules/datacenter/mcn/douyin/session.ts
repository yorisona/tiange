/*
 * @Author: 肖槿
 * @Date: 2021-07-06 16:32:35
 * @Description: 表格
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-16 10:38:45
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\mcn\index.ts
 */
import { computed, defineComponent, ref, SetupContext, watch } from '@vue/composition-api';
import SelectDate from '@/modules/datacenter/components/selectDate/index.vue';
import DataCenterList from '@/modules/datacenter/components/list/douyin.vue';
import { GetCommonDouyinProjectList } from '@/services/datacenter';
import { QueryS2B2CDouyinSessionReport } from '@/services/commonBusiness/project';

import { DataCenterTableParams } from '@/types/tiange/datacenter';
import { BusinessType } from '@/const/common';
import moment from 'moment';
import { DisplayDailyData } from '@/types/tiange/commonBusiness/project';
import { FeiShuDepartment } from '@/types/tiange/live';
import { GetFeishuDepartmentList } from '@/services/live';
import { ElTree } from 'element-ui/types/tree';
import { departmentFilterDisabled } from '@/utils/filter';
const useList = (ctx: SetupContext) => {
  const tableLoading = ref<boolean>(true);
  const tableData: any = ref([]);

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
  const update_time: any = ref('');
  const getData = async (payload: DataCenterTableParams, department_id?: number | string) => {
    tableLoading.value = true;
    let currentDate = moment(payload.the_date);
    if (payload.dateType === 2) {
      let arr: any = payload.the_date.split('-');
      if (!arr || arr.length < 2) {
        arr = [moment().year(), moment().quarter()];
      }
      const str =
        Number(arr[1]) === 1
          ? '01'
          : Number(arr[1]) === 2
          ? '04'
          : Number(arr[1]) === 3
          ? '07'
          : Number(arr[1]) === 4
          ? '10'
          : '01';
      currentDate = moment(arr[0] + '-' + str + '-01');
    }
    const timestr = payload.dateType === 2 ? 'quarter' : 'M';
    const begin_time = String(currentDate.startOf(timestr).format(dateFormat));
    const end_time = String(currentDate.endOf(timestr).format(dateFormat));
    const params = {
      begin_time,
      end_time,
      project_id: payload.project_id,
      group: payload.dateType === 2 ? 'quarter' : 'month',
      department_id: department_id || undefined,
    };
    const res = await QueryS2B2CDouyinSessionReport(params);
    // loading.value = false;
    if (res.data.success) {
      if (res.data.data.update_time) {
        const date_moment = moment(res.data.data.update_time * 1000);
        update_time.value = date_moment.format('yyyy.MM.DD');
      } else {
        update_time.value = undefined;
      }
      const arr: any = res.data.data.date_list
        ? res.data.data.date_list.map((item: DisplayDailyData) => {
            if (payload.dateType !== 2) {
              const week_str: string = item.weeK_str || '';
              const weekarr: string[] = week_str.split('月') || [];
              const title_arr: string[] =
                weekarr.length > 1
                  ? weekarr[1].split('周')
                  : weekarr.length > 0
                  ? weekarr[0].split('周')
                  : [];

              item.weeK_str = weekarr.length > 0 ? title_arr[0] + '周' : '周';
              item.day_str = weekarr.length > 1 ? title_arr[1] : '';
            }
            return item;
          })
        : [];
      if (res.data.data.last) {
        const lastweeK_str = payload.dateType === 2 ? '上季度数据' : '上月数据';
        arr.push({ ...res.data.data.last, weeK_str: lastweeK_str });
      }
      if (res.data.data.current) {
        const currentweeK_str = payload.dateType === 2 ? '本季度合计' : '本月合计';
        arr.push({ ...res.data.data.current, weeK_str: currentweeK_str });
      }
      if (res.data.data.link_ratio) {
        arr.push({ ...res.data.data.link_ratio, weeK_str: '环比' });
      }
      tableData.value = arr || res.data.data.date_list;
    } else {
      ctx.root.$message.error(res.data.message);
    }
    tableLoading.value = false;
  };
  select_project_id.value = 0;
  const arr: any = [{ id: 0, title: '所有项目', project_name: '所有项目' }];
  project_list.value = arr;
  const getMcnProjectList = async (
    end_date: string,
    dateType: number,
    department_id?: number | string,
  ) => {
    const timestr = dateType === 2 ? 'quarter' : 'M';
    let currentDate = moment(end_date);
    if (dateType === 2) {
      let arr: any = end_date.split('-');
      if (!arr || arr.length < 2) {
        arr = [moment().year(), moment().quarter()];
      }
      const str =
        Number(arr[1]) === 1
          ? '01'
          : Number(arr[1]) === 2
          ? '04'
          : Number(arr[1]) === 3
          ? '07'
          : Number(arr[1]) === 4
          ? '10'
          : '01';
      currentDate = moment(arr[0] + '-' + str + '-01');
    }
    const begin_time = currentDate.clone().startOf(timestr).format(dateFormat);
    const end_time = currentDate.clone().endOf(timestr).format(dateFormat);
    const params = {
      begin_time,
      end_time,
      department_id: department_id || undefined,
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
      getData(
        {
          business_type: BusinessType.Mcn,
          project_id: select_project_id.value || undefined,
          the_date: end_date,
          dateType: dateType,
        },
        department_id,
      );
    } else {
      ctx.root.$message.error(data.message);
    }
  };

  return {
    update_time,
    select_project_id,
    getData,
    tableLoading,
    tableData,
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
  components: { DataCenterList, SelectDate },
  props: {
    // 编辑的系统角色对象
    project_id: {
      type: String,
      default: '',
    },
    is_one_peoject: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const mcnLogic = useList(ctx);
    const cb_department_tree = ref<ElTree<number, FeiShuDepartment> | undefined>(undefined);
    const feishu_department_id: any = ref();
    const feishu_department_name: any = ref('');
    if (props.is_one_peoject) {
      mcnLogic.select_project_id.value = props.project_id;
    }
    const activeIndex = ref<number>(0);
    let theDate = '';
    const selectedDateType = ref(0);
    const handleCheckTab = (activeItem: number) => {
      activeIndex.value = activeItem;
    };
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const getFeishuDepartmentList = async (isFirst = false) => {
      const res = await GetFeishuDepartmentList({ root_department_name: '商业化中心' });
      const list = res.data.data.data;
      //设置一级选项不让选择
      departmentFilterDisabled(list, false, 3);
      feishuDepartmentList.value = list;
      if (isFirst && list.length > 0) {
        feishu_department_name.value = list[0].name;
        cb_department_tree.value?.setCheckedKeys([list[0].id]);
      }
    };
    const selectDate = (dateType: number, dateValue: string) => {
      selectedDateType.value = dateType;
      theDate = dateValue;
      if (props.is_one_peoject) {
        mcnLogic.getData(
          {
            business_type: BusinessType.Mcn,
            project_id: mcnLogic.select_project_id.value || undefined,
            the_date: theDate,
            dateType: selectedDateType.value,
          },
          feishuDepartmentList.value.length > 0 &&
            feishuDepartmentList.value[0].id === feishu_department_id.value
            ? ''
            : feishu_department_id.value,
        );
      } else {
        mcnLogic.getMcnProjectList(
          String(theDate),
          dateType,
          feishuDepartmentList.value.length > 0 &&
            feishuDepartmentList.value[0].id === feishu_department_id.value
            ? ''
            : feishu_department_id.value,
        );
      }
    };
    watch(
      () => mcnLogic.select_project_id.value,
      () => {
        mcnLogic.getData(
          {
            business_type: BusinessType.Mcn,
            project_id: mcnLogic.select_project_id.value || undefined,
            the_date: theDate,
            dateType: selectedDateType.value,
          },
          feishuDepartmentList.value.length > 0 &&
            feishuDepartmentList.value[0].id === feishu_department_id.value
            ? ''
            : feishu_department_id.value,
        );
      },
    );
    if (!props.is_one_peoject) {
      getFeishuDepartmentList(true);
    }
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    const handleCheckChange = (data: FeiShuDepartment) => {
      cb_department_tree.value?.setCheckedKeys([]);
      if (data.id === feishu_department_id.value) {
        feishu_department_id.value = undefined;
        feishu_department_name.value = undefined;
      } else {
        feishu_department_id.value = data.id;
        feishu_department_name.value = data.name;
        cb_department_tree.value?.setCheckedKeys([data.id]);
      }
      mcnLogic.getMcnProjectList(
        String(theDate),
        selectedDateType.value,
        feishuDepartmentList.value[0].id === feishu_department_id.value
          ? ''
          : feishu_department_id.value,
      );
    };
    const default_checked_department_ids = computed(() => {
      return feishu_department_id.value ? [feishu_department_id.value] : [];
    });
    watch(
      () => feishu_department_name.value,
      () => {
        if (!feishu_department_name.value) {
          feishu_department_id.value = '';
          feishu_department_name.value = '';
          mcnLogic.getMcnProjectList(
            String(theDate),
            selectedDateType.value,
            feishu_department_id.value,
          );
        }
      },
    );
    return {
      cb_department_tree,
      handleCheckChange,
      feishu_department_id,
      feishu_department_name,
      treeProps,
      default_checked_department_ids,
      getFeishuDepartmentList,
      feishuDepartmentList,
      activeIndex,
      handleCheckTab,
      selectDate,
      selectedDateType,
      ...mcnLogic,
    };
  },
});
