import { defineComponent, reactive, ref } from '@vue/composition-api';
import { GetShopLiveQuerySeasonRules, UpdateDouyinCompetitiveShops } from '@/services/datacenter';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

export default defineComponent({
  setup(props, ctx) {
    const saveLoading = ref<boolean>(false);
    const formRef = ref<ElForm | null>(null);
    const visible = ref(false);
    const show = () => {
      visible.value = true;
      getData();
    };

    const form = reactive<any>({
      id: '',
      rules: [],
    });

    const getData = () => {
      const seasonMap = ['未知', '春季', '夏季', '秋季', '冬季'];
      GetShopLiveQuerySeasonRules().then((res: any) => {
        if (res.data.success) {
          form.rules = res.data.data.map((item: any) => {
            return {
              season_cn: seasonMap[item.season],
              ...item,
            };
          });
        }
      });
    };

    const onClose = () => {
      visible.value = false;
    };

    const onSave = async () => {
      const isValid = await new Promise(resolve => formRef.value?.validate(pass => resolve(pass)));
      if (!isValid) {
        return;
      }
      saveLoading.value = true;
      const res = await UpdateDouyinCompetitiveShops(
        form.rules.map((it: any) => {
          it.date = moment(it.date).format('YYYY-MM-DD');
          return it;
        }),
      );
      saveLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success(res.data.message ?? '修改成功');
        visible.value = false;
      } else {
        ctx.root.$message.error(res.data.message ?? '保存失败，请稍候重试');
      }
    };

    const nowYear = moment().year();
    const disabledDate = (year: 1 | 2, today: Date) => {
      if (year === 1) return today.getFullYear() !== nowYear;
      else return today.getFullYear() <= nowYear;
    };

    const defaultDate = (year: 1 | 2) => {
      if (year === 1) return moment();
      else return moment().add(1, 'y').toDate();
    };

    return {
      form,
      defaultDate,
      formRef,
      show,
      visible,
      saveLoading,
      disabledDate,
      onClose,
      onSave,
    };
  },
});
