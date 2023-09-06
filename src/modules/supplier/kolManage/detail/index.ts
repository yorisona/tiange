import { defineComponent, ref, onMounted, computed, inject } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { useRouter } from '@/use/vue-router';
import { useRefTabs } from '@/use/tab';
import { GetKOLList, UpdateKolPlatform } from '@/services/kol';
import { numberMoneyFormat } from '@/utils/formatMoney';
import formatData from '@/utils/formatData';
import { getToken } from '@/utils/token';
import { douyinType } from '@/utils/filter';
import { approvalKol } from '@/api/medium';
import dialogCheck from '../../playerManager/common/dialogCheck/index.vue';
import { KolVerifyStatusEnum, kolTagList } from '@/const/kolConst';
import editTaobao from './modify/taobao/index.vue';
import editDouyin from './modify/douyin/index.vue';
import editKuaishou from './modify/kuaishou/index.vue';
import editXiaohongshu from './modify/xiaohongshu/index.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';

const { tranNumber } = formatData;

const routes = [
  {
    name: RouterNameSupplier.list,
    title: '达人管理',
  },
  {
    path: '',
    title: '达人详情',
  },
];

export default defineComponent({
  components: {
    dialogCheck,
    editTaobao,
    editDouyin,
    editKuaishou,
    editXiaohongshu,
  },
  setup: function (props, ctx) {
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const router = useRouter();
    const defaultTab = ref<string>('');
    const tabItem = ref<any>([]);
    const kol = ref<any>({});
    const kolInfo = ref<any>({});
    const tbInfo = ref<any>({});
    const dyInfo = ref<any>({});
    const xhsInfo = ref<any>({});
    const ksInfo = ref<any>({});
    const isDouyinLiveFull = ref<boolean>(true);
    const isDouyinGrassFull = ref<boolean>(true);
    const isTaobaoInEdit = ref<boolean>(false);
    const isDouyinInEdit = ref<boolean>(false);
    const isXiaohongshuInEdit = ref<boolean>(false);
    const isKuaishouInEdit = ref<boolean>(false);
    const editTaobaoData = ref<any>({});
    const editDouyinData = ref<any>({});
    const editXiaohongshuData = ref<any>({});
    const editKuaishouData = ref<any>({});
    const kolTag = ref<number>(0);
    const canEdit = HasPermission(NEW_RIGHT_CODE.kol_edit_in_detail);
    console.log('=-----', canEdit);
    const tabs = useRefTabs(
      computed(() => {
        const tabList = tabItem.value;
        return tabList;
      }),
      defaultTab,
    );

    const dialogRejectRef = ref<{ show: (...args: any) => void } | null>(null);
    const isApprovalBtnShow = ref<boolean>(false);
    const kolId = router.currentRoute.params.id;

    const getKol = async () => {
      if (kolId) {
        const { data: response } = await GetKOLList({
          kol_id: kolId,
        });
        if (response.success) {
          const res = response.data.data[0];
          kol.value = res;
          kolInfo.value = res.kol_info;
          kolTag.value = res.kol_info.kol_tag;
          if (
            router.currentRoute.path.includes('/approval/') &&
            kolInfo.value?.verify_status === KolVerifyStatusEnum.PENDING
          ) {
            isApprovalBtnShow.value = true;
          }

          if (res.kol_douyin_info) {
            dyInfo.value = res.kol_douyin_info;
            tabItem.value.push({
              label: '抖音',
              value: 'douyin',
            });
            defaultTab.value = 'douyin';
            if (
              dyInfo.value.live_pit_price ||
              dyInfo.value.live_pit_publish_price ||
              dyInfo.value.mix_min_commission_percent ||
              dyInfo.value.pure_min_commission_percent ||
              dyInfo.value.live_special_price ||
              dyInfo.value.live_special_publish_price ||
              dyInfo.value.special_commission_min_percent ||
              dyInfo.value.avg_sales_amount
            ) {
              isDouyinLiveFull.value = true;
            } else {
              isDouyinLiveFull.value = false;
            }
            if (
              dyInfo.value.video_1_20_star_map_price ||
              dyInfo.value.video_21_60_star_map_price ||
              dyInfo.value.video_gt_60_star_map_price ||
              dyInfo.value.shopcart_without_fee_price ||
              dyInfo.value.shopcart_min_commission_percent
            ) {
              isDouyinGrassFull.value = true;
            } else {
              isDouyinGrassFull.value = false;
            }
            editDouyinData.value = res.kol_douyin_info;
          }

          if (res.star_info) {
            tbInfo.value = res.star_info;
            tabItem.value.push({
              label: '淘宝',
              value: 'taobao',
            });
            if (defaultTab.value === '') {
              defaultTab.value = 'taobao';
            }
            editTaobaoData.value = res.star_info;
          }

          if (res.kol_xhs_info) {
            xhsInfo.value = res.kol_xhs_info;
            tabItem.value.push({
              label: '小红书',
              value: 'xhs',
            });
            if (defaultTab.value === '') {
              defaultTab.value = 'xhs';
            }
            editXiaohongshuData.value = res.kol_xhs_info;
          }

          if (res.kol_kuaishou_info) {
            ksInfo.value = res.kol_kuaishou_info;
            tabItem.value.push({
              label: '快手',
              value: 'kuaishou',
            });
            if (defaultTab.value === '') {
              defaultTab.value = 'kuaishou';
            }
            editKuaishouData.value = res.kol_kuaishou_info;
          }
        }
      }
    };

    const kolTagFun = (type: number) => {
      return kolTagList.find((item: any) => item.value === type)?.label || '--';
    };

    const clickEditButtonHandle = (tab: string) => {
      switch (tab) {
        case 'tb':
          isTaobaoInEdit.value = true;
          break;
        case 'douyin':
          isDouyinInEdit.value = true;
          break;
        case 'xhs':
          isXiaohongshuInEdit.value = true;
          break;
        case 'kuaishou':
          isKuaishouInEdit.value = true;
          break;
      }
    };

    const closeEditForm = (tab: string) => {
      switch (tab) {
        case 'tb':
          isTaobaoInEdit.value = false;
          break;
        case 'douyin':
          isDouyinInEdit.value = false;
          break;
        case 'xhs':
          isXiaohongshuInEdit.value = false;
          break;
        case 'kuaishou':
          isKuaishouInEdit.value = false;
          break;
      }
    };

    const submitEditForm = async (tab: string, data: any) => {
      const params = {};
      switch (tab) {
        case 'tb':
          Object.assign(params, { tb: data });
          break;
        case 'douyin':
          Object.assign(params, { douyin: data });
          break;
        case 'xhs':
          Object.assign(params, { xhs: data });
          break;
        case 'kuaishou':
          Object.assign(params, { kuaishou: data });
          break;
      }
      const { data: response } = await UpdateKolPlatform(params);
      if (response.success) {
        ctx.root.$message.success('保存成功');
        closeEditForm(tab);
        getKol();
      } else {
        ctx.root.$message.warning(response.message);
      }
    };

    const businessTypeFun = (list: number[]) => {
      const businessList: string[] = [];
      (list || []).map(item => {
        if (item === 1) {
          businessList.push('整合营销');
        } else if (item === 2) {
          businessList.push('淘宝店播');
        } else if (item === 3) {
          businessList.push('抖音店播');
        } else if (item === 5) {
          businessList.push('创新项目');
        } else if (item === 6) {
          businessList.push('区域店播');
        } else if (item === 7) {
          businessList.push('本地生活');
        } else if (item === 8) {
          businessList.push('淘宝甄选');
        } else {
          businessList.push('--');
        }
      });
      return businessList;
    };

    const caseFunarr = (link: string) => {
      if (link) {
        const caseArr = link.split(',');
        return caseArr;
      } else {
        return [];
      }
    };

    const dyTypeList = (douyin_type: string) => {
      if (douyin_type) {
        const list = douyin_type.split(',').map(item => {
          return douyinType(item);
        });
        return list;
      } else {
        return [];
      }
    };

    // 擅长领域相关操作
    const goodAction = ref<boolean>(false);
    const handleGoodAction = () => {
      goodAction.value = !goodAction.value;
    };

    // 合作品牌相关操作
    const brandAction = ref<boolean>(false);
    const handleBrandAction = () => {
      brandAction.value = !brandAction.value;
    };

    const rejectKol = async (props: any) => {
      const reason: string = props?.verify_message || '';
      const data = {
        kol_id: kolId,
        status: KolVerifyStatusEnum.NOT_APPROVED,
        reason: reason,
      };
      approvalKol(data).then(res => {
        if (res.data.success) {
          ctx.root.$router.push({
            name: RouterNameSupplier.list,
          });
        } else {
          ctx.root.$message(res.data.message);
        }
      });
    };

    const approveKol = (kol_id: bigint) => {
      ctx.root
        .$confirm('是否确认审核通过？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
        .then(() => {
          const data = {
            kol_id: kol_id,
            status: KolVerifyStatusEnum.APPROVED,
          };
          approvalKol(data).then(res => {
            if (res.data.success) {
              ctx.root.$router.push({
                name: RouterNameSupplier.list,
              });
            } else {
              ctx.root.$message.error(res.data.message ?? '审核失败！');
              // ctx.root.$message(res.data.message);
            }
          });
        });
    };

    const showRejectDialog = () => {
      dialogRejectRef.value?.show();
    };

    const handleEditClick = () => {
      ctx.root.$router.push({
        name: RouterNameSupplier.generateEdit,
        params: {
          id: kolInfo.value.kol_id + '',
          isFromDetail: '1',
        },
      });
    };

    onMounted(() => {
      getKol();
    });

    return {
      caseFunarr,
      kol,
      kolInfo,
      tbInfo,
      dyInfo,
      xhsInfo,
      ksInfo,
      ...tabs,
      defaultTab,
      goodAction,
      handleGoodAction,
      brandAction,
      handleBrandAction,
      kolTagFun,
      businessTypeFun,
      numberMoneyFormat,
      getToken,
      tranNumber,
      dyTypeList,
      rejectKol,
      approveKol,
      dialogRejectRef,
      isApprovalBtnShow,
      showRejectDialog,
      isDouyinLiveFull,
      isDouyinGrassFull,
      isTaobaoInEdit,
      isDouyinInEdit,
      isXiaohongshuInEdit,
      isKuaishouInEdit,
      clickEditButtonHandle,
      editTaobaoData,
      editDouyinData,
      editXiaohongshuData,
      editKuaishouData,
      closeEditForm,
      submitEditForm,
      kolTag,
      canEdit,
      handleEditClick,
    };
  },
});
