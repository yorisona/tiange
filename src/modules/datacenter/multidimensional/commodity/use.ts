import { reactive, ref } from '@vue/composition-api';
import { isEmpty } from '@/utils/func';
import chartOptions from './chartOptions';
import {
  query_latitude_list,
  query_product_multidimensional_statistics,
  StatisticsTemplate,
} from '@/services/datacenter';
import { useRequest } from '@gm/hooks/ahooks';
import moment from 'moment';
import { Message } from 'element-ui';
import { useRouter } from '@/use/vue-router';

export type UTemplate = ReturnType<typeof useTemplate>;

interface ILatitude {
  // 纬度类型
  latitude_type: number;
  // 纬度ID
  property_id: number;
}
interface ITemplateFormData {
  latitude_list: string[];
  // 分析指标
  target_type: TargetType;
}
export type LatitudeOption = TG.OptionType<string>;
// 指标类型
export enum TargetType {
  // 销量
  SALES = 2,
  // 销售额
  SALESQUOTA = 1,
  // 欢迎指数
  WELCOMEINDEX = 3,
}
export const useTemplate = () => {
  // 请求状态
  const loading = ref(false);
  // 最终图表渲染的选项
  const chart_options = ref<any>(undefined);
  // 表单数据
  const formData = ref<ITemplateFormData>({
    latitude_list: Array.from({ length: 4 }),
    target_type: TargetType.SALES,
  });

  // 是否第一次加入
  const isFirst = ref(false);
  // 返回的数据
  // const responseData = ref({});

  return reactive({
    formData,
    loading,
    chart_options,
    isFirst,
  });
};

export const useTemplateManager = () => {
  const router = useRouter();
  // 当前选择的模板信息
  const template_info = ref<{ id: number; name: string }>({} as any);
  const list = ref<UTemplate[]>([]);
  // 列队请求状态
  const loading = ref(false);
  // 请求队列
  const queue = ref<UTemplate[]>([]);
  // 表单对象
  const formData = ref<{
    project_id: number;
    date: any[];
    category: number;
  }>({
    project_id: Number(router.currentRoute.query.project_id),
    date: [moment().subtract(7, 'day'), moment().subtract(1, 'day')],
  } as any);
  // 纬度列表
  const latitude_options = ref<LatitudeOption[]>([]);
  // 纬度选项
  const reqLatitude = useRequest(query_latitude_list, {
    manual: true,
    onSuccess: data => {
      latitude_options.value = data.map(it => {
        return {
          label: it.property_name,
          value: `${it.latitude_type}_${it.property_id}`,
          latitude_type: it.latitude_type,
          property_id: it.property_id,
        };
      });
    },
  });

  // 加入请求列队
  const addLoadQueue = (tmp: UTemplate) => {
    tmp.loading = true;
    loading.value = true;
    queue.value.push(tmp);
    doLoadQuery();
  };

  // 列队当前操作对象
  let currentQueueTarget: UTemplate | undefined;
  // 获取纬度长度
  const get_latitude_length = (list: any[]) => {
    let count = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i]) count++;
    }
    return count;
  };

  const doLoadQuery = async () => {
    if (currentQueueTarget !== undefined) return;
    currentQueueTarget = queue.value.shift();
    if (currentQueueTarget === undefined) {
      // 所有列队处理完成
      loading.value = false;
      return;
    }

    const get_selected_latitude = (selected: string[]): ILatitude[] => {
      return selected
        .filter(it => !isEmpty(it))
        .map(it => {
          const values = it.split('_').map(Number);
          return {
            latitude_type: values[0],
            property_id: values[1],
          };
        });
    };
    const selected_latitude_list = get_selected_latitude(currentQueueTarget.formData.latitude_list);
    if (selected_latitude_list.length > 0) {
      const res = await query_product_multidimensional_statistics({
        project_id: formData.value.project_id,
        second_cid: formData.value.category,
        start_date: moment(formData.value.date[0]).format('YYYY-MM-DD'),
        end_date: moment(formData.value.date[1]).format('YYYY-MM-DD'),
        panel_config: {
          target_type: currentQueueTarget.formData.target_type,
          latitude_list: selected_latitude_list,
        },
      });
      currentQueueTarget.loading = false;
      currentQueueTarget.isFirst = false;
      if (res.data.success) {
        const data = res.data.data;
        const length = get_latitude_length(currentQueueTarget.formData.latitude_list); // 统一处理销售额 / 100

        if (data.row_name_list[data.row_name_list.length - 1] === '销售额') {
          data.row_data_list.forEach(it => {
            it[it.length - 1] = it[it.length - 1] / 100;
          });
        }
        switch (length) {
          case 1:
            currentQueueTarget.chart_options = chartOptions.get_latitude_2_base(data);
            break;
          case 2:
            currentQueueTarget.chart_options = chartOptions.get_latitude_3_base(data);
            break;
          case 3:
            currentQueueTarget.chart_options = chartOptions.get_latitude_4_base(data);
            break;
          case 4:
            currentQueueTarget.chart_options = chartOptions.get_latitude_5_base(data);
            break;
        }
      } else {
        Message.error(res.data.message);
        currentQueueTarget.chart_options = {};
      }
    } else {
      currentQueueTarget.loading = false;
    }

    currentQueueTarget = undefined;
    await doLoadQuery();
  };
  const addNewTemplate = () => {
    list.value.push(useTemplate());
  };
  const loadTemplate = (tmp: StatisticsTemplate) => {
    // 先清空模板
    list.value = [];
    // 使用模板类目
    formData.value.category = tmp.second_cid;
    template_info.value.id = tmp.id as number;
    template_info.value.name = tmp.template_name;
    tmp.template_config.forEach(it => {
      const temp = useTemplate();
      temp.formData.target_type = it.target_type;
      it.latitude_list.forEach((it, key) => {
        temp.formData.latitude_list[key] = `${it.latitude_type}_${it.property_id}`;
      });
      addLoadQueue(temp);
      list.value.push(temp);
    });
  };

  // 更新纬度选项
  const updateLatitudeOptions = () => {
    reqLatitude.runAsync({
      second_cid: formData.value.category,
    });
  };

  const startAnalyzing = () => {
    // formData.value.date = date;
    // formData.value.project_id = project_id;
    for (let i = 0; i < list.value.length; i++) {
      addLoadQueue(list.value[i]);
    }
  };

  return reactive({
    formData,
    startAnalyzing,
    loadTemplate,
    addLoadQueue,
    addNewTemplate,
    loading,
    list,
    latitude_options,
    updateLatitudeOptions,
    template_info,
  });
};
