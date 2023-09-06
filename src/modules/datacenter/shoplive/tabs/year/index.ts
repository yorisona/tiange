/**
 * 年分析
 */
import { defineComponent, ref } from '@vue/composition-api';
import analyseIndex from '@/modules/datacenter/shoplive/components/analyse/index.vue';
import moment from 'moment';
import { GetShopLiveProjectGroundList } from '@/services/datacenter/shoplive';

export default defineComponent({
  components: {
    analyseIndex,
  },
  setup(props, ctx) {
    const week_date = ref(moment());
    const week_date_str = ref('');
    const project_ground_name = ref('品牌中心');
    const dateFormatStr = 'yyyy-MM-DD';
    week_date_str.value = moment(week_date.value).format(dateFormatStr);
    const project_ground_id = ref<number>(0);
    const project_ground_list = ref<{ id: number | undefined; name: string }[]>([
      {
        id: 0,
        name: '全部',
      },
    ]);
    const business_type = ref(undefined);
    const getProjectGround = () => {
      GetShopLiveProjectGroundList({
        end_date: moment(week_date.value).startOf('year').format(dateFormatStr),
        start_date: moment(week_date.value).endOf('year').format(dateFormatStr),
        business_type: business_type.value,
      }).then(({ data }) => {
        if (data.success) {
          project_ground_list.value = data.data.data;
          project_ground_list.value.unshift({
            id: 0,
            name: '全部',
          });
          const find = project_ground_list.value.find(item => item.id === project_ground_id.value);
          project_ground_id.value = find ? project_ground_id.value : 0;
        }
        week_date_str.value = moment(week_date.value).format(dateFormatStr);
      });
    };
    getProjectGround();
    const selectDateChange = (val: any) => {
      if (val) {
        getProjectGround();
      } else {
        week_date_str.value = '';
        project_ground_id.value = 0;
      }
    };
    const selectGround = (val: any) => {
      if (val === 0) {
        project_ground_name.value = '品牌中心';
      }
      const obj = project_ground_list.value.find((item: any) => {
        return item.id === val;
      });
      project_ground_name.value = obj ? obj.name : '品牌中心';
    };

    return {
      selectGround,
      selectDateChange,
      week_date,
      week_date_str,
      project_ground_list,
      project_ground_id,
      project_ground_name,
      business_type,
      projectTypeOptions: E.project.ProjectTypeOption.filter(item => item.value !== 5),
    };
  },
  mounted() {
    this.onRefresh();
  },
  methods: {
    onRefresh() {
      const container: any = document.getElementsByClassName('tg-datacenter-shoplive');
      container[0].scrollTop = 0;
      container[0].scrollLeft = 0;
    },
  },
});
