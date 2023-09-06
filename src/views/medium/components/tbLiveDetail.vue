<template>
  <section class="star-personal-section page-section">
    <div v-if="false" class="new-star-info-header">
      <div class="header-top">
        <i class="el-icon-arrow-left" @click="$router.back()"></i>
        <span>主播详情</span>
        <p v-show="isConStar" class="add-modify-by">
          <em>录入人：{{ showStarInfo.addBy || '--' }}</em
          >|<em>最终修改人：{{ showStarInfo.modifyBy || '--' }}</em>
        </p>
        <!-- <div class="btns">
          <el-button size="small" :disabled="showStarInfo.showStarName === '--'" @click="deleteOneStar">删除主播</el-button>
          <el-button type="primary" size="small" :disabled="showStarInfo.showStarName === '--'">新增场次</el-button>
        </div> -->
        <div class="opt-btns" v-show="isConStar">
          <span><i class="gm-icon gm-icon-edit" @click="openSaveDialog"></i></span>
          <span><i class="gm-icon gm-icon-delete" @click="deleteOneStar"></i></span>
        </div>
      </div>
      <el-row class="star-info">
        <el-col :span="8" class="border-right-gray">
          <div class="star-avatar">
            <img v-if="showStarInfo.imgSrc" :src="showStarInfo.imgSrc" class="avatar" />
            <img v-if="!showStarInfo.imgSrc" src="@/assets/img/not_match_set.png" class="avatar" />
            <span v-if="isConStar" class="star-relationship">已合作</span>
          </div>
          <div class="star-info-detail">
            <div class="star-name-box">
              <el-tooltip :content="showStarInfo.showStarName" placement="top" effect="light">
                <p class="star-name">{{ showStarInfo.showStarName }}</p>
              </el-tooltip>
              <!-- <i v-show="showStarInfo.showStarName !== '--'" class="el-icon-edit" @click="openSaveDialog"></i> -->
            </div>
            <div class="info-box" :style="`height: ${shrinkState ? '40' : '100'}px;`">
              <p class="info-item">主播ID：{{ showStarInfo.showStarId }}</p>
              <p class="info-item">
                配合度：<el-rate
                  disabled
                  style="display: inline-block; vertical-align: middle"
                  v-model="showStarInfo.Cooperation"
                ></el-rate>
              </p>
              <p class="info-item">
                淘客ID：{{ showStarInfo.wangwang === '' ? '--' : showStarInfo.wangwang }}
              </p>
              <p class="info-item">
                手机号：{{ showStarInfo.phoneNum === '' ? '--' : showStarInfo.phoneNum }}
              </p>
              <p class="info-item">
                微信号：{{ showStarInfo.weChat === '' ? '--' : showStarInfo.weChat }}
              </p>
            </div>
            <span class="shrink-btn" @click="handleShrink"
              >{{ shrinkState ? '更多资料' : '收起' }}
              <i v-show="shrinkState" class="el-icon-arrow-down"></i
              ><i v-show="!shrinkState" class="el-icon-arrow-up"></i
            ></span>
          </div>
        </el-col>
        <el-col :span="4" class="data-box-wrap">
          <div class="data-box">
            <p class="data-val">
              {{
                showStarInfo.showStarFuns === '--'
                  ? showStarInfo.showStarFuns
                  : formatNumber((showStarInfo.showStarFuns * 10000).toFixed(0))
              }}
            </p>
            <p class="data-label">粉丝数/人</p>
          </div>
        </el-col>
        <el-col :span="4" class="data-box-wrap">
          <div class="data-box">
            <p class="data-val">{{ showStarInfo.showStarDisplay }}</p>
            <p class="data-label">直播场次数/场</p>
          </div>
        </el-col>
        <el-col :span="4" class="data-box-wrap">
          <div class="data-box">
            <p class="data-val">{{ showStarInfo.showStarScore }}</p>
            <p class="data-label">流量评分</p>
          </div>
        </el-col>
        <el-col :span="4" class="data-box-wrap">
          <div class="data-box">
            <p
              class="data-val"
              :style="showStarInfo.showStarOrganize === '未知' ? 'color: #CBCBCB;' : ''"
            >
              {{ showStarInfo.showStarOrganize }}
            </p>
            <p class="data-label">当前所属机构</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="info-about-price-category" v-show="isConStar">
      <el-row :gutter="12" style="padding-left: 0; padding-right: 0">
        <el-col :span="14">
          <div class="info-block">
            <div class="box1">
              <el-row>
                <el-col class="info-block-box-wrap" :span="8">
                  <div class="info-block-box">
                    <p class="info-block-label">主播成本及报价/元</p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">混播成本</span>
                      <span class="info-block-data-val">{{
                        showStarInfo.starMixCost === 0 ? '--' : showStarInfo.starMixCost
                      }}</span>
                    </p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">混播报价</span>
                      <span class="info-block-data-val">{{
                        showStarInfo.starMixPrice === 0 ? '--' : showStarInfo.starMixPrice
                      }}</span>
                    </p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">专场成本</span>
                      <span class="info-block-data-val">{{
                        showStarInfo.starSpecialCost === 0 ? '--' : showStarInfo.starSpecialCost
                      }}</span>
                    </p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">专场报价</span>
                      <span class="info-block-data-val">{{
                        showStarInfo.starSpecialPrice === 0 ? '--' : showStarInfo.starSpecialPrice
                      }}</span>
                    </p>
                  </div>
                </el-col>
                <el-col class="info-block-box-wrap" :span="8">
                  <div class="info-block-box">
                    <p class="info-block-label">最近15场场均PV/万</p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">专场</span>
                      <span class="info-block-data-val">{{
                        showStarInfo.mixed === '--'
                          ? '--'
                          : showStarInfo.mixed[1]
                          ? showStarInfo.mixed[1][1]
                          : '0'
                      }}</span>
                    </p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">混播</span>
                      <span class="info-block-data-val">{{
                        showStarInfo.mixed === '--'
                          ? '--'
                          : showStarInfo.mixed[0]
                          ? showStarInfo.mixed[0][1]
                          : '0'
                      }}</span>
                    </p>
                  </div>
                </el-col>
                <el-col class="info-block-box-wrap no-border" :span="8">
                  <div class="info-block-box" style="width: 90%">
                    <p class="info-block-label">商品属性</p>
                    <p class="info-block-data">
                      <span class="info-block-data-label" style="width: 42px; display: inline-block"
                        >品类</span
                      >
                      <span class="info-block-data-val">
                        <p
                          v-if="!showStarInfo.star_category"
                          class="star-name"
                          style="display: inline; position: static"
                        >
                          --
                        </p>
                        <el-tooltip
                          v-if="showStarInfo.star_category"
                          :content="showStarInfo.star_category"
                          placement="top"
                          effect="light"
                          style="display: inline; position: static"
                        >
                          <p class="star-name">{{ showStarInfo.star_category }}</p>
                        </el-tooltip>
                      </span>
                    </p>
                    <p class="info-block-data">
                      <span class="info-block-data-label">客单价</span>
                      <span class="info-block-data-val">{{
                        getSales(showStarInfo.unitPrice)
                      }}</span>
                    </p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="info-block">
            <div v-loading="pieLoading" class="pie-chart">
              <div id="pieStatChartsPar">
                <div id="pieStatCharts"></div>
              </div>
              <div
                class="click-num-noData"
                v-show="showStarInfo.latestClickNumPieData.length === 0"
              >
                最近30款产品点击数/次
                <span>还没有开播 ~</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-tabs class="data-tab" v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane label="直播场次" name="LiveEvent"></el-tab-pane>
      <el-tab-pane label="粉丝画像" name="FanPortrait"></el-tab-pane>
      <el-tab-pane label="数据统计" name="LiveData"></el-tab-pane>
    </el-tabs>
    <!-- 直播场次 -->
    <div v-if="activeTabName === 'LiveEvent'">
      <liveRecords :starName="starName" :starId="starId" />
    </div>
    <!-- 粉丝画像 -->
    <div v-if="activeTabName === 'FanPortrait'">
      <fanPortrait :starName="showStarInfo.showStarName" />
    </div>
    <!-- 数据统计 -->
    <div v-show="activeTabName === 'LiveData'">
      <dataStatistics :starName="chartStarName" ref="dataStatistics" />
    </div>
  </section>
</template>

<script>
// import echarts from 'echarts';
import * as echarts from 'echarts';
import { domain } from '@/utils/variable';
import { queryStarStat, sortStar } from '@/api/stat';
import {
  salesPriceOptions,
  periodStatDimension,
  displayStatDimension,
  displayRecentDayDimension,
  smallCategoryDaydimension,
  categoryOptions,
} from '@/const/options';
import { noDataOption } from '@/const/optionChart';
import { queryStars } from '@/api/star';
import fanPortrait from '@/views/fans';
import liveRecords from '../../chart/component/liveRecords';
import dataStatistics from '../../chart/component/dataStatistics';
import { PieChartColors } from '@/const/chart';
import { RouterNameProjectManage } from '@/const/router';

export default {
  components: {
    fanPortrait,
    liveRecords,
    dataStatistics,
  },
  props: {
    starName: String,
    starId: String,
  },
  data() {
    return {
      domain,
      noDataOption,
      pieLoading: false,
      dailyLoading: false,
      categoryLoading: false,
      displayLoading: false,
      smallCateLoading: false,
      salesPriceOptions,
      categoryOptions,
      isOnfoucs: false,
      searchStarInfo: '',
      showStarInfo: {
        showStarName: '--',
        showStarId: '--',
        showStarFuns: '--',
        showStarDisplay: '--',
        showStarScore: '--',
        showStarOrganize: '--',
        Cooperation: 0,
        phoneNum: '--',
        weChat: '--',
        category: '--',
        category_items: [],
        unitPrice: '--',
        mixed: '--',
        special: '--',
        latestClickNumPieData: [],
        imgSrc: '',
        wangwang: '--',
        starSpecialCost: '--',
        starSpecialPrice: '--',
        starMixCost: '--',
        starMixPrice: '--',
        addBy: '--',
        modifyBy: '--',
      },
      periodStatChart: null, // 时间段图表
      periodStatDimension,
      // periodCurrentColor: [],
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
      // displayRecentDay: '最近15场',
      displayRecentDayDimension,
      // displayCurrentColor: [],
      // isOpenDisplayDimen: false,
      // displayArrowNum: 0,
      // smallCateDimenRecent: '最近15天', // 子类目排行
      smallCategoryDaydimension,
      // smallCategoryStatChartInfo: [
      //   {}, {}, {}
      // ],
      // childCateStatChart: null,
      // smallCateSelectedDays: 0,
      // liveCategory: [],
      // isDrawCate: false,
      // isDrawDisplay: false,
      isConStar: false,
      clickNumLastest: [],
      pieStatChart: null,
      // 是否销毁
      isDestroyed: false,
      // 数据展示部分，激活状态tab名称
      activeTabName: 'LiveEvent',
      // 用户信息收缩
      shrinkState: true,
      // 编辑弹窗是否显示
      // saveStarDialogVisible: false,
      // starInfoForm: {},
      // starDetailData: null, // 主播详情完整数据
      chartStarName: '', // 数据统计组件传入的主播名称
    };
  },
  created() {
    this.showStarInfo.showStarName = this.starName;
  },
  mounted() {
    document.getElementById('pieStatChartsPar').style.height = 0;
    this.mountedSearch();
    window.addEventListener('resize', this.winResize);

    // // 判断是否直接显示粉丝画像tab
    // if (this.$route.query.tab && this.$route.query.tab === 'fans') {
    //   this.activeTabName = 'FanPortrait'
    // }

    // console.log(this.starName, this.starId)
  },
  beforeDestroy() {
    // 销毁了就不再渲染图表，防止报错
    this.isDestroyed = true;
    window.removeEventListener('resize', this.winResize);
  },
  methods: {
    mountedSearch() {
      if (this.starName) {
        this.searchStarInfo = this.starName;
        this.searchStar();
      } else {
        // 进入主播详情页后查询榜单第一名
        sortStar({ num: 1 }).then(response => {
          const data = response.data;
          if (data.success) {
            this.searchStarInfo = data.data.data[0].star_name;
            this.searchStar();
          }
        });
      }
    },
    // resize事件
    winResize() {
      // debugger
      if (this.isConStar && this.showStarInfo.latestClickNumPieData.length > 0) {
        this.pieStatChart.resize();
      }
    },
    // 跳转到场次页
    goDisplayDetail(value) {
      // this.$router.push({path: '/data/display-info', query: {'starName': value}})
      this.$router.push({
        name: RouterNameProjectManage.marketing.display.list,
        query: { starName: value },
      });
    },
    getSales(value) {
      this.salesPriceOptions.forEach(item => {
        if (value === item.value) {
          value = item.label;
        }
      });
      return value;
    },
    // 搜索主播-进入页面时执行
    async searchStar() {
      if (this.searchStarInfo !== '' && this.searchStarInfo !== null) {
        const searchStarPass = {
          star_name: this.searchStarInfo,
        };

        // 同步写法：请求下一个接口后展示数据会用到第一个接口的数据，异步返回先后顺序不可控可能引起图表展示问题
        try {
          const response = await queryStarStat(searchStarPass);
          const data = response.data;
          if (data.success) {
            if (data.data.data.length === 0) {
              return false;
            }

            const res = data.data.data[0];
            this.showStarInfo.showStarDisplay = res.display_num;
            this.showStarInfo.showStarScore = res.score;
            this.showStarInfo.showStarOrganize = res.organization;
            this.showStarInfo.showStarFuns = res.fans_number;
            this.showStarInfo.showStarName = res.star_name;
            this.showStarInfo.showStarId = res.star_id;
            this.showStarInfo.imgSrc = res.pic_url;

            // 判断是否为合作主播
            if (data.data.data[0].is_cooperation === 1) {
              this.isConStar = true;
            } else {
              this.isConStar = false;
              this.chartStarName = this.showStarInfo.showStarName;
              this.activeTabName = 'LiveData';
              this.$nextTick(() => {
                this.$refs.dataStatistics.mountedSearch();
              });
            }
          }
        } catch (error) {
          console.log(error);
          this.$message({ message: '暂无此主播信息', type: 'warning' });
        }

        // 查询录入的信息
        const searchConditions = {
          star_name: this.searchStarInfo,
          star_id: this.starId,
        };
        this.pieLoading = true;
        // 是合作主播时查询主播详细信息
        queryStars(searchConditions)
          .then(response => {
            const res = response.data.data.data[0];
            // this.starDetailData = res
            if (res) {
              this.showStarInfo.showStarName = res.star_name;
              this.showStarInfo.showStarId = res.star_id;
              this.showStarInfo.showStarFuns = res.fans_number;
              this.showStarInfo.Cooperation = res.responsivity;
              this.showStarInfo.category = res.category;
              this.showStarInfo.star_category = res.star_category;
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
              if (!this.showStarInfo.imgSrc) this.showStarInfo.imgSrc = res.pic_url;
              this.showStarInfo.wangwang = res.wangwang_name;
              // this.showStarInfo.starCost = res.star_cost
              this.showStarInfo.starSpecialCost = res.star_special_cost;
              this.showStarInfo.starSpecialPrice = res.star_special_price;
              this.showStarInfo.starMixCost = res.star_mix_cost;
              this.showStarInfo.starMixPrice = res.star_mix_price;
            } else {
              if (!this.showStarInfo.imgSrc)
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
              this.$nextTick(() => {
                this.initPieStatChart();
                this.pieStatChart.resize();
                this.pieLoading = false;
              });
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
    // 收缩
    handleShrink() {
      this.shrinkState = !this.shrinkState;
    },
    // 数字千位格式化
    formatNumber(num) {
      const str = num + '';
      const str0 = str.split('.')[0];
      // ["8", "7", "6", "5", "4", "3", "2", "1"]
      return str0
        .split('')
        .reverse()
        .reduce((prev, next, index) => {
          return (index % 4 ? next : next + ',') + prev;
        });
    },
    // 监控tab切换
    handleTabClick() {
      if (this.activeTabName === 'LiveData') {
        this.chartStarName = this.showStarInfo.showStarName;
        this.$nextTick(() => {
          this.$refs.dataStatistics.mountedSearch();
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.star-personal-section {
  min-width: 100%;
  width: 100%;
}
@import '@/styles/vars.scss';
.info-attr-con-rate {
  .el-rate {
    .el-rate__item {
      .el-rate__icon {
        font-size: 14px;
      }
    }
  }
}
.edit-star-dialog {
  .el-form-item__error {
    right: 0;
    top: -20px;
  }
  .el-form-item__label {
    line-height: 15px;
    padding-bottom: 4px;
  }
  .el-dialog__body {
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f1f2;
  }
  .el-dialog__footer {
    margin-top: 10px;
  }
  .el-dialog__header {
    background: #f8f8f8;
    border-bottom: #efefef solid 1px;
    .el-dialog__headerbtn {
      top: 13px;
    }
    span,
    i {
      color: var(--text-second-color) !important;
    }
  }
}
.edit-star-dialog {
  .el-row {
    width: 80%;
    margin: 0 auto;
    .el-form-item {
      width: 43%;
      margin-left: 3%;
      margin-right: 3%;
      position: relative;
      margin-bottom: 6px;
      // span {
      //   font-size: 12px;
      //   color: $color-primary;
      //   position: absolute;
      //   top: -26px;
      //   right: 0;
      // }
      .el-select {
        width: 100%;
      }
    }
  }
  .el-button {
    width: 80px;
  }
}
</style>

<style lang="scss" scoped>
$color-primary: var(--theme-color);
::v-deep .el-col {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
::v-deep .el-tabs__item.is-top {
  color: var(--text-des-color);
}
::v-deep .el-tabs__item:hover {
  color: #666;
  cursor: pointer;
}
::v-deep .el-tabs__item.is-top:last-child {
  padding-right: 20px;
}
::v-deep .el-tabs__item.is-top:nth-child(2) {
  padding-left: 20px;
}
::v-deep .el-tabs__active-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0;
  z-index: -2020;
}
::v-deep .el-tabs__item.is-active {
  font-size: 18px !important;
  color: #333333 !important;
  font-weight: 600;
  position: relative;
  &::after {
    display: block;
    content: '';
    width: 80%;
    height: 11px;
    border-radius: 6px;
    background: #ffce36;
    position: absolute;
    left: 10px;
    bottom: 16px;
    z-index: -1;
  }
}
.star-personal-section {
  padding-bottom: 0;
  // margin-top: 10px;
  .top-el-row {
    height: 48px;
    div {
      position: relative;
      display: inline-block;
    }
    .search-button {
      width: 18px;
      height: 18px;
      background: url(../../../assets/img/personal_sprite.png);
      background-position: -8px -6px;
      border: none;
      outline: none;
      position: absolute;
      right: 18px;
      top: 22px;
      cursor: pointer;
    }
    .search-button:hover {
      top: 23px;
    }
    .search-input {
      width: 306px;
      height: 32px;
      line-height: 32px;
      padding-left: 14px;
      margin-top: 14px;
      font-size: 12px;
      outline: none;
      border: none;
      color: #666;
      border-radius: 2px;
    }
    .onfoucs-style {
      background-color: #e4e4e4;
    }
    .onblur-style {
      background-color: #dcdcdc;
    }
  }
}
/* 以下需要注释 */
// 修改
// .not-con-style {
//   background: #fff;
//   margin: 12px 0;
//   font-size: 0;
//   .info-left {
//     width: 20%;
//     box-sizing: border-box;
//     // background-image: url(../../assets/img/not_con.png);
//     // background-position: 0 0;
//     // background-repeat: no-repeat;
//     .info-left-child {
//       margin: 20px 0;
//       border-right: 1px dashed #ebebeb;
//     }
//   }
//   .info-right {
//     width: 80%;
//     box-sizing: border-box;
//     margin: 20px 0;
//     .info-desc-par {
//       display: inline-block;
//       box-sizing: border-box;
//       width: 25%;
//       border-right: 1px dashed #ebebeb;
//       .info-desc-num {
//         font-size: 26px;
//         font-weight: 400;
//       }
//     }
//   }
//   .info-desc {
//     font-size: 20px;
//     font-weight: 600;
//     color: $color-primary;
//     text-align: center;
//     // margin-top: 12px;
//     height: 40px;
//     line-height: 40px;
//   }
//   .info-attr {
//     display: block;
//     text-align: center;
//     font-size: 14px;
//     color: #666;
//     height: 30px;
//     line-height: 30px;
//   }
// }
/* 以上需要注释 */
/* 以下需要注释 */
.is-con-style {
  margin: 12px 0;
  background-color: #fff;
  .info-desc {
    font-size: 20px;
    font-weight: 600;
    color: $color-primary;
    text-align: center;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .info-attr {
    display: block;
    text-align: center;
    font-size: 14px;
    color: #666;
    height: 30px;
    line-height: 30px;
  }
  .info-left {
    padding: 10px;
    background: #fff;
    width: calc(24% - 12px);
    background-image: url(../../../assets/img/personal_sprite.png);
    background-position: -178px -178px;
    background-repeat: no-repeat;
    .head-img {
      width: 84px;
      height: 84px;
      border-radius: 50%;
      margin: 4px auto;
      overflow: hidden;
      img {
        width: 84px;
        height: 84px;
        border-radius: 50%;
      }
    }
    .info-desc-con {
      height: 30px;
      line-height: 30px;
    }
    .info-attr-con {
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        font-size: 12px;
        display: inline-block;
        height: 18px;
        line-height: 18px;
        margin-top: 14px;
        padding: 1px 9px;
        color: $color-primary;
        background: #ebf3ff;
        border-radius: 20px;
      }
    }
    .info-attr-con-rate {
      font-size: 14px;
      color: #666;
      height: 32px;
      line-height: 32px;
      white-space: nowrap;
      border-bottom: 1px dashed #ebebeb;
      text-align: center;
      margin-top: 8px;
    }
    .info-phone-wechat {
      text-align: center;
      height: 22px;
      line-height: 22px;
      color: #666;
      margin-top: 10px;
      i {
        vertical-align: bottom;
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(../../../assets/img/personal_sprite.png) -8px -186px no-repeat;
      }
      .icon-wechat {
        background: url(../../../assets/img/personal_sprite.png) -8px -157px no-repeat;
      }
    }
  }
  .info-line {
    width: 12px;
    height: 322px;
    background: #f1f2f3;
  }
  .info-right {
    background: #fff;
    width: 76%;
    font-size: 0;
    box-sizing: border-box;
    .info-desc-par {
      display: inline-block;
      box-sizing: border-box;
      width: 25%;
      border-right: 1px dashed #ebebeb;
      margin: 20px 0;
      .el-icon-arrow-right {
        cursor: pointer;
        font-size: 24px;
      }
      .info-desc-num {
        font-size: 26px;
        font-weight: 400;
      }
    }
  }
  .basic-right-bot {
    .pro-attr {
      box-sizing: border-box;
      padding: 10px 18px;
      width: calc(50% - 6px);
      .pro-attr-top {
        height: 90px;
        .pro-attr-cost-price {
          font-size: 14px;
          .cost-price-tit {
            color: #666;
            margin-bottom: 6px;
          }
          .cost-price-desc {
            .cost-price-part {
              width: 49%;
              display: inline-block;
              color: var(--text-des-color);
              line-height: 30px;
              p {
                span {
                  font-size: 16px;
                  font-weight: 600;
                  color: $color-primary;
                }
              }
            }
          }
        }
      }
      .pro-attr-recent-pv {
        height: 94px;
        border-top: 1px dashed #ebebeb;
        font-size: 14px;
        p {
          color: #666;
          line-height: 32px;
        }
        span {
          color: var(--text-des-color);
          line-height: 30px;
          display: block;
          strong {
            color: $color-primary;
          }
        }
        .mix-spec-pv {
          display: block;
          width: 100%;
        }
      }
    }
    .pie-chart {
      width: calc(50% - 6px);
      .el-col {
        height: 220px;
      }
    }
    .click-num-noData {
      box-sizing: border-box;
      padding: 10px;
      width: 100%;
      height: 100%;
      color: #666;
      background: url(../../../assets/img/pvnull.png) center 48px no-repeat;
      span {
        display: block;
        text-align: center;
        margin-top: 140px;
        font-size: 14px;
        color: #a9a6aa;
        font-weight: 300;
      }
    }
  }
}
/* 以上需要注释 */
.show-info-stat {
  .fans-color {
    color: #3bc6bb;
  }
  .display-color {
    color: #ff9639;
  }
  .score-color {
    color: #e880f7;
  }
  .org-color {
    color: #5a08e2;
  }
}
.el-dropdown-menu__item {
  font-size: 12px;
  line-height: 22px;
  color: #666;
}
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
.recent-day-parent {
  width: 118px;
  background: #f2f2f2;
  border-radius: 20px;
  text-align: center;
  .recent-day {
    cursor: pointer;
    font-size: 12px;
    color: #666;
    height: 24px;
    line-height: 24px;
    overflow: hidden;
    .date-form-icon {
      width: 20px;
      height: 20px;
      background: url(../../../assets/img/personal_sprite.png);
      background-position: -11px -106px;
      vertical-align: top;
      float: right;
      margin-right: 12px;
      position: relative;
      top: 1px;
    }
  }
}
.circleDot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  margin-right: 4px;
}
.el-dropdown-menu__item:hover {
  color: $color-primary;
  background: rgba(239, 239, 247, 1);
}
#pieStatCharts {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  margin-left: 0;
}
#pieStatCharts:hover {
  box-shadow: none;
}
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
.no-conStar {
  text-align: center;
  line-height: 160px;
  color: var(--text-third-color);
}
.no-conStar:hover {
  box-shadow: none !important;
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
    background: #f2f2f2;
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
    background: #f2f2f2;
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
.el-dropdown-menu-childCate {
  max-height: 200px;
  overflow: auto;
  opacity: 0.8;
}

// 2019-4-17 modify by BaiQing
.data-tab {
  background: #fff;
  ::v-deep .el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap {
      padding-left: 10px;
      &::after {
        background-color: #e8e8e8;
        height: 1px;
      }
    }
  }
  ::v-deep .el-tabs__item {
    line-height: 60px;
    height: 60px;
    font-size: 16px;
  }
  // ::v-deep #tab-LiveData {
  //   padding: 0 20px;
  // }
}
.stat-top {
  .daily-stat {
    .daily-stat-top {
      .recent-day-parent {
        float: left;
        background: #fff;
      }
    }
  }
}
.display-stat {
  .display-stat-day {
    background: #fff;
  }
}
.categories-ranking {
  .cate-ranking-recent {
    background: #fff;
  }
}

// 主播详情 上半部分
.new-star-info-header {
  background: #fff;
  margin-bottom: 12px;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04);
  .header-top {
    height: 54px;
    line-height: 54px;
    i {
      width: 36px;
      text-align: center;
      color: #bfc1c8;
      font-size: 18px;
      font-weight: 600;
      vertical-align: text-bottom;
      cursor: pointer;
    }
    span {
      color: #666;
      font-size: 16px;
      font-weight: 600;
      margin-right: 30px;
    }
    p {
      display: inline-block;
      color: var(--text-des-color);
      font-size: 12px;
    }
    .btns {
      float: right;
      padding-right: 12px;
    }
    .add-modify-by {
      em {
        font-style: normal;
        margin: 0 15px;
      }
    }
    .opt-btns {
      float: right;
      height: 54px;
      overflow: hidden;
      span {
        display: inline-block;
        padding: 10px;
        border-left: #f5f5f5 solid 1px;
        height: 34px;
        margin: 0;
      }
    }
  }
  .star-info {
    border-top: #f5f5f5 solid 1px;
    // height: 154px;
    .star-avatar {
      padding: 30px 20px;
      position: relative;
      float: left;
      .avatar {
        width: 86px;
        height: 86px;
        border-radius: 50%;
      }
      .star-relationship {
        position: absolute;
        top: 104px;
        left: 32px;
        background: #ffb423;
        color: #fff;
        border-radius: 10px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        padding: 0 10px;
        border: #fff solid 2px;
      }
    }
    .star-info-detail {
      padding: 30px 0;
      float: left;
      .star-name-box {
        position: relative;
        display: inline-block;
        .el-icon-edit {
          position: absolute;
          right: -30px;
          top: 5px;
          font-size: 18px;
          cursor: pointer;
          color: #cfd0d6;
        }
      }
      .star-name {
        font-size: 20px;
        color: var(--text-color);
        margin-bottom: 5px;
        max-width: 175px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
      }
      .info-box {
        // height: 40px;
        overflow: hidden;
        .info-item {
          font-size: 12px;
          color: var(--text-des-color);
          line-height: 20px;
          ::v-deep .el-rate__icon {
            font-size: 13px;
            margin-top: 2px;
          }
        }
      }
      .shrink-btn {
        color: #5c82ff;
        font-size: 12px;
        cursor: pointer;
        display: inline-block;
        margin-top: 2px;
        i {
          font-weight: 600;
        }
      }
    }
    .border-right-gray {
      border-right: #f5f5f5 solid 1px;
    }
    .data-box-wrap {
      margin-top: 40px;
      border-right: #ebebeb dashed 1px;
      .data-box {
        position: relative;
        left: 50%;
        display: inline-block;
        .data-val {
          position: relative;
          left: -50%;
          font-size: 26px;
          padding-bottom: 15px;
          color: var(--text-color);
        }
        .data-label {
          position: relative;
          left: -50%;
          color: var(--text-des-color);
          font-size: 14px;
        }
      }
    }
  }
}
// 成本信息 以及 品类信息
.info-about-price-category {
  .box1 {
    border: 1px solid #ebeef6;
    margin-left: 10px;
    border-radius: 10px;
  }
  .info-block {
    background: #fff;
    // padding: 20px 0;
    .info-block-box-wrap {
      height: 160px;
      margin: 20px 0;
      .info-block-box {
        position: relative;
        left: 50%;
        display: inline-block;
        p {
          position: relative;
          left: -50%;
        }
      }
      .info-block-label {
        color: #666;
        font-size: 14px;
        margin: 0 0 25px 0;
      }
      .info-block-data {
        margin-bottom: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .info-block-data-label {
          display: inline-block;
          margin-right: 20px;
          color: var(--text-des-color);
        }
        .info-block-data-val {
          font-size: 16px;
          color: var(--text-color);
        }
      }
    }
  }
}
.click-num-noData {
  height: 200px;
  line-height: 200px;
  text-align: center;
  color: var(--text-des-color);
  font-size: 16px;
  border-radius: 10px;
  margin: 0 10px;
  border: 1px solid #ebeef6;
}
</style>
