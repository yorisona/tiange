/**
 * 营销业务 - 项目详情 - tab 业绩登记表 - 抽屉(业绩登记)
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-10 14:36:52
 */
import { computed, inject, Ref, ref, watch } from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import type { ElForm } from 'element-ui/types/form';
import type {
  Achievement,
  AchievementForm,
  AchievementSaveParams,
} from '@/types/tiange/marketing/achievement';
import { CertificateUpdateType } from '@/types/tiange/marketing/achievement';
import { getPositiveNumber } from '@/utils/string';
import { UploadCertificate } from '@/services/common/other';
import { SaveAchievement } from '@/services/marketing/achievement';
import { sleep } from '@/utils/func';
import type { MarketingProjectDetail as ProjectDetail } from '@/types/tiange/marketing/project';
import { GetContractUid } from '@/services/contract';
import type { OptionType } from '@/types/base/advanced';
import { GatherTypes } from '@/const/options';
import { ValidateCallback } from '@/types/vendor/form';
import { REG_POSITIVE_NUMBER_STRICT } from '@/const/regexp';

/** 抽屉逻辑 */
const useDrawer = (ctx: SetupContext) => {
  /** 是否可见 */
  const drawerVisible = ref(false);

  /** 开关抽屉 */
  const setDrawerVisible = (visible = false) => {
    drawerVisible.value = visible;
  };

  /** 打开抽屉 */
  const openDrawer = () => setDrawerVisible(true);

  const formRef = ref<null | ElForm>(null);
  const form = ref<AchievementForm>({
    achievement_name: '',
    gather_type: 1,
    contract_id: '',
    gather_amount: '',
    gather_way: 1,
    task_id: '',
    order_wangwang_id: '',
    order_date: '',
    is_invoice: 1,
    gather_certificate_pic: '',
    pay_company_name: '',
    achievement_id: undefined,
    cooperation_id: '',
  });

  const drawerTitle = computed(() =>
    form.value.achievement_id === undefined ? '登记业绩' : '编辑业绩',
  );

  const project = inject<Ref<ProjectDetail>>('MarketingProject');

  watch(
    () => project?.value,
    next => {
      if (next !== undefined) {
        form.value.cooperation_id = next.cooperation_id;
        form.value.contract_id = next.contract_id;
      }
    },
  );

  watch(
    () => drawerVisible.value,
    next => {
      if (next) {
        formRef.value?.clearValidate();
      }
    },
  );

  const resetForm = () => {
    form.value.achievement_name = '';
    form.value.gather_type = 1;
    form.value.gather_amount = '';
    form.value.gather_way = 1;
    form.value.task_id = '';
    form.value.order_wangwang_id = '';
    form.value.order_date = '';
    form.value.is_invoice = 1;
    form.value.gather_certificate_pic = '';
    form.value.pay_company_name = '';
    form.value.achievement_id = undefined;

    if (project?.value !== undefined) {
      form.value.cooperation_id = project.value.cooperation_id;
      form.value.contract_id = project.value.contract_id;
    } else {
      form.value.cooperation_id = '';
      form.value.contract_id = '';
    }

    contract_uid.value = '';
  };

  /** 回填数据 */
  const fillForm = (record: Achievement) => {
    form.value.achievement_id = record.achievement_id;
    form.value.achievement_name = record.achievement_name;
    form.value.gather_type = record.gather_type ?? GatherTypes.ServiceCharge;
    form.value.gather_amount = `${record.gather_amount}`;
    form.value.gather_way = record.gather_way;
    form.value.task_id = record.gather_way_detail.task_id;
    form.value.order_wangwang_id = record.gather_way_detail.order_wangwang_id;
    form.value.order_date = record.gather_way_detail.order_date;
    form.value.is_invoice = record.is_invoice;
    form.value.gather_certificate_pic = record.gather_certificate_pic;
    form.value.pay_company_name = record.gather_way_detail.pay_company_name;
    form.value.achievement_id = record.achievement_id;

    form.value.contract_id = record.contract_id ?? '';

    contract_uid.value = record.contract_uid ?? '';
  };

  /** 关闭抽屉 */
  const closeDrawer = () => {
    setDrawerVisible();
    resetForm();
  };

  watch(
    () => form.value.gather_way,
    (next, prev) => {
      if (next !== prev) {
        formRef.value?.clearValidate([
          'task_id',
          'order_wangwang_id',
          'order_date',
          'pay_company_name',
        ]);
      }
    },
  );

  const formRules = ref({
    achievement_name: [
      {
        required: true,
        message: '请输入业绩名称',
        trigger: 'blur',
      },
    ],
    gather_type: [
      {
        required: true,
        message: '请选择收款类型',
        trigger: 'blur',
      },
    ],
    gather_amount: [
      {
        required: true,
        message: '请输入收款金额',
        trigger: 'blur',
      },
      {
        validator: (_: any, value: string, callback: ValidateCallback) => {
          const result = REG_POSITIVE_NUMBER_STRICT.exec(value);

          if (result === null) {
            callback(new Error('请输入正数'));
          } else {
            callback();
          }
        },
        trigger: 'blur',
      },
    ],
    gather_way: [
      {
        required: true,
        message: '请选择收款方式',
        trigger: 'blur',
      },
    ],
    task_id: [
      {
        required: true,
        message: '请输入V任务ID',
        trigger: 'blur',
      },
    ],
    order_wangwang_id: [
      {
        required: true,
        message: '清输入下单旺旺名',
        trigger: 'blur',
      },
    ],
    order_date: [
      {
        required: true,
        message: '请选择接单日期',
        trigger: 'blur',
      },
    ],
    pay_company_name: [
      {
        required: true,
        message: '请输入打款公司',
        trigger: 'blur',
      },
    ],
    is_invoice: [
      {
        required: true,
        message: '请选择是否开票',
        trigger: 'blur',
      },
    ],
  });

  // 输入金额
  const onInputGatherAmount = (val: string) => {
    form.value.gather_amount = getPositiveNumber(val);
  };

  const contract_uid = ref('');

  const contract_list = ref<OptionType[]>([]);

  const onContractChange = (val: number) => {
    form.value.contract_id = val;
  };

  const onContractSearch = async (search: string) => {
    if (project?.value === undefined) {
      return;
    }

    const { data: response } = await GetContractUid({
      partner_type: 1,
      contract_status: 2,
      project_type: 2,
      search,
    });

    if (response.success) {
      contract_list.value = response.data.data.map(data => ({
        label: data.contract_uid,
        value: data.contract_id,
      }));
    }
  };

  // 附件上传
  const uploadAttachmenFile = async (value: { file: File; filename: string }) => {
    const formData = new FormData();
    formData.append('file', value.file, value.file.name);
    formData.append('type', CertificateUpdateType.AchievementGatherCertificate);

    const res = await UploadCertificate(formData);
    const { data: response } = res;
    if (response.success) {
      form.value.gather_certificate_pic = response.data.source;
    } else {
      ctx.root.$message.error(response.message);
    }

    return res;
  };

  const onPicRemove = () => {
    form.value.gather_certificate_pic = '';
  };

  const submitSuccess = ref(0);
  const submitLoading = ref(false);

  const onSubmit = async () => {
    const result = await new Promise(resolve => {
      formRef.value?.validate(valid => {
        resolve(valid);
      });
    });

    if (!result) {
      return;
    }

    const { achievement_id, contract_id, ...rest } = form.value;

    if (project?.value?.cooperation_id === undefined) {
      return;
    }

    const payload: AchievementSaveParams = {
      ...rest,
      contract_id: contract_id === '' ? undefined : contract_id,
      cooperation_id: project?.value?.cooperation_id,
    };

    submitLoading.value = true;
    console.log(payload, 'ppp');

    const [{ data: response }] = await Promise.all([
      await SaveAchievement(
        achievement_id !== undefined ? { ...payload, achievement_id } : payload,
      ),
      await sleep(500),
    ]);
    submitLoading.value = false;
    if (response.success) {
      ctx.root.$message.success('登记业绩成功');
      closeDrawer();
      submitSuccess.value++;
    } else {
      ctx.root.$message.error(response.message ?? '登记业绩失败');
    }
  };

  const shop_name = computed(() => project?.value?.shop_name ?? '--');
  const manager_name = computed(() => project?.value?.manager_name ?? '--');
  const company_name = computed(() => project?.value?.company_name ?? '--');

  return {
    shop_name,
    manager_name,
    company_name,
    drawerVisible,
    openDrawer,
    closeDrawer,
    archievement_form: form,
    drawerTitle,
    fillForm,
    formRef,
    formRules,
    onInputGatherAmount,
    uploadAttachmenFile,
    onPicRemove,
    onSubmit,
    submitSuccess,
    submitLoading,
    resetForm,
    contract_uid,
    contract_list,
    onContractChange,
    onContractSearch,
  };
};

export default useDrawer;
