import { defineComponent, ref } from '@vue/composition-api';
import { sleep, wait } from '@/utils/func';
import { SaveCommodityYearSeasonRule, GetCommodityYearSeasonRule } from '@/services/datacenter';

export default defineComponent({
  name: 'yearSeasonSetting',
  setup(props, ctx) {
    const saveLoading = ref(false);
    const formData = ref({
      project_id: undefined as number | undefined,
      year_start_num: undefined,
      year_end_num: undefined,
      year_list: [{ chars: undefined, real: undefined }],
      season_start_num: undefined,
      season_end_num: undefined,
      season_list: [{ chars: undefined, real: undefined }],
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
        GetCommodityYearSeasonRule({ project_id: Number(formData.value.project_id || 0) }),
      );
      upDataLoading.value = false;
      if (response.success && response.data) {
        formData.value = {
          project_id: Number(formData.value.project_id || 0) || undefined,
          year_start_num: response.data.year.start_index || undefined,
          year_end_num: response.data.year.end_index || undefined,
          year_list:
            response.data.year.data.length > 0
              ? response.data.year.data
              : [{ chars: undefined, real: undefined }],
          season_start_num: response.data.season.start_index || undefined,
          season_end_num: response.data.season.end_index || undefined,
          season_list:
            response.data.season.data.length > 0
              ? response.data.season.data
              : [{ chars: undefined, real: undefined }],
        };
      }
    };
    // 提交form
    const handleDialogSubmit = async () => {
      if (!formData.value.year_start_num || !formData.value.season_start_num) {
        ctx.root.$message.warning('请完善年度季节规则设置！');
        return;
      }
      const find_year = formData.value.year_list.find(item => !item.chars || !item.real);
      const find_season = formData.value.season_list.find(item => !item.chars || !item.real);
      if (find_year || find_season) {
        ctx.root.$message.warning('请完善年度季节规则设置！');
        return;
      }
      const payload: any = {
        project_id: formData.value.project_id,
        year: {
          start_index: formData.value.year_start_num,
          end_index: formData.value.year_end_num || undefined,
          data: formData.value.year_list,
        },
        season: {
          start_index: formData.value.season_start_num,
          end_index: formData.value.season_end_num || undefined,
          data: formData.value.season_list,
        },
      };
      saveLoading.value = true;
      const [{ data: response }, _] = await Promise.all([
        await SaveCommodityYearSeasonRule(payload),
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
    const onAddYear = () => {
      formData.value.year_list.push({ chars: undefined, real: undefined });
    };
    const onDeleteYear = (index: number) => {
      formData.value.year_list.splice(index, 1);
    };
    const onAddSeason = () => {
      formData.value.season_list.push({ chars: undefined, real: undefined });
    };
    const onDeleteSeason = (index: number) => {
      formData.value.season_list.splice(index, 1);
    };
    return {
      upDataLoading,
      updateParams,
      onAddSeason,
      onDeleteSeason,
      onAddYear,
      formData,
      onDeleteYear,
      handleDialogSubmit,
      emitClose,
      saveLoading,
      visible: false,
    };
  },
  methods: {
    // 提供给父组件使用，勿删
    show(project_id: number) {
      this.visible = true;
      this.formData.project_id = project_id;
      this.updateParams();
      this.$nextTick(() => {});
    },
  },
});
