/**
 * 收入结算列表
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 16:08:45
 */
import { ComputedRef, Ref, ref, unref } from '@vue/composition-api';
import { Settlement, SettlementListQueryParams } from '@/types/tiange/finance/settlement';
import { GetSettlementList } from '@/services/finance/settlement';
import { wait } from '@/utils/func';
import { FetchAll } from '@/utils/fetch';

type ProjectType =
  | 'marketing'
  | 'live'
  | 'common'
  | 'finance'
  | 'finance_cost'
  | 'local_life'
  | 'supply_chain';

/**
 * 收入结算列表逻辑
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-06-02 16:30:26
 * @param   {ComputedRef<ProjectType> | Ref<ProjectType> | ProjectType} project_type
 * @param   {number}  waitTime 等待时间，不需要的时候可以写0， 默认500
 */
export const useSettlementIncomeList = (
  project_type: ComputedRef<ProjectType> | Ref<ProjectType> | ProjectType,
  waitTime = 500,
) => {
  const loading = ref(false);
  const data = ref<Settlement[]>([]);
  const total = ref(0);

  /** 加载数据 */
  const loadData = async (payload: SettlementListQueryParams) => {
    loading.value = true;
    const [{ data: response }] = await wait(
      waitTime,
      GetSettlementList(unref(unref(project_type)), payload),
    );
    loading.value = false;

    if (response.success) {
      data.value = response.data.data;
      total.value = response.data.total;
    } else {
      data.value = [];
      total.value = 0;
    }
  };

  /** 加载全部数据 */
  const loadDataAll = async (payload: SettlementListQueryParams) => {
    const response = await FetchAll(payload, async (params: SettlementListQueryParams) =>
      GetSettlementList(unref(unref(project_type)), params),
    );

    data.value = response.data;
    total.value = response.total;
  };

  return {
    loading,
    data,
    total,
    loadData,
    loadDataAll,
  };
};
