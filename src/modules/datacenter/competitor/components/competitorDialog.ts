/*
 * @Author: 肖槿
 * @Date: 2022-01-07 11:45:22
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-02-18 13:53:22
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\competitor\components\competitorDialog.ts
 */
import { defineComponent, ref } from '@vue/composition-api';
import { PostCompetitiveShops } from '@/services/datacenter';
import { CompeteShopStyleOptions, CompeteShopStyle } from '@/const/datacenter';
export interface IShopList {
  shop_name: string;
  style?: number;
}
export default defineComponent({
  setup(_, ctx) {
    const onClose = () => {
      if (hasUpdate.value === true) {
        ctx.emit('close', shopList.value);
      }
      visible.value = false;
    };
    const hasUpdate = ref(false);
    const postLoading = ref(false);
    const onSave = async () => {
      if (shopList.value.length > 50) {
        ctx.root.$message.warning('店铺数量不能超过50个');
        return;
      }
      let message = false;
      for (let i = 0; i < shopList.value.length; i++) {
        const shop = shopList.value[i];
        if (shop.shop_name.replace(/\s/g, '') === '') {
          message = true;
          break;
        }
        if (shop.style === null || shop.style === undefined) {
          message = true;
          break;
        }
      }
      if (message) {
        ctx.root.$message.warning('店铺类型和名称必须填写');
        return;
      }

      postLoading.value = true;
      const {
        data: { success },
      } = await PostCompetitiveShops(shopList.value);
      if (!success) {
        ctx.root.$message.error('添加失败');
      } else {
        ctx.root.$message.success('添加成功');
        hasUpdate.value = true;
      }
      postLoading.value = false;
      visible.value = false;
    };
    const visible = ref(false);
    const addShopFlag = ref(false);
    const addShop = () => {
      if (shopList.value.length > 0) {
        const last = shopList.value[shopList.value.length - 1];
        if (last.style === null || last.style === undefined) {
          ctx.root.$message.warning('必须选择类型');
          return;
        }
        if (last.shop_name.replace(/\s/g, '') === '') {
          ctx.root.$message.warning('必须填写店铺名称');
          return;
        }
        if (shopList.value.length >= 50) {
          ctx.root.$message.warning('最多只能50个店铺');
          return;
        }
      }
      shopList.value.push({ shop_name: '', style: undefined });
    };
    const onShopBlur = (shop: IShopList, idx: number) => {
      if (idx === shopList.value.length - 1) {
        if (
          shop.shop_name.replace(/\s/g, '') === '' &&
          (shop.style === null || shop.style === undefined)
        ) {
          deleteShop(idx);
          return;
        }
      }
      for (let i = 0; i < shopList.value.length; i++) {
        if (i === idx) continue;
        if (shop.shop_name === shopList.value[i].shop_name) {
          shop.shop_name = '';
          break;
        }
      }
    };
    const currentName = ref('');
    const deleteShop = (idx: number) => {
      shopList.value.splice(idx, 1);
    };
    const shopList = ref<IShopList[]>([]);
    const show = (list: string[] | IShopList[]) => {
      // list.shift();
      const hasNewFormat = (list: string[] | IShopList[]): list is IShopList[] => {
        if (typeof list[0] === 'string') return false;
        return true;
      };
      if (list.length === 0) {
        shopList.value = [];
      } else if (hasNewFormat(list)) {
        shopList.value = list;
      } else {
        shopList.value = list.map(_ => {
          return {
            shop_name: _,
          };
        });
      }
      hasUpdate.value = false;
      visible.value = true;
    };

    return {
      onClose,
      onSave,
      addShop,
      currentName,
      postLoading,
      shopList,
      visible,
      show,
      deleteShop,
      addShopFlag,
      onShopBlur,
      CompeteShopStyleOptions,
      CompeteShopStyle,
    };
  },
});
