<template>
  <section class="star-personal-section page-section">
    <div class="new-star-info-header">
      <div class="header-top">
        <i class="el-icon-arrow-left" @click="$router.back()"></i>
        <span>主播详情</span>
        <p v-show="isConStar" class="add-modify-by">
          <em>录入人：{{ showStarInfo.addBy || '--' }}</em
          >|<em>最终修改人：{{ showStarInfo.modifyBy || '--' }}</em>
        </p>
        <div class="opt-btns" v-show="isConStar">
          <span v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_kol)"
            ><i class="gm-icon gm-icon-edit" @click="openSaveDialog"></i
          ></span>
          <span v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_kol)"
            ><i class="gm-icon gm-icon-delete" @click="deleteOneStar"></i
          ></span>
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
      <el-row :gutter="12">
        <el-col :span="12">
          <div class="info-block">
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
                    <span class="info-block-data-val">{{ getSales(showStarInfo.unitPrice) }}</span>
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
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
      <el-tab-pane label="直播场次" name="LiveEvent" />
      <el-tab-pane label="粉丝画像" name="FanPortrait" />
      <el-tab-pane label="数据统计" name="LiveData" />
    </el-tabs>
    <div v-show="activeTabName === 'LiveData'">
      <dataStatistics :starName="chartStarName" ref="dataStatistics" />
    </div>
    <div v-if="activeTabName === 'FanPortrait'">
      <fanPortrait :starName="showStarInfo.showStarName" />
    </div>
    <div v-if="activeTabName === 'LiveEvent'">
      <liveRecords :starName="showStarInfo.showStarName" />
    </div>
    <el-dialog
      title=""
      :visible.sync="saveStarDialogVisible"
      class="edit-star-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="editDialogClose('starInfoForm')"
      append-to-body
      custom-class="dialog-min-width"
    >
      <template #title>
        <div class="cutom-header"><span>编辑主播信息</span></div>
      </template>
      <el-form
        :model="starInfoForm"
        :inline="true"
        size="small"
        label-position="top"
        ref="starInfoForm"
      >
        <el-row>
          <el-form-item
            label="主播ID"
            prop="star_id"
            :rules="[{ required: true, message: '淘客ID不能为空' }]"
          >
            <el-input
              name="star_id"
              v-model="starInfoForm.star_id"
              type="number"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机号"
            prop="star_mobile"
            :rules="[{ required: true, message: '手机号不能为空' }]"
          >
            <el-input
              name="star_mobile"
              v-model="starInfoForm.star_mobile"
              type="number"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="配合度"
            prop="responsivity"
            :rules="[{ required: true, message: '配合度不能为空' }]"
          >
            <el-rate v-model="starInfoForm.responsivity" show-text name="responsivity"></el-rate>
          </el-form-item>
          <el-form-item
            label="粉丝数"
            prop="fans_number"
            :rules="[{ required: true, message: '粉丝量不能为空' }]"
          >
            <el-input
              name="fans_number"
              v-model="starInfoForm.fans_number"
              type="number"
              @mousewheel.native.prevent
            >
              <template #append>万</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="昵 称"
            prop="star_name"
            :rules="[{ required: true, message: '昵称不能为空' }]"
          >
            <el-input name="star_name" v-model="starInfoForm.star_name"></el-input>
          </el-form-item>
          <el-form-item
            label="微信号"
            prop="star_wechat"
            :rules="[{ required: true, message: '微信号不能为空' }]"
          >
            <el-input name="star_wechat" v-model="starInfoForm.star_wechat"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <!-- <el-form-item label="品 类" prop="category" :rules="[{required: true, message: '品类不能为空'}]">
            <el-select v-model="starInfoForm.category" placeholder="请选择" name="category">
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item
            label="客单价"
            prop="sales_price_period"
            :rules="[{ required: true, message: '客单价不能为空' }]"
          >
            <el-select
              v-model="starInfoForm.sales_price_period"
              placeholder="请选择"
              name="sales_price_period"
            >
              <el-option
                v-for="item in salesPriceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="淘客ID">
            <el-input v-model="starInfoForm.wangwang_name"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="主播专场报价">
            <el-input v-model="starInfoForm.star_special_price">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="主播专场成本">
            <el-input v-model="starInfoForm.star_special_cost">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="主播混播报价">
            <el-input v-model="starInfoForm.star_mix_price">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="主播混播成本">
            <el-input v-model="starInfoForm.star_mix_cost">
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="big-button"
            size="small"
            @click="
              editDialogClose('starInfoForm');
              saveStarDialogVisible = false;
            "
            >取消</el-button
          >
          <el-button
            class="big-button btn-blue"
            type="primary"
            @click="submitSaveStar(starInfoForm, 'starInfoForm')"
            size="small"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import echarts from 'echarts';
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
import { queryStars, saveStar, deleteStar } from '@/api/star';
import fanPortrait from '@/views/fans';
import liveRecords from './component/liveRecords';
import dataStatistics from './component/dataStatistics';
import { RIGHT_CODE } from '@/const/roleCode';
import { PieChartColors } from '@/const/chart';
import { RouterNameProjectManage } from '@/const/router';

export default {
  components: {
    fanPortrait,
    liveRecords,
    dataStatistics,
  },
  data() {
    return {
      RIGHT_CODE,
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
      displayRecentDayDimension,
      smallCategoryDaydimension,
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
      saveStarDialogVisible: false,
      starInfoForm: {},
      starDetailData: null, // 主播详情完整数据
      chartStarName: '', // 数据统计组件传入的主播名称
    };
  },
  mounted() {
    document.getElementById('pieStatChartsPar').style.height = 0;
    this.mountedSearch();
    window.addEventListener('resize', this.winResize);

    // 判断是否直接显示粉丝画像tab
    if (this.$route.query.tab && this.$route.query.tab === 'fans') {
      this.activeTabName = 'FanPortrait';
    }
  },
  beforeDestroy() {
    // 销毁了就不再渲染图表，防止报错
    this.isDestroyed = true;
    window.removeEventListener('resize', this.winResize);
  },
  methods: {
    mountedSearch() {
      if (this.$route.query.starName) {
        this.searchStarInfo = this.$route.query.starName;
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
      if (this.isConStar && this.showStarInfo.latestClickNumPieData.length > 0) {
        this.pieStatChart.resize();
      }
    },
    // 跳转到场次页
    goDisplayDetail(value) {
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
          star_id: this.$route.query.starId,
        };
        this.pieLoading = true;
        // 是合作主播时查询主播详细信息
        queryStars(searchConditions)
          .then(response => {
            const res = response.data.data.data[0];
            this.starDetailData = res;
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
    // 点击编辑主播信息
    openSaveDialog() {
      this.saveStarDialogVisible = true;
      this.starInfoForm = JSON.parse(JSON.stringify(this.starDetailData));
      const getStarCostArr = [
        'star_mix_cost',
        'star_mix_price',
        'star_special_cost',
        'star_special_price',
      ];
      getStarCostArr.forEach(item => {
        if (this.starInfoForm[item] === 0) this.starInfoForm[item] = '';
      });
      this.isClickEdit = true;
    },
    // 关闭编辑弹窗
    editDialogClose(formName) {
      this.searchStar();
      this.$refs[formName].resetFields();
    },
    // 提交保存
    submitSaveStar(starInfoForm, formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const starinfopass = {
            id: starInfoForm.id,
            star_id: starInfoForm.star_id,
            star_name: starInfoForm.star_name,
            star_mobile: starInfoForm.star_mobile,
            star_wechat: starInfoForm.star_wechat,
            responsivity: starInfoForm.responsivity,
            sales_price_period: starInfoForm.sales_price_period,
            category: starInfoForm.category,
            fans_number: starInfoForm.fans_number,
            wangwang_name: starInfoForm.wangwang_name,
            star_special_price: starInfoForm.star_special_price,
            star_special_cost: starInfoForm.star_special_cost,
            star_mix_price: starInfoForm.star_mix_price,
            star_mix_cost: starInfoForm.star_mix_cost,
          };
          // if (starinfopass.category === '无') {
          //   this.$gmMessage('品类属性不能为“无”', 'tip')
          // } else
          if (starinfopass.responsivity === 0) {
            this.$gmMessage('主播配合度不能为空', 'tip');
          } else {
            saveStar(starinfopass).then(response => {
              const result = response.data;
              if (result.success) {
                this.saveStarDialogVisible = false;
                this.$gmMessage(result.message);
                this.starInfoForm = {};
                this.starSuggest = [];
                // this.starSearchSuggest()
                // this.mountedSearch()
                // 为了防止修改主播名称和主播id导致当前页面无数据，所以利用router.replace替换当前路由
                this.$router.replace({
                  path: '/star-personal',
                  query: {
                    starName: starinfopass.star_name,
                    starId: starinfopass.star_id,
                  },
                });
              } else {
                this.$gmMessage(result.message, 'tip');
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 删除主播
    deleteOneStar() {
      this.$confirm('确认删除主播？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const starinfo = {
            star_id: JSON.stringify(this.showStarInfo.showStarId),
          };
          deleteStar(starinfo)
            .then(response => {
              const data = response.data;
              if (data.success) {
                this.$gmMessage(data.message);
                // this.queryStar(this.starQueryForm)
                this.$router.go(-1);
              } else {
                this.$gmMessage(data.message, 'tip');
              }
            })
            .catch(() => {
              this.$message({
                type: 'warning',
                message: '删除失败',
              });
            });
        })
        .catch(() => {
          /* do nth */
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

<style lang="scss">
@import '@/styles/vars.scss';

.star-personal-section {
  min-width: 1000px;
}

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
      color: #666 !important;
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
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/starPersonal.scss';
</style>
