import { ref, reactive } from '@vue/composition-api';
import { GetLiveAnalyse, PostContrast, PostContrastFeedback } from '@/services/live.replay';
import { LiveDisplayQuery } from '@/services/live';

export interface IHttpResult {
  order_analyse: {
    promote_order_amount: number;
  };
}

export const useLiveReplay = () => {
  const data = ref<any>({
    order_analyse: {},
    view_analyse: {},
    traffic_analyse: {},
    conversion_analyse: {},
    item_analyse: {},
    contrast_live_id: null,
  });
  let lastLiveId = 0;

  const query = (liveId: number) => {
    lastLiveId = liveId;
    return GetLiveAnalyse(liveId).then(res => {
      data.value = res;
    });
  };

  const reload = () => query(lastLiveId);

  // 关联对比场次 0 为删除
  const live_analyse_contrast = (liveId: number, contrastLiveId: number) => {
    return PostContrast(liveId, contrastLiveId).then(res => {
      data.value = res;
    });
  };
  /**
   * 1: 直播成交 2: 观看分析 3: 流量分析 4: 转化分析 5: 商品分析
   * @param liveId
   */

  const contract_feedback = (liveId: number) => {
    const source = data.value;
    const postData = [
      { type: 1, content: source.order_analyse.feedback },
      { type: 2, content: source.view_analyse.feedback },
      { type: 3, content: source.traffic_analyse.feedback },
      { type: 4, content: source.conversion_analyse.feedback },
      { type: 5, content: source.item_analyse.feedback },
    ];

    return PostContrastFeedback(liveId, postData);
  };

  return reactive({
    data,
    query,
    live_analyse_contrast,
    reload,
    contract_feedback,
  });
};

export const useLiveContract = () => {
  const list = ref<any>([]);

  const query = (live_start_date: string, liveId: number, project_id: any) => {
    return LiveDisplayQuery({ live_start_date, business_type: undefined, project_id }).then(res => {
      list.value = res.data.data.data.filter(it => it.id !== liveId - 0);
    });
  };

  const reset = () => {
    list.value = [];
  };
  return reactive({
    list,
    query,
    reset,
  });
};
