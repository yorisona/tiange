/**
 * 营销业务 - 项目详情 - tab 跟单表 - 抽屉(登记跟单)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-13 17:43:58
 */
import { computed, inject, ref, watch } from '@vue/composition-api';
import type { Ref, SetupContext } from '@vue/composition-api';
import type { ElForm } from 'element-ui/types/form';
import type { MarketingProjectDetail as ProjectDetail } from '@/types/tiange/marketing/project';
import type { AEOrder, AEOrderForm, AEOrderSaveParams } from '@/types/tiange/marketing/ae';
import { SaveAEOrder, UpdateDocumentary } from '@/services/marketing/ae';
import { sleep } from '@/utils/func';
import { getPositiveNumber } from '@/utils/string';
import type { ValidateCallback } from '@/types/vendor/form';
import { REG_URL } from '@/const/regexp';
import { queryAllKolNames } from '@/api/medium';
/** 抽屉逻辑 */

const useDrawer = (ctx: SetupContext) => {
  const project = inject<Ref<ProjectDetail>>('MarketingProject');
  /** 是否可见 */
  const drawerVisible = ref(false);

  /** 开关抽屉 */
  const setDrawerVisible = (visible = false) => {
    drawerVisible.value = visible;
  };

  /** 打开抽屉 */
  const openDrawer = () => setDrawerVisible(true);

  /** 是否编辑模式, 由fillForm触发的为编辑模式(且单一跟单) */
  const editMode = ref(false);
  const drawerTitle = computed(() => (editMode.value ? '编辑跟单' : '新增跟单'));

  const formRef = ref<null | ElForm[]>(null);

  /** 关闭抽屉 */
  const closeDrawer = () => {
    setDrawerVisible();
    resetForm();
    // 关闭编辑模式，切回默认新增模式
    editMode.value = false;
  };

  const kol_name = ref('');

  const kol_list = ref<any[]>([]);

  const onKolChange = (orderIndex: number, val: number) => {
    aeForm.value[orderIndex].kol_id = val;
  };

  const onKolSearch = async (search: string) => {
    if (project?.value === undefined) {
      return;
    }

    const { data: response } = await queryAllKolNames({
      kol_name: search,
    });

    if (response.success) {
      kol_list.value = response.data.map((item: { kol_name: string; kol_id: number }) => ({
        label: item.kol_name,
        value: item.kol_id,
      }));
    }
  };

  const aeForm = ref<AEOrderForm[]>([
    {
      documentary_id: undefined,
      ae_id: undefined,
      kol_id: '',
      kol_name: '',
      price_amount: '',
      cost_amount: '',
      live_date: '',
      is_cost_arrange: 0,
      is_sample_arrange: 0,
      note: '',
      item_list: [],
    },
  ]);

  const resetForm = () => {
    aeForm.value = [
      {
        documentary_id: undefined,
        ae_id: undefined,
        kol_id: '',
        kol_name: '',
        price_amount: '',
        cost_amount: '',
        live_date: '',
        is_cost_arrange: 0,
        is_sample_arrange: 0,
        note: '',
        item_list: [],
      },
    ];
  };

  /** 回填表单 */
  const fillForm = (record: AEOrder) => {
    aeForm.value = [
      {
        documentary_id: record.documentary_id,
        ae_id: record.ae_id,
        kol_id: record.kol_id,
        kol_name: record.kol_name,
        price_amount: `${record.price_amount}`,
        cost_amount: `${record.cost_amount}`,
        live_date: record.live_date,
        is_cost_arrange: record.is_cost_arrange,
        is_sample_arrange: record.is_sample_arrange,
        note: record.note,
        item_list: record.item_list.map(item => ({ ...item })),
      },
    ];

    editMode.value = true;
  };

  const addOrder = () => {
    aeForm.value.push({
      ae_id: undefined,
      kol_id: '',
      kol_name: '',
      price_amount: '',
      cost_amount: '',
      live_date: '',
      is_cost_arrange: 0,
      is_sample_arrange: 0,
      note: '',
      item_list: [],
    });

    addItem(aeForm.value.length - 1);
  };

  const removeOrder = (orderIndex: number) => {
    aeForm.value = aeForm.value.filter((_, index) => index !== orderIndex);

    if (aeForm.value.length < 1) {
      addOrder();
    }

    formRef.value?.forEach(el => {
      el.clearValidate();
    });
  };

  const addItem = (orderIndex: number) => {
    aeForm.value[orderIndex].item_list.push({
      item_name: '',
      item_url: '',
      is_sample_arrange: 0,
    });
  };

  const removeItem = (orderIndex: number, itemIndex: number) => {
    aeForm.value[orderIndex].item_list = aeForm.value[orderIndex].item_list.filter(
      (_, index) => index !== itemIndex,
    );

    formRef.value?.[orderIndex]?.clearValidate(['item_list']);
    if (aeForm.value[orderIndex].item_list.length < 1) {
      addItem(orderIndex);
    }

    formRef.value?.forEach(el => {
      el.clearValidate();
    });
  };

  watch(
    () => drawerVisible.value,
    next => {
      if (next) {
        aeForm.value.forEach((order, orderIndex) => {
          if (order.item_list.length < 1) {
            addItem(orderIndex);
          }
        });

        formRef.value?.forEach(el => {
          el.clearValidate();
        });
      }
    },
  );

  const getPayload = () => {
    let flag = true;
    const payloadList: AEOrderSaveParams[] = [];
    aeForm.value.forEach(order => {
      const { kol_id, item_list, ...rest } = order;

      if (kol_id === '' || project?.value === undefined) {
        flag = false;
        return;
      }

      const payload: AEOrderSaveParams = {
        kol_id,
        cooperation_id: project?.value?.cooperation_id,
        item_list: item_list.filter(el => el.item_name !== '' && el.item_url !== ''),
        ...rest,
      };

      if (payload.item_list.length === 0) {
        flag = false;
        ctx.root.$message.warning('请填写完整至少一条商品信息');
        return;
      }

      payloadList.push(payload);
    });

    return flag === true ? payloadList : false;
  };

  const formRules = ref({
    kol_id: [
      {
        required: true,
        message: '请输入并选择KOL名称',
        trigger: 'change',
      },
    ],
    price_amount: [
      {
        required: true,
        message: '请输入报价金额',
        trigger: 'blur',
      },
    ],
    is_cost_arrange: [
      {
        required: true,
        message: '请选择成本是否安排',
        trigger: 'blur',
      },
    ],
    item_name: [
      {
        required: true,
        message: '请输入商品名称',
        trigger: 'blur',
      },
    ],
    item_url: [
      {
        required: true,
        message: '请输入商品链接',
        trigger: 'blur',
      },
      {
        validator: (_: any, url: string, callback: ValidateCallback) => {
          if (!REG_URL.test(url)) {
            callback(new Error('请输入合法的链接地址'));
          } else {
            try {
              new URL(url);
              callback();
            } catch {
              callback(new Error('请输入合法的链接地址'));
            }
          }
        },
      },
    ],
  });

  const submitLoading = ref(false);
  const submitSuccess = ref(0);

  const onInputPriceAmount = (orderIndex: number, value: string) => {
    aeForm.value[orderIndex].price_amount = getPositiveNumber(value);
  };

  const onInputCostAmount = (orderIndex: number, value: string) => {
    aeForm.value[orderIndex].cost_amount = getPositiveNumber(value);
  };

  const onSubmit = async () => {
    const list: Promise<boolean>[] = [];

    formRef.value?.forEach(el => {
      list.push(
        new Promise<boolean>(resolve => {
          el?.validate(valid => {
            resolve(valid);
          });
        }),
      );
    });

    const result = await Promise.all(list);

    if (result.includes(false)) {
      console.warn('校验不通过');
      return;
    }

    const payload = getPayload();

    if (payload === false) {
      console.warn('参数不合格');
      return;
    }

    submitLoading.value = true;
    const [{ data: response }] = await Promise.all([
      editMode.value ? await UpdateDocumentary(payload[0]) : await SaveAEOrder(payload),
      await sleep(500),
    ]);
    submitLoading.value = false;

    if (response.success) {
      ctx.root.$message.success(response.message ?? '保存成功');
      submitSuccess.value++;
      closeDrawer();
    } else {
      ctx.root.$message.error(response.message ?? '保存失败');
    }
  };

  const shop_name = computed(() => project?.value?.shop_name ?? '--');
  const manager_name = computed(() => project?.value?.manager_name ?? '--');
  const company_name = computed(() => project?.value?.company_name ?? '--');

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    drawerTitle,
    kol_name,
    kol_list,
    onKolChange,
    onKolSearch,
    aeForm,
    fillForm,
    addOrder,
    removeOrder,
    formRef,
    formRules,
    addItem,
    removeItem,
    onSubmit,
    submitLoading,
    submitSuccess,
    resetForm,
    shop_name,
    manager_name,
    company_name,
    editMode,
    onInputPriceAmount,
    onInputCostAmount,
  };
};

export default useDrawer;
