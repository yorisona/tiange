import lodash from '@/utils/lodash/custom';
import { SaveMarketingProjectConfirmEnd } from '@/services/marketing.project';
import {
  MarketingProjectConfirmEndForm,
  MarketingProjectDetail,
  MarketingProjectTerminateTypeEnum,
} from '@/types/tiange/marketing/project';
import { sleep } from '@/utils/func';
import { computed, defineComponent, inject, ref, Ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';

const { debounce } = lodash;

export default defineComponent({
  name: 'TgMarketingProjectExecuteFinishDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);

    const formRules = ref({
      end_type: [{ required: true, message: '请选择执行结果', trigger: 'blur' }],
      unexpected_terminate_type: [
        { required: true, message: '请选择终止处理类型', trigger: 'blur' },
      ],
      unexpected_terminate_detail: [{ required: true, message: '请输入处理方案', trigger: 'blur' }],
    });

    const project =
      inject<Ref<MarketingProjectDetail>>('MarketingProject') ?? ref<MarketingProjectDetail>();

    const ProjectInfo = computed(() => {
      return project.value;
    });

    const ProjectConfirmForm = ref<MarketingProjectConfirmEndForm>({
      cooperation_id: ProjectInfo.value?.cooperation_id ?? -1,
      end_type: 1,
      unexpected_terminate_type: 1,
      unexpected_terminate_detail: '',
      is_update: 0,
    });

    watch(
      () => props.visible,
      newVal => {
        if (newVal) {
          resetForm();
          formRef.value?.resetFields();

          ProjectConfirmForm.value.cooperation_id = ProjectInfo.value?.cooperation_id ?? -1;
        }
      },
    );

    /** 重置表单 */
    const resetForm = () => {
      ProjectConfirmForm.value.end_type = 1;
      ProjectConfirmForm.value.unexpected_terminate_type = 1;
      ProjectConfirmForm.value.unexpected_terminate_detail = '';
      ProjectConfirmForm.value.is_update = 0;
    };

    const onCloseBtnClick = () => {
      ctx.emit('dialog:close');
    };

    const saveLoading = ref(false);

    const submit = async () => {
      if (saveLoading.value) {
        return;
      }
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }

      const payload: MarketingProjectConfirmEndForm = {
        cooperation_id: ProjectConfirmForm.value.cooperation_id,
        end_type: ProjectConfirmForm.value.end_type,
        unexpected_terminate_type: ProjectConfirmForm.value.unexpected_terminate_type,
        is_update: ProjectConfirmForm.value.is_update,
      };
      if (
        ProjectConfirmForm.value.unexpected_terminate_type ===
        MarketingProjectTerminateTypeEnum.other
      ) {
        payload.unexpected_terminate_detail = ProjectConfirmForm.value.unexpected_terminate_detail;
      }

      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveMarketingProjectConfirmEnd(payload),
        await sleep(200),
      ]);
      saveLoading.value = false;

      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);

        ctx.root.$store.dispatch('marketing/setProjectInfo', -1);
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    return {
      formRef,
      formRules,
      saveLoading,
      onSaveBtnClick,
      ProjectInfo,
      ProjectConfirmForm,
      onCloseBtnClick,
    };
  },
});
