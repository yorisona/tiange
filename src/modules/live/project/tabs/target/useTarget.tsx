import Vue from 'vue';
import {
  GetShopLiveTargetList,
  PostSaveLiveShopTarget,
  PostSaveLiveShopTargetDay,
  PostSaveLiveShopTargetYear,
} from '@/services/live.project';
import { useRequest } from '@gm/hooks/ahooks';
import moment, { Moment } from 'moment';
import { QueryProjectDailyGoalSettings } from '@/services/live';
import { set, computed, Ref } from '@vue/composition-api';
import verification from '@/utils/verification';
import { Confirm } from '@/use/asyncConfirm';
import { Message } from 'element-ui';

export enum TargetStatus {
  /** 审批中 */
  approval = 1,
  /** 审批通过 */
  approved,
  /** 审批失败 */
  approvalFailed,
  /**  已撤销 */
  revoked,
}

interface TargetYearData {
  // 审核状态描述
  comment: string | null;
  // 年度GMV目标
  goal_value: number;
  // 年度浄销额目标
  net_sales_goal_value: number;
  status: TargetStatus;
}
interface TargetMonthData {
  // 月份中文描述 1月
  name: string;
  // 月度GMV
  gmv: number;
  // 月度销售额
  goal_value: number;
  //月度浄销额
  net_sales_goal_value: number;
  // 销售额完成比例
  net_sales_percent: number;
  status: TargetStatus;
}
interface TargetDayData {
  // 日的中文描述 01
  goal_day: number;
  // 日GMV
  gmv: number;
  // 日销售额
  goal_value: number;
  //日浄销额
  net_sales_goal_value: number;
  // 日销售额完成比例
  net_sales_percent: number;
  // 是否休息
  is_rest_day: boolean;
}
interface TargetData {
  //当前操作时间对象
  currentDate: Moment;
  // 当前显示/操作的年
  currentYear: number;
  // 当前显示/操作的月
  currentMonth: number;
  // 当前正在编辑的月数据
  currentEditMonthData: Ref<TargetMonthData>;
  // 当前可以操作的年
  currentYearOptions: TG.OptionType[];
  // 获取年月接口
  reqYear: ReturnType<typeof useRequest>;
  reqDays: ReturnType<typeof useRequest>;
  // 当前项目ID
  project_id: number | undefined;
  business_type?: number | undefined;
  // 查询当前年/月数据
  queryYear: () => void;
  // 查询日
  queryDays: () => void;
  // 改变年份
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  // 年的数据
  yearData: TargetYearData;
  // 月的数据
  monthData: TargetMonthData[];
  // 日的数据
  daysData: TargetDayData[];
  // 是否正在编辑
  isEdit: TargetEditType | null;
  // 开始编辑年月日
  startEditYear: TG.anyFunc;
  startEditMonth: TG.anyFunc;
  startEditDay: TG.anyFunc;
  // 取消编辑
  cancelEdit: TG.anyFunc;
  // 是否有被编辑改变
  hasChangeData: boolean;
  saveLoading: boolean;
  Save: (hasReload?: boolean) => Promise<void>;
  SaveMonth: (hasReload?: boolean) => Promise<void>;
  // 导入日目标数据
  importDailyTargetData: TG.anyFunc;
  // 分割月数据
  SplitMonthData: (field: 'goal_value' | 'net_sales_goal_value') => void;
}
// 编辑的类型
export enum TargetEditType {
  YEAR,
  MONTH,
  DAY,
}
const data = Vue.observable<TargetData>({
  yearData: {},
  monthData: [],
  daysData: [],
  currentMonth: 0,
  project_id: undefined,
  businessType: undefined,
  saveLoading: false,
} as any);

const init = () => {
  data.currentDate = moment();
  set(data, 'currentYear', new Date().getFullYear());
  data.currentYearOptions = new Array(4).fill(1).map((_, index) => {
    const target = data.currentYear - index + 1;
    return {
      label: `${target} 年`,
      value: target,
    };
  });
  data.reqYear = useRequest(GetShopLiveTargetList, {
    manual: true,
    onSuccess: req => {
      if (req.length > 0) {
        const reqData = req[0];
        const { goal_value, net_sales_goal_value, comment, status } = reqData;
        data.yearData = {
          goal_value,
          net_sales_goal_value,
          comment,
          status,
        };
        data.monthData = reqData.months;
      }
    },
  });
  data.reqDays = useRequest(QueryProjectDailyGoalSettings, {
    manual: true,
    onSuccess: req => {
      if (req.length > 0) {
        const reqData = req[0];
        data.daysData = reqData.days;
      }
    },
  });
  data.project_id = undefined;
  data.currentMonth = data.currentDate.month();
  data.changeYear = async year => {
    if (data.currentYear === year) return;
    let result = false;
    if (data.isEdit !== null && data.hasChangeData) {
      try {
        try {
          result = await Confirm({
            content: '目标信息已变更，是否需要保存?',
            title: '提示',
          });
        } catch (e) {}
        if (result) await data.Save(false);
        console.log('保存成功');
      } catch (e: any) {
        Message.error(e.message);
        return;
      }
    }

    data.currentDate.year(year);
    data.currentYear = data.currentDate.year();
    data.monthData = [];
    data.daysData = [];
    data.queryYear();
    data.queryDays();
    data.hasChangeData = false;
  };
  data.changeMonth = async month => {
    if (data.currentMonth === month) return;
    if (data.isEdit === TargetEditType.DAY && data.hasChangeData) {
      try {
        let result = false;
        try {
          result = await Confirm({
            content: '目标信息已变更，是否需要保存?',
            title: '提示',
          });
        } catch (e) {}
        if (result) {
          await data.Save();
        }
      } catch (e: any) {
        Message.error(e.message);
        return;
      }
    }
    data.currentDate.month(month);
    data.currentMonth = data.currentDate.month();
    data.daysData = [];
    data.queryDays();
    data.hasChangeData = false;
  };
  data.queryYear = () => {
    data.reqYear.runAsync(data.currentYear, data.project_id, data.business_type);
  };
  data.queryDays = () => {
    data.reqDays.runAsync({
      project_id: data.project_id,
      year: data.currentYear,
      month: data.currentMonth + 1,
      business_type: data.business_type,
    });
  };
  // -----
  set(data, 'isEdit', null);
  data.startEditYear = () => {
    data.hasChangeData = false;
    data.isEdit = TargetEditType.YEAR;
  };
  data.startEditMonth = () => {
    data.hasChangeData = false;
    data.isEdit = TargetEditType.MONTH;
  };
  data.startEditDay = () => {
    data.hasChangeData = false;
    data.isEdit = TargetEditType.DAY;
  };
  data.hasChangeData = false;
  data.cancelEdit = () => {
    if (data.isEdit === TargetEditType.MONTH) {
      data.reqYear.reload();
    } else if (data.isEdit === TargetEditType.DAY) {
      data.reqDays.reload();
    }
    data.isEdit = null;
  };
  data.currentEditMonthData = computed(() => {
    const value = data.monthData[data.currentMonth];
    return value;
  });
  data.Save = async (hasReload = true) => {
    data.saveLoading = true;
    let result: any;
    try {
      switch (data.isEdit) {
        case TargetEditType.MONTH:
          result = await SaveMonth();
          break;
        case TargetEditType.YEAR:
          result = await SaveYear();
          break;
        case TargetEditType.DAY:
          result = await SaveDays();
          break;
      }
    } finally {
      data.saveLoading = false;
    }
    data.hasChangeData = false;
    // 保存成功后, 刷新一下目标审核提示
    if (hasReload) {
      await data.reqYear.reload();
    }

    return result;
  };

  data.importDailyTargetData = (days: TargetDayData[]) => {
    data.daysData = data.daysData.map((item, index) => {
      const newItem = days[index];
      if (newItem) {
        item.goal_value = newItem.goal_value;
        item.net_sales_goal_value = newItem.net_sales_goal_value;
      }
      return item;
    });
  };

  data.SplitMonthData = field => {
    const monthData = data.monthData[data.currentMonth];
    const value = Number(monthData[field]);
    const splitNum = data.daysData.length;
    // 预计平均分配数量
    const one = Number((Math.floor((value / splitNum) * 100) / 100).toFixed(2));

    // 剩余可以分配目标
    let surplus = value;

    data.daysData = data.daysData.map((item, index) => {
      surplus -= one;
      if (surplus < 0) surplus = 0;

      let fillin = one;
      // 最后一个
      if (splitNum === index + 1) {
        fillin = Number((value - Math.ceil(one * (splitNum - 1) * 100) / 100).toFixed(2));
      }
      // 如果剩余的数量不够一次
      else if (one > surplus) {
        fillin = surplus;
      }

      return {
        ...item,
        [field]: fillin,
      };
    });

    data.hasChangeData = true;
  };

  const SaveMonth = async () => {
    // 所有月的浄销总额
    let allMonthsGoalValue = 0;
    // let allMonthNetSalesGoalValue = 0;
    const monthData: any[] = JSON.parse(JSON.stringify(data.monthData));
    monthData.forEach(item => {
      if (!isNaN(item.goal_value)) {
        allMonthsGoalValue += Number(item.goal_value);
      }
      // if (!isNaN(item.net_sales_goal_value)) {
      //   allMonthNetSalesGoalValue += Number(item.net_sales_goal_value);
      // }
      item.name = Number(item.name.replace('月', '')) as any;
    });

    if (verification.less(allMonthsGoalValue, Number(data.yearData.goal_value), 0.1)) {
      throw new Error('销售额月目标汇总数据小于年目标数据，请校验数据！');
    }
    // if (
    //   verification.less(allMonthNetSalesGoalValue, Number(data.yearData.net_sales_goal_value), 0.1)
    // ) {
    //   throw new Error('浄销额月目标汇总数据小于年目标数据，请校验数据！');
    // }
    const res = await PostSaveLiveShopTarget({
      project_id: data.project_id,
      year: data.currentYear,
      goals: {
        months: monthData.map(item => {
          const { goal_value, net_sales_goal_value, name } = item;
          return {
            goal_value,
            net_sales_goal_value,
            goal_month: name,
          };
        }),
      },
    });
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  };
  data.SaveMonth = SaveMonth;
  const SaveYear = async () => {
    const { net_sales_goal_value, goal_value } = data.yearData;
    /*  if (
      net_sales_goal_value !== null &&
      !isNaN(net_sales_goal_value) &&
      Number(net_sales_goal_value) <= 0
    ) {
      throw new Error('年度净销额目标必须大于0');
    }*/
    if (goal_value !== null && !isNaN(goal_value) && Number(goal_value) <= 0) {
      throw new Error('年度净销额目标必须大于0');
    }
    const res = await PostSaveLiveShopTargetYear({
      project_id: data.project_id,
      year: data.currentYear,
      goals: {
        goal_value,
        net_sales_goal_value,
      },
    });
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  };

  const SaveDays = async () => {
    // 所有月的浄销总额
    let allGoalValue = 0;
    let allNetSalesGoalValue = 0;
    const days: any[] = JSON.parse(JSON.stringify(data.daysData));
    days.forEach(item => {
      if (!isNaN(item.goal_value)) {
        allGoalValue += Number(item.goal_value);
      }
      if (!isNaN(item.net_sales_goal_value)) {
        allNetSalesGoalValue += Number(item.net_sales_goal_value);
      }
    });
    const MonthData = data.monthData[data.currentMonth];

    if (verification.less(allGoalValue, Number(MonthData.goal_value), 0.1)) {
      throw new Error('销售额日目标汇总数据小于月目标数据，请校验数据！');
    }
    if (verification.less(allNetSalesGoalValue, Number(MonthData.net_sales_goal_value), 0.1)) {
      throw new Error('浄销额日目标汇总数据小于月目标数据，请校验数据！');
    }
    const res = await PostSaveLiveShopTargetDay({
      business_type: data.business_type,
      project_id: data.project_id,
      year: data.currentYear,
      month: data.currentMonth + 1,
      goals: {
        days: days.map(item => {
          const { goal_value, net_sales_goal_value, goal_day } = item;
          return {
            goal_value,
            net_sales_goal_value,
            goal_day,
          };
        }),
      },
    });
    if (!res.data.success) throw new Error(res.data.message);
    return res.data;
  };
};

/**
 * 目标管理数据管理, 单例模式
 * @param project_id 传递项目ID则更新项目ID
 */
export const useTarget = (project_id: number | undefined, business_type?: number | undefined) => {
  if (business_type) {
    data.business_type = business_type;
  }
  if (project_id !== undefined) {
    data.isEdit = null;
    data.project_id = project_id;
    data.queryYear();
    data.queryDays();
  }

  return data;
};

init();
