import { ref } from '@vue/composition-api';
import { GetMerchantAchievement, DeleteShopLiveAchievementCommon } from '@/services/live.project';
import { LiveProjectAchievement } from '@/types/tiange/live.project';
import { Message } from 'element-ui';
export default {
  useShopLiveAchievment() {
    const init = ref(false);
    const loading = ref(false);
    const data = ref<LiveProjectAchievement[]>([]);
    const queryForm = ref({
      page_num: 1,
      num: 20,
      total: 0,
    });
    const query = async (
      page_num: number = queryForm.value.page_num,
      num: number = queryForm.value.num,
    ): Promise<void> => {
      loading.value = true;
      const res = await GetMerchantAchievement(195, page_num, num);
      loading.value = false;
      if (res.data.success) {
        const resData = res.data.data;
        data.value = resData.data;
        queryForm.value.total = resData.total;
        init.value = true;
      } else {
        Message.error(res.data.message);
      }
    };
    const reload = () => {
      query();
    };

    const deleteShopLiveAchievement = (achievement_id: number) => {
      return DeleteShopLiveAchievementCommon(achievement_id + '').then(res => {
        if (res.data.success) {
          Message.success(res.data.message);
          reload();
        } else {
          Message.error(res.data.message);
        }
      });
    };

    return {
      init,
      loading,
      data,
      query,
      queryForm,
      reload,
      deleteShopLiveAchievement,
    };
  },
};
