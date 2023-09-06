import { defineComponent, ref, computed } from '@vue/composition-api';
import DataSwitch from '@/modules/datacenter/components/switch/index.vue';
import SelectDate from '@/modules/datacenter/components/selectDate/index.vue';
import DataCenterList from '@/modules/datacenter/components/list/index.vue';
import DataCenterChart from './chart/index.vue';
import RelatedProject from '@/modules/datacenter/components/relatedProject/index.vue';
import { GetDataCenterTable, GetMarketingProjectList } from '@/services/datacenter';
import { RouterDataCenter } from '../../../const/router';
import { BusinessType } from '../../../const/common';
import { useRouter } from '@/use/vue-router';
export default defineComponent({
  components: { DataSwitch, DataCenterList, DataCenterChart, SelectDate, RelatedProject },
  setup(props, ctx) {
    const project_id = ref<any>('');
    const project_id_filter = ref<string>('');
    const activeIndex = ref(0);
    const handleCheckTab = (activeItem: number) => {
      activeIndex.value = activeItem;
    };
    const project_list = ref<any[]>([]);
    const project_list_filter = computed(() => {
      return project_list.value.filter(item => {
        if (!project_id_filter.value) return true;
        if (
          item.cooperation_name &&
          item.cooperation_name.indexOf(project_id_filter.value) !== -1
        ) {
          return true;
        }
        if (item.cooperation_uid && item.cooperation_uid.indexOf(project_id_filter.value) !== -1)
          return true;
        return false;
      });
    });
    const list = ref<any>([]);
    const currentDateType = ref<number | null>(null);
    const currentDate = ref<string | null>(null);
    const tableLoading = ref<boolean>(true);

    const selectDate = (dateType: number, dateValue: string) => {
      currentDateType.value = dateType;
      currentDate.value = dateValue;
      tableLoading.value = true;
      GetDataCenterTable({
        business_type: 1,
        the_date: dateValue,
      }).then(res => {
        const data = res.data.data;
        list.value = data ? data.data : [];
        tableLoading.value = false;
      });

      GetMarketingProjectList({
        page_num: 1,
        num: 1000000,
        end_date: dateValue,
      }).then(res => {
        if (res.data.success) {
          project_list.value = res.data.data.data.map((item: any) => {
            item.id = item.cooperation_id;
            item.title =
              item.cooperation_name === null || item.cooperation_name === ''
                ? item.cooperation_uid
                : item.cooperation_name;
            return item;
          });
        }
      });
    };

    const viewDetail = (project: any) => {
      const router = useRouter();
      const { meta } = router.currentRoute;
      ctx.root.$router.push({
        name:
          meta?.activePath === '/datacenter/overview'
            ? RouterDataCenter.dataGeneralizationProject
            : RouterDataCenter.dataMarketProject,
        params: { id: project.id, businessType: '' + BusinessType.Marketing },
        query: {
          dateType: '' + currentDateType.value,
          dateValue: currentDate.value,
          projectName: project.title,
        },
      });
    };
    const onEnterPressSearch = () => {
      project_id_filter.value = project_id.value;
    };

    return {
      activeIndex,
      handleCheckTab,
      selectDate,
      currentDateType,
      list,
      tableLoading,
      project_id,
      viewDetail,
      onEnterPressSearch,
      project_list,
      currentDate,
      project_list_filter,
    };
  },
});
