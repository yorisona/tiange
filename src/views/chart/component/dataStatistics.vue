<template>
  <section class="star-personal-section page-section">
    <el-row class="stat-top">
      <section class="daily-stat" v-loading="dailyLoading">
        <div>
          <div class="daily-stat-top">
            <span>每日统计</span>
            <el-dropdown
              trigger="click"
              :hide-on-click="true"
              class="recent-day-parent"
              placement="bottom-start"
            >
              <span class="el-dropdown-link recent-day"
                >{{ recentDay }}<i class="el-icon-arrow-down"></i
              ></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in recentDayDimension"
                    :key="item.value"
                    @click="selectedDateDimension(item)"
                    >{{ item.value }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <div>
              <el-dropdown
                trigger="click"
                :hide-on-click="false"
                @visible-change="isSelect = !isSelect"
              >
                <span
                  class="el-dropdown-link"
                  style="cursor: pointer; font-size: 12px; color: #666"
                >
                  选择维度
                  <i
                    class="el-icon--right"
                    :class="isSelect ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
                  ></i>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="daily-dimen">
                    <el-dropdown-item
                      v-for="(item, index) in periodStatDimension"
                      :style="{ color: item.color }"
                      :key="index"
                      :class="dimensionCls ? 'is-selected' : 'no-selected'"
                      @click="selectedDimension(item, index)"
                    >
                      <i class="circleDot" :style="{ background: item.color }"></i>
                      {{ item.value }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div id="periodStatChart"></div>
      </section>
      <cateStatChart
        ref="cateStateChart"
        v-if="$props.starName !== ''"
        :categoryStatChartInfo="categoryStatChartInfo"
        v-loading="categoryLoading"
      ></cateStatChart>
    </el-row>
    <el-row>
      <section class="display-stat" v-loading="displayLoading">
        <div style="overflow: hidden">
          <span class="display-stat-title">每场统计</span>
          <div class="dimension-dropdown">
            <el-dropdown
              trigger="click"
              :hide-on-click="false"
              @visible-change="isOpenDisplayDimen = !isOpenDisplayDimen"
            >
              <span class="el-dropdown-link">
                选择维度
                <i
                  class="el-icon--right"
                  :class="isOpenDisplayDimen ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                ></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, index) in displayStatDimension"
                    :style="{ color: item.color }"
                    :key="index"
                    @click="selectedDisplayDimesion(item, index)"
                  >
                    <i class="circleDot" :style="{ background: item.color }"></i>
                    {{ item.value }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-dropdown
            class="display-stat-day"
            trigger="click"
            :hide-on-click="true"
            placement="bottom-start"
          >
            <span class="el-dropdown-link"
              >{{ displayRecentDay }}<i class="el-icon-arrow-down"></i
            ></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in displayRecentDayDimension"
                  :key="index"
                  @click="selectedDisplayDay(item, index)"
                >
                  {{ item.value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div id="displayStatChart"></div>
      </section>
    </el-row>
    <el-row>
      <section class="categories-ranking" v-loading="smallCateLoading">
        <div class="categories-ranking-top">
          <span class="categories-ranking-title">子类目直播排行</span>
          <el-dropdown
            class="cate-ranking-recent"
            trigger="click"
            :hide-on-click="true"
            placement="bottom-start"
          >
            <span class="el-dropdown-link"
              >{{ smallCateDimenRecent }}<i class="el-icon-arrow-down"></i
            ></span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in smallCategoryDaydimension"
                  :key="index"
                  @click="selectedSmCateDay(item, index)"
                  >{{ item }}</el-dropdown-item
                >
              </el-dropdown-menu></template
            >
          </el-dropdown>
        </div>
        <div id="childCateStatChart"></div>
      </section>
    </el-row>
  </section>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import {
  queryStarStat,
  periodStatistics,
  displayStatistics,
  queryCategory,
  smallCategory,
} from '@/api/stat';
import { domain } from '@/utils/variable';
import {
  periodStatDimension,
  displayStatDimension,
  displayRecentDayDimension,
  smallCategoryDaydimension,
} from '@/const/options';
import { noDataOption } from '@/const/optionChart';
import { queryStars } from '@/api/star';
import cateStatChart from './categoryStat';
import { PieChartColors } from '@/const/chart';

export default {
  components: { cateStatChart },
  props: ['starName'],
  data() {
    return {
      domain,
      noDataOption,
      dailyLoading: false,
      categoryLoading: false,
      displayLoading: false,
      smallCateLoading: false,
      showStarInfo: {
        showStarName: '---',
        showStarId: '---',
        showStarFuns: '---',
        showStarDisplay: '---',
        showStarScore: '---',
        showStarOrganize: '---',
        Cooperation: 0,
        phoneNum: '---',
        weChat: '---',
        category: '---',
        unitPrice: '---',
        mixed: '---',
        special: '---',
        latestClickNumPieData: [],
        imgSrc: '',
        wangwang: '-',
        starSpecialCost: '-',
        starSpecialPrice: '-',
        starMixCost: '-',
        starMixPrice: '-',
        addBy: '---',
        modifyBy: '---',
      },
      recentDay: '最近10个月',
      recentDayDimension: [
        {
          value: '最近10天',
          label: 'day',
        },
        {
          value: '最近10周',
          label: 'week',
        },
        {
          value: '最近10个月',
          label: 'month',
        },
      ],
      periodStatChart: null, // 时间段图表
      periodStatDimension,
      periodCurrentColor: [],
      dimensionCls: false,
      periodStatChartInfo: {
        averageWatchPersonByHour: [],
        averageWatchNumberByHour: [],
        displayDate: [],
        averageWatchPersonByDisplay: [],
        averageWatchNumberByDisplay: [],
        fansPrecision: [],
        averageDisplayNum: [],
        duration: [],
        averageClickNum: [],
        interactiveNumByHour: [],
        averageInteractiveNum: [],
      },
      isSelect: true,
      categoryStatChartInfo: [],
      displayStatChart: null, // 场次统计图表
      displayStatChartInfo: {
        displayDate: [],
        averageWatchNumHour: [],
        averageWatchPersonHour: [],
        watchNum: [],
        watchPerson: [],
        duration: [],
        label: [],
      },
      displayStatDimension,
      displayRecentDay: '最近15场',
      displayRecentDayDimension,
      displayCurrentColor: [],
      isOpenDisplayDimen: false,
      displayArrowNum: 0,
      smallCateDimenRecent: '最近15天', // 子类目排行
      smallCategoryDaydimension,
      smallCategoryStatChartInfo: [{}, {}, {}],
      childCateStatChart: null,
      smallCateSelectedDays: 0,
      liveCategory: [],
      isDrawCate: false,
      isDrawDisplay: false,
      isConStar: false,
      clickNumLastest: [],
      pieStatChart: null,
      // 是否销毁
      isDestroyed: false,
    };
  },
  created() {
    this.periodCurrentColor = this.periodStatDimension.map(item => {
      return item.color;
    });
    this.displayCurrentColor = this.displayStatDimension.map(item => {
      return item.color;
    });
  },
  beforeDestroy() {
    // 销毁了就不再渲染图表，防止报错
    this.isDestroyed = true;
    window.removeEventListener('resize', this.winResize);
  },
  methods: {
    mountedSearch() {
      if (this.$props.starName) {
        this.searchStarInfo = this.$props.starName;
        this.searchStar();
        window.addEventListener('resize', this.winResize);
      }
    },
    // resize事件
    winResize() {
      this.periodStatChart.resize();
      // this.categoryStatChart.resize()
      this.displayStatChart.resize();
      this.childCateStatChart.resize();
      if (this.isConStar && this.showStarInfo.latestClickNumPieData.length > 0) {
        this.pieStatChart.resize();
      }
    },
    // 子类目排行-改变最近多少天天数
    selectedSmCateDay(item, index) {
      if (this.smallCateDimenRecent !== item) {
        this.smallCateDimenRecent = item;
        this.smallCateSelectedDays = index;
        // 数组为空时渲染无数据~
        if (this.smallCategoryStatChartInfo.length !== 0) {
          this.liveCategory = this.smallCategoryStatChartInfo[index].small_categorys;
          this.initChildCateStatChart();
        } else {
          this.childCateStatChart = echarts.init(document.getElementById('childCateStatChart'));
          this.childCateStatChart.clear();
          this.smallCategoryNoDataShow();
        }
      }
    },
    // 每场统计图表-选择维度后 控制某维度的显示隐藏(颜色变化)
    selectedDisplayDimesion(item, index) {
      const currentColor = this.displayCurrentColor[index];
      if (item.color !== '#999') {
        item.color = '#999';
      } else if (item.color === '#999') {
        item.color = currentColor;
      }
      // echarts方法
      this.displayStatChart.dispatchAction({
        type: 'legendToggleSelect',
        name: item.value,
      });
    },
    // 每场统计图表-选择最近多少场
    selectedDisplayDay(item) {
      if (item.value !== this.displayRecentDay) {
        this.displayRecentDay = item.value;
        const displayStatpass = {
          star_name: this.showStarInfo.showStarName,
          recently_displays_num: item.num,
        };
        this.displayLoading = true;
        displayStatistics(displayStatpass)
          .then(response => {
            const data = response.data;
            if (data.data.data.length === 0) {
              this.displayStatChart = echarts.init(document.getElementById('displayStatChart'));
              this.displayStatChart.clear();
              this.displayNoDataShow();
              this.displayLoading = false;
            } else {
              if (data.success) {
                this.displayStatChartInfo.displayDate = [];
                this.displayStatChartInfo.averageWatchNumHour = [];
                this.displayStatChartInfo.averageWatchPersonHour = [];
                this.displayStatChartInfo.watchNum = [];
                this.displayStatChartInfo.watchPerson = [];
                this.displayStatChartInfo.duration = [];
                this.displayStatChartInfo.label = [];
                const res = response.data.data.data;
                res.reverse().forEach(item => {
                  this.displayStatChartInfo.displayDate.push(item.display_date);
                  this.displayStatChartInfo.averageWatchNumHour.push(item.average_watch_num);
                  this.displayStatChartInfo.averageWatchPersonHour.push(item.average_watch_persons);
                  this.displayStatChartInfo.watchNum.push(item.watch_num);
                  this.displayStatChartInfo.watchPerson.push(item.watch_persons);
                  this.displayStatChartInfo.duration.push(item.duration);
                  this.displayStatChartInfo.label.push(item.label);
                });
                this.initDisplayStatChart();
                this.displayLoading = false;
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 每日统计图表- 选择最近多少个月
    selectedDateDimension(val) {
      if (this.recentDay !== val.value) {
        this.recentDay = val.value;
        const periodStatpass = {
          star_name: this.showStarInfo.showStarName,
          unit: val.label,
        };
        this.dailyLoading = true;
        if (periodStatpass.star_name) {
          periodStatistics(periodStatpass).then(response => {
            const data = response.data;
            if (data.success) {
              const res = data.data.data;
              this.periodStatChartInfo.displayDate = [];
              this.periodStatChartInfo.averageWatchPersonByHour = [];
              this.periodStatChartInfo.averageWatchNumberByHour = [];
              this.periodStatChartInfo.averageWatchPersonByDisplay = [];
              this.periodStatChartInfo.averageWatchNumberByDisplay = [];
              this.periodStatChartInfo.fansPrecision = [];
              this.periodStatChartInfo.averageDisplayNum = [];
              this.periodStatChartInfo.duration = [];
              this.periodStatChartInfo.averageClickNum = [];
              this.periodStatChartInfo.interactiveNumByHour = [];
              this.periodStatChartInfo.averageInteractiveNum = [];
              if (res.length === 0) {
                this.periodStatChart.clear();
                this.noDataShow();
                this.dailyLoading = false;
              } else {
                res.reverse().forEach(item => {
                  if (item.watch_person_num_by_hour) {
                    this.periodStatChartInfo.displayDate.push(item.display_date[0]);
                    this.periodStatChartInfo.averageWatchPersonByHour.push(
                      item.watch_person_num_by_hour,
                    );
                    this.periodStatChartInfo.averageWatchNumberByHour.push(item.watch_num_by_hour);
                    this.periodStatChartInfo.averageWatchPersonByDisplay.push(
                      item.watch_person_num_by_display,
                    );
                    this.periodStatChartInfo.averageWatchNumberByDisplay.push(
                      item.watch_num_by_display,
                    );
                    this.periodStatChartInfo.fansPrecision.push(item.fans_precision);
                    this.periodStatChartInfo.averageDisplayNum.push(item.display_num);
                    this.periodStatChartInfo.duration.push(item.duration);
                    this.periodStatChartInfo.averageClickNum.push(item.average_click_num);
                    this.periodStatChartInfo.interactiveNumByHour.push(item.interactive_by_hour);
                    this.periodStatChartInfo.averageInteractiveNum.push(item.average_interactive);
                  }
                });
                this.initDailyStatChart();
                this.dailyLoading = false;
              }
            }
          });
        } else {
          // console.log('请先搜索主播')
        }
      }
    },
    // 每日统计图表- 选择维度 控制某维度显示隐藏
    selectedDimension(item, index) {
      this.dimensionCls = true;
      const currentColor = this.periodCurrentColor[index];
      if (item.color !== '#999') {
        item.color = '#999';
      } else if (item.color === '#999') {
        item.color = currentColor;
      }
      this.periodStatChart.dispatchAction({
        type: 'legendToggleSelect',
        name: item.value,
      });
    },
    // 无数据时执行渲染
    noDataShow() {
      this.periodStatChart.setOption(this.noDataOption);
    },
    displayNoDataShow() {
      this.displayStatChart.setOption(this.noDataOption);
    },
    smallCategoryNoDataShow() {
      this.childCateStatChart.setOption(this.noDataOption);
    },
    // 搜索主播-进入页面时执行
    searchStar() {
      if (this.searchStarInfo !== '' && this.searchStarInfo !== null) {
        const searchStarPass = {
          star_name: this.searchStarInfo,
        };
        queryStarStat(searchStarPass)
          .then(response => {
            const data = response.data;
            // // 判断是否为合作主播
            // if (data.data.data[0].is_cooperation === 1) {
            //   this.isConStar = true
            // } else {
            //   this.isConStar = false
            // }
            if (data.success) {
              if (data.data.data.length === 0) {
                return false;
              }
              if (data.data.data.length > 0) {
                this.recentDay = '最近10个月';
                this.displayRecentDay = '最近15场';
              }
              const res = data.data.data[0];
              this.showStarInfo.showStarDisplay = res.display_num;
              this.showStarInfo.showStarScore = res.score;
              this.showStarInfo.showStarOrganize = res.organization;

              // 每日统计图表-查询数据(需传入最近时间 没选择一次发一次请求)
              const periodStatpass = {
                star_name: this.searchStarInfo, // 每日统计-第一个图表day,week,month
                unit: 'month',
              };
              this.dailyLoading = true;
              periodStatistics(periodStatpass).then(response => {
                const data = response.data;
                if (data.success) {
                  const res = data.data.data;
                  this.periodStatChartInfo.displayDate = [];
                  this.periodStatChartInfo.averageWatchPersonByHour = [];
                  this.periodStatChartInfo.averageWatchNumberByHour = [];
                  this.periodStatChartInfo.averageWatchPersonByDisplay = [];
                  this.periodStatChartInfo.averageWatchNumberByDisplay = [];
                  this.periodStatChartInfo.fansPrecision = [];
                  this.periodStatChartInfo.averageDisplayNum = [];
                  this.periodStatChartInfo.duration = [];
                  this.periodStatChartInfo.averageClickNum = [];
                  this.periodStatChartInfo.interactiveNumByHour = [];
                  this.periodStatChartInfo.averageInteractiveNum = [];
                  if (res.length === 0) {
                    this.periodStatChart = echarts.init(document.getElementById('periodStatChart'));
                    this.periodStatChart.clear();
                    this.noDataShow();
                    this.isNotData = false;
                    this.dailyLoading = false;
                  } else {
                    this.isNotData = true;
                    res.reverse().forEach(item => {
                      if (item.watch_person_num_by_hour) {
                        this.periodStatChartInfo.displayDate.push(item.display_date[1]);
                        this.periodStatChartInfo.averageWatchPersonByHour.push(
                          item.watch_person_num_by_hour,
                        );
                        this.periodStatChartInfo.averageWatchNumberByHour.push(
                          item.watch_num_by_hour,
                        );
                        this.periodStatChartInfo.averageWatchPersonByDisplay.push(
                          item.watch_person_num_by_display,
                        );
                        this.periodStatChartInfo.averageWatchNumberByDisplay.push(
                          item.watch_num_by_display,
                        );
                        this.periodStatChartInfo.fansPrecision.push(item.fans_precision);
                        this.periodStatChartInfo.averageDisplayNum.push(item.display_num);
                        this.periodStatChartInfo.duration.push(item.duration);
                        this.periodStatChartInfo.averageClickNum.push(item.average_click_num);
                        this.periodStatChartInfo.interactiveNumByHour.push(
                          item.interactive_by_hour,
                        );
                        this.periodStatChartInfo.averageInteractiveNum.push(
                          item.average_interactive,
                        );
                      }
                    });
                    this.initDailyStatChart();
                    this.dailyLoading = false;
                  }
                }
              });

              // 类目统计图表-查询数据(一次性返回完)
              const queryCategoryPass = {
                star_name: this.searchStarInfo, // 类目统计--第二个图表--唯一参数
              };
              this.categoryLoading = true;
              queryCategory(queryCategoryPass).then(response => {
                const data = response.data;
                if (data.success) {
                  if (data.data.data.length === 0) {
                    this.categoryStatChartInfo = [];
                    this.categoryLoading = false;
                  } else {
                    const res = response.data.data.data[0];
                    this.categoryStatChartInfo = [
                      res.category_info_15,
                      res.category_info_30,
                      res.category_info_90,
                    ];
                    this.categoryLoading = false;
                  }
                }
              });

              // 每场统计图表-查询数据(需传入最近多少场 没选择一次发一次请求)
              const displayStatpass = {
                star_name: this.searchStarInfo,
                recently_displays_num: 15,
              };
              this.displayLoading = true;
              displayStatistics(displayStatpass).then(response => {
                // 场次统计
                const data = response.data;
                if (data.success) {
                  if (data.data.data.length === 0) {
                    this.displayStatChart = echarts.init(
                      document.getElementById('displayStatChart'),
                    );
                    this.displayStatChart.clear();
                    this.displayNoDataShow();
                    this.displayLoading = false;
                  } else {
                    this.displayStatChartInfo.displayDate = [];
                    this.displayStatChartInfo.averageWatchNumHour = [];
                    this.displayStatChartInfo.averageWatchPersonHour = [];
                    this.displayStatChartInfo.watchNum = [];
                    this.displayStatChartInfo.watchPerson = [];
                    this.displayStatChartInfo.duration = [];
                    this.displayStatChartInfo.label = [];
                    const res = response.data.data.data;
                    res.reverse().forEach(item => {
                      this.displayStatChartInfo.displayDate.push(item.display_date);
                      this.displayStatChartInfo.averageWatchNumHour.push(item.average_watch_num);
                      this.displayStatChartInfo.averageWatchPersonHour.push(
                        item.average_watch_persons,
                      );
                      this.displayStatChartInfo.watchNum.push(item.watch_num);
                      this.displayStatChartInfo.watchPerson.push(item.watch_persons);
                      this.displayStatChartInfo.duration.push(item.duration);
                      this.displayStatChartInfo.label.push(item.label);
                    });
                    this.displayLoading = false;
                    this.initDisplayStatChart();
                  }
                } else {
                  // console.log(data.message)
                }
              });

              // 子类目直播排行图表-一次性返回所有数据
              const starnamepass = {
                star_name: this.searchStarInfo, // 子类目排行统计
              };
              this.smallCateLoading = true;
              smallCategory(starnamepass).then(response => {
                const result = response.data;
                if (result.success) {
                  if (result.data.data.length === 0) {
                    // 有主播信息-无数据
                    this.smallCategoryStatChartInfo = [];
                    this.childCateStatChart = echarts.init(
                      document.getElementById('childCateStatChart'),
                    );
                    this.childCateStatChart.clear();
                    this.smallCategoryNoDataShow();
                    this.smallCateLoading = false;
                  } else {
                    const res = result.data.data[0];
                    this.smallCategoryStatChartInfo[0] = res.small_category_info_15;
                    this.smallCategoryStatChartInfo[1] = res.small_category_info_30;
                    this.smallCategoryStatChartInfo[2] = res.small_category_info_90;
                    this.liveCategory = this.smallCategoryStatChartInfo[0].small_categorys;
                    this.initChildCateStatChart();
                    this.smallCateLoading = false;
                  }
                }
              });
            }
          })
          .catch(error => {
            console.log(error);
            this.$message({ message: '暂无此主播信息', type: 'warning' });
          });

        // 查询录入的信息
        const searchConditions = {
          star_name: this.searchStarInfo,
          star_id: this.$route.query.starId,
        };
        this.pieLoading = true;
        // 是合作主播时查询主播详细信息
        queryStars(searchConditions)
          .then(response => {
            const res = response.data.data.data[0];
            if (res) {
              this.showStarInfo.showStarName = res.star_name;
              this.showStarInfo.showStarId = res.star_id;
              this.showStarInfo.showStarFuns = res.fans_number;
              this.showStarInfo.Cooperation = res.responsivity;
              this.showStarInfo.category = res.category;
              this.showStarInfo.unitPrice = res.sales_price_period;
              this.showStarInfo.phoneNum = res.star_mobile;
              this.showStarInfo.weChat = res.star_wechat;
              this.showStarInfo.mixed = res.display_type;
              this.showStarInfo.addBy = res.add_by;
              this.showStarInfo.modifyBy = res.modified_by;
              if (this.showStarInfo.mixed.length === 1) {
                if (this.showStarInfo.mixed[0][0] === '专场') {
                  this.showStarInfo.mixed[1] = ['混播', 0];
                } else {
                  this.showStarInfo.mixed[1] = ['专场', 0];
                }
              }
              this.showStarInfo.latestClickNumPieData = res.cate_click_num_items;
              this.showStarInfo.imgSrc = res.pic_url;
              this.showStarInfo.wangwang = res.wangwang_name;
              // this.showStarInfo.starCost = res.star_cost
              this.showStarInfo.starSpecialCost = res.star_special_cost;
              this.showStarInfo.starSpecialPrice = res.star_special_price;
              this.showStarInfo.starMixCost = res.star_mix_cost;
              this.showStarInfo.starMixPrice = res.star_mix_price;
            } else {
              this.showStarInfo.imgSrc = this.domain + '/template/default_avatar.jpeg';
            }
            // 判断最近点击数 是否显示最近气场图表或暂未开播
            if (this.showStarInfo.latestClickNumPieData.length === 0) {
              this.pieLoading = false;
              document.getElementById('pieStatChartsPar').style.height = 0;
              document.getElementById('pieStatChartsPar').style.display = 'none';
            } else {
              document.getElementById('pieStatChartsPar').style.display = 'block';
              document.getElementById('pieStatChartsPar').style.height = '200px';
              this.clickNumLastest = [];
              this.showStarInfo.latestClickNumPieData.forEach(item => {
                this.clickNumLastest.push({
                  value: item[1],
                  name: item[0],
                });
              });
              // 渲染最近30款产品点击数图表
              this.initPieStatChart();
              this.pieStatChart.resize();
              this.pieLoading = false;
            }
          })
          .catch(error => {
            console.log(error);
            this.pieLoading = false;
          });
      } else {
        this.$message({ message: '请先输入主播昵称', type: 'warning' });
      }
    },
    // 渲染每日统计
    initDailyStatChart() {
      if (this.isDestroyed) return;
      this.periodStatChart = echarts.init(document.getElementById('periodStatChart'));
      this.periodStatChart.clear();
      this.periodStatChart.setOption({
        // 图表颜色 按顺序获取 ['#666', '#888‘]
        color: this.periodCurrentColor,
        legend: { show: true, x: 'center', top: '-999' },
        xAxis: {
          type: 'category',
          data: this.periodStatChartInfo.displayDate,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: 'var(--text-second-color)' } },
        },
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#bebebe',
              },
            },
            splitLine: {
              lineStyle: {
                color: '#f0efef',
                type: 'dashed',
              },
            },
          },
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#bebebe',
              },
            },
            splitLine: {
              lineStyle: {
                color: '#f0efef',
                type: 'dotted',
              },
            },
          },
        ],
        // hover提示
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, .8)',
          formatter(params) {
            let res =
              '<div style="color:#5273D3;font-size:14px;font-weight:bold">' +
              params[0].axisValue +
              '</div>';
            let color, seriesName, data;
            for (let i = 0; i < params.length; i++) {
              color = params[i].color;
              seriesName = params[i].seriesName;
              data = params[i].data;
              res += '<div style="color:' + color + '">' + seriesName + '：' + data + '</div>';
            }
            return res;
          },
          textStyle: {
            fontSize: 12,
          },
          axisPointer: {
            show: false,
            type: 'line',
            lineStyle: {
              color: '#c0c7dd',
              type: 'dashed',
            },
          },
        },
        grid: {
          x: 72,
          x2: 56,
          y: 36,
          y2: 46,
          borderWidth: 0,
        },
        // 数据
        series: [
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageWatchPersonByHour,
            name: '每小时观看人数',
            showSymbol: false,
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageWatchNumberByHour,
            name: '每小时观看数',
            showSymbol: false,
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageWatchPersonByDisplay,
            name: '场均观看人数',
            showSymbol: false,
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageWatchNumberByDisplay,
            name: '场均观看数',
            showSymbol: false,
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.fansPrecision,
            name: '粉丝精准度',
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageDisplayNum,
            name: '日均开播场次',
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.duration,
            name: '日均开播时长',
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageClickNum,
            name: '人均点击数',
            yAxisIndex: 1,
            showSymbol: false,
            symbol: 'circle',
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.interactiveNumByHour,
            name: '每小时互动数',
            showSymbol: false,
          },
          {
            type: 'line',
            smooth: true,
            data: this.periodStatChartInfo.averageInteractiveNum,
            name: '人均互动数',
            showSymbol: false,
            symbol: 'circle',
            yAxisIndex: 1,
          },
        ],
      });
    },
    // 渲染每场统计
    initDisplayStatChart() {
      if (this.isDestroyed) return;
      const showLabel = this.displayStatChartInfo.label.map(item => {
        if (item === '') item = '-';
        return item;
      });
      this.displayStatChart = echarts.init(document.getElementById('displayStatChart'));
      this.displayStatChart.clear();
      this.displayStatChart.setOption({
        // color: ['#4DCDB1', '#7484B7', '#BDCBF6', '#F895E7', '#5AB1EF'],
        color: this.displayCurrentColor,
        grid: { x: 72, x2: 56, y: 36, y2: 46, borderWidth: 0 },
        legend: { show: true, x: 'center', top: '-999' },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          textStyle: { color: '#333', fontSize: 12 },
          axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(69, 93, 161, 0.1)' } },
          formatter(params) {
            let res = `<div style="color:#1890FF;font-size:14px;font-weight:bold">${params[0].axisValue}</div>`;
            res += `<div style="color:#666">标签：${showLabel[params[0].dataIndex]}</div>`;
            let color, seriesName, data;
            for (let i = 0; i < params.length; i++) {
              color = params[i].color;
              seriesName = params[i].seriesName;
              data = params[i].data;
              res += '<div style="color:' + color + '">' + seriesName + '：' + data + '</div>';
            }
            return res;
          },
        },
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          data: this.displayStatChartInfo.displayDate,
          axisLine: { lineStyle: { color: 'var(--text-second-color)' } },
        },
        yAxis: [
          {
            type: 'value',
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#bebebe' } },
            splitLine: { lineStyle: { color: '#f0efef', type: 'dashed' } },
          },
          {
            type: 'value',
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#bebebe' } },
            splitLine: { lineStyle: { color: '#ececec', type: 'dotted' } },
          },
        ],
        series: [
          {
            type: 'line',
            name: '每小时观看人数',
            data: this.displayStatChartInfo.averageWatchNumHour,
            showSymbol: false,
          },
          {
            type: 'bar',
            name: '每小时观看数',
            data: this.displayStatChartInfo.averageWatchPersonHour,
            stack: '柱状',
            barMaxWidth: '30px',
          },
          {
            type: 'bar',
            name: '观看数',
            data: this.displayStatChartInfo.watchNum,
            stack: '柱状',
            barMaxWidth: '30px',
          },
          {
            type: 'line',
            name: '观看人数',
            data: this.displayStatChartInfo.watchPerson,
            showSymbol: false,
          },
          {
            type: 'line',
            name: '时长',
            data: this.displayStatChartInfo.duration,
            yAxisIndex: 1,
            showSymbol: false,
          },
        ],
      });
      this.isDrawDisplay = true;
    },
    // 渲染子类目排行
    initChildCateStatChart() {
      if (this.isDestroyed) return;
      this.childCateStatChart = echarts.init(document.getElementById('childCateStatChart'));
      this.childCateStatChart.clear();
      if (
        this.smallCategoryStatChartInfo[this.smallCateSelectedDays].small_categorys.length === 0
      ) {
        this.smallCategoryNoDataShow();
        this.smallCateLoading = false;
      } else {
        const smallCateShowInfo = this.smallCategoryStatChartInfo[this.smallCateSelectedDays];
        for (let i = 0, len = smallCateShowInfo.average_watch_persons.length; i < len; i++) {
          smallCateShowInfo.average_watch_persons[i] = parseInt(
            smallCateShowInfo.average_watch_persons[i],
            10,
          );
        }
        const options = {
          color: ['#5C82FF', '#7484B7', '#FCBD40', '#F895E7'],
          legend: { show: true, x: 'center', y: 'top' },
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            textStyle: { color: '#333', fontSize: 12 },
            axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(69, 93, 161, 0.1)' } },
          },
          grid: { x: 72, x2: 26, y: 26, y2: 46 },
          xAxis: {
            type: 'category',
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#333' } },
            axisLabel: { textStyle: { color: '#666', fontSize: 12 } },
            data: smallCateShowInfo.small_categorys,
          },
          yAxis: {
            type: 'value',
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#bebebe' } },
            splitLine: { lineStyle: { color: '#f0efef', type: 'dotted' } },
          },
          series: [],
        };
        options.series = [
          {
            type: 'bar',
            name: '场均观看人数',
            data: smallCateShowInfo.average_watch_persons,
            barMaxWidth: '6px',
            itemStyle: {
              barBorderRadius: 3,
            },
          },
        ];
        this.childCateStatChart.setOption(options);
      }
    },
    // 渲染饼图
    initPieStatChart() {
      if (this.isDestroyed) return;
      document.getElementById('pieStatChartsPar').style.height = '200px';
      this.pieStatChart = echarts.init(document.getElementById('pieStatCharts'));
      this.pieStatChart.clear();
      this.pieStatChart.setOption({
        color: PieChartColors,
        title: {
          text: '最近30款产品点击数/次',
          textStyle: {
            color: '#666',
            fontSize: 14,
            fontWeight: 'normal',
          },
          padding: [20, 18],
        },
        tooltip: {
          backgroundColor: 'rgba(255,255,255,0.8)',
          textStyle: { color: '#666', fontSize: 12 },
        },
        series: [
          {
            type: 'pie',
            radius: ['36%', '58%'],
            center: ['50%', '56%'],
            hoverOffset: 4,
            data: this.clickNumLastest,
          },
        ],
      });
    },
  },
};
</script>
<style lang="scss">
.star-personal-section {
  min-width: 1000px;
}
@import '@/styles/vars.scss';
</style>

<style lang="scss" scoped>
#periodStatChart {
  width: 100%;
  height: 356px;
}
#displayStatChart {
  width: 100%;
  height: 356px;
}
#childCateStatChart {
  width: 100%;
  height: 354px;
}
// @import '@/assets/scss/starPersonal.scss';
.stat-top {
  overflow: hidden;
  .daily-stat {
    width: calc(50% - 1px);
    height: 420px;
    background: #fff;
    float: left;
    border-right: #e8e8e8 solid 1px;
    .daily-stat-top {
      margin: 10px;
      overflow: hidden;
    }
    .daily-stat-top > span {
      float: left;
      color: var(--text-color);
    }
    .daily-stat-top > div {
      float: right;
    }
  }
}
.display-stat {
  background-color: #fff;
  border-radius: 2px;
  height: 420px;
  // margin-top: 12px;
  border-top: #e8e8e8 solid 1px;
  .display-stat-title {
    margin: 10px 0 0 10px;
    float: left;
    font-size: 14px;
    color: #666;
  }
  .dimension-dropdown {
    margin: 10px 10px 0 0;
    float: right;
    cursor: pointer;
    span {
      font-size: 12px;
      color: #666;
    }
  }
  .display-stat-day {
    width: 120px;
    // background: #f2f2f2;
    margin: 10px 10px 0 10px;
    border-radius: 20px;
    cursor: pointer;
    text-align: center;
    span {
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      color: #666;
      width: 50px;
      .display-icon {
        width: 20px;
        height: 20px;
        background: url(../../../assets/img/personal_sprite.png);
        background-position: -10px -130px;
        float: right;
        margin-left: 14px;
        vertical-align: top;
        position: relative;
        top: 2px;
      }
    }
  }
}
.founderDot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  background-color: #4dcdb1;
  vertical-align: middle;
}
.categories-ranking {
  width: 100%;
  height: 416px;
  background: #fff;
  // margin-top: 12px;
  border-top: #e8e8e8 solid 1px;
  .categories-ranking-top {
    overflow: hidden;
    .categories-ranking-title {
      float: left;
      margin: 10px 0 0 10px;
      color: #666;
    }
    .categories-ranking-dropdown {
      float: right;
      cursor: pointer;
      margin: 10px 10px 0 0;
      span {
        font-size: 12px;
      }
    }
  }
  .cate-ranking-recent {
    width: 118px;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    color: #666;
    text-align: center;
    border-radius: 16px;
    // background: #f2f2f2;
    margin: 10px 0 0 10px;
    span {
      cursor: pointer;
      font-size: 12px;
      .child-cate-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../../assets/img/personal_sprite.png);
        background-position: -5px -104px;
        vertical-align: top;
      }
    }
  }
}
.stat-top .daily-stat .recent-day-parent {
  float: left !important;
  margin-left: 20px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 2px;
}
</style>
