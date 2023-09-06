<template>
  <section class="page-section">
    <el-button
      size="small"
      icon="el-icon-arrow-left"
      type="primary"
      style="margin-bottom: 14px; font-size: 14px; padding: 8px 15px"
      @click="$router.back()"
      >返回</el-button
    >
    <!-- requiremet form -edit/add -->
    <transition name="demand-active">
      <el-row style="background: #fff" v-show="!isShowReqDetail">
        <p style="margin-left: 16px; line-height: 36px; color: var(--text-color); font-size: 15px">
          编辑需求
        </p>
        <el-form
          v-loading="addReqLoading"
          size="small"
          :inline="true"
          :model="requirementInfoForm"
          class="add-demand-form"
          ref="requirementInfoForm"
        >
          <el-row>
            <el-form-item
              label="品牌名称"
              prop="brand_name"
              :rules="[{ required: true, message: '品牌名称不能为空' }]"
            >
              <el-select
                placeholder="请选择品牌名称"
                name="brand_name"
                v-model="requirementInfoForm.brand_name"
                filterable
                clearable
              >
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :value="item.brand_name"
                  :label="item.brand_name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="利润率"
              prop="profit"
              :rules="[{ required: true, message: '利润率不能为空' }]"
            >
              <el-input
                placeholder="请输入内容"
                name="profit"
                v-model="requirementInfoForm.profit"
                type="number"
                @mousewheel.native.prevent
              >
                <template #append> % </template>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="需求名称"
              prop="requirement_name"
              :rules="[{ required: true, message: '需求名称不能为空' }]"
            >
              <el-input
                placeholder="请输入内容"
                name="requirement_name"
                v-model="requirementInfoForm.requirement_name"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="预 算"
              prop="budget"
              :rules="[{ required: true, message: '预算不能为空' }]"
            >
              <el-input
                placeholder="请输入内容"
                name="budget"
                v-model="requirementInfoForm.budget"
                type="number"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              label="直播类型"
              prop="display_type"
              :rules="[{ required: true, message: '直播类型不能为空' }]"
            >
              <!-- <el-input size="small" placeholder="请输入内容" v-model="demandInfoForm.liveType"></el-input> -->
              <el-select v-model="requirementInfoForm.display_type" name="display_type">
                <el-option
                  v-for="item in displayTypeOptions"
                  :value="item.value"
                  :label="item.label"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="返 点"
              prop="rebate"
              :rules="[{ required: true, message: '返点不能为空' }]"
            >
              <el-input
                placeholder="请输入内容"
                name="rebate"
                type="number"
                v-model="requirementInfoForm.rebate"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="提报日期">
              <el-date-picker
                placeholder="请选择提报日期"
                v-model="requirementInfoForm.report_date"
                value-format="yyyy-MM-dd"
                format="yyyy.MM.dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="KPI指标"
              :prop="'[' + kpiOptions + ']'"
              :rules="[{ required: true, message: 'KPI指标不能为空' }]"
              class="kpi-target"
            >
              <el-input
                type="number"
                placeholder="请输入内容"
                class="input-with-select"
                :name="[kpiOptions]"
                v-model="requirementInfoForm[kpiOptions]"
                :maxlength="9"
              >
                <template #prepend>
                  <el-select size="small" placeholder="请选择" v-model="kpiOptions">
                    <el-option label="销售额/元" value="kpi_sales_amount" />
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="需求介绍">
              <el-input
                placeholder="请输入内容"
                type="textarea"
                v-model="requirementInfoForm.introduce"
                :autosize="{ minRows: 1, maxRows: 3 }"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <el-row style="margin: 16px 0; text-align: center">
          <el-button
            size="medium"
            type="primary"
            @click="isShowReqDetail = true"
            v-show="isUpdateReqBtn"
            >取消保存</el-button
          >
          <el-button
            size="medium"
            type="primary"
            @click="clickUpdateRequirement('requirementInfoForm')"
            v-show="isUpdateReqBtn"
          >
            保存需求
          </el-button>
          <el-button
            size="medium"
            type="primary"
            @click="clickSaveRequirement('requirementInfoForm')"
            v-show="!isUpdateReqBtn"
          >
            新增需求
          </el-button>
        </el-row>
      </el-row>
    </transition>
    <!-- requirement detail -->
    <transition>
      <el-row v-show="isShowReqDetail" v-loading="reqDetailLoading" class="demand-detail-el-row">
        <el-row class="demand-detail-header">
          <span>需求详情</span>
          <i class="gm-icon gm-icon-edit" @click="editRequirementDetail('requirementInfoForm')"></i>
        </el-row>
        <requirementDetail
          :requirementDetailInfo="requirementDetailInfo"
          :brandList="brandList"
        ></requirementDetail>
        <el-row class="demand-detail-footer">
          <p>
            剩余成本：<span>{{ last_cost }}元</span>
          </p>
          <p>
            总成本：<span>{{ requirementDetailInfo.total_cost }}元</span>
          </p>
        </el-row>
      </el-row>
    </transition>
    <!-- button-row -->
    <transition name="demand-active">
      <el-row class="row-button" v-show="isShowReqDetail || isImportedPro">
        <el-upload
          class="row-button-upload"
          ref="upload"
          :action="''"
          :http-request="clickImportProduct"
          :show-file-list="false"
          multiple
          :file-list="fileList"
        >
          <el-button size="medium" type="primary" :loading="uploadLoading">导入商品</el-button>
        </el-upload>
        <el-button size="medium" type="primary" @click="downloadTemplate">下载模板</el-button>
        <el-button size="medium" type="primary" @click="clickMatchCandidate">匹配候选集</el-button>
        <el-button size="medium" type="primary" @click="clickProducePlan">生成方案</el-button>
      </el-row>
    </transition>
    <!-- product list & matched info list -->
    <el-row class="row-table" v-show="isShowReqDetail || isImportedPro">
      <el-table
        stripe
        class="require-table"
        :data="list"
        :header-cell-style="{
          background: '#f0f1f2',
          height: '48px',
          color: 'var(--text-second-color)',
        }"
        empty-text="请先导入商品"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        v-loading="tableLoading"
      >
        <el-table-column type="expand" width="20">
          <template v-slot="scope">
            <el-scrollbar style="width: 100%; overflow-y: hidden" ref="scroll">
              <div
                class="list-box"
                :style="'width:' + scope.row.chosen_plan_list.length * 232 + 'px'"
              >
                <div
                  class="list-item-wrapper"
                  v-for="(anchor, index) in scope.row.chosen_plan_list"
                  :key="index"
                >
                  <anchor-item
                    :anchor="anchor"
                    :isChose="1"
                    @del="updateStar({ method: 'del', anchor, index })"
                    @update="updateStar"
                  ></anchor-item>
                </div>
              </div>
            </el-scrollbar>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="220" show-overflow-tooltip>
          <template v-slot="scope">
            <span>
              <a :href="scope.row.product_url" target="_blank" title="点击跳转">
                <i class="gm-icon-link pro-url"></i>
              </a>
              <span>{{ scope.row.product_name }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="品类" prop="category" min-width="120" :formatter="categoryFormate">
        </el-table-column>
        <el-table-column label="活动价（客单价）" min-width="140" prop="product_sales_price">
        </el-table-column>
        <el-table-column label="匹配状态" min-width="140">
          <template v-slot="scope">
            <span>
              <span v-if="matchLoading">匹配中...</span>
              <span v-else-if="scope.row.is_match_candidate === 0">候选集未匹配</span>
              <template v-else>
                <span
                  v-if="scope.row.chosen_plan_list.length > 0"
                  class="type-anchor"
                  :class="{ active: expands.length > 0 && expands[0] === scope.row.id }"
                  @click="showStarList(scope)"
                  >主播已确定</span
                >
                <span v-else>候选集已生成</span>
              </template>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="240">
          <template v-slot="scope">
            <el-button size="mini" type="primary" @click="clickChooseAnchor(scope)">
              <template v-if="scope.row.chosen_plan_list.length > 0">继续选择</template>
              <template v-else>选择主播</template>
            </el-button>
            <el-button size="mini" type="primary" @click="clickEditProduct(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary" @click="deleteProduct(scope)"
              >删除<span v-show="false">{{ scope.row }}</span></el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog
      :visible.sync="editProDialogVisible"
      width="34%"
      title="编辑商品信息"
      class="demand-edit-pro-dialog"
      @close="closeEditReqProDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <editRequirementPro
        :importedProListItem="importedProListItem"
        @passRefFormName="getRefFormName"
        ref="importedProListItem"
      />
      <template #footer>
        <span>
          <el-row>
            <el-button size="small" @click="editProDialogVisible = false">取消</el-button>
            <el-button size="small" type="primary" @click="saveEditedProduct">保存</el-button>
          </el-row>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      class="dialog-anthor-list"
      :visible.sync="chooseAnchorVisible"
      title="候选集列表"
      @close="cancelStarList"
      top="10vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row type="flex">
        <el-col class="dialog-anthor-text">
          <span>总成本：</span>
          <b class="total">{{ requirementDetailInfo.total_cost }}元</b>
          <span>剩余成本：</span>
          <b class="last">{{ last_cost }}元</b>
        </el-col>
        <el-col :span="8">
          <el-select
            placeholder="输入主播名称手动添加主播"
            v-model="currentStar"
            size="small"
            multiple-limit="1"
            popper-class="dialog-select-class"
            filterable
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in allStars"
              :value="item.value"
              :key="index"
              :label="item.value"
            >
              <span class="dialog-anthor-select"
                >{{ item.value }}
                <i class="tips" v-if="checkIsAdded(item.star_id)">(已添加)</i>
              </span>
              <i
                class="dialog-anthor-btn-add"
                v-if="!checkIsAdded(item.star_id)"
                @click="selectOption(item)"
                >添加</i
              >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <anchor-list />
      <template #footer>
        <div class="dialog-footer">
          <span class="text"
            >已选主播<b>{{ selectCount }}</b
            >位</span
          >
          <el-button type="primary" size="small" @click="chooseStarList">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import requirementDetail from './component/requirementDetail';
import editRequirementPro from './component/editRequirementPro';
import anchorList from './component/anchorList';
import anchorItem from './component/anchorItem';

import { getAllStar } from '@/const/getStar';
import { showProDateFormat, categoryFormate } from '@/utils/format';
import { fileMaxSize, fileMaxSizeTips } from '@/utils/config';
import { displayTypeOptions, categoryOptions } from '@/const/options';

import {
  queryBrand,
  saveRequirment,
  updateRequirement,
  queryRequirement,
  queryRequirementProduct,
  delRequirementProduct,
  updateRequirementProduct,
} from '@/api/brand';
import { queryStars } from '@/api/star';
import { matchCandidate, queryCandidate, addCandidate, updateCandidate } from '@/api/candidate';
import { uploadFile } from '@/api/upload';
import { domain } from '@/utils/variable';
import { RouterNameProjectManage, RouterNameSupplier } from '@/const/router';

export default {
  data() {
    return {
      brandList: [],
      displayTypeOptions,
      categoryOptions,
      requirementInfoForm: {
        brand_name: '',
        profit: '',
        requirement_name: '',
        budget: '',
        display_type: '',
        rebate: '',
        report_date: showProDateFormat(new Date()),
        introduce: '',
        kpi_sales_amount: '',
        kpi_uv: '',
      },
      kpiOptions: 'kpi_sales_amount',
      isUpdateReqBtn: false, // 新增-保存 按钮
      isShowReqDetail: false, // 显示详情-表单
      currentId: '',
      addReqLoading: false,

      requirementDetailInfo: {},
      reqDetailLoading: false,
      fileList: [],
      uploadLoading: false,
      plsImportProLoading: false,
      isImportedPro: false, // 导入商品字样-候选集信息
      isShowMatchInfo: false, // 未匹配候选集-匹配后
      tableLoading: true,
      matchLoading: false,
      // matchedInfoList: [],
      // importedProList: [],
      // 上面两个合并的列表
      // list: [],
      importedProListItem: {},
      editProDialogVisible: false,
      comEditProValidate: null,
      // 选择主播弹窗
      chooseAnchorVisible: false,
      allStars: [],
      currentStar: '',
      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
    };
  },
  computed: {
    // 所有主播列表加上是否已添加标示
    // allStarsAndCheck() {
    //   let ret = JSON.parse(JSON.stringify(this.allStars))
    //   ret.forEach(star => {
    //     let id = star.star_id
    //     star.isAdded = false
    //     this.currentChosenPlanList.forEach(item => {
    //       if (item.star_id === id) {
    //         star.isAdded = true
    //       }
    //     })
    //     this.currentCostRangeList.forEach(item => {
    //       item.star_list.forEach(item => {
    //         if (item.star_id === id) {
    //           star.isAdded = true
    //         }
    //       })
    //     })
    //   })
    //   console.log(ret)
    //   return ret
    // },
    list() {
      return this.$store.getters['requirement/list'];
    },
    // 当前已确定选择的主播
    currentChooseAnchorIndex() {
      return this.$store.state.requirement.currentChooseAnchorIndex;
    },
    // 当前候选集里的主播
    currentCostRangeList() {
      return this.$store.getters['requirement/currentCostRangeList'];
    },
    // 选择的主播列表
    currentChosenPlanList() {
      return this.$store.getters['requirement/currentChosenPlanList'];
    },
    // 使用总成本
    used_cost() {
      let count = 0;
      this.list.forEach(item => {
        item.chosen_plan_list.forEach(star => {
          let _cost = 0;
          if (this.requirementDetailInfo.display_type === 0) {
            _cost = star.star_mix_cost;
          } else {
            _cost = star.star_special_cost;
          }
          count += _cost * star.display_num;
        });
        item.cost_range_list.forEach(range => {
          range.star_list.forEach(star => {
            if (star.isSelect) {
              let _cost = 0;
              if (this.requirementDetailInfo.display_type === 0) {
                _cost = star.star_mix_cost;
              } else {
                _cost = star.star_special_cost;
              }
              count += _cost * star.display_num;
            }
          });
        });
      });
      return count;
    },
    // 剩余成本
    last_cost() {
      let cost = this.requirementDetailInfo.total_cost - this.used_cost;
      if (cost.toString().indexOf('.') > -1) {
        cost = cost.toFixed(2);
      }
      return cost;
    },
    // 选择的主播数
    selectCount() {
      let count = 0;
      if (this.currentChooseAnchorIndex > -1) {
        this.list[this.currentChooseAnchorIndex].cost_range_list.forEach(item => {
          item.star_list.forEach(item => {
            if (item.isSelect) {
              count++;
            }
          });
        });
      }
      return count;
    },
  },
  components: { requirementDetail, editRequirementPro, anchorList, anchorItem },
  created() {
    queryBrand().then(response => {
      this.brandList = response.data.data.data;
    });
    if (this.$route.query.requirementId) {
      this.isUpdateReqBtn = true;
      this.isShowReqDetail = true;
      this.currentId = this.$route.query.requirementId;
      this.idQueryRequirement();
      this.idQueryReqmentPro();
      this.queryCandidate();
    }
  },
  methods: {
    clickSaveRequirement(formName) {
      // 新增需求
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addReqLoading = true;
          const requirementpass = this.requirementInfoForm;
          if (this.kpiOptions === 'kpi_sales_amount') {
            requirementpass.kpi_uv = '-1.00';
          } else {
            requirementpass.kpi_sales_amount = '-1.00';
          }
          saveRequirment(requirementpass).then(response => {
            const result = response.data;
            if (result.success) {
              this.addReqLoading = false;
              this.currentId = result.data;
              this.isUpdateReqBtn = true;
              this.isShowReqDetail = true;
              this.$router.push({
                name: RouterNameProjectManage.marketing.demand.demand,
                params: { id: this.currentId },
              });
              this.idQueryRequirement();
              this.idQueryReqmentPro();
              for (const item in this.requirementInfoForm) {
                this.requirementInfoForm[item] = '';
              }
            } else {
              this.$gmMessage(result.message, 'tip');
              this.addReqLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    clickUpdateRequirement(formName) {
      // 保存需求
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addReqLoading = true;
          const requirementpass = JSON.parse(JSON.stringify(this.requirementInfoForm));
          const deleteArr = [
            'add_by',
            'brand_id',
            'flag',
            'gmt_create',
            'gmt_modified',
            'modified_by',
            'total_cost',
            'status',
          ];
          deleteArr.forEach(key => {
            delete requirementpass[key];
          });
          if (this.kpiOptions === 'kpi_sales_amount') {
            requirementpass.kpi_uv = '-1.00';
          } else {
            requirementpass.kpi_sales_amount = '-1.00';
          }
          updateRequirement(requirementpass).then(response => {
            const result = response.data;
            if (result.success) {
              this.addReqLoading = false;
              this.isShowReqDetail = true;
              this.idQueryRequirement();
              this.clickMatchCandidate();
              for (const item in this.requirementInfoForm) {
                this.requirementInfoForm[item] = '';
              }
            } else {
              this.$gmMessage(result.message, 'tip');
              this.addReqLoading = false;
            }
          });
        } else {
          return false;
        }
      });
    },
    // 查询候选集
    idQueryRequirement() {
      const requirementpass = { requirement_id: '' };
      if (this.isUpdateReqBtn) {
        requirementpass.requirement_id = this.currentId;
        this.reqDetailLoading = true;
        queryRequirement(requirementpass)
          .then(response => {
            const result = response.data.data;
            this.requirementDetailInfo = result.data[0];
            this.$store.commit(
              'requirement/setDisplayType',
              this.requirementDetailInfo.display_type,
            );
            this.reqDetailLoading = false;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    editRequirementDetail(_formName) {
      // 点击编辑需求详情
      this.$confirm('修改需求可能会导致已经匹配的候选集不可用！', '提示', {
        confirmButtonText: '确定修改',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          if (this.requirementDetailInfo.status !== 0) {
            this.$gmMessage('您的方案正在执行中，无法修改需求', 'tip');
          } else {
            this.isShowReqDetail = false;
            this.requirementInfoForm = JSON.parse(JSON.stringify(this.requirementDetailInfo));
            this.requirementInfoForm.report_date = this.showProDateFormat(
              this.requirementInfoForm.report_date,
            );
          }
        })
        .catch(() => {
          /* do nth */
        });
    },
    clickImportProduct(param) {
      this.uploadLoading = true;
      const file = param.file;
      if (file.size > fileMaxSize) {
        this.$message.error(fileMaxSizeTips);
        this.uploadLoading = false;
        return;
      }
      const form = new FormData();
      form.append('param_id', this.currentId);
      form.append('operate', 'require_product');
      form.append('file', file);
      uploadFile(form).then(response => {
        const result = response.data;
        if (result.success) {
          this.$gmMessage({
            content: result.message,
            type: 'tip',
            duration: 0,
            showBtn: true,
          });
          // 获取商品loading
          this.tableLoading = true;
          setTimeout(() => {
            this.idQueryReqmentPro();
            this.queryCandidate();
          }, 500);
          this.uploadLoading = false;
        } else {
          this.$gmMessage(result.message, 'tip');
          this.uploadLoading = false;
        }
      });
    },
    // 获取商品列表
    idQueryReqmentPro() {
      const querypass = {
        requirement_id: this.currentId,
      };
      this.plsImportProLoading = true;
      queryRequirementProduct(querypass).then(response => {
        const result = response.data;
        if (result.success) {
          this.$store.commit('requirement/updateImportedProList', result.data.data);
          this.isImportedPro = true;
          this.plsImportProLoading = false;
        } else {
          // this.list = []
          this.isShowMatchInfo = false;
          this.isImportedPro = false;
          this.plsImportProLoading = false;
          this.tableLoading = false;
        }
      });
    },
    downloadTemplate() {
      window.open(domain + '/template/requirement_product_template.xlsx');
    },
    deleteProduct(scope) {
      const val = scope.row;
      this.$confirm('此操作将永久删除数据，请谨慎操作!', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const delproductpass = {
            requirement_product_id: val.id,
          };
          delRequirementProduct(delproductpass).then(response => {
            const result = response.data;
            if (result.success) {
              this.$gmMessage(result.message);
              this.$store.commit('requirement/resetRequirementData');
              // this.idQueryRequirement()
              this.idQueryReqmentPro();
              this.queryCandidate();
            } else {
              this.$gmMessage(result.message, 'tip');
            }
          });
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 编辑商品
    clickEditProduct(val) {
      this.editProDialogVisible = true;
      this.importedProListItem = JSON.parse(JSON.stringify(val));
    },
    // 查询候选集
    queryCandidate(fn) {
      const matchpass = {
        requirement_id: this.currentId,
      };
      this.matchLoading = true;
      queryCandidate(matchpass).then(response => {
        const result = response.data;
        this.tableLoading = false;
        if (result.success) {
          this.$store.commit('requirement/updateMatchedInfoList', result.data.candidate_list);
          if (typeof fn === 'function') {
            fn();
          }
          this.isShowMatchInfo = true;
          this.matchLoading = false;
        } else {
          this.$gmMessage(result.message, 'tip');
          this.matchLoading = false;
          this.isShowMatchInfo = false;
        }
      });
    },
    // 重新匹配候选集
    clickMatchCandidate(fn) {
      // 重新匹配候选集
      const matchpass = {
        requirement_id: this.currentId,
      };
      this.matchLoading = true;
      matchCandidate(matchpass).then(response => {
        const result = response.data;
        this.tableLoading = false;
        if (result.success) {
          // 重新查询商品信息
          this.idQueryReqmentPro();
          this.$store.commit('requirement/updateMatchedInfoList', result.data.candidate_list);
          if (typeof fn === 'function') {
            fn();
          }
          // this.$refs.scroll.refresh()
          // this.list = this.$store.getters['requirement/list']
          // console.log(this.list)
          // this.matchedInfoList.forEach(item => {
          //   this.$set(item, 'showMatchedStarList', item.cost_range_list[0].star_list)
          //   // this.$set(item, 'activeIndex', 0)
          //   item.cost_range_list[0].star_list.forEach(arg => {
          //     if (arg.display_num === 0) {
          //       arg.display_num = 1
          //     }
          //   })
          // })
          this.isShowMatchInfo = true;
          this.matchLoading = false;
        } else {
          this.$gmMessage(result.message, 'tip');
          this.matchLoading = false;
          this.isShowMatchInfo = false;
        }
      });
    },
    closeEditReqProDialog() {
      this.comEditProValidate.resetFields();
    },
    getRefFormName(formName) {
      this.comEditProValidate = formName;
    },
    // 保存编辑
    saveEditedProduct() {
      // 保存商品
      this.comEditProValidate.validate(valid => {
        // this.$refs[formName].validate(valid => {
        if (valid) {
          const deleteArr = [
            'add_by',
            'flag',
            'gmt_create',
            'gmt_modified',
            'is_match_candidate',
            'modified_by',
            'requirement_id',
            'shop_name',
            'chosen_plan_list',
            'cost_range_list',
            'star_num',
            'used_cost',
            'display_cost',
            'require_product_id',
          ];
          deleteArr.forEach(key => {
            delete this.importedProListItem[key];
          });
          updateRequirementProduct(this.importedProListItem).then(response => {
            const result = response.data;
            if (result.success) {
              this.editProDialogVisible = false;
              // 保存后重新匹配候选集
              this.clickMatchCandidate();
            } else {
              this.$gmMessage({
                duration: 0,
                content: result.message,
                type: 'tip',
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    clickProducePlan() {
      this.$router.push({
        name: RouterNameSupplier.companyPlan,
        query: {
          requirementId: this.currentId,
        },
        params: {
          id: this.currentId,
        },
      });
    },
    // 选择主播
    clickChooseAnchor(scope) {
      this.list_bak = JSON.parse(JSON.stringify(this.list));
      // let row = scope.row
      this.$store.commit('requirement/updateCurrentChooseAnchorIndex', scope.$index);
      // this.currentChosenPlanList = row.chosen_plan_list
      // 增加isSelect， generate_way
      // let ret = []
      // ret = row.cost_range_list.map((item, index) => {
      //   item.star_list.forEach((item, index) => {
      //     if (!item.isSelect) {
      //       item.isSelect = 0
      //     }
      //     if (!item.generate_way) {
      //       item.generate_way = 0
      //     }
      //   })
      //   return item
      // })
      // console.log(this.currentCostRangeList)
      this.chooseAnchorVisible = true;
      // 没有allStars数据就发个请求拿数据
      if (!this.allStars.length) {
        getAllStar().then(allStars => {
          this.allStars = allStars;
        });
      }
    },
    // 显示主播列表
    showStarList(scope) {
      this.$store.commit('requirement/updateCurrentChooseAnchorIndex', scope.$index);
      const id = scope.row.id;
      if (this.expands.length > 0) {
        if (id !== this.expands[0]) {
          this.expands = [];
          this.expands.push(id);
        } else {
          this.expands = [];
        }
      } else {
        this.expands.push(id);
      }
    },
    // 选择搜索框的主播名
    selectOption(item) {
      this.currentStar = item.value;
      // 搜主播
      this.clickQueryStar();
    },
    // 按名字搜主播详细信息
    clickQueryStar() {
      this.starTableData = [];
      queryStars({ star_name: this.currentStar }).then(response => {
        const result = response.data;
        if (result.success) {
          const star1 = result.data.data[0];
          const _index = this.$store.state.requirement.currentChooseAnchorIndex;
          const params = {
            display_num: 1,
            is_chosen: '0',
            product_id: this.list[_index].require_product_id,
            requirement_id: this.list[_index].requirement_id,
            star_id: star1.star_id,
          };
          addCandidate(params).then(res => {
            res = res.data;
            if (res.success) {
              const star2 = res.data;
              const star = Object.assign(star1, star2);
              this.$store.commit('requirement/addStar', {
                star: {
                  click_num: star.click_num,
                  display_num: star.display_num,
                  generate_way: star.generate_way,
                  pic_url: star.pic_url,
                  plan_id: star.id,
                  sales_data: star.sales_data,
                  star_id: star.star_id,
                  star_mix_cost: star.star_mix_cost,
                  star_name: star.star_name,
                  star_special_cost: star.star_special_cost,
                },
              });
            } else {
              this.$gmMessage(res.message, 'tip');
            }
          });
          // this.addStarToCandidatepass.star_id = response.data.data.data[0].star_id
          // this.starTableData = response.data.data.data
        }
      });
    },
    // 更新候选集主播到已选择的主播
    _updateCandidate() {
      const params = [];
      this.list[this.currentChooseAnchorIndex].cost_range_list.forEach(item => {
        item.star_list.forEach(item => {
          if (item.isSelect) {
            params.push({
              display_num: item.display_num,
              is_chosen: '1',
              plan_id: item.plan_id,
            });
          }
        });
      });
      updateCandidate({
        plan_info: JSON.stringify(params),
      }).then(_res => {
        this.chooseAnchorVisible = false;
        // 重新匹配候选集
        this.queryCandidate(() => {
          this.$nextTick(() => {
            if (this.$refs.scroll) this.$refs.scroll.update();
          });
        });
      });
    },
    // 在已选择的列表中更新主播信息
    updateStar(obj) {
      let planInfoItem = {};
      // 删除主播
      if (obj.method === 'del') {
        planInfoItem = {
          display_num: 0,
          is_chosen: '0',
          plan_id: obj.anchor.plan_id,
        };
      } else if (obj.method === 'update') {
        // 更新主播的场次
        planInfoItem = {
          display_num: obj.number,
          is_chosen: '1',
          plan_id: obj.anchor.plan_id,
        };
      }
      const planInfo = [];
      planInfo.push(planInfoItem);
      const params = {
        plan_info: JSON.stringify(planInfo),
      };
      updateCandidate(params).then(res => {
        res = res.data;
        if (res.success) {
          if (obj.method === 'del') {
            const star = obj.anchor;
            this.$store.commit('requirement/delChosenStar', obj.index);
            this.$store.commit('requirement/addStar', {
              star: {
                click_num: star.click_num,
                display_num: star.display_num,
                generate_way: star.generate_way,
                pic_url: star.pic_url,
                plan_id: star.plan_id,
                sales_data: star.sales_data,
                star_id: star.star_id,
                star_mix_cost: star.star_mix_cost,
                star_name: star.star_name,
                star_special_cost: star.star_special_cost,
              },
            });
          }
        } else {
          this.$gmMessage(res.message, 'tip');
        }
      });
    },
    // 取消选择的主播
    cancelStarList() {
      this.chooseAnchorVisible = false;
      this.$store.commit('requirement/resetSelect');
    },
    // 保存选择的主播
    chooseStarList() {
      this._updateCandidate();
    },
    // 判断主播的id有没有在已选择的列表或者候选集列表里面
    checkIsAdded(id) {
      let ret = false;
      this.currentChosenPlanList.forEach(item => {
        // number和string问题
        if (item.star_id + '' === id + '') {
          ret = true;
        }
      });
      this.currentCostRangeList.forEach(item => {
        item.star_list.forEach(item => {
          // number和string问题
          if (item.star_id + '' === id + '') {
            ret = true;
          }
        });
      });
      return ret;
    },
    // clickMatchedInfo(item, index) {
    //   console.log(item)
    //   console.log(this.matchedInfoList[index])
    //   this.matchedInfoVisible = true
    // },
    categoryFormate,
    showProDateFormat,
  },
  beforeRouteLeave(to, from, next) {
    // 不是编辑商品
    if (this.isShowReqDetail) {
      next();
    } else {
      const arr = [];
      for (const item in this.requirementInfoForm) {
        if (this.requirementInfoForm[item] === '') {
          arr.push(item);
        }
      }
      if (arr.length < 9) {
        this.$confirm('当前页面存在未完成的表单，离开将不会保存', '提示', {
          confirmButtonText: '确认离开',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
          .then(() => {
            next();
          })
          .catch(() => {
            next(false);
          });
      } else {
        next();
      }
    }
  },
  // 离开重置vuex requirement模块数据
  destroyed() {
    this.$store.commit('requirement/resetRequirementData');
  },
  watch: {
    last_cost(val, oldVal) {
      // 第一次实际成本超过预算,打开主播弹窗中
      if (val < 0 && oldVal >= 0 && this.chooseAnchorVisible) {
        this.$message({
          message: '您的实际成本已超过总成本！',
          type: 'warning',
        });
      }
      if (this.$refs.scroll) {
        this.$nextTick(() => {
          this.$refs.scroll.update();
        });
      }
    },
    currentChosenPlanList(list) {
      if (list.length === 0) {
        this.expands = [];
      }
    },
  },
};
</script>
<style lang="scss">
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
.require-table {
  .el-table__expand-icon {
    display: none;
  }
  .el-table__expanded-cell[class*='cell'] {
    padding: 10px;
  }
  .el-table_1_column_3,
  .el-table_1_column_4,
  .el-table_1_column_5,
  .el-table_1_column_6 {
    text-align: center;
  }
  .el-button--mini {
    padding: 8px 10px;
  }
}
.add-demand-form {
  .el-form-item__label {
    width: 29%;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-form-item__content {
    width: 50%;
  }
  .el-textarea__inner {
    max-height: 103px;
  }
  .el-form-item__error {
    top: -16px;
  }
}
.kpi-target {
  .el-select .el-input {
    width: 96px;
    .el-input__inner {
      padding-left: 6px;
    }
  }
  .input-with-select .el-input-group__prepend {
    background: #fff;
  }
}
.demand-add-star-dialog {
  .el-dialog__body {
    padding: 0 10px;
  }
}
.dialog-anthor-list {
  .el-dialog {
    max-width: 1246px;
    min-width: 900px;
    width: 96%;
  }
  .el-dialog__header {
    margin-bottom: 0;
  }
  .el-dialog__headerbtn {
    top: 10px;
    font-size: 24px;
  }
  .el-dialog__body {
    padding: 0 20px;
    & > .el-row.el-row--flex {
      padding: 12px 0;
    }
    .dialog-anthor-text {
      line-height: 32px;
      b {
        margin-right: 20px;
      }
      .total {
        color: $color-primary;
      }
      .last {
        color: #f26467;
      }
    }
  }
  .el-dialog__footer {
    padding: 15px 20px;
  }
  .dialog-footer {
    text-align: right !important;
    .text {
      color: #666;
      font-size: 14px;
      margin-right: 12px;
      b {
        color: $color-primary;
        font-size: 16px;
        padding: 0 8px;
      }
    }
    .el-button--small {
      padding: 9px 25px;
    }
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/requirementInfo.scss';
a {
  .pro-url {
    vertical-align: middle;
    transform: scale(0.7);
  }
}
.dialog-select-class {
  .dialog-anthor-select {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 260px;
    .tips {
      color: $color-primary;
      font-style: normal;
    }
  }
  .el-select-dropdown__item.selected {
    font-weight: 400;
    font-size: 14px;
    padding: 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--theme-color);
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
  }
}
.dialog-anthor-btn-add {
  position: absolute;
  top: 7px;
  right: 10px;
  height: 20px;
  font-size: 12px;
  padding: 0 10px;
  border-radius: 4px;
  line-height: 20px;
  font-style: normal;
  background: $color-primary;
  color: #fff;
}
.type-anchor {
  position: relative;
  display: inline-block;
  padding: 0 10px;
  color: #1890ff;
  cursor: pointer;
  &.active,
  &:hover {
    background: #e9efff;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent transparent transparent #1890ff;
    border-width: 3px 3px;
    transform: rotate(45deg);
  }
}
.require-table {
  .list-item-wrapper {
    font-size: 14px;
    display: inline-block;
    vertical-align: top;
    &:nth-child(n + 2) {
      margin-left: 10px;
    }
  }
}
</style>
