/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-22 16:11:51
 */
import { computed, defineComponent, ref, watch } from '@vue/composition-api';
import { useData } from './use/useData';
import dailyDetailList from '../../components/dailyDetailList/index.vue';
import SelectDate from '@/modules/datacenter/components/selectDate/index.vue';
import { getToken } from '@/utils/token';
import moment from 'moment';
import qs from 'query-string';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  name: 'projectDaily',
  components: {
    dailyDetailList,
    SelectDate,
  },
  props: {
    projectId: {
      type: Number,
      default: 0,
    },
    analyseType: {
      type: String,
      default: 'date',
    },
    selectDate: {
      type: moment,
      default: '',
    },
    is_from_project: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const dateFormat = 'yyyy-MM-DD';
    const router = useRouter();
    const { isFromLocalLife, isFromLive, isFromSupplyChain } = useProjectBaseInfo();
    const is_new_from_project = computed(() =>
      isFromLocalLife.value || isFromLive.value || isFromSupplyChain.value
        ? true
        : props.is_from_project || router.currentRoute.params.is_from_project === '1' || false,
    );
    let start_time = '';
    let end_time = '';
    if (props.analyseType === 'week') {
      start_time = props.selectDate.startOf('w').format(dateFormat);
      end_time = props.selectDate.endOf('w').format(dateFormat);
    }
    if (props.analyseType === 'date') {
      start_time = props.selectDate.format(dateFormat);
      end_time = start_time;
    }
    if (props.analyseType === 'month') {
      start_time = props.selectDate.startOf('M').format(dateFormat);
      end_time = props.selectDate.endOf('M').format(dateFormat);
    }
    const dataLogic = useData(
      ctx,
      props.projectId,
      start_time,
      end_time,
      is_new_from_project.value,
    );
    watch(
      () => [props.analyseType, props.selectDate, props.projectId],
      () => {
        if (props.analyseType === 'week') {
          start_time = props.selectDate.startOf('w').format(dateFormat);
          end_time = props.selectDate.endOf('w').format(dateFormat);
        }
        if (props.analyseType === 'date') {
          start_time = props.selectDate.format(dateFormat);
          end_time = start_time;
        }
        if (props.analyseType === 'month') {
          start_time = props.selectDate.startOf('M').format(dateFormat);
          end_time = props.selectDate.endOf('M').format(dateFormat);
        }
        dataLogic.queryForm.value.project_id = props.projectId || 0;
        dataLogic.queryForm.value.start_date = start_time;
        dataLogic.queryForm.value.end_date = end_time;
        refrashData();
      },
    );
    const day_arr = ref<any[]>([]);
    const refrashData = () => {
      const select_currentDate = moment(props.selectDate);
      const select_str = props.analyseType === 'week' ? 'w' : 'M';
      if (props.analyseType === 'month') {
        const arr: any = ref([]);
        const end_day = select_currentDate.endOf(select_str).format('DD');
        for (let i = 1; i <= Number(end_day); i++) {
          arr.value.push(i + '日');
        }
        day_arr.value = arr.value;
      } else if (props.analyseType === 'week') {
        day_arr.value = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      } else {
        day_arr.value = [moment(props.selectDate).format('MM-DD')];
      }
    };
    refrashData();
    /* 每日明细导出 */
    const onExport = () => {
      const _paramsstr = qs.stringify(dataLogic.queryForm.value);
      const token = getToken();
      window.open(
        `${
          process.env.VUE_APP_BASE_API
        }/api/shop_live/project_data/export_project_statistics_detail${
          isFromSupplyChain.value ? '/supply_chain' : isFromLocalLife.value ? 'local_life' : ''
        }?${_paramsstr}&Authorization=${token}`,
      );
    };
    return {
      day_arr,
      // selectDate,
      ...dataLogic,
      onExport,
    };
  },
  mounted() {
    this.onRefresh();
  },
  methods: {
    onRefresh() {
      const container: any = document.getElementsByClassName('data-field');
      container[0].scrollTop = 0;
      container[0].scrollLeft = 0;
    },
  },
  render() {
    return (
      <div class="tg-datacenter-shoplive-daily-detail" style="height: calc(100% - 0px);">
        {/* <section class="filter-field">
          <div style="display: flex">
            <select-date
              style="width: 402px"
              on-selectDate={this.selectDate}
              isMonthWeek={true}
            ></select-date>
          </div>
        </section>*/}
        {this.$slots.default ? (
          this.$slots.default
        ) : (
          <div class="pdr-18 mgt-12" style="display: flex">
            <tg-button style="margin-left: auto;" onClick={this.onExport}>
              导出明细
            </tg-button>
          </div>
        )}
        <section class="data-field">
          <div>
            <div class="projects-data" v-loading={this.loading}>
              <dailyDetailList
                v-loading={this.loading}
                data={this.projectsData}
                day_arr={this.day_arr}
                is_total={true}
                on-selectChanged={this.onSelectChanged}
                on-refresh={() => {
                  this.queryDepartmentStatisticsDetail(false);
                }}
              ></dailyDetailList>
            </div>
          </div>
        </section>
      </div>
    );
  },
});
