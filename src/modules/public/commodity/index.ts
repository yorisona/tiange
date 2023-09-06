import { defineComponent, onBeforeMount, reactive, ref } from '@vue/composition-api';
import getRectHeightData from '@/utils/autoHeight';
import { useList } from './use/list';
import { UserInfo } from '@/types/tiange/system';
import { GetUser } from '@/services/system';
import { CommodityQueryParams } from '@/types/tiange/public';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import EditCommodity from '@/modules/public/commodity/dialog/editCommodity.vue';
import targetRule from './dialog/targetRule.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
export const quarterList = [
  {
    label: '春季',
    value: 1,
  },
  {
    label: '夏季',
    value: 2,
  },
  {
    label: '秋季',
    value: 3,
  },
  {
    label: '冬季',
    value: 4,
  },
];

export default defineComponent({
  name: 'TgPublicCommodity',
  components: {
    EditCommodity,
    targetRule,
  },
  setup(props, ctx) {
    const { tableHeightLogic, onTopCardRectUpdate } = getRectHeightData();
    const canUpdate = HasPermission(RIGHT_CODE.commodity_information_manager_update);
    const queryForm = reactive<CommodityQueryParams>({
      project_name: '',
      item_id: '',
      item_sn: '',
      year: '',
      season: '',
      add_by: '',
      page_num: 1,
      num: 20,
    });
    const userList = ref<UserInfo[]>([]);
    const getUserList = async (search_value: string) => {
      const params = {
        search_type: 2,
        search_value,
        is_checked: 1,
      };
      const { data: response } = await GetUser(params);
      if (response.success) {
        userList.value = response.data.data;
      } else {
        ctx.root.$message({
          type: 'warning',
          message: response.message ?? '查询失败，稍后重试',
          duration: 2000,
          showClose: true,
        });
      }
    };
    const onUserIdChange = (id: number) => {
      queryForm.add_by = id;
    };

    const listLogic = useList(ctx);
    const reload = async (clean = true) => {
      if (clean) {
        queryForm.page_num = 1;
      }
      await listLogic.loadData(queryForm);
    };
    const onQuerySearchClick = () => {
      reload();
    };
    const onQueryResetClick = () => {
      queryForm.project_name = '';
      queryForm.item_id = '';
      queryForm.item_sn = '';
      queryForm.year = '';
      queryForm.season = '';
      queryForm.add_by = '';
      queryForm.page_num = 1;
      queryForm.num = 20;
      reload();
    };
    // 翻页
    const handleCurrentChange = (page_num: number) => {
      queryForm.page_num = page_num;
      reload(false);
    };

    const handlePageSizeChange = (num: number) => {
      queryForm.num = num;
      reload();
    };
    const onSave = () => {
      reload();
    };

    const downloadModelxlsx = () => {
      window.open(
        'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/douyin_goods_template.xlsx',
      );
    };
    const beforeMerchantUpload = (config: any) =>
      ValidationFileUpload({ excel: true, fileSize: 30 })(config);
    const successMerchantUpload = (res: { data: any; success: boolean; message: string }) => {
      if (res && res.success) {
        ctx.root.$message.success(res.message);
        reload(true);
      } else {
        ctx.root.$message.error(res.message);
      }
    };
    onBeforeMount(() => {
      reload();
    });
    const targetRuleRef = ref<any>();

    const showTargetRule = () => {
      targetRuleRef.value?.show();
    };

    return {
      reload,
      queryForm,
      quarterList,
      userList,
      getUserList,
      onUserIdChange,
      onQueryResetClick,
      onQuerySearchClick,
      handleCurrentChange,
      handlePageSizeChange,
      ...listLogic,
      onTopCardRectUpdate,
      ...tableHeightLogic,
      downloadModelxlsx,
      beforeMerchantUpload,
      successMerchantUpload,
      onSave,
      canUpdate,
      showTargetRule,
      targetRuleRef,
    };
  },
});
