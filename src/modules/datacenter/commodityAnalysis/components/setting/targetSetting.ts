import { defineComponent, ref } from '@vue/composition-api';
import { sleep } from '@/utils/func';
import { SaveCommoditySettingConfig } from '@/services/datacenter';
import {
  settingItem,
  settingItemOpt,
} from '@/modules/datacenter/commodityAnalysis/monitorAnalysis/types';
import Vue from 'vue';

export default defineComponent({
  name: 'targetSetting',
  /*  props: {
    saleCompetitiveBaseList.value: {
      type: Array as PropType<settingItem[]>,
      required: true,
    },
    saleSelfBaseList.value: {
      type: Array as PropType<settingItem[]>,
      required: true,
    },
  },*/
  setup(props, ctx) {
    const checkCompetitiveAllArr = ref<boolean[]>([]);
    const IndeterminateCompetitive = ref<boolean[]>([]);
    const checkSelfAllArr = ref<boolean[]>([]);
    const IndeterminateSelf = ref<boolean[]>([]);
    const checkedSelfArr = ref<any>([]);
    const checkedCompetitiveArr = ref<any>([]);
    const project_id = ref<number | undefined>(undefined);
    const saleSelfBaseList = ref<settingItem[]>([]);
    const saleCompetitiveBaseList = ref<settingItem[]>([]);
    const updateParams = () => {
      checkedSelfArr.value = saleSelfBaseList.value.map((item: settingItem) => {
        return (
          item.children
            .filter((it: settingItemOpt) => it.select)
            .map((sub: settingItemOpt) => sub.name) || []
        );
      });
      checkedCompetitiveArr.value = saleCompetitiveBaseList.value.map((item: settingItem) => {
        return item.children
          .filter((it: settingItemOpt) => it.select)
          .map((sub: settingItemOpt) => sub.name);
      });
      checkSelfAllArr.value = [
        ...checkedSelfArr.value.map((arr: String[], index: number) => {
          return (arr || []).length === saleSelfBaseList.value[index].children.length;
        }),
      ];
      IndeterminateSelf.value = [
        ...checkedSelfArr.value.map((arr: String[], index: number) => {
          return (
            (arr || []).length > 0 &&
            (arr || []).length < saleSelfBaseList.value[index].children.length
          );
        }),
      ];

      checkCompetitiveAllArr.value = [
        ...checkedCompetitiveArr.value.map((arr: String[], index: number) => {
          return (arr || []).length === saleCompetitiveBaseList.value[index].children.length;
        }),
      ];
      IndeterminateCompetitive.value = [
        ...checkedCompetitiveArr.value.map((arr: String[], index: number) => {
          return (
            (arr || []).length > 0 &&
            (arr || []).length < saleCompetitiveBaseList.value[index].children.length
          );
        }),
      ];
    };

    const handleCheckAllChange = (val: boolean, index: number, isCompetitve = 0) => {
      if (isCompetitve === 1) {
        checkedCompetitiveArr.value[index] = val
          ? saleCompetitiveBaseList.value[index].children.map((sub: settingItemOpt) => sub.name)
          : [];
        IndeterminateCompetitive.value[index] = false;
        return;
      }
      checkedSelfArr.value[index] = val
        ? saleSelfBaseList.value[index].children.map((sub: settingItemOpt) => sub.name)
        : [];
      IndeterminateSelf.value[index] = false;
    };
    const handleCheckedCitiesChange = (value: string[], index: number, isCompetitve = 0) => {
      const checkedCount = value.length;
      if (isCompetitve === 1) {
        Vue.set(
          checkCompetitiveAllArr.value,
          index,
          checkedCount === saleCompetitiveBaseList.value[index].children.length,
        );
        Vue.set(
          IndeterminateCompetitive.value,
          index,
          checkedCount > 0 && checkedCount < saleCompetitiveBaseList.value[index].children.length,
        );
        return;
      }
      Vue.set(
        checkSelfAllArr.value,
        index,
        checkedCount === saleSelfBaseList.value[index].children.length,
      );
      Vue.set(
        IndeterminateSelf.value,
        index,
        checkedCount > 0 && checkedCount < saleSelfBaseList.value[index].children.length,
      );
    };
    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('close');
      ctx.emit('update:visible', false);
      ctx.emit('dialog:close', success);
    };
    const saveLoading = ref(false);
    const handleDialogSubmit = async () => {
      const payload: any = {
        project_id: project_id.value,
        data: {
          competitive_config: saleCompetitiveBaseList.value.map(
            (item: settingItem, index: number) => {
              const arr = item.children.map(sub => {
                sub.select = checkedCompetitiveArr.value[index].find(
                  (it: string) => it === sub.name,
                )
                  ? true
                  : false;
                return sub;
              });
              item.children = arr;
              return item;
            },
          ),
          self_config: saleSelfBaseList.value.map((item: settingItem, index: number) => {
            const arr = item.children.map(sub => {
              sub.select = checkedSelfArr.value[index].find((it: string) => it === sub.name)
                ? true
                : false;
              return sub;
            });
            item.children = arr;
            return item;
          }),
        },
      };
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveCommoditySettingConfig(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.emit('submit');
        emitClose();
        ctx.root.$message.success(response.message ?? '保存成功');
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    return {
      emitClose,
      saleSelfBaseList,
      saleCompetitiveBaseList,
      updateParams,
      project_id,
      handleDialogSubmit,
      saveLoading,
      checkedCompetitiveArr,
      checkedSelfArr,
      checkCompetitiveAllArr,
      checkSelfAllArr,
      IndeterminateSelf,
      IndeterminateCompetitive,
      handleCheckedCitiesChange,
      handleCheckAllChange,
    };
  },
  methods: {
    // 提供给父组件使用，勿删
    show(
      project_id: number,
      saleSelfBaseList: settingItem[],
      saleCompetitiveBaseList: settingItem[],
    ) {
      this.project_id = project_id;
      this.saleSelfBaseList = saleSelfBaseList;
      this.saleCompetitiveBaseList = saleCompetitiveBaseList;
      this.updateParams();
      this.$nextTick(() => {});
    },
  },
});
