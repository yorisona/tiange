import { ref, defineComponent, h, provide, computed, watch, inject } from '@vue/composition-api';
import { DisplayDataType, DateRangeType, seachTpye, Data_list } from './use/useData';
import sessions from '../../components/sessions/index.vue';
import commodity from '../../components/commodity/index.vue';
import launchnchor from '../../components/launchnchor/index.vue'; //开播主播人数
import flow from '../../components/performance/flow/index.vue'; //自然流量
import fans from '../../components/performance/crowd/index.vue'; //粉丝
import launch from '../../components/performance/put/index.vue'; //投放
import { useRouter } from '@/use/vue-router';
import { formatAmount } from '@/utils/string';
import { numberFormat } from '@/utils/formatMoney';
import { useRefTabs } from '@/use/tab';
import BaseEcharts from '@/modules/datacenter/components/baseEcharts/chart.vue';
import moment from 'moment';
import {
  GetProjectOverview,
  GetLiveRoomOverview,
  GetLastUpdateTime,
  GetTabOverview,
} from '@/services/datacenter/shoplive';
import LineEcharts from './LineEcharts';
import projectDaily from '@/modules/datacenter/shoplive/tabs/projectDailyDetail/index.vue';
import { RouterDataCenter, RouterNameProjectManage } from '@/const/router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export default defineComponent({
  components: {
    sessions,
    commodity,
    launchnchor,
    BaseEcharts,
    LineEcharts,
    projectDaily,
    flow,
    fans,
    launch,
  },
  props: {
    is_from_project: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const { isFromLocalLife, isFromLiveDouyin, isFromLive, isFromSupplyChain } =
      useProjectBaseInfo();
    const is_new_from_project = computed(() =>
      isFromLocalLife.value || isFromLive.value || isFromSupplyChain.value
        ? true
        : props.is_from_project || router.currentRoute.params.is_from_project === '1' || false,
    );
    /** 本地生活 */

    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      const routes = [
        {
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.project.list
            : RouterNameProjectManage.live.project.list,
          title: '项目管理',
        },
        {
          // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.detail.info
            : RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: project_id,
            tab: 'projectInfo',
            liveType: 'calendar',
          },
          title: '项目详情',
        },
        {
          path: '',
          title: '运营数据',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    } else if (router.currentRoute.fullPath.indexOf('/datacenter/projectDetail/') >= 0) {
      const routes = [
        { title: '品牌中心', name: RouterDataCenter.shopLive },
        { title: '项目详情' },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    const tabs = useRefTabs(
      [
        { label: '数据分析', value: 'projectDetail' },
        { label: '每日明细', value: 'projectDaily' },
      ],
      'projectDetail',
    );
    const routes = [
      {
        // name: '',
        title: '项目数据看板',
      },
      {
        title: '品牌中心',
      },
      {
        title: '项目详情',
      },
    ];
    // const useDatas = useData(ctx);

    const query_startDate = router.currentRoute.query.start_date;
    const dateType = ref<'date' | 'week' | 'month'>('date');
    const dates = ref<any>(
      query_startDate ? moment(query_startDate as any) : moment().add(-1, 'day'),
    );
    // 时间
    const dateV = ref<any>({
      date: {
        value: dates.value,
        format: 'yyyy年MM月DD日',
      },
      week: {
        value: moment().add(-1, 'day').startOf('w'),
        format: 'yyyy第 WW 周',
      },
      month: {
        value: moment(),
        format: 'yyyy 年 第 MM 月',
      },
    });
    // console.log(dateV.value, dates, 'dateV.value');
    // watch([() => dateType.value], (newV, oldV) => {
    //   console.log(dates.value, newV, oldV, 'sss');

    //   dates.value = moment(dateV.value[oldV[0]].value);
    //   dateV.value = {
    //     date: {
    //       value: dates.value,
    //       format: 'yyyy年MM月DD日',
    //     },
    //     week: {
    //       value: moment(dates.value).startOf('w'),
    //       format: 'yyyy第 WW 周',
    //     },
    //     month: {
    //       value: moment(dates.value),
    //       format: 'yyyy 年 第 MM 月',
    //     },
    //   };
    // });
    // const currentMoment = ref(moment().add(-1, 'day'));
    const currentMoment = computed(() => {
      return moment(dateV.value[dateType.value].value);
    });

    const prevDateSwitchDisables = computed(() => {
      // const minYear = '2022-01-01';
      return false;
      switch (dateType.value) {
        case DateRangeType[0]: {
          const minMoment = moment('2022-01-01').startOf('day');
          return currentMoment.value.isSameOrBefore(minMoment, 'day');
        }
        case DateRangeType[1]: {
          const minMoment = moment().startOf('week');
          return currentMoment.value.isSameOrBefore(minMoment, 'week');
        }
        case DateRangeType[2]: {
          const minMoment = moment().startOf('year');
          return currentMoment.value.isSameOrBefore(minMoment, 'month');
        }
      }
      return false;
    });
    const nextDateSwitchDisables = computed(() => {
      switch (dateType.value) {
        case DateRangeType[0]: {
          const maxMoment = moment().endOf('day');
          return moment(currentMoment.value).isSameOrAfter(maxMoment, 'day');
        }
        case DateRangeType[1]: {
          const maxMoment = moment().endOf('week');
          return moment(currentMoment.value).isSameOrAfter(maxMoment, 'week');
        }
        case DateRangeType[2]: {
          const maxMoment = moment().endOf('month');
          return moment(currentMoment.value).isSameOrAfter(maxMoment, 'month');
        }
      }
      return false;
    });
    const onDateChange = (step: number) => {
      if (step === 1) {
        if (nextDateSwitchDisables.value) {
          return;
        }
      } else {
        if (prevDateSwitchDisables.value) {
          return;
        }
      }

      switch (dateType.value) {
        case DateRangeType[0]: {
          // currentMoment.value = currentMoment.value.clone().add(step, 'day');
          dateV.value[dateType.value].value = moment(dateV.value[dateType.value].value)
            .clone()
            .add(step, 'day');
          break;
        }
        case DateRangeType[1]: {
          // currentMoment.value = currentMoment.value.clone().add(step, 'week');
          dateV.value[dateType.value].value = moment(dateV.value[dateType.value].value)
            .clone()
            .add(step, 'week');
          break;
        }
        case DateRangeType[2]: {
          // debugger;
          // currentMoment.value = currentMoment.value.clone().add(step, 'month');
          dateV.value[dateType.value].value = moment(dateV.value[dateType.value].value)
            .clone()
            .add(step, 'month');
          break;
        }
        default:
          break;
      }
      // getData();
    };
    const displayDate = computed(() => {
      switch (dateType.value) {
        case DateRangeType[0]:
          return currentMoment.value.format('yyyy年MM月DD日');
        case DateRangeType[1]:
          return (
            moment(currentMoment.value).startOf('w').format('yyyy第W周') +
            `(${moment(currentMoment.value).startOf('w').format('MM月DD日')}-${moment(
              currentMoment.value,
            )
              .endOf('w')
              .format('MM月DD日')})`
          );
        case DateRangeType[2]:
          return currentMoment.value.format('yyyy年MM月');
        default:
          return '';
      }
    });
    //时间按周需减一天
    const searchParams = computed<seachTpye>(() => {
      return {
        start_date:
          dateType.value === 'date'
            ? moment(currentMoment.value).format('YYYY-MM-DD')
            : dateType.value === 'week'
            ? moment(currentMoment.value).startOf('w').add(0, 'day').format('YYYY-MM-DD')
            : moment(currentMoment.value).startOf('M').format('YYYY-MM-DD'),
        end_date:
          dateType.value === 'date'
            ? moment(currentMoment.value).format('YYYY-MM-DD')
            : dateType.value === 'week'
            ? moment(currentMoment.value).endOf('w').add(0, 'day').format('YYYY-MM-DD')
            : moment(currentMoment.value).endOf('M').format('YYYY-MM-DD'),
        project_id: project_id + '',
        // category_id: 1,
        sort: 'shop_gmv_desc',
        date_type: dateType.value,
        is_from_project: is_new_from_project.value,
      };
    });
    // useDatas.searchData.value.project_id = project_id;
    provide('searchParams', searchParams);
    const project_name = ref(router.currentRoute.query.project_name);
    provide('searchProjectName', project_name);
    const displayDataType = ref('sessions');
    const onDisplayDataType = (type: DisplayDataType) => {
      displayDataType.value = type;
    };
    const onDateRangeType = (type: any) => {
      dateType.value = type;
      getData();
    };
    const animateNumberFormater = (val: number | string) => {
      return formatAmount(val, 'None');
    };

    //接口调用
    const projectData = ref<any>({});
    const projectDataLoading = ref<boolean>(true);
    const roomOoverview = ref<any>({});
    const roomOoverviewLoading = ref<boolean>(true);
    const upDataTime = ref<string>('');
    const tabData = ref<any>({});
    const max_gmv = ref<number>(0);
    const max_watch = ref<number>(0);
    const { business_type } = useProjectBaseInfo();
    const getData = () => {
      projectDataLoading.value = true;
      roomOoverviewLoading.value = true;
      GetProjectOverview(
        {
          start_date: searchParams.value.start_date,
          end_date: searchParams.value.end_date,
          project_id: searchParams.value.project_id,
          is_from_project: searchParams.value.is_from_project,
        },
        business_type.value,
      ).then(({ data }) => {
        projectDataLoading.value = false;
        if (data.success) {
          projectData.value = data.data;
          project_name.value = data.data.project_name;
          if (projectData.value?.data_list?.length > 0) {
            // const arr = projectData.value?.data_list?.map((v: any) => Number(v.gmv / 100));
            max_gmv.value = Math.max(
              ...projectData.value?.data_list?.map((v: any) => Number(v.gmv)),
            );
            max_watch.value = Math.max(
              ...projectData.value?.data_list?.map((v: any) => Number(v.watch_ucnt)),
            );
          }
          // if (projectData.value.data_list.length > 0) {
          //   baseProjectOptions.value.series[0].data = projectData.value.data_list.map(
          //     (item: Data_list) => {
          //       return Number(item.gmv || 0);
          //     },
          //   );
          //   baseProjectOptions.value.series[1].data = projectData.value.data_list.map(
          //     (item: Data_list) => {
          //       return Number(item.order_num || 0);
          //     },
          //   );
          //   baseProjectOptions.value.xAxis.data = projectData.value.data_list.map(
          //     (item: Data_list) => {
          //       if (dateType.value === 'date') {
          //         return item.date;
          //       } else if (dateType.value === 'week') {
          //         // console.log(moment(item.date).format('周w'), 'moment');
          //         const week = moment(item.date).day();
          //         switch (week) {
          //           case 1:
          //             return '周一';
          //           case 2:
          //             return '周二';
          //           case 3:
          //             return '周三';
          //           case 4:
          //             return '周四';
          //           case 5:
          //             return '周五';
          //           case 6:
          //             return '周六';
          //           case 0:
          //             return '周日';
          //         }
          //       } else if (dateType.value === 'month') {
          //         return moment(item.date).format('DD日');
          //       }
          //     },
          //   );
          //   // baseProjectOptionsRt.value.series[0].data = projectData.value.data_list.map(
          //   //   (item: any) => {
          //   //     return Number(item.watch_ucnt || 0);
          //   //   },
          //   // );
          //   // baseProjectOptionsRt.value.series[1].data = projectData.value.data_list.map(
          //   //   (item: any) => {
          //   //     return Number(item.single_uv || 0);
          //   //   },
          //   // );
          //   // baseProjectOptionsRt.value.xAxis.data = projectData.value.data_list.map((item: any) => {
          //   //   return item.date;
          //   // });
          // }
        }
      });
      GetLiveRoomOverview(
        {
          start_date: searchParams.value.start_date,
          end_date: searchParams.value.end_date,
          project_id: searchParams.value.project_id,
          is_from_project: searchParams.value.is_from_project,
        },
        business_type.value,
      ).then(({ data }) => {
        roomOoverviewLoading.value = false;
        if (data.success) {
          roomOoverview.value = data.data;
        }
      });
      //更新时间
      GetLastUpdateTime(
        {
          project_id: searchParams.value.project_id,
          is_from_project: searchParams.value.is_from_project,
        },
        business_type.value,
      ).then(({ data }) => {
        if (data.success) {
          upDataTime.value = data.data;
        }
      });
      GetTabOverview(
        {
          is_from_project: searchParams.value.is_from_project,
          project_id: searchParams.value.project_id,
          start_date: searchParams.value.start_date,
          end_date: searchParams.value.end_date,
        },
        business_type.value,
      ).then(({ data }) => {
        if (data.success) {
          tabData.value = data.data;
        }
      });
    };
    getData();
    watch([() => tabs.checkedTab.value], () => {
      if (tabs.checkedTab.value === 'projectDaily') {
        if (dateType.value === 'date') {
          dateType.value = 'week';
        }
      } else {
        getData();
      }
    });
    watch([() => searchParams.value], () => {
      if (tabs.checkedTab.value !== 'projectDaily') {
        getData();
      }
    });
    return {
      is_new_from_project,
      ...tabs,
      dateV,
      max_gmv,
      max_watch,
      tabData,
      upDataTime,
      routes,
      prevDateSwitchDisables,
      nextDateSwitchDisables,
      displayDate,
      onDateChange,
      animateNumberFormater,
      displayDataType,
      onDisplayDataType,
      onDateRangeType,
      dateType,
      currentMoment,
      // baseProjectOptions,
      // baseProjectOptionsRt,
      projectData,
      projectDataLoading,
      roomOoverviewLoading,
      roomOoverview,
      // baseProjectOptionsLook,
      project_id,
      searchParams,
      // ...useDatas,
    };
  },
  render() {
    // const updateTime = this.overviewData?.update_time
    //   ? moment(this.overviewData.update_time * 1000).format('yyyy.MM.DD HH:mm')
    //   : '--';
    const searchTop = (
      <div class="tg-datacenter-shoplive">
        {/* {this.is_new_from_project === false && <tg-breadcrumbs routes={this.routes} />}
        {this.is_new_from_project === false && <div class="bar"></div>}*/}
        <tg-tabs
          tabs={this.tabs}
          v-model={this.checkedTab}
          class={this.is_new_from_project ? 'project tabs' : 'tabs'}
        >
          <div class="update-time">数据更新时间：{this.upDataTime}</div>
          <tg-button
            disabled={this.prevDateSwitchDisables}
            class="time-btn"
            type="link"
            on-click={() => this.onDateChange(-1)}
          >
            <tg-icon name="ico-arrow-left"></tg-icon>
          </tg-button>
          {/* <span class="display-time">{this.displayDate}</span> */}
          {/* {console.log(this.dateV[this.dateType], 'click')} */}
          <el-date-picker
            clearable={false}
            v-model={this.dateV[this.dateType].value}
            picker-options={{
              disabledDate: (current: any) => {
                const end = moment();
                return current.valueOf() > end.valueOf();
              },
            }}
            type={this.dateType}
            prefix-icon="null"
            format={this.displayDate}
            placeholder="选择周"
            class="date-switch"
            pickerOptions={{ firstDayOfWeek: 1 }}
            popper-class="projectDetail_detes"
            style={{
              width:
                this.dateType === 'week' ? '240px' : this.dateType === 'month' ? '100px' : '130px',
              height: '40px',
            }}
          ></el-date-picker>
          <tg-button
            disabled={this.nextDateSwitchDisables}
            class="time-btn"
            type="link"
            on-click={() => this.onDateChange(1)}
          >
            <tg-icon name="ico-arrow-right"></tg-icon>
          </tg-button>
          <el-button-group class="dates">
            <el-button
              class={this.dateType === 'date' && 'active'}
              onClick={() => this.onDateRangeType(DateRangeType[0])}
              size="small"
            >
              日
            </el-button>
            <el-button
              class={this.dateType === 'week' && 'active'}
              onClick={() => this.onDateRangeType(DateRangeType[1])}
              size="small"
            >
              周
            </el-button>
            <el-button
              class={this.dateType === 'month' && 'active'}
              onClick={() => this.onDateRangeType(DateRangeType[2])}
              size="small"
            >
              月
            </el-button>
          </el-button-group>
        </tg-tabs>
      </div>
    );
    const Tabs = (
      <section class={'overview-container'}>
        <div
          class="overview-item sessions"
          selected={this.displayDataType === DisplayDataType.sessions}
          on-click={() => this.onDisplayDataType(DisplayDataType.sessions)}
        >
          <div class="item-header">
            <div class="item-icon">
              <img
                src={require(`@/assets/img/projectDetail/sessions${
                  this.displayDataType === DisplayDataType.sessions ? 1 : 0
                }.png`)}
                alt=""
              />
            </div>
            <div class="item-title">开播场次</div>
          </div>
          <animate-number
            class="item-amount"
            from="0"
            to={`${this.tabData?.live_room_cnt ?? 0}`}
            key={`${this.tabData?.live_room_cnt ?? 'sessions'}`}
            easing="easeInOutQuad"
            duration="1000"
            // formatter={this.animateNumberFormater}
          ></animate-number>
        </div>
        <div
          class="overview-item commodity"
          selected={this.displayDataType === DisplayDataType.commodity}
          on-click={() => this.onDisplayDataType(DisplayDataType.commodity)}
        >
          <div class="item-header">
            <div class="item-icon">
              <img
                src={require(`@/assets/img/projectDetail/commodity${
                  this.displayDataType === DisplayDataType.commodity ? 1 : 0
                }.png`)}
                alt=""
              />
            </div>
            <div class="item-title">{'销售商品'}</div>
          </div>
          <animate-number
            class="item-amount"
            from="0"
            to={this.tabData?.item_count ?? 0}
            key={`${this.tabData?.item_count ?? 'commodity'}`}
            easing="easeInOutQuad"
            duration="1000"
          ></animate-number>
        </div>
        <div
          class="overview-item launchnchor"
          selected={this.displayDataType === DisplayDataType.launchnchor}
          on-click={() => this.onDisplayDataType(DisplayDataType.launchnchor)}
        >
          <div class="item-header">
            <div class="item-icon">
              <img
                src={require(`@/assets/img/projectDetail/launchnchor${
                  this.displayDataType === DisplayDataType.launchnchor ? 1 : 0
                }.png`)}
                alt=""
              />
            </div>
            <div class="item-title">开播主播人数</div>
          </div>
          <animate-number
            class="item-amount"
            from="0"
            to={this.tabData?.kol_count ?? 0}
            key={this.tabData?.kol_count ?? 'launchnchor'}
            easing="easeInOutQuad"
            duration="1000"
            // formatter={this.animateNumberFormater}
          ></animate-number>
        </div>
        <div
          class="overview-item flow"
          selected={this.displayDataType === DisplayDataType.flow}
          on-click={() => this.onDisplayDataType(DisplayDataType.flow)}
        >
          <div class="item-header">
            <div class="item-icon">
              <img
                src={require(`@/assets/img/projectDetail/flow${
                  this.displayDataType === DisplayDataType.flow ? 1 : 0
                }.png`)}
                alt=""
              />
            </div>
            <div class="item-title">自然流量占比</div>
          </div>
          <animate-number
            class="item-amount profit"
            from="0"
            to={this.tabData?.natural_flow_ratio ?? 0}
            key={this.tabData?.natural_flow_ratio ?? 'profit'}
            easing="easeInOutQuad"
            duration="1000"
            formatter={this.animateNumberFormater}
          ></animate-number>
        </div>
        <div
          class="overview-item fans"
          selected={this.displayDataType === DisplayDataType.fans}
          on-click={() => this.onDisplayDataType(DisplayDataType.fans)}
        >
          <div class="item-header">
            <div class="item-icon">
              <img
                src={require(`@/assets/img/projectDetail/fans${
                  this.displayDataType === DisplayDataType.fans ? 1 : 0
                }.png`)}
                alt=""
              />
            </div>
            <div class="item-title">新增粉丝人数</div>
          </div>
          <animate-number
            class="item-amount"
            from="0"
            to={this.tabData?.incr_fans_cnt ?? 0}
            key={this.tabData?.incr_fans_cnt ?? 'fans'}
            easing="easeInOutQuad"
            duration="1000"
            // formatter={this.animateNumberFormater}
          ></animate-number>
        </div>
        <div
          class="overview-item launch"
          selected={this.displayDataType === DisplayDataType.launch}
          on-click={() => this.onDisplayDataType(DisplayDataType.launch)}
        >
          <div class="item-header">
            <div class="item-icon">
              <img
                src={require(`@/assets/img/projectDetail/launch${
                  this.displayDataType === DisplayDataType.launch ? 1 : 0
                }.png`)}
                alt=""
              />
            </div>
            <div class="item-title">投放金额</div>
          </div>
          <animate-number
            class="item-amount money"
            from="0"
            to={this.tabData?.cost / 100 ?? 0}
            key={this.tabData?.cost ?? 'launch'}
            easing="easeInOutQuad"
            duration="1000"
            formatter={this.animateNumberFormater}
          ></animate-number>
        </div>
      </section>
    );
    const content = <this.displayDataType />;
    //秒转分秒
    const secondToTime = (second: number) => {
      // const h = Math.floor(second / 3900);
      // const m = Math.floor((second % 3600) / 60);
      // const s = Math.floor((second % 3600) % 60);
      // return `${h}时${m}分${s}秒`;
      const minute = Math.floor(second / 60);
      const second1 = second % 60;
      return `${minute}分${second1.toFixed(0)}秒`;
    };
    const currentMomentCpy = moment(this.currentMoment);
    console.log(this.currentMoment.format('yyyy.MM.DD'), 'currentMomentCpy');

    return (
      <div class="all-project">
        {searchTop}
        {this.checkedTab === 'projectDetail' && (
          <div class="div-conent">
            <div class="main-content">
              <div class="backLog-box">
                <div class="log-box">
                  <el-image className="project-icon" src={this.projectData.shop_logo}>
                    <div slot="error" class="project-icon-slot">
                      <img src="@/assets/img/image_placeholder.png" alt="" />
                    </div>
                  </el-image>
                </div>
              </div>
              <div class="bor">
                <div class="amount-data">
                  <div class="lt">
                    <div class="item">
                      <span class="label">小店成交金额：</span>
                      <span class="value">
                        {formatAmount(this.projectData.dp_gmv / 100 || 0, '¥ ')}
                      </span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.dp_gmv_percent === null ||
                          this.projectData.dp_gmv_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">{Math.abs(this.projectData.dp_gmv_percent ?? 0)}%</span>
                    </div>
                    <div class="item">
                      <span class="label">小店成交订单：</span>
                      <span class="value">{this.projectData.dp_order_num || 0}</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.dp_order_num_percent === null ||
                          this.projectData.dp_order_num_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.dp_order_num_percent ?? 0)}%
                      </span>
                    </div>
                    <div class="item">
                      <span class="label">目标完成度：</span>
                      <span class="value">{this.projectData.dp_goal_gmv_percent ?? 0}%</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.dp_goal_gmv_percent_percent === null ||
                          this.projectData.dp_goal_gmv_percent_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.dp_goal_gmv_percent_percent ?? 0)}%
                      </span>
                    </div>
                    <div class="item">
                      <span class="label">直播成交金额：</span>
                      <span class="value">
                        {formatAmount(this.projectData.gmv / 100 || 0, '¥ ')}
                      </span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.gmv_percent === null || this.projectData.gmv_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">{Math.abs(this.projectData.gmv_percent ?? 0)}%</span>
                    </div>
                    <div class="item">
                      <span class="label">直播成交订单：</span>
                      <span class="value">{this.projectData.order_num ?? 0}</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.order_num_percent === null ||
                          this.projectData.order_num_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.order_num_percent ?? 0)}%
                      </span>
                    </div>
                  </div>
                  <div class="rt">
                    <div class="item">
                      <span class="label">总观看人数：</span>
                      <span class="value">{this.projectData.watch_ucnt ?? 0}</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.watch_ucnt_percent === null ||
                          this.projectData.watch_ucnt_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.watch_ucnt_percent ?? 0)}%
                      </span>
                    </div>
                    <div class="item">
                      <span class="label">最高在线：</span>
                      <span class="value">{this.projectData.max_online_cnt ?? 0}</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.max_online_cnt_percent === null ||
                          this.projectData.max_online_cnt_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.max_online_cnt_percent ?? 0)}%
                      </span>
                    </div>
                    <div class="item">
                      <span class="label">人均观看时长：</span>
                      <span class="value">
                        {secondToTime(this.projectData.avg_watch_duration ?? 0)}
                      </span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.avg_watch_duration_percent === null ||
                          this.projectData.avg_watch_duration_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.avg_watch_duration_percent ?? 0)}%
                      </span>
                    </div>
                    <div class="item">
                      <span class="label">单UV价值：</span>
                      <span class="value">{this.projectData.single_uv ?? 0}</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.projectData.single_uv_percent === null ||
                          this.projectData.single_uv_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.projectData.single_uv_percent ?? 0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div class="chart-box">
                  <div class="lt" v-loading={this.projectDataLoading}>
                    {(this.projectData.data_list || []).length > 0 ? (
                      <div style="height: 320px;width: 100%;">
                        {/* <base-echarts options={this.baseProjectOptions}></base-echarts> */}
                        <line-echarts
                          id={1}
                          tipFormatter={(params: any) => {
                            let res = '';
                            // console.log(params[0].axisValue, params, '222');
                            let titlestr = params[0].axisValue || '';
                            if (this.dateType === 'week') {
                              const week = params[0].axisValue || '';
                              switch (week) {
                                case '周一':
                                  titlestr =
                                    '周一 (' +
                                    moment(this.searchParams.start_date).format('MM月DD日') +
                                    ')';
                                  break;
                                case '周二':
                                  titlestr =
                                    '周二 (' +
                                    moment(this.searchParams.start_date)
                                      .add(1, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周三':
                                  titlestr =
                                    '周三 (' +
                                    moment(this.searchParams.start_date)
                                      .add(2, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周四':
                                  titlestr =
                                    '周四 (' +
                                    moment(this.searchParams.start_date)
                                      .add(3, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周五':
                                  titlestr =
                                    '周五 (' +
                                    moment(this.searchParams.start_date)
                                      .add(4, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周六':
                                  titlestr =
                                    '周六 (' +
                                    moment(this.searchParams.start_date)
                                      .add(5, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周日':
                                  titlestr =
                                    '周日 (' +
                                    moment(this.searchParams.start_date)
                                      .add(6, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                              }
                            } else if (this.dateType === 'month') {
                              titlestr = titlestr.replace(/日/g, '.');
                              const monthstr =
                                moment(this.searchParams.start_date).format('YYYY-MM') +
                                '-' +
                                titlestr;
                              titlestr = moment(monthstr).format('MM月DD日');
                            }
                            // const title = moment(params[0].axisValue).format('MM月DD日');
                            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${titlestr}</div>`;
                            let seriesName, color, data, result;
                            for (let i = 0; i < params.length; i++) {
                              color = params[i].color;
                              seriesName = params[i].seriesName;
                              data = params[i].data;
                              result =
                                i === 0 ? formatAmount(Number(data || 0), '¥') : Number(data || 0);
                              res +=
                                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                                color +
                                '"></div>' +
                                seriesName +
                                '：' +
                                '<div style="color: var(--text-color);font-weight: 400;"> ' +
                                result +
                                ' </div>' +
                                '</div>';
                            }
                            return res;
                          }}
                          xData={this.projectData?.data_list.map((item: Data_list) => {
                            if (this.dateType === 'date') {
                              return item.date.split(' ')[1];
                            } else if (this.dateType === 'week') {
                              const week = moment(item.date).day();
                              switch (week) {
                                case 1:
                                  return '周一';
                                case 2:
                                  return '周二';
                                case 3:
                                  return '周三';
                                case 4:
                                  return '周四';
                                case 5:
                                  return '周五';
                                case 6:
                                  return '周六';
                                case 0:
                                  return '周日';
                              }
                            } else if (this.dateType === 'month') {
                              return moment(item.date).format('DD日');
                            }
                          })}
                          yData={[
                            {
                              type: 'value',
                              name:
                                Number(this.max_gmv) < 10000 ? '成交金额 (千)' : '成交金额 (万)',
                              position: 'left',
                              splitLine: {
                                //   show: false,
                                lineStyle: {
                                  type: [6, 5],
                                  color: 'var(--border-line-div-color)',
                                  cap: 'round',
                                  dashOffset: 6,
                                },
                              },
                              axisPointer: {
                                show: false,
                              },
                              alignTicks: true,
                              axisLine: {
                                show: false,
                              },
                              // axisLabel: {
                              //   formatter: '{value} 元',
                              // },
                              nameTextStyle: {
                                padding: [0, 12, 12, 12],
                              },
                              axisLabel: {
                                formatter: (value: any) => {
                                  // console.log(value, this.projectData.data_list, 'value');

                                  if (this.max_gmv < 10000) {
                                    return Number(value / 1000).toFixed(2);
                                  } else {
                                    return Number(value / 10000).toFixed(0);
                                  }
                                  // return Number(value / 1000000).toFixed(0);
                                },
                              },
                            },
                            {
                              type: 'value',
                              name: '成交订单',
                              position: 'right',
                              alignTicks: true,
                              splitLine: {
                                lineStyle: {
                                  type: [6, 5],
                                  color: '#F2F2F2',
                                  cap: 'round',
                                  dashOffset: 6,
                                },
                              },
                              axisPointer: {
                                show: false,
                              },
                              axisLine: {
                                show: false,
                              },
                              nameTextStyle: {
                                padding: [0, 6, 12, 12],
                              },
                              axisLabel: {
                                formatter: '{value}',
                              },
                            },
                          ]}
                          series={[
                            {
                              name: '成交金额',
                              type: 'line',
                              smooth: true,
                              showSymbol: this.projectData?.data_list?.length < 2 ? true : false,
                              itemStyle: {
                                color: '#FF7F00',
                              },
                              connectNulls: true,
                              lineStyle: {
                                width: 3,
                                // shadowColor: '#9273F83d',
                                // shadowOffsetX: 0,
                                // shadowOffsetY: 11,
                                // shadowBlur: 11,
                              },
                              data: (this.projectData.data_list || []).map((item: Data_list) => {
                                return Number(item.gmv || 0);
                              }),
                            },
                            {
                              name: '成交订单',
                              type: 'line',
                              smooth: true,
                              showSymbol: this.projectData?.data_list?.length < 2 ? true : false,
                              yAxisIndex: 1,
                              itemStyle: {
                                color: '#2877FF',
                              },
                              lineStyle: {
                                width: 3,
                                // shadowColor: '#FF7F003d',
                                // shadowOffsetX: 0,
                                // shadowOffsetY: 11,
                                // shadowBlur: 11,
                              },
                              data: (this.projectData.data_list || []).map((item: Data_list) => {
                                return Number(item.order_num || 0);
                              }),
                            },
                          ]}
                        ></line-echarts>
                      </div>
                    ) : (
                      <empty-common imgWidth="200" imgHeight="100" />
                    )}
                  </div>
                  <div class="line"></div>
                  <div class="rt" v-loading={this.projectDataLoading}>
                    {(this.projectData.data_list || []).length > 0 ? (
                      <div style="height: 320px;width: 100%;">
                        {/* <base-echarts options={this.baseProjectOptionsRt}></base-echarts> */}
                        <line-echarts
                          id={2}
                          tipFormatter={(params: any) => {
                            let res = '';
                            let titlestr = params[0].axisValue || '';
                            if (this.dateType === 'week') {
                              const week = params[0].axisValue || '';
                              switch (week) {
                                case '周一':
                                  titlestr =
                                    '周一 (' +
                                    moment(this.searchParams.start_date).format('MM月DD日') +
                                    ')';
                                  break;
                                case '周二':
                                  titlestr =
                                    '周二 (' +
                                    moment(this.searchParams.start_date)
                                      .add(1, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周三':
                                  titlestr =
                                    '周三 (' +
                                    moment(this.searchParams.start_date)
                                      .add(2, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周四':
                                  titlestr =
                                    '周四 (' +
                                    moment(this.searchParams.start_date)
                                      .add(3, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周五':
                                  titlestr =
                                    '周五 (' +
                                    moment(this.searchParams.start_date)
                                      .add(4, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周六':
                                  titlestr =
                                    '周六 (' +
                                    moment(this.searchParams.start_date)
                                      .add(5, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                                case '周日':
                                  titlestr =
                                    '周日 (' +
                                    moment(this.searchParams.start_date)
                                      .add(6, 'day')
                                      .format('MM月DD日') +
                                    ')';
                                  break;
                              }
                            } else if (this.dateType === 'month') {
                              titlestr = titlestr.replace(/日/g, '.');
                              const monthstr =
                                moment(this.searchParams.start_date).format('YYYY-MM') +
                                '-' +
                                titlestr;
                              titlestr = moment(monthstr).format('MM月DD日');
                            }
                            // const title = moment(params[0].axisValue).format('MM月DD日');
                            res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${titlestr}</div>`;
                            let seriesName, color, data, result;
                            for (let i = 0; i < params.length; i++) {
                              color = params[i].color;
                              seriesName = params[i].seriesName;
                              data = params[i].data;
                              result =
                                i === 0 ? Number(data || 0) : formatAmount(Number(data || 0), '¥');
                              res +=
                                '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                                '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                                color +
                                '"></div>' +
                                seriesName +
                                '：' +
                                '<div style="color: var(--text-color);font-weight: 400;"> ' +
                                result +
                                ' </div>' +
                                '</div>';
                            }
                            return res;
                          }}
                          xData={this.projectData?.data_list.map((item: Data_list) => {
                            if (this.dateType === 'date') {
                              return item.date.split(' ')[1];
                            } else if (this.dateType === 'week') {
                              const week = moment(item.date).day();
                              switch (week) {
                                case 1:
                                  return '周一';
                                case 2:
                                  return '周二';
                                case 3:
                                  return '周三';
                                case 4:
                                  return '周四';
                                case 5:
                                  return '周五';
                                case 6:
                                  return '周六';
                                case 0:
                                  return '周日';
                              }
                            } else if (this.dateType === 'month') {
                              return moment(item.date).format('DD日');
                            }
                          })}
                          yData={[
                            {
                              type: 'value',
                              name:
                                Number(this.max_watch) < 10000 ? '观看人数 (千)' : '观看人数 (万)',
                              position: 'left',
                              splitLine: {
                                //   show: false,
                                lineStyle: {
                                  type: [6, 5],
                                  color: '#F2F2F2',
                                  cap: 'round',
                                  dashOffset: 6,
                                },
                              },
                              axisPointer: {
                                show: false,
                              },
                              alignTicks: true,
                              axisLine: {
                                show: false,
                              },
                              // axisLabel: {
                              //   formatter: '{value} 元',
                              // },
                              nameTextStyle: {
                                padding: [0, 12, 12, 12],
                              },
                              axisLabel: {
                                formatter: (value: any) => {
                                  // return Number(value / 10000).toFixed(0);
                                  if (this.max_watch < 10000) {
                                    return numberFormat(value / 1000, 0, ',');
                                  } else {
                                    return numberFormat(value / 10000, 0, ',');
                                  }
                                },
                              },
                            },
                            {
                              type: 'value',
                              name: '单UV价值',
                              position: 'right',
                              alignTicks: true,
                              splitLine: {
                                lineStyle: {
                                  type: [6, 5],
                                  color: '#F2F2F2',
                                  cap: 'round',
                                  dashOffset: 6,
                                },
                              },
                              axisPointer: {
                                show: false,
                              },
                              axisLine: {
                                show: false,
                              },
                              nameTextStyle: {
                                padding: [0, 6, 12, 12],
                              },
                              axisLabel: {
                                formatter: (value: any) => {
                                  return numberFormat(value, 1, '.');
                                },
                              },
                            },
                          ]}
                          series={[
                            {
                              name: '观看人数',
                              type: 'line',
                              smooth: true,
                              showSymbol: this.projectData?.data_list?.length < 2 ? true : false,
                              itemStyle: {
                                color: '#FF7F00',
                              },
                              lineStyle: {
                                width: 3,
                                // shadowColor: '#9273F83d',
                                // shadowOffsetX: 0,
                                // shadowOffsetY: 11,
                                // shadowBlur: 11,
                              },
                              data: this.projectData?.data_list.map((item: Data_list) => {
                                return Number(item.watch_ucnt || 0);
                              }),
                            },
                            {
                              name: '单UV价值',
                              type: 'line',
                              smooth: true,
                              showSymbol: this.projectData?.data_list?.length < 2 ? true : false,
                              yAxisIndex: 1,
                              itemStyle: {
                                color: '#2877FF',
                              },
                              lineStyle: {
                                width: 3,
                                // shadowColor: '#FF7F003d',
                                // shadowOffsetX: 0,
                                // shadowOffsetY: 11,
                                // shadowBlur: 11,
                              },
                              data: this.projectData?.data_list.map((item: any) => {
                                return Number(item.single_uv || 0);
                              }),
                            },
                          ]}
                        ></line-echarts>
                      </div>
                    ) : (
                      <empty-common imgWidth="200" imgHeight="100" />
                    )}
                  </div>
                </div>
                <div class="progress-box" v-loading={this.roomOoverviewLoading}>
                  <div class="line1">
                    <div class="up-box">
                      <span class="value">{this.roomOoverview.pay_watch_percent ?? 0}%</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.roomOoverview.pay_watch_percent_percent === null ||
                          this.roomOoverview.pay_watch_percent_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.roomOoverview.pay_watch_percent_percent ?? 0)}%
                      </span>
                    </div>
                    {/* <img class="linegk" src={require('@/assets/img/lineAll.png')} alt="" /> */}
                    <div class="linegk">
                      <img class="arrow-up" src={require('@/assets/img/arrow_down.png')} alt="" />
                    </div>
                  </div>
                  <section class="progress-wrap">
                    <div class="item box">
                      <div class="label">曝光人数</div>
                      <div class="value">{this.roomOoverview.exposure_ucnt ?? 0}</div>
                    </div>
                    <div class="item">
                      <div class="up-box">
                        <span class="value">{this.roomOoverview.watch_exposure_percent ?? 0}%</span>
                        <tg-icon
                          style="margin: auto 1px"
                          name={
                            this.roomOoverview.watch_exposure_percent_percent === null ||
                            this.roomOoverview.watch_exposure_percent_percent >= 0
                              ? 'ico-icon_tongyong_shangsheng_16_red'
                              : 'ico-icon_tongyong_xiajiang_16_green'
                          }
                        ></tg-icon>
                        <span class="up-num">
                          {Math.abs(this.roomOoverview.watch_exposure_percent_percent ?? 0)}%
                        </span>
                      </div>
                      <img class="arrow" src={require('@/assets/img/arrow_gradient.png')} alt="" />
                    </div>
                    <div class="item box gk">
                      <div class="label">观看人数</div>
                      <div class="value">{this.roomOoverview.watch_ucnt ?? 0}</div>
                    </div>
                    <div class="item">
                      <div class="up-box">
                        <span class="value">
                          {this.roomOoverview.product_watch_watch_percent ?? 0}%
                        </span>
                        <tg-icon
                          style="margin: auto 1px"
                          name={
                            this.roomOoverview.product_watch_watch_percent_percent === null ||
                            this.roomOoverview.product_watch_watch_percent_percent >= 0
                              ? 'ico-icon_tongyong_shangsheng_16_red'
                              : 'ico-icon_tongyong_xiajiang_16_green'
                          }
                        ></tg-icon>
                        <span class="up-num">
                          {Math.abs(this.roomOoverview.product_watch_watch_percent_percent ?? 0)}%
                        </span>
                      </div>
                      <img class="arrow" src={require('@/assets/img/arrow_gradient.png')} alt="" />
                    </div>
                    <div class="item box">
                      <div class="label">商品曝光人数</div>
                      <div class="value">{this.roomOoverview.product_watch_ucnt ?? 0}</div>
                    </div>
                    <div class="item">
                      <div class="up-box">
                        <span class="value">
                          {this.roomOoverview.product_click_product_watch_percent ?? 0}%
                        </span>
                        <tg-icon
                          style="margin: auto 1px"
                          name={
                            this.roomOoverview.product_click_product_watch_percent_percent ===
                              null ||
                            this.roomOoverview.product_click_product_watch_percent_percent >= 0
                              ? 'ico-icon_tongyong_shangsheng_16_red'
                              : 'ico-icon_tongyong_xiajiang_16_green'
                          }
                        ></tg-icon>
                        <span class="up-num">
                          {Math.abs(
                            this.roomOoverview.product_click_product_watch_percent_percent ?? 0,
                          )}
                          %
                        </span>
                      </div>
                      <img class="arrow" src={require('@/assets/img/arrow_gradient.png')} alt="" />
                    </div>
                    <div class="item box">
                      <div class="label">商品点击人数</div>
                      <div class="value">{this.roomOoverview.product_click_ucnt ?? 0}</div>
                    </div>
                    <div class="item">
                      <div class="up-box">
                        <span class="value">
                          {this.roomOoverview.pay_product_click_percent ?? 0}%
                        </span>
                        <tg-icon
                          style="margin: auto 1px"
                          name={
                            this.roomOoverview.pay_product_click_percent_percent === null ||
                            this.roomOoverview.pay_product_click_percent_percent >= 0
                              ? 'ico-icon_tongyong_shangsheng_16_red'
                              : 'ico-icon_tongyong_xiajiang_16_green'
                          }
                        ></tg-icon>
                        <span class="up-num">
                          {Math.abs(this.roomOoverview.pay_product_click_percent_percent ?? 0)}%
                        </span>
                      </div>
                      <img class="arrow" src={require('@/assets/img/arrow_gradient.png')} alt="" />
                    </div>
                    <div class="item box">
                      <div class="label">成交人数</div>
                      <div class="value">{this.roomOoverview.pay_ucnt ?? 0}</div>
                    </div>
                  </section>
                  <div class="line2">
                    <div class="up-box">
                      <span class="value">{this.roomOoverview.pay_exposure_percent ?? 0}%</span>
                      <tg-icon
                        style="margin: auto 1px"
                        name={
                          this.roomOoverview.pay_exposure_percent_percent === null ||
                          this.roomOoverview.pay_exposure_percent_percent >= 0
                            ? 'ico-icon_tongyong_shangsheng_16_red'
                            : 'ico-icon_tongyong_xiajiang_16_green'
                        }
                      ></tg-icon>
                      <span class="up-num">
                        {Math.abs(this.roomOoverview.pay_exposure_percent_percent ?? 0)}%
                      </span>
                    </div>
                    {/* <img class="linegk" src={require('@/assets/img/lineAll1.png')} alt="" /> */}
                    <div class="linegk">
                      <img class="arrow-up" src={require('@/assets/img/arrow_down.png')} alt="" />
                    </div>
                  </div>
                </div>
                <div class="lookEcharts-box" v-loading={this.projectDataLoading}>
                  <div class="line"></div>
                  {(this.projectData.data_list || []).length > 0 ? (
                    <div style="height: 265px;width: 100%;">
                      {/* <base-echarts options={this.baseProjectOptionsLook}></base-echarts> */}
                      <line-echarts
                        id={3}
                        xData={this.roomOoverview?.data_list.map((item: Data_list) => {
                          // return moment(item.date).format('MM月DD日');
                          if (this.dateType === 'date') {
                            return item.date.split(' ')[1];
                          } else if (this.dateType === 'week') {
                            const week = moment(item.date).day();
                            switch (week) {
                              case 1:
                                return '周一';
                              case 2:
                                return '周二';
                              case 3:
                                return '周三';
                              case 4:
                                return '周四';
                              case 5:
                                return '周五';
                              case 6:
                                return '周六';
                              case 0:
                                return '周日';
                            }
                          } else if (this.dateType === 'month') {
                            return moment(item.date).format('DD日');
                          }
                        })}
                        series={[
                          {
                            name: '曝光观看率',
                            type: 'line',
                            smooth: true,
                            showSymbol: this.roomOoverview?.data_list?.length < 2 ? true : false,
                            itemStyle: {
                              color: '#FF7F00',
                            },
                            lineStyle: {
                              width: 3,
                              // shadowOffsetX: 0,
                              // shadowOffsetY: 11,
                              // shadowBlur: 11,
                            },
                            data: this.roomOoverview?.data_list.map((item: any) => {
                              return item.watch_exposure_percent;
                            }),
                          },
                          {
                            name: '观看商品曝光率',
                            type: 'line',
                            smooth: true,
                            showSymbol: this.roomOoverview?.data_list?.length < 2 ? true : false,
                            itemStyle: {
                              color: '#2877FF',
                            },
                            lineStyle: {
                              width: 3,
                              // shadowOffsetX: 0,
                              // shadowOffsetY: 11,
                              // shadowBlur: 11,
                            },
                            data: this.roomOoverview?.data_list.map((item: any) => {
                              return item.product_watch_watch_percent;
                            }),
                          },
                          {
                            name: '商品曝光点击率',
                            type: 'line',
                            smooth: true,
                            showSymbol: this.roomOoverview?.data_list?.length < 2 ? true : false,
                            itemStyle: {
                              color: '#4FCA50',
                            },
                            lineStyle: {
                              width: 3,
                              // shadowOffsetX: 0,
                              // shadowOffsetY: 11,
                              // shadowBlur: 11,
                            },
                            data: this.roomOoverview?.data_list.map((item: any) => {
                              return item.product_click_product_watch_percent;
                            }),
                          },
                          {
                            name: '点击成交率',
                            type: 'line',
                            smooth: true,
                            showSymbol: this.roomOoverview?.data_list?.length < 2 ? true : false,
                            itemStyle: {
                              color: '#9273F8',
                            },
                            lineStyle: {
                              width: 3,
                              // shadowOffsetX: 0,
                              // shadowOffsetY: 11,
                              // shadowBlur: 11,
                            },
                            data: this.roomOoverview?.data_list.map((item: any) => {
                              return item.pay_product_click_percent;
                            }),
                          },
                          {
                            name: '曝光成交率',
                            type: 'line',
                            smooth: true,
                            showSymbol: this.roomOoverview?.data_list?.length < 2 ? true : false,
                            itemStyle: {
                              color: '#FFBF00',
                            },
                            lineStyle: {
                              width: 3,
                              // shadowOffsetX: 0,
                              // shadowOffsetY: 11,
                              // shadowBlur: 11,
                            },
                            data: this.roomOoverview?.data_list.map((item: any) => {
                              return item.pay_exposure_percent;
                            }),
                          },
                          {
                            name: '观看成交率',
                            type: 'line',
                            smooth: true,
                            showSymbol: this.roomOoverview?.data_list?.length < 2 ? true : false,
                            itemStyle: {
                              color: '#FF75C3',
                            },
                            lineStyle: {
                              width: 3,
                              // shadowOffsetX: 0,
                              // shadowOffsetY: 11,
                              // shadowBlur: 11,
                            },
                            data: this.roomOoverview?.data_list.map((item: any) => {
                              return item.pay_watch_percent;
                            }),
                          },
                        ]}
                        tipFormatter={(params: any) => {
                          let res = '';
                          let titlestr = params[0].axisValue || '';
                          if (this.dateType === 'week') {
                            const week = params[0].axisValue || '';
                            switch (week) {
                              case '周一':
                                titlestr =
                                  '周一 (' +
                                  moment(this.searchParams.start_date).format('MM月DD日') +
                                  ')';
                                break;
                              case '周二':
                                titlestr =
                                  '周二 (' +
                                  moment(this.searchParams.start_date)
                                    .add(1, 'day')
                                    .format('MM月DD日') +
                                  ')';
                                break;
                              case '周三':
                                titlestr =
                                  '周三 (' +
                                  moment(this.searchParams.start_date)
                                    .add(2, 'day')
                                    .format('MM月DD日') +
                                  ')';
                                break;
                              case '周四':
                                titlestr =
                                  '周四 (' +
                                  moment(this.searchParams.start_date)
                                    .add(3, 'day')
                                    .format('MM月DD日') +
                                  ')';
                                break;
                              case '周五':
                                titlestr =
                                  '周五 (' +
                                  moment(this.searchParams.start_date)
                                    .add(4, 'day')
                                    .format('MM月DD日') +
                                  ')';
                                break;
                              case '周六':
                                titlestr =
                                  '周六 (' +
                                  moment(this.searchParams.start_date)
                                    .add(5, 'day')
                                    .format('MM月DD日') +
                                  ')';
                                break;
                              case '周日':
                                titlestr =
                                  '周日 (' +
                                  moment(this.searchParams.start_date)
                                    .add(6, 'day')
                                    .format('MM月DD日') +
                                  ')';
                                break;
                            }
                          } else if (this.dateType === 'month') {
                            titlestr = titlestr.replace(/日/g, '.');
                            const monthstr =
                              moment(this.searchParams.start_date).format('YYYY-MM') +
                              '-' +
                              titlestr;
                            titlestr = moment(monthstr).format('MM月DD日');
                          }
                          // const title = moment(params[0].axisValue).format('MM月DD日');
                          res = `<div style="color:var(--text-color);font-size:14px;font-weight:400;text-align: left;line-height: 30px;margin-bottom: 12px">${titlestr}</div>`;
                          let seriesName, color, data;
                          for (let i = 0; i < params.length; i++) {
                            color = params[i].color;
                            seriesName = params[i].seriesName;
                            data = params[i].data;
                            res +=
                              '<div style="display: flex;margin-bottom: 10px;height: 20px;line-height: 20px;font-size: 12px;color:#606974;font-weight: 400;">' +
                              '<div style="margin:5px;border-radius: 5px;height: 10px;width: 10px;background:' +
                              color +
                              '"></div>' +
                              seriesName +
                              '：' +
                              '<div style="color: var(--text-color);font-weight: 400;"> ' +
                              data +
                              '% </div>' +
                              '</div>';
                          }
                          return res;
                        }}
                      ></line-echarts>
                    </div>
                  ) : (
                    <div style="height:265px;display: flex;justify-content: center;align-items: center;">
                      <empty-common imgWidth="200" imgHeight="100" />
                    </div>
                  )}
                </div>
              </div>
              {Tabs}
              {content}
            </div>
          </div>
        )}
        {this.checkedTab === 'projectDaily' && (
          <div class="div-conent">
            <projectDaily
              selectDate={currentMomentCpy}
              analyseType={this.dateType}
              projectId={this.project_id}
              is_from_project={this.is_new_from_project}
            />
          </div>
        )}
      </div>
    );
  },
});
