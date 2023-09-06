/*
 * @Brief: 店铺代播-项目管理-项目详情-跟踪事项 弹框
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2020-12-30 18:28:31
 */

import {
  defineComponent,
  nextTick,
  PropType,
  ref,
  Ref,
  SetupContext,
  watch,
} from '@vue/composition-api';
import { TrackMatter, TrackMatterForm } from '@/types/tiange/live';
import { TrackMasterSave } from '@/services/live';
import { ElForm } from 'element-ui/types/form';
import { ElInput } from 'element-ui/types/input';

export default defineComponent({
  props: {
    /* 编辑事项，编辑时候传 */
    track_master_obj: {
      type: Object as PropType<TrackMatter>,
    },
    /* 项目id，新增时候传 */
    project_id: {
      type: Number,
      default: undefined,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    return { ...eventData(ctx, props) };
  },
});

function eventData(ctx: SetupContext, props: any) {
  const saveLoading = ref<boolean>(false);

  const trackingEventRef = ref<ElInput | undefined>(undefined);
  const formRef = ref<ElForm | undefined>(undefined);

  const form = ref<TrackMatterForm>({
    id: undefined,
    track_matter: '',
    expect_complete_date: '',
    is_complete: false,
    complete_date: '',
    project_id: undefined,
  });

  const handleCloseAction = () => {
    ctx.emit('closeAction');
  };
  // 保存按钮点击事件
  const handleSaveAction = () => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        saveTrackMasterRequest(ctx, form, saveLoading);
      }
    });
  };

  const resetForm = () => {
    formRef.value?.clearValidate();
    form.value.id = undefined;
    form.value.track_matter = '';
    form.value.expect_complete_date = '';
    form.value.complete_date = '';
    form.value.project_id = undefined;
    form.value.is_complete = false;
  };

  watch(
    [() => props.visible, () => props.track_master_obj, () => props.project_id],
    ([newVisiable, newTrackMasterObj, newProjectId]) => {
      if (newVisiable) {
        if (!props.track_master_obj) {
          nextTick(() => {
            trackingEventRef.value?.focus();
          });
        }
        resetForm();
        if (newTrackMasterObj) {
          form.value.id = newTrackMasterObj.id;
          form.value.track_matter = newTrackMasterObj.track_matter;
          form.value.expect_complete_date = newTrackMasterObj.expect_complete_date;
          form.value.complete_date = newTrackMasterObj.complete_date;
          form.value.project_id = newTrackMasterObj.project_id;
        } else if (newProjectId) {
          form.value.project_id = newProjectId;
        }
      }
    },
  );

  return {
    form,
    saveLoading,
    handleCloseAction,
    handleSaveAction,
    formRef,
    trackingEventRef,
  };
}
// 保存跟踪事项请求
async function saveTrackMasterRequest(
  ctx: SetupContext,
  form: Ref<TrackMatterForm>,
  saveLoading: Ref<boolean>,
) {
  saveLoading.value = true;
  const res = await TrackMasterSave(form.value);
  saveLoading.value = false;

  if (res.data.success) {
    ctx.emit('succeed');
    ctx.root.$message.success(res.data.message ?? '保存成功');
  } else {
    ctx.root.$message.error(res.data.message ?? '保存失败');
  }
}
