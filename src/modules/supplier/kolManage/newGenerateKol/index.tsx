import { defineComponent, ref, onMounted, provide, inject } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { saveKol } from '@/api/medium'; // updateKol
import { GetKOLList } from '@/services/kol';
import kolBaseInfo from './kolBaseInfo/index.vue';
import { kolTagList } from '@/const/kolConst';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default defineComponent({
  components: { kolBaseInfo },
  setup(prop, ctx) {
    const detailLoading = ref(false);
    const companyList: any = ref([]);
    const editData: any = ref({});
    const backHandler = () => {
      ctx.root.$router.go(-1);
    };
    const routes = ref<any>([
      {
        name: RouterNameSupplier.list,
        title: '达人管理',
      },
      {
        path: '',
        title: '新增达人',
      },
    ]);
    const loading = ref(false);
    const postKol = async (params: any) => {
      if (editData.value.kol_info && editData.value.kol_info.verify_status === 1) {
        const result = await AsyncConfirm(ctx, '该信息已审核通过，是否确认提交重新进行审核?');
        if (!result) {
          return false;
        }
      }

      loading.value = true;
      const { data } = await saveKol(params);
      loading.value = false;
      if (data.success) {
        ctx.root.$message.success('保存成功');
        ctx.root.$router.push({ name: RouterNameSupplier.list });
      } else {
        ctx.root.$message.warning(data.message);
      }
    };
    const kolTag = ref<any>('');
    provide('kolTag', kolTag);
    const validate = async () => {
      try {
        const platformObj = await (
          ctx.refs.kolBaseInfo as unknown as { validateBase: () => void }
        ).validateBase();
        postKol(Object.assign({ kol_id: editData.value?.kol_info?.kol_id }, platformObj));
      } catch (error) {
        console.error(error);
      }
    };
    const submitHandler = () => {
      validate();
    };
    provide('editData', editData);
    provide('companyList', companyList);
    const getKolDetail = async (id: string) => {
      detailLoading.value = true;
      const { data } = await GetKOLList({ kol_id: id });
      detailLoading.value = false;
      if (data.success) {
        const obj: any = data.data.data;
        const kolData = obj[0];
        kolData.kol_info.kol_tag = kolTagList.find(
          (item: any) => item.value === kolData.kol_info?.kol_tag,
        )?.value;
        const businessType = kolData.kol_info.business_type.length
          ? kolData.kol_info.business_type[0]
          : '';
        if (businessType !== BusinessTypeEnum.marketing && businessType !== BusinessTypeEnum.mcn) {
          kolData.kol_info.business_type = businessType;
        }
        kolData.kol_info.kol_company_id = kolData.kol_info?.kol_company_id || undefined;
        editData.value = kolData;
        kolTag.value = editData.value.kol_info.kol_tag;
      } else {
        ctx.root.$message.warning(data.message);
      }
    };
    onMounted(() => {
      if (ctx.root.$route.params.id) {
        routes.value[1].title = '编辑达人';
        getKolDetail(ctx.root.$route.params.id);
      }
      if (ctx.root.$route.params && ctx.root.$route.params.isFromDetail === '1') {
        routes.value.splice(1, 0, {
          name: RouterNameSupplier.listDetail,
          params: {
            id: ctx.root.$route.params.id + '',
          },
          title: '达人详情',
        });
      }
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes.value);
    });
    return {
      backHandler,
      submitHandler,
      loading,
      editData,
    };
  },
  render() {
    return (
      <div class="player-detail-page flex-auto">
        <kol-base-info ref="kolBaseInfo" v-loading={this.detailLoading} />
        <div class="options">
          <tg-button onClick={this.backHandler} style="margin-right: 12px">
            返回列表
          </tg-button>
          <tg-button class="div-primary-btn" type="primary" onClick={this.submitHandler}>
            提交审核
          </tg-button>
        </div>
      </div>
    );
  },
});
