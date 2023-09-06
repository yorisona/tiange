import { ref } from '@vue/composition-api';
import { GetCommonAchievement, DeleteShopLiveAchievementCommon } from '@/services/live.project';
import { LiveProjectAchievement } from '@/types/tiange/live.project';
import { Message } from 'element-ui';
import { wait } from '@/utils/func';
export default {
  useShopLiveAchievment() {
    const init = ref(false);
    const loading = ref(false);
    const data = ref<LiveProjectAchievement[]>([]);
    const confirmed_gather_amount = ref(0);
    const total_gather_amount = ref(0);
    const wait_gather_amount = ref(0);
    const not_write_off_amount = ref(0);
    const write_off_amount = ref(0);
    let lastQuery: any;
    const old_is_hide_reverse_data = ref<number | undefined>(1);
    const query = async (id: any, is_hide_reverse_data: number | undefined): Promise<void> => {
      if (id === undefined) return;
      lastQuery = id;
      loading.value = true;
      old_is_hide_reverse_data.value = is_hide_reverse_data || undefined;
      const [res] = await wait(500, GetCommonAchievement(id, is_hide_reverse_data, 1, 1000));
      const resData = res.data.data;
      const stat_info = resData.stat_info;
      data.value = resData.data;
      init.value = true;
      confirmed_gather_amount.value = stat_info.confirmed_gather_amount;
      total_gather_amount.value = stat_info.total_gather_amount;
      wait_gather_amount.value = stat_info.wait_gather_amount;
      write_off_amount.value = stat_info.write_off_amount;
      not_write_off_amount.value = stat_info.not_write_off_amount;
      // setTimeout(() => {
      loading.value = false;
      // }, 0);
    };
    const reload = (is_hide_reverse_data: number | undefined) => {
      query(lastQuery, is_hide_reverse_data);
    };

    const deleteShopLiveAchievement = (achievement_id: number) => {
      return DeleteShopLiveAchievementCommon(achievement_id + '').then(res => {
        if (res.data.success) {
          Message.success(res.data.message);
          reload(old_is_hide_reverse_data.value);
        } else {
          Message.error(res.data.message);
        }
      });
    };

    return {
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
    };
  },
};
