/**
 * 周分析
 */
import { defineComponent, ref } from '@vue/composition-api';
import analyseIndex from '@/modules/datacenter/shoplive/components/analyse/index.vue';
import generalIndex from '@/modules/datacenter/shoplive/components/general/index.vue';
import sellIndex from '@/modules/datacenter/shoplive/components/sell/index.vue';
import flowIndex from '@/modules/datacenter/shoplive/components/flow/index.vue';
import crowdIndex from '@/modules/datacenter/shoplive/components/crowd/index.vue';
import changeIndex from '@/modules/datacenter/shoplive/components/change/index.vue';
import putIndex from '@/modules/datacenter/shoplive/components/put/index.vue';
import moment from 'moment';
import { GetShopLiveProjectGroundList } from '@/services/datacenter/shoplive';

export default defineComponent({
  components: {
    analyseIndex,
    generalIndex,
    sellIndex,
    flowIndex,
    crowdIndex,
    changeIndex,
    putIndex,
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const selectIndex = ref(0);
    const switchComponents = [
      generalIndex.name,
      sellIndex.name,
      flowIndex.name,
      crowdIndex.name,
      changeIndex.name,
      putIndex.name,
    ];
    const week_date = ref(moment());
    const week_date_str = ref('');
    const dateFormatStr = 'yyyy-MM-DD';
    week_date_str.value = moment(week_date.value).format(dateFormatStr);
    const currentDate = week_date.value;
    const dateFormat = 'MM月DD日';
    const start_time = ref('');
    const end_time = ref('');
    start_time.value = currentDate.startOf('w').format(dateFormat);
    end_time.value = currentDate.endOf('w').format(dateFormat);
    const selectDateChange = (val: any) => {
      if (val) {
        // const date_str = format(val, 'YYYY-mm-dd');
        const select_currentDate = moment(val);
        const dateFormat = 'MM月DD日';
        start_time.value = select_currentDate.startOf('w').format(dateFormat);
        end_time.value = select_currentDate.endOf('w').format(dateFormat);
        getProjectGround(true);
      } else {
        project_ground_id.value = 0;
        week_date_str.value = '';
      }
    };
    const project_ground_id = ref<number>(0);
    const project_ground_name = ref('品牌中心');
    const project_ground_list = ref<{ id: number | undefined; name: string }[]>([
      {
        id: 0,
        name: '全部',
      },
    ]);
    const business_type = ref(undefined);
    const getProjectGround = (isChangeDate = false) => {
      GetShopLiveProjectGroundList({
        end_date: moment(week_date.value).startOf('week').format(dateFormatStr),
        start_date: moment(week_date.value).endOf('week').format(dateFormatStr),
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
        if (isChangeDate) {
          week_date_str.value = moment(week_date.value).format(dateFormatStr);
        }
      });
    };
    getProjectGround();
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
      week_date_str,
      start_time,
      end_time,
      project_ground_list,
      project_ground_id,
      project_ground_name,
      selectDateChange,
      week_date,
      switchComponents,
      selectIndex,
      saveLoading,
      fixed: false,
      selectFixed: false,
      projectTypeOptions: E.project.ProjectTypeOption.filter(item => item.value !== 5),
      business_type,
    };
  },
  mounted() {
    this.onRefresh();
    window.addEventListener('scroll', this.fixedActiveBtn, true);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.fixedActiveBtn, true);
  },
  methods: {
    fixedActiveBtn(e: any) {
      const scrollTop =
        e.target.scrollTop || document.documentElement.scrollTop || document.body.scrollTop;
      const classname = String(e.target.className || '');
      if (scrollTop === 0 && this.fixed === true) {
        return;
      }
      /*
      if (this.fixed === false && scrollTop === 0) {
        this.selectFixed = false;
        return;
      }*/
      if (
        classname.indexOf('el-table') < 0 &&
        classname.indexOf('main-table') < 0 &&
        classname.indexOf('el-props') < 0
      ) {
        scrollTop >= 760 ? (this.fixed = true) : (this.fixed = false);
        scrollTop >= 760 ? (this.selectFixed = true) : (this.selectFixed = false);
      }
      if (this.fixed === false || scrollTop === 0) {
        this.selectFixed = false;
        return;
      }
    },
    onSwitch(index: number) {
      this.selectIndex = index;
      if (this.fixed) {
        this.$nextTick(() => {
          const container: any = document.getElementsByClassName('week-div');
          container[0].scrollTop = 760;
          container[0].scrollLeft = 0;
        });
      }
    },
    onRefresh() {
      const container: any = document.getElementsByClassName('week-div');
      container[0].scrollTop = 0;
      container[0].scrollLeft = 0;
    },
  },
});
