import { ref, defineComponent, h, onMounted } from '@vue/composition-api';
import layerForm from './components/common/layerForm.vue';
import styleBeforeWords from './components/common/styleBeforeWords.vue';
import {
  GetQueryDouyinReportProjects,
  GetCheckDouyinAccess,
  GetQueryProjectSalesAnalysis,
} from '@/services/datacenter';
import { ProjectStatusEnum } from '@/types/tiange/common';
import { useDialog } from '@/use/dialog';
import yearSeasonRuleSettingDialog from '@/modules/datacenter/commodityAnalysis/components/setting/yearSeasonRuleSetting.vue';
import ruleSettingDialog from '@/modules/datacenter/commodityAnalysis/components/setting/ruleSetting.vue';
import { RouterDataCenter } from '@/const/router';
import { RawLocation } from 'vue-router';
import formatData from '@/utils/formatData';
import moment from 'moment';
import { usePermission } from '@/use/permission';
const { formatPriceFormYuan } = formatData;

type accessType = {
  access_url: string;
  has_access: boolean;
};
export default defineComponent({
  name: '',
  components: {
    layerForm,
    styleBeforeWords,
  },
  setup(props, ctx) {
    const permission = usePermission();

    const select_analysis = ref<number | undefined>(undefined);
    const project_list = ref();
    const project_sale_obj = ref();
    const project_id = ref();
    const project_name = ref('');
    const loading = ref(false);
    /* 商家授权 */
    const accessObj = ref<accessType>({
      access_url: '',
      has_access: true,
    });
    const const_methods = {
      /* 项目查询 */
      queryData() {
        return GetQueryDouyinReportProjects().then((res: any) => {
          project_list.value = res.data.data.projects;
          return res.data.data;
        });
      },
      querySalesData() {
        loading.value = true;
        GetQueryProjectSalesAnalysis({ project_id: Number(project_id.value) }).then((res: any) => {
          project_sale_obj.value = res.data.data || undefined;
          loading.value = false;
        });
      },
    };
    onMounted(() => {
      const_methods.queryData().then(data => {
        if (project_id.value === undefined) {
          project_id.value = data.default.project_id;
          project_name.value = data.default.project_name;
          methods.getAccess();
        }
        const_methods.querySalesData();
      });
    });
    const methods = {
      linkAccess() {
        window.open(accessObj.value.access_url);
      },
      async getAccess() {
        project_list.value.map((item: any) => {
          if (item.project_id === project_id.value) {
            project_name.value = item.project_name;
          }
        });
        const_methods.querySalesData();
        try {
          const {
            data: { data },
          } = await GetCheckDouyinAccess({
            project_id: project_id.value,
          });

          accessObj.value = data;
        } catch (error) {
          console.log(error);
        }
      },
    };
    const gotoAnalysisClick = (index: number) => {
      select_analysis.value = index;
      if (index === 0) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityWeekMonthSalesAnalysis,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, true);
      } else if (index === 1) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityBrandCategoryAnalysis,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, true);
      } else if (index === 2) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityYearSeasonAnalysis,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, true);
      } else if (index === 3) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityAnalysisCompetitive,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, true);
      } else if (index === 4) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityAnalysisMonitor,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, true);
      } else if (index === 5) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityAnalysisPreSale,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, true);
      } else if (index === 6) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityMultiDimensionalAnalysis,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, false);
      } else if (index === 7) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityCollocationMonitoringLive,
          query: {
            project_name: project_name.value,
            project_id: project_id.value,
          },
        };
        jump(jumpParams, false);
      } else if (index === 8) {
        const jumpParams: RawLocation = {
          name: RouterDataCenter.commodityCollocationMonitoringInventory,
          // query: {
          //   project_name: project_name.value,
          //   project_id: project_id.value,
          // },
        };
        jump(jumpParams, false);
      }
    };
    const jump = (payload: RawLocation, newWindow = false) => {
      if (newWindow) {
        const { href } = ctx.root.$router.resolve(payload);
        window.open(href, '_blank');
      } else {
        ctx.root.$router.push(payload);
      }
    };

    const dialogYearSeasonRuleSetting = useDialog({
      component: yearSeasonRuleSettingDialog,
      title: '年度季节规则设置',
      width: '915px',
      footer: false,
    });
    const dialogRuleSetting = useDialog({
      component: ruleSettingDialog,
      title: '规则设置',
      width: '453px',
      footer: false,
    });
    const showRuleSettingClick = (index: number) => {
      if (index === 1) {
        dialogYearSeasonRuleSetting.show(project_id.value);
      } else {
        dialogRuleSetting.update({
          title:
            index === 2
              ? '款数判定规则设置'
              : index === 3
              ? '款别判断规则设置'
              : '竞店款号抓取规则设置',
        });
        dialogRuleSetting.show(project_id.value, index);
      }
    };
    const getUpTime = () => {
      if (project_sale_obj.value && project_sale_obj.value.update_time) {
        return moment(project_sale_obj.value.update_time).format('YYYY.MM.DD HH:mm');
      }

      return '--';
    };
    return {
      getUpTime,
      loading,
      formatPriceFormYuan,
      project_sale_obj,
      showRuleSettingClick,
      gotoAnalysisClick,
      select_analysis,
      project_list,
      project_id,
      ProjectStatusEnum,
      accessObj,
      permission,
      ...methods,
    };
  },
});
