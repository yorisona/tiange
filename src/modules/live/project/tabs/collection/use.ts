import { reactive, ref } from '@vue/composition-api';
import { GetShopLiveAchievement, DeleteShopLiveAchievement } from '@/services/live.project';
import { LiveProjectAchievement } from '@/types/tiange/live.project';
import { Message } from 'element-ui';
export default {
  useShopLiveAchievment(business_type: number = E.project.BusinessType.douyin) {
    const init = ref(false);
    const loading = ref(false);
    const data = ref<LiveProjectAchievement[]>([]);
    const confirmed_gather_amount = ref(0);
    const total_gather_amount = ref(0);
    const wait_gather_amount = ref(0);
    const not_write_off_amount = ref(0);
    const write_off_amount = ref(0);
    let lastQuery: any;

    const query = async (id: any): Promise<void> => {
      if (id === undefined) return;
      lastQuery = id;

      loading.value = true;
      const res = await GetShopLiveAchievement(id, business_type);
      loading.value = false;

      const resData = res.data.data;
      const stat_info = resData.stat_info;
      data.value = resData.data;
      init.value = true;

      confirmed_gather_amount.value = stat_info.confirmed_gather_amount;
      total_gather_amount.value = stat_info.total_gather_amount;
      wait_gather_amount.value = stat_info.wait_gather_amount;
      write_off_amount.value = stat_info.write_off_amount;
      not_write_off_amount.value = stat_info.not_write_off_amount;
    };
    const reload = () => {
      query(lastQuery);
    };

    const deleteShopLiveAchievement = (achievement_id: number) => {
      return DeleteShopLiveAchievement(achievement_id + '').then(res => {
        if (res.data.success) {
          Message.success(res.data.message);
          reload();
        } else {
          Message.error(res.data.message);
        }
      });
    };

    return reactive({
      init,
      loading,
      data,
      confirmed_gather_amount,
      total_gather_amount,
      wait_gather_amount,
      write_off_amount,
      not_write_off_amount,
      query,
      reload,
      deleteShopLiveAchievement,
    });
  },
};
