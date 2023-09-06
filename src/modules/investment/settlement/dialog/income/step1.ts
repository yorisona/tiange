/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-01-21 10:26:09
 */
import { defineComponent, ref, inject, Ref, computed, onMounted } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { BaseInfoForm, Merchants, SaveBaseInfoParams } from '@/types/tiange/investment';
import { QuerySettlementShopLive, SaveMerchantSettlementBaseInfo } from '@/services/investment';
import { Settlement, SettlementStep } from '@/types/tiange/finance/settlement';
import { LiveDisplay } from '@/types/tiange/live';

export default defineComponent({
  setup(props, ctx) {
    const merchant_goods = inject<Ref<Merchants | undefined>>('merchant_goods') ?? ref(undefined);
    const settlement = inject<Ref<Settlement | undefined>>('settlement') ?? ref(undefined);

    const saveLoading = ref<boolean>(false);
    const formRef = ref<ElForm | undefined>(undefined);
    const dataForm = ref<BaseInfoForm>({
      shop_live_id: settlement.value?.shop_live_info_id,
    });

    const merchant_user = computed(() => {
      const name = merchant_goods.value?.add_by_name || settlement.value?.merchant_add_by_username;
      return name ? name : '--';
    });
    const shop_live_list = ref<LiveDisplay[]>([]);
    const settlement_cycle_str = computed(() => {
      const find = shop_live_list.value.find(el => el.id === dataForm.value.shop_live_id);
      if (!find) {
        return '--';
      }
      return `${find?.live_start_time.replace(/-/g, '.')} - ${find?.live_end_time.replace(
        /-/g,
        '.',
      )}`;
    });
    const methods = {
      prev: () => {
        ctx.emit('cancel');
      },
      next: async () => {
        if (!methods.isModify) {
          ctx.emit('next');
          return;
        }
        formRef.value?.validate(valid => {
          if (valid) {
            methods.saveBaseInfoRequest();
          }
        });
      },
      confirmBeforeClose: () => {
        return false;
      },
      isModify: () => {
        return true;
      },
      saveBaseInfoRequest: async () => {
        const find = shop_live_list.value.find(el => el.id === dataForm.value.shop_live_id) as any;

        const params: SaveBaseInfoParams = {
          id: settlement.value?.id,
          step: SettlementStep.step_two,
          shop_live_info_id: dataForm.value.shop_live_id,
          shop_live_live_goods_id: find?.shop_live_live_goods_id,
        };
        saveLoading.value = true;
        const res = await SaveMerchantSettlementBaseInfo(params);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '保存成功');
          ctx.emit('next', res.data.data);
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
      },
      querySettlementShopLiveRequest: async () => {
        const res = await QuerySettlementShopLive(
          merchant_goods.value?.id || settlement.value?.json_data?.goods_id,
        );
        if (res.data.success) {
          shop_live_list.value = res.data.data.data ?? [];
          if (!dataForm.value.shop_live_id) {
            dataForm.value.shop_live_id = shop_live_list.value[0]?.id;
          }
        } else {
          shop_live_list.value = [];
        }
      },
    };

    onMounted(() => {
      methods.querySettlementShopLiveRequest();
    });

    return {
      formRef,
      dataForm,
      settlement,
      saveLoading,
      merchant_user,
      shop_live_list,
      settlement_cycle_str,
      ...methods,
    };
  },
});
