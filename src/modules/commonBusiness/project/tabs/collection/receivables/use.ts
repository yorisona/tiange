/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-07-06 14:54:40
 */
import { ref } from '@vue/composition-api';
import { DeleteShopLiveAchievement } from '@/services/live.project';
import { GetReceivableCommonReceivables } from '@/services/commonBusiness/project';
import { AchievementReceivable } from '@/types/tiange/marketing/achievement';
import { Message } from 'element-ui';
import { wait } from '@/utils/func';
export default {
  useShopLiveAchievment() {
    const init = ref(false);
    const loading = ref(false);
    const data = ref<AchievementReceivable[]>([]);
    const not_write_off = ref(0);
    const receivable = ref(0);
    const write_off = ref(0);
    let lastQuery: any;
    const old_is_hide_reverse_data = ref<number | undefined>(1);
    const query = async (params: any): Promise<void> => {
      if (params === undefined) return;
      lastQuery = params;
      loading.value = true;
      old_is_hide_reverse_data.value = params.is_hide_reverse_data || undefined;
      const [{ data: res }] = await wait(500, GetReceivableCommonReceivables(params));
      const resData = res.data;
      data.value = resData.data;
      init.value = true;
      not_write_off.value = resData.not_write_off;
      receivable.value = resData.receivable;
      write_off.value = resData.write_off;
      // setTimeout(() => {
      loading.value = false;
      // }, 0);
    };
    const reload = (is_hide_reverse_data: number | undefined) => {
      query({ ...lastQuery, is_hide_reverse_data });
    };

    const deleteShopLiveAchievement = (achievement_id: number) => {
      return DeleteShopLiveAchievement(achievement_id + '').then(res => {
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
      not_write_off,
      receivable,
      write_off,
      query,
      reload,
      deleteShopLiveAchievement,
    };
  },
};
