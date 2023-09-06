<template>
  <section class="page-section">
    <el-row>
      <el-button size="small" icon="el-icon-arrow-left" type="primary" @click="$router.go(-1)"
        >返回</el-button
      >
    </el-row>
    <el-row class="top-tabs">
      <i
        class="el-icon-arrow-right"
        @click="isRightArrow = !isRightArrow"
        :class="isRightArrow ? 'is-right' : 'is-bot'"
      ></i>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="需求详情" name="requirement">
          <transition name="plan-active">
            <el-row v-show="!isRightArrow" v-loading="requirementDetailLoading">
              <requirement-detail
                :requirementDetailInfo="requirementDetailInfo"
              ></requirement-detail>
              <el-col class="detail-footer"
                >成本计算：<span>{{ totalCost }} 元</span></el-col
              >
            </el-row>
          </transition>
        </el-tab-pane>
        <el-tab-pane label="商品列表" name="product">
          <transition name="plan-active">
            <el-row v-show="!isRightArrow" style="padding: 0 10px" v-loading="productListLoading">
              <el-row
                class="product-list-desc"
                v-for="(item, index) in importedProInfo"
                :key="index"
              >
                <el-col :span="2"
                  ><i class="icon-num">{{ index + 1 }}</i></el-col
                >
                <el-col :span="22">
                  <el-row :gutter="5" class="pro-desc">
                    <el-col :span="10" class="text-overflow-cls">
                      商品名称： <span class="text-overflow-cls">{{ item.product_name }}</span>
                    </el-col>
                    <el-col :span="7">
                      预 计 成 本 ：<span>{{ item.display_cost }} 元</span>
                    </el-col>
                    <el-col :span="7">品类：{{ categoryFormate(item) }}</el-col>
                  </el-row>
                  <el-row :gutter="5" class="pro-desc">
                    <el-col :span="10"
                      >商品链接：
                      <span class="pro-link">
                        <a :href="item.product_url" target="_blank" :title="item.product_name">
                          <i class="gm-icon-link"></i>
                          点击跳转
                        </a>
                      </span>
                    </el-col>
                    <el-col :span="7"
                      >活动价(客单价)：<span>{{ item.product_sales_price }} 元</span></el-col
                    >
                    <el-col :span="7"><span>&nbsp;</span></el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-row>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-row class="plan-list" v-if="matchPlanList.length === 0">
      <p style="text-align: center; color: var(--text-third-color); line-height: 120px">
        还没有方案~
      </p>
    </el-row>
    <template v-if="matchPlanList.length > 0">
      <el-row
        class="plan-list"
        v-for="(item, index) in matchPlanList"
        :key="index"
        v-loading="planListLoading"
      >
        <el-col :span="5" class="plan-list-desc-star">
          <el-row class="star-header">
            <img :src="item.star_info.pic_url" alt="" />
            <p>{{ item.star_info.star_name }}</p>
          </el-row>
          <el-row class="star-cost-amount">
            <div class="star-cost">
              <span>{{ item.star_info.star_mix_cost }}</span>
              <p>混播成本/元</p>
            </div>
          </el-row>
          <el-row class="replace-star">
            <el-button
              size="small"
              type="primary"
              @click="
                clickReplaceStar(index);
                replaceStarDialogVisible = true;
              "
              >替换主播</el-button
            >
          </el-row>
        </el-col>
        <el-col :span="19" class="plan-list-desc-pro">
          <el-row class="pro-top">
            <div class="pro-info-par gm-scrollBar-style">
              <el-row
                class="pro-info"
                v-for="(arg, key) in item.not_scheduled_require_product_data"
                :key="key"
              >
                <el-col :span="1">&nbsp;</el-col>
                <el-col :span="3" class="pro-info-tit">
                  <span v-show="key === 0"> 未排期商品</span>&nbsp;&nbsp;
                </el-col>
                <el-col :span="20" class="pro-info-desc text-overflow-cls">
                  <div class="text-overflow-cls">
                    {{ arg.product_name }}
                    <span style="color: var(--text-des-color)"
                      >直播成本：{{ arg.display_cost }} 元</span
                    >
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-row class="pro-info" v-show="item.not_scheduled_require_product_data.length === 0">
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="3" class="pro-info-tit">
                <span> 未排期商品</span>
              </el-col>
              <el-col :span="20" style="line-height: 30px; color: #666"> 暂无未排期商品~ </el-col>
            </el-row>
            <el-row class="date-info">
              <el-col :span="1">&nbsp;</el-col>
              <el-col :span="3" class="date-info-tit">排期 &nbsp;&nbsp;</el-col>
              <el-col :span="20" class="date-info-desc">
                <span
                  style="line-height: 30px; color: #666"
                  v-if="matchPlanList[index].schedule_list.length === 0"
                  >暂无排期~</span
                >
                <div v-if="matchPlanList[index].schedule_list.length > 0">
                  <!-- 数据已反馈时 不可删除 -->
                  <div v-for="(tag, key) in item.schedule_list" :key="key">
                    <span class="date-tag-span text-overflow-cls">
                      <span @click="clickScheduleDate(tag, key, index)">
                        {{ showProDateFormat(tag.display_time) }}
                        <i class="el-icon-arrow-right"></i>
                      </span>
                      <em :class="tag.is_display === 2 ? 'is-display' : 'not-display'">
                        {{ getIsDisplay(tag) }}
                      </em>
                      <i
                        class="el-icon-circle-close"
                        v-show="true"
                        @click="deleteTheDate(tag.id)"
                      ></i>
                    </span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-row>
          <el-row class="pro-bot">
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="19"><span>&nbsp;</span></el-col>
            <el-col :span="4" class="add-schedule">
              <el-button size="small" type="primary" @click="clickAddSchedule(item, index)"
                >添加排期</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </template>
    <!-- 替换主播弹框 -->
    <el-dialog
      title="替换主播"
      :visible.sync="replaceStarDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeReplaceStarDialog"
      width="78%"
      class="replace-star-dialog"
    >
      <el-row class="replace-star-dialog-header">
        <span>主播信息：</span>
        <el-select
          v-model="searchStarName"
          placeholder="请选择主播"
          size="small"
          filterable
          clearable
        >
          <el-option
            v-for="(item, index) in allStars"
            :key="index"
            :value="item.value"
            :label="item.label"
            @click.native="clickQueryStar"
          >
          </el-option>
        </el-select>
      </el-row>
      <el-row v-loading="replaceStarLoading">
        <addStar :starTableData="starTableData" :isReplaceStar="true"></addStar>
      </el-row>
      <template #footer>
        <span>
          <el-button size="small" style="width: 72px" @click="replaceStarDialogVisible = false"
            >取消</el-button
          >
          <el-button size="small" type="primary" @click="confirmReplace">确定替换</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加排期弹框 -->
    <el-dialog
      title="主播排期"
      @close="closeAddScheduleDialog('addScheduleForm')"
      :visible.sync="addDateDialogVisible"
      class="add-date-dialog"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        size="small"
        :inline="true"
        label-position="top"
        label-width="110px"
        :model="addScheduleForm"
        ref="addScheduleForm"
      >
        <el-form-item
          label="选择商品"
          prop="productList"
          :rules="[{ required: true, message: '请选择至少一个商品' }]"
        >
          <el-select
            placeholder="请选择要直播的商品"
            popper-class="date-product-option"
            clearable
            filterable
            multiple
            name="product_list"
            v-model="addScheduleForm.productList"
          >
            <el-option
              :value="indexs"
              :label="pro.productName"
              v-for="(pro, indexs) in notScheduleProductList"
              :key="indexs"
            ></el-option>
          </el-select>
          <div class="tag-checked-product" v-show="addScheduleForm.productList.length > 0">
            <span
              v-for="(item, index) in addScheduleForm.productList"
              :key="index"
              class="text-overflow-cls"
            >
              <!-- {{item === notScheduleProductList[index].id ? notScheduleProductList[index].productName:''}} -->
              {{ notScheduleProductList[item].productName }}
              <i class="el-icon-circle-close" @click="deleteTheProduct(index)"></i>
            </span>
          </div>
        </el-form-item>
        <el-form-item
          label="直播日期"
          prop="displayTime"
          :rules="[{ required: true, message: '直播日期是必填项' }]"
        >
          <el-date-picker
            name="display_time"
            placeholder="请选择直播日期"
            format="yyyy.MM.dd"
            value-format="yyyy-MM-dd"
            v-model="addScheduleForm.displayTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="是否预售"
          prop="isPresell"
          :rules="[{ required: true, message: '请选择是否为预售场' }]"
        >
          <el-select v-model="addScheduleForm.isPresell" name="isPresell">
            <el-option
              v-for="item in presellSelectOption"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button
            size="small"
            style="width: 80px; margin-top: 12px"
            @click="addDateDialogVisible = false"
            >取消</el-button
          >
          <el-button
            size="small"
            type="primary"
            style="width: 80px"
            @click="addSchedule('addScheduleForm')"
            >添加</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 排期详情弹框 -->
    <el-dialog
      title="排期详情"
      :visible.sync="dateDetailDialogVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="date-detail-dialog"
    >
      <el-row class="date-detail-dialog-header">
        <span class="date-detail-tit">排期详情</span>
        <el-row
          >直播日期： <span>{{ showProDateFormat(scheduleDetailDisplayTime) }}</span></el-row
        >
        <el-row
          >直播商品：
          <span v-for="(pro, key) in scheduleDetailItem" :key="key">
            {{ pro.product_name }}
            <em v-if="pro.is_presell === 1">预售</em>
            <em v-if="pro.is_presell === 2">预热</em>
            、
          </span>
        </el-row>
      </el-row>
      <el-row v-loading="productTableLoading">
        <!-- 商品信息组件 -->
        <product-table
          :size="'mini'"
          :productTableData="productTableData"
          @com-query-product="comQueryProduct"
        >
        </product-table>
      </el-row>
    </el-dialog>
  </section>
</template>
<script>
import { queryRequirement, queryRequirementProduct } from '@/api/brand';
import { queryPlan, addSchedule, deleteSchedule, replaceStar } from '@/api/candidate';
import { queryStars } from '@/api/star';
import { queryProducts } from '@/api/display';
import { presellSelectOption } from '@/const/options';
import { allStars } from '@/const/getStar';
import { showProDateFormat, categoryFormate, getIsDisplay } from '@/utils/format';

import productTable from '../product/component/productTable';
import requirementDetail from './component/requirementDetail';
import addStar from './component/addStar';

export default {
  data() {
    return {
      activeName: 'requirement',
      isRightArrow: false,
      requirementDetailInfo: {},
      importedProInfo: [],
      requirementDetailLoading: false,
      requirementId: null,
      currentStarId: '',
      allStars,
      searchStarName: '',
      totalCost: '',

      presellSelectOption,
      productListLoading: false,
      planListLoading: false,

      matchPlanList: [],
      addScheduleForm: {
        // 添加排期form表单
        displayTime: '',
        productList: [],
        isPresell: '',
      },
      notScheduleProductList: [],
      oldStarId: '',
      starTableData: [],
      replaceStarDialogVisible: false,
      replaceStarLoading: false,
      addDateDialogVisible: false,
      dateDetailDialogVisible: false,
      scheduleDetailItem: [], // 排期详情弹框中的商品,
      scheduleDetailDisplayTime: '',

      productTableData: [],
      productTableLoading: false,
      currentDisplayId: '',
    };
  },
  props: { id: Number },
  components: { requirementDetail, productTable, addStar },
  created() {
    if (this.$route.params.id) {
      this.requirementId = this.id;
      this.idQueryRequirementInfo();
      this.idQueryPlan();
    }
  },
  methods: {
    closeAddScheduleDialog(formName) {
      this.addScheduleForm.productList = [];
      this.addScheduleForm.isPresell = 0;
      this.$refs[formName].resetFields();
    },
    clickAddSchedule(item, index) {
      // 点击添加排期
      this.currentStarId = item.star_id;
      this.addDateDialogVisible = true;
      this.notScheduleProductList = [];
      this.matchPlanList[index].not_scheduled_require_product_data.forEach(items => {
        this.notScheduleProductList.push({
          // 未排期商品列表-排期表单中商品下拉框
          id: items.id,
          productName: items.product_name,
        });
      });
    },
    clickScheduleDate(tag, key, index) {
      // 点击排期日期
      this.scheduleDetailItem = this.matchPlanList[index].schedule_list[key].product_list;
      this.currentDisplayId = tag.id;
      this.scheduleDetailDisplayTime = tag.display_time;
      this.queryProduct();
      this.dateDetailDialogVisible = true;
    },
    idQueryRequirementInfo() {
      const requirementpass = {
        requirement_id: this.requirementId,
      };
      this.requirementDetailLoading = true;
      queryRequirement(requirementpass).then(response => {
        const result = response.data;
        if (result.success) {
          this.requirementDetailInfo = result.data.data[0];
          this.requirementDetailLoading = false;
        } else {
          this.requirementDetailLoading = false;
        }
      });

      this.productListLoading = true;
      queryRequirementProduct(requirementpass).then(response => {
        const res = response.data;
        if (res.success) {
          this.importedProInfo = response.data.data.data;
          this.productListLoading = false;
        } else {
          this.productListLoading = false;
        }
      });
    },
    idQueryPlan() {
      const requirementpass = {
        requirement_id: this.requirementId,
      };
      this.planListLoading = true;
      queryPlan(requirementpass).then(response => {
        const result = response.data;
        if (result.success) {
          this.matchPlanList = result.data.data;
          this.totalCost = result.data.total_cost;
          this.planListLoading = false;
        }
      });
    },
    addSchedule(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const proId = this.addScheduleForm.productList.map((item, index) => {
            return this.notScheduleProductList[index].id;
          });
          const addSchedulepass = {
            requirement_id: this.requirementId,
            star_id: this.currentStarId,
            display_time: this.addScheduleForm.displayTime,
            product_list: JSON.stringify(proId),
            is_presell: this.addScheduleForm.isPresell,
          };
          addSchedule(addSchedulepass).then(response => {
            const result = response.data;
            if (result.success) {
              this.addDateDialogVisible = false;
              this.idQueryPlan();
              this.$gmMessage(result.message);
            } else {
              this.$gmMessage(result.message, 'tip');
            }
          });
        } else {
          return false;
        }
      });
    },
    deleteTheProduct(index) {
      //  删除展示选中商品集合
      this.addScheduleForm.productList.splice(index, 1);
    },
    deleteTheDate(val) {
      deleteSchedule({ id: val }).then(response => {
        const result = response.data;
        if (result.success) {
          this.$message({ message: result.message, type: 'success' });
          this.idQueryPlan();
        } else {
          this.$gmMessage(result.message, 'tip');
        }
      });
    },
    clickQueryStar() {
      this.starTableData = [];
      this.replaceStarLoading = true;
      queryStars({ star_name: this.searchStarName }).then(response => {
        const result = response.data;
        if (result.success) {
          this.starTableData = response.data.data.data;
          this.replaceStarLoading = false;
        }
      });
    },
    clickReplaceStar(index) {
      this.oldStarId = this.matchPlanList[index].star_id;
    },
    closeReplaceStarDialog() {
      this.starTableData = [];
      this.searchStarName = '';
    },
    confirmReplace() {
      if (this.starTableData.length === 0) {
        this.$gmMessage('请先选择主播', 'tip');
      } else {
        const replacepass = {
          old_star_id: this.oldStarId,
          new_star_id: this.starTableData[0].star_id,
          requirement_id: this.requirementId,
        };
        replaceStar(replacepass).then(response => {
          const result = response.data;
          if (result.success) {
            this.replaceStarDialogVisible = false;
            this.idQueryPlan();
            this.$gmMessage(result.message);
          } else {
            this.$gmMessage(result.message, 'tip');
          }
        });
      }
    },
    queryProduct() {
      this.productTableLoading = true;
      const queryproductpass = {
        display_id: this.currentDisplayId,
      };
      this.productTableData = [];
      queryProducts(queryproductpass).then(response => {
        const result = response.data;
        if (result.success) {
          for (const item in result.data.data) {
            this.productTableData.push(Object.assign(result.data.data[item]));
          }
          this.productTableLoading = false;
        }
      });
    },
    comQueryProduct() {
      this.queryProduct();
      this.idQueryPlan();
    },
    getIsDisplay,
    showProDateFormat,
    categoryFormate,
  },
};
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.top-tabs {
  margin-top: 10px;
  .el-tabs__header {
    margin-bottom: 0;
    border-color: #f4f5f6;
  }
  .el-tabs__nav {
    border-top: none !important;
    border-radius: 0 !important;
    border-left: none !important;
  }
  .is-active {
    // border-bottom-color: #f4f5f6;
    border-top: none;
  }
}
.add-date-dialog {
  .el-form-item {
    position: relative;
    .el-form-item__label {
      padding-bottom: 2px;
      height: 20px;
      line-height: 20px;
    }
    .el-select__tags {
      display: none;
    }
    .el-select__tags > span {
      width: 100%;
      // overflow: hidden;
      text-overflow: ellipsis;
    }
    .el-form-item__error {
      position: absolute;
      top: -16px;
      right: 0;
    }
  }
  .el-dialog__body {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
}
.date-detail-dialog {
  .el-dialog__body {
    padding: 10px;
  }
}
.date-product-option {
  width: 19%;
  background: rgba(255, 255, 255, 0.9);
}
.replace-star-dialog {
  .el-dialog__body {
    padding: 0 10px;
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/scss/planInfo.scss';
</style>
