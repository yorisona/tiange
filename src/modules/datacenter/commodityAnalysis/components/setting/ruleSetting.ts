import { defineComponent, ref } from '@vue/composition-api';
import { sleep, wait } from '@/utils/func';
import { SaveCommoditySettingRule, GetCommoditySettingRule } from '@/services/datacenter';

export default defineComponent({
  name: 'departmentSetting',
  setup(props, ctx) {
    const saveLoading = ref(false);
    const formData = ref({
      project_id: undefined as number | undefined,
      section_start_num: undefined,
      section_end_num: undefined,
      section_list: [{ chars: undefined, real: undefined }],
      index_num: undefined,
      is_section_distinction: 0,
    });
    // 抛出关闭事件
    const emitClose = (success = false) => {
      ctx.emit('close');
      ctx.emit('update:visible', false);
      ctx.emit('dialog:close', success);
    };
    const upDataLoading = ref(false);
    const updateParams = async () => {
      upDataLoading.value = true;
      const [{ data: response }] = await wait(
        500,
        GetCommoditySettingRule(
          { project_id: Number(formData.value.project_id || 0) },
          selectIndex.value,
        ),
      );
      upDataLoading.value = false;
      if (response.success && response.data) {
        formData.value = {
          project_id: Number(formData.value.project_id || 0) || undefined,
          section_start_num: response.data.section ? response.data.section.start_index : undefined,
          section_end_num: response.data.section ? response.data.section.end_index : undefined,
          section_list:
            response.data.section && response.data.section.data.length > 0
              ? response.data.section.data
              : [{ chars: undefined, real: undefined }],
          index_num:
            selectIndex.value === 2
              ? response.data.real_sn
              : selectIndex.value === 3
              ? response.data.no_section
              : response.data.real_sn,
          is_section_distinction:
            selectIndex.value === 3 &&
            response.data.section &&
            response.data.section.data.length > 0
              ? 1
              : 0,
        };
      }
    };
    const selectIndex = ref(2);
    // 提交form
    const handleDialogSubmit = async () => {
      if (formData.value.is_section_distinction === 0 && !formData.value.index_num) {
        ctx.root.$message.warning(
          selectIndex.value === 2
            ? '请完善款数判定规则设置！'
            : selectIndex.value === 3
            ? '请完善款别判断规则设置！'
            : '请完善竞店款号抓取规则设置！',
        );
        return;
      }
      if (
        formData.value.is_section_distinction === 1 &&
        !Number(formData.value.section_start_num) &&
        !Number(formData.value.section_start_num || 0)
      ) {
        ctx.root.$message.warning('请完善款别判断规则设置！');
        return;
      }
      if (selectIndex.value !== 3 && !Number(formData.value.index_num)) {
        ctx.root.$message.warning('请填写有效数字！');
        return;
      }
      const find_section = formData.value.section_list.find(item => !item.chars || !item.real);
      if (formData.value.is_section_distinction === 1 && find_section) {
        ctx.root.$message.warning('请完善款别判断规则设置！');
        return;
      }
      const payload: any = {
        project_id: formData.value.project_id,
        section:
          formData.value.is_section_distinction === 1 && selectIndex.value === 3
            ? {
                start_index: formData.value.section_start_num,
                end_index: formData.value.section_end_num || undefined,
                data: formData.value.section_list,
              }
            : undefined,
        no_section:
          formData.value.is_section_distinction === 0 && selectIndex.value === 3
            ? formData.value.index_num
            : '',
        real_sn:
          formData.value.is_section_distinction === 0 && selectIndex.value === 2
            ? formData.value.index_num
            : '',
        competitive:
          formData.value.is_section_distinction === 0 && selectIndex.value === 4
            ? formData.value.index_num
            : '',
      };
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveCommoditySettingRule(payload, selectIndex.value),
        await sleep(200),
      ]);
      saveLoading.value = false;
      if (response.success) {
        ctx.root.$message.success(response.message ?? '保存成功');
        emitClose();
      } else {
        ctx.root.$message.error(response.message ?? '保存失败');
      }
    };
    const onAddSection = () => {
      formData.value.section_list.push({ chars: undefined, real: undefined });
    };
    const onDeleteSection = (index: number) => {
      formData.value.section_list.splice(index, 1);
    };
    return {
      upDataLoading,
      selectIndex,
      updateParams,
      onAddSection,
      onDeleteSection,
      formData,
      handleDialogSubmit,
      emitClose,
      saveLoading,
      visible: false,
    };
  },
  methods: {
    // 提供给父组件使用，勿删
    show(project_id: number, index: number) {
      this.visible = true;
      this.selectIndex = index;
      this.formData.project_id = project_id;
      this.updateParams();
      this.$nextTick(() => {});
    },
  },
});
