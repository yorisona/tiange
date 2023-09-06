import { Studio, StudioForm } from '@/types/tiange/studio';
import { defineComponent, nextTick, PropType, ref, watch } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';

import lodash from '@/utils/lodash/custom';
import { SaveStudio } from '@/services/studio';
import { ElInput } from 'element-ui/types/input';

const { debounce } = lodash;

export default defineComponent({
  name: 'AddStudio',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    studio: {
      type: Object as PropType<Studio>,
      required: false,
    },
  },
  setup(props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const autoFocuseRef = ref<ElInput | undefined>(undefined);

    const formTitle = ref<string>('新增直播间');

    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
      resetForm();
    };

    const studioForm = ref<StudioForm>({
      id: -1,
      business_type: [],
      studio_address: '',
      studio_name: '',
    });

    /** 重置表单 */
    const resetForm = () => {
      studioForm.value.studio_name = '';
      studioForm.value.id = -1;
      studioForm.value.studio_address = '';
      studioForm.value.business_type = [];
    };

    watch(
      () => props.visible,
      newVal => {
        formRef.value?.clearValidate();
        if (newVal) {
          formTitle.value = props.studio === undefined ? '新增直播间' : '编辑直播间';

          if (props.studio !== undefined) {
            studioForm.value.studio_name = props.studio.studio_name;
            studioForm.value.id = props.studio.id;
            studioForm.value.studio_address = props.studio.studio_address;
            studioForm.value.business_type = props.studio.business_type;
          } else {
            nextTick(() => {
              autoFocuseRef.value?.focus();
            });
          }
        }
      },
    );

    const studioFormRules = ref({
      studio_name: [{ required: true, message: '请输入直播间名称', trigger: 'blur' }],
      business_type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
    });

    /** 点击保存 */
    const submit = async () => {
      if (studioForm?.value === undefined) {
        return;
      }
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }

      const payload: StudioForm = {
        studio_name: studioForm.value.studio_name,
        business_type: studioForm.value.business_type,
      };
      if (studioForm?.value.studio_address) {
        payload.studio_address = studioForm.value.studio_address;
      }

      if (studioForm?.value.id !== -1) {
        payload.id = studioForm.value.id;
      }
      const { data: response } = await SaveStudio(payload);

      if (response.success) {
        ctx.root.$message.success(response.message);
        ctx.emit('dialog:close', true);
        resetForm();
      } else {
        ctx.root.$message.error(response.message ?? '直播间保存失败');
      }
    };

    const onSaveBtnClick = debounce(submit, 200);

    return {
      autoFocuseRef,
      formTitle,
      formRef,
      studioFormRules,
      studioForm,
      onSaveBtnClick,
      onCancelBtnClick,
    };
  },
});
