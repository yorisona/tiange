<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2019-08-06 09:35:27
 * @LastEditors: your name
 -->
<template>
  <section class="page-section page-section-star">
    <section style="background: #fff; padding: 10px; margin-top: 12px">
      <el-form
        :inline="true"
        :model="starQueryForm"
        size="small"
        class="query-star"
        label-position="right"
      >
        <el-row>
          <el-form-item label="主播昵称">
            <!-- 带输入建议 :fetch-suggestions="querySearch" :trigger-on-focus="false" -->
            <el-input
              v-model="starQueryForm.star_name"
              placeholder="请输入主播昵称"
              @select="handleSelect"
              clearable
              @clear="handleStarNameClear"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="客 单 价">
            <el-select v-model="starQueryForm.sales_price_period" clearable placeholder="请选择">
              <el-option
                v-for="item in salesPriceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <el-form
        :inline="true"
        :model="starQueryForm"
        size="small"
        class="query-star-pv"
        label-position="right"
      >
        <el-row>
          <el-form-item label="近15场PV">
            <el-select
              v-model="starQueryForm.mix_or_special"
              placeholder="请选择播放类型"
              clearable
            >
              <el-option
                v-for="item in mixSpeicalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="starQueryForm.min_pv"
              placeholder="请输入PV下限"
              type="number"
              @mousewheel.native.prevent
            ></el-input>
            <span class="to-word">至</span>
            <el-input
              v-model="starQueryForm.max_pv"
              placeholder="请输入PV上限"
              type="number"
              @mousewheel.native.prevent
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-form
        :inline="true"
        :model="starQueryForm"
        size="small"
        class="query-star"
        label-position="right"
      >
        <el-row>
          <el-form-item label="直播品类">
            <el-select v-model="starQueryForm.category" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in categoryOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="粉 丝 数">
            <el-select v-model="starQueryForm.fans_number" clearable placeholder="请选择">
              <el-option
                v-for="item in fansNumberOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- <el-form :inline="true" :model="starQueryForm" size="small" v-if="false" class="query-star-pv" label-position="right">
        <el-row>
          <el-form-item label="近15场点击量"> // 现为最近30款产品点击数
            <el-select v-model="starQueryForm.click_type" placeholder="请选择">
              <el-option v-for="item in clickTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input v-model="starQueryForm.min_click_num" placeholder="点击量下限" type="number"></el-input>
            <span class="to-word">至</span>
            <el-input v-model="starQueryForm.max_click_num" placeholder="点击量上限" type="number"></el-input>
          </el-form-item>
        </el-row>
      </el-form> -->
      <el-row style="margin-top: 14px; padding-left: 10px">
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.view_kol)"
          type="primary"
          size="small"
          @click="addStarDialog"
          >新增主播</el-button
        >
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.view_kol)"
          type="primary"
          size="small"
          @click="lotImportDialogVisible = true"
          >批量导入</el-button
        >
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_kol)"
          type="primary"
          size="small"
          @click="showDelete"
          v-show="!notData"
          >批量删除</el-button
        >
        <el-button
          v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.export_kol)"
          type="primary"
          size="small"
          @click="showExport"
          style="width: 80px"
          >导出</el-button
        >
        <el-button type="primary" size="small" @click="queryStarsubmit" style="width: 80px"
          >查询</el-button
        >
        <!-- <el-checkbox-group @change="clickAllCheckbox" v-model="isCheckedAll" v-show="isLotDelete" style="display:inline-block;margin-left:10px"> -->
        <template v-if="isLotDelete">
          <el-checkbox style="margin-left: 16px" @change="clickAllCheckbox" v-model="isCheckedAll"
            >全选</el-checkbox
          >
          <!-- </el-checkbox-group> -->
          <div style="float: right">
            <el-button size="small" @click="cancleDelete">取消</el-button>
            <el-button type="primary" plain size="small" @click="confirmDelete">确认删除</el-button>
          </div>
        </template>
        <template v-if="isExport">
          <el-checkbox style="margin-left: 16px" @change="clickAllCheckbox" v-model="isCheckedAll"
            >全选</el-checkbox
          >
          <div style="float: right">
            <el-button size="small" @click="cancleExport">取消</el-button>
            <el-button type="primary" plain size="small" @click="exportStar">确认导出</el-button>
          </div>
        </template>
      </el-row>
    </section>
    <!-- 批量导入弹窗 -->
    <el-dialog
      custom-class="dialog-min-width-import"
      title="批量导入"
      :visible.sync="lotImportDialogVisible"
      center
      append-to-body
      width="32%"
      class="lot-import-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row type="flex" justify="space-between">
        <el-upload :action="''" :http-request="uploadStarFile" :show-file-list="false">
          <el-button size="mini" type="primary" :loading="uploadLoading"
            >批量导入主播基本信息</el-button
          >
        </el-upload>
        <el-upload :action="''" :http-request="uploadStarCostFile" :show-file-list="false">
          <el-button size="mini" type="primary" :loading="uploadCostLoading"
            >批量导入主播成本报价</el-button
          >
        </el-upload>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-button size="mini" type="primary" @click="downloadModelxlsx"
          >下载主播基本信息模板</el-button
        >
        <el-button size="mini" type="primary" @click="downloadStarCostModel"
          >下载主播成本报价模板</el-button
        >
      </el-row>
    </el-dialog>
    <ul class="show-search-info" v-show="!notData">
      <li
        :class="{ 'is-marginLeft': index % 2 === 0, 'is-marginRight': index % 2 !== 0 }"
        v-for="(item, index) in starQueryData"
        :key="index"
      >
        <div class="card-head">
          <div class="card-head-left">
            <img :src="item.pic_url" alt="" @click="goStarDetail(item.star_name)" />
            <span class="star-name" @click="goStarDetail(item.star_name)"
              >{{ item.star_name }}
              <el-button
                icon="el-icon-arrow-right"
                class="go-detail"
                @click="goStarDetail(item.star_name)"
              ></el-button>
            </span>
          </div>
          <!-- v-if="isAdminUser" -->
          <template>
            <i
              class="card-edit"
              @click="openSaveDialog(item)"
              v-if="!(isLotDelete || isExport)"
            ></i>
            <i
              class="card-delete"
              @click="openDeleteDialog(item.star_id)"
              v-if="!(isLotDelete || isExport)"
            ></i>
          </template>
          <el-checkbox-group
            v-model="checkAllData"
            v-show="isLotDelete || isExport"
            @change="clickCheckBox"
          >
            <el-checkbox :label="item.star_id" ref="table"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="card-body">
          <div class="basic-info">
            <p class="card-body-title">主播信息</p>
            <p>主播ID：{{ item.star_id }}</p>
            <p>淘客ID：{{ item.wangwang_name === '' ? '-' : item.wangwang_name }}</p>
            <p>
              配合度：<el-rate disabled text-color="#ff9900" v-model="item.responsivity"></el-rate>
            </p>
            <p>粉丝数：{{ item.fans_number }} 万</p>
            <p>手机号：{{ item.star_mobile }}</p>
            <p>微信号：{{ item.star_wechat }}</p>
          </div>
          <div
            class="card-body-middle"
            :class="[
              item.cate_click_num_items.length === 0 && item.display_type.length === 0
                ? 'isRelativeLeft'
                : 'noRelativeLeft',
            ]"
          >
            <p class="card-body-title">主播成本及报价/元</p>
            <p class="star-cost-info">
              混播成本：{{ item.star_mix_cost === 0 ? '-' : item.star_mix_cost }}
            </p>
            <p class="star-cost-info">
              混播报价：{{ item.star_mix_price === 0 ? '-' : item.star_mix_price }}
            </p>
            <p class="star-cost-info">
              专场成本：{{ item.star_special_cost === 0 ? '-' : item.star_special_cost }}
            </p>
            <p class="star-cost-info">
              专场报价：{{ item.star_special_price === 0 ? '-' : item.star_special_price }}
            </p>
            <p class="card-body-title star-cost-info">商品属性</p>
            <p class="star-cost-info">品类：{{ item.category_items.join('、') }}</p>
            <p class="star-cost-info">客单价：{{ getSalesPricePeriod(item.sales_price_period) }}</p>
          </div>
          <div class="card-body-last" v-show="true">
            <p class="card-body-title" v-show="item.cate_click_num_items.length !== 0">
              最近30款产品点击数/次
            </p>
            <div class="card-body-last-des" v-show="item.cate_click_num_items.length !== 0">
              <p
                class="small-line-height"
                v-for="(items, ind) in showRecentClickNum15[index].cateInfo"
                :key="ind"
              >
                {{ items[0] }}：{{ items[1] }}
              </p>
            </div>
            <p class="card-body-title" v-show="item.display_type.length !== 0">
              最近15场场均PV /万
            </p>
            <p class="small-line-height" v-if="item.display_type.length !== 0">
              {{ item.display_type[0][0] }}：{{ item.display_type[0][1] }}
            </p>
            <p class="small-line-height" v-if="item.display_type.length > 1">
              {{ item.display_type[1][0] }}：{{ item.display_type[1][1] }}
            </p>
          </div>
        </div>
        <div class="card-foot">
          <p>
            录入人：<span>{{ getZeroNum(item.add_by) }}</span>
          </p>
          <p>
            最终修改人：<span>{{ getZeroNum(item.modified_by) }}</span>
          </p>
          <el-button size="mini" type="primary" @click="openAddDisplayDialog(item)"
            >新增场次</el-button
          >
          <el-button size="mini" type="primary" @click="showDisplay(item)">查看场次</el-button>
        </div>
      </li>
    </ul>
    <!-- not-data -->
    <div class="not-data" v-show="notData" v-loading="searchStarLoading">
      <p><i></i></p>
      <p>暂无数据</p>
    </div>
    <!-- add-display-dialog -->
    <el-dialog
      title="新增场次"
      :visible.sync="addDisplayDialogVisible"
      @close="closeAddDisplayDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="36%"
      class="add-display-form"
      custom-class="dialog-min-width"
    >
      <displayForm :displayInfoForm="displayInfoForm" @display-form-ref="displayFormRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" @click="addDisplayDialogVisible = false">取消</el-button>
          <el-button type="primary" size="small" @click="addDisplay">添加</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- add-star-edit-starinfo -->
    <el-dialog
      title="主播信息"
      :visible.sync="saveStarDialogVisible"
      class="add-star-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="editDialogClose('starInfoForm')"
      append-to-body
      custom-class="dialog-min-width"
    >
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
          <el-form-item
            label="品 类"
            prop="category"
            :rules="[{ required: true, message: '品类不能为空' }]"
          >
            <el-select v-model="starInfoForm.category" placeholder="请选择" name="category">
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
        <el-row>
          <el-form-item label="淘客ID">
            <el-input v-model="starInfoForm.wangwang_name"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="small"
            @click="editDialogClose('starInfoForm'), (saveStarDialogVisible = false)"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="submitSaveStar(starInfoForm, 'starInfoForm')"
            size="small"
            >保存</el-button
          >
        </div>
      </template>
    </el-dialog>
    <div class="block" v-show="!notData">
      <div class="pageBox">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size.sync="pagination.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import { queryStars, saveStar, deleteStar, queryStarSug, exportStars } from '@/api/star';
import { saveDisplay } from '@/api/display';
import { categoryFormate } from '@/utils/format';
import { fileMaxSize, fileMaxSizeTips } from '@/utils/config'; // , USER_ROLE
// import { getUserInfo } from '@/api/auth'
import {
  presellSelectOption,
  categoryOptions,
  salesPriceOptions,
  displayTypeOptions,
  fansNumberOptions,
  mixSpeicalOptions,
  clickTypeOptions,
} from '@/const/options';
import { uploadFile } from '@/api/upload';
import { domain } from '@/utils/variable';

import displayForm from '../display/component/displayForm';
import { RIGHT_CODE } from '@/const/roleCode';
import { RouterNameProjectManage } from '@/const/router';

export default {
  components: { displayForm },
  data() {
    return {
      RIGHT_CODE,
      domain: domain,
      searchStarLoading: false,

      showRecentClickNum15: [],
      // isAdminUser: true,
      checkAllData: [],
      notData: true,
      isCheckedAll: false,
      delStarId: [],

      isLotDelete: false,
      // 是否导出
      isExport: false,
      queryStarSuggest: [],
      starSuggest: [],
      searchCondition: {
        num: 1000,
      },
      categoryOptions,
      salesPriceOptions,
      fansNumberOptions,
      mixSpeicalOptions,
      clickTypeOptions,
      presellSelectOption,
      displayTypeOptions,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      lotImportDialogVisible: false,
      uploadLoading: false,
      uploadCostLoading: false,
      showUploadNumber: false,

      downloadUrlxlsx: domain + '/template/template.xlsx',
      downloadModelStarCost: domain + '/template/star_cost_price_template.xlsx',
      starQueryForm: {
        star_name: '',
        category: '',
        sales_price_period: '',
        fans_number: '',
        mix_or_special: '',
        min_pv: '',
        max_pv: '',
        // click_type: '',
        // min_click_num: '',
        // max_click_num: ''
      },
      isClickEdit: false,
      starQueryData: [],
      starCurrentInfo: {},
      saveStarDialogVisible: false,
      starInfoForm: {},
      addDisplayDialogVisible: false,
      displayInfoForm: {},
      displayInfoFormRef: null,
    };
  },
  created() {
    // getUserInfo().then(response => {
    //   if (response.data.data.role === USER_ROLE.CUSTOMER_MANAGER || response.data.data.role === USER_ROLE.PROJECT_MANAGER) {
    //     this.isAdminUser = false
    //   }
    // })
    // const role = this.$store.getters['user/getUserRole']
    // if (role === USER_ROLE.CUSTOMER_MANAGER || role === USER_ROLE.PROJECT_MANAGER) {
    //   this.isAdminUser = false
    // }

    this.queryStar();
    this.starSearchSuggest();
  },
  methods: {
    // display-validate-ref,
    // 清除主播名称条件自动查询
    handleStarNameClear() {
      this.queryStarsubmit();
    },
    displayFormRef(val) {
      console.log(val);
      this.displayInfoFormRef = val;
    },
    downloadStarCostModel() {
      window.open(this.downloadModelStarCost);
    },
    // go-start-detail-chart
    goStarDetail(val) {
      // this.$router.push({ path: '/star-personal', query: { starName: val } });
    },
    getZeroNum(value) {
      if (value === 0 || value === '') {
        return ' - ';
      } else {
        return value;
      }
    },
    clickAllCheckbox(val) {
      if (val) {
        this.checkAllData = this.starQueryData.map(item => {
          return item.star_id;
        });
      } else {
        this.checkAllData = [];
      }
    },
    clickCheckBox(val) {
      this.isCheckedAll = val.length === this.starQueryData.length;
    },
    cancleDelete() {
      this.isLotDelete = false;
      this.checkAllData = [];
      this.isCheckedAll = false;
    },
    cancleExport() {
      this.isExport = false;
      this.checkAllData = [];
      this.isCheckedAll = false;
    },
    confirmDelete() {
      if (this.checkAllData.length === 0) {
        this.$gmMessage('请先选择主播', 'tip');
      } else {
        this.$confirm('确认删除主播？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
          .then(() => {
            this.checkAllData.forEach(item => {
              this.delStarId.push(parseInt(item, 10), 10);
            });
            const starinfopass = {
              star_id: JSON.stringify(this.delStarId),
            };
            deleteStar(starinfopass).then(response => {
              const data = response.data;
              if (data.success) {
                this.$gmMessage(data.message);
                this.queryStarsubmit(this.starQueryForm);
              } else {
                this.$gmMessage(data.message, 'tip');
                this.checkAllData = [];
                this.delStarId = [];
                this.isCheckedAll = false;
              }
            });
          })
          .catch(() => {
            /* do nth */
          });
      }
    },
    // 防止拦截
    openWindow(url) {
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    // 导出主播
    exportStar() {
      if (this.checkAllData.length === 0) {
        this.$gmMessage('请先选择主播', 'tip');
      } else {
        this.checkAllData.forEach(item => {
          this.delStarId.push(parseInt(item, 10), 10);
        });
        const starinfopass = {
          star_ids: JSON.stringify(this.delStarId),
        };
        // 防止被拦截
        // let winRef = window.open('', '_blank')
        exportStars(starinfopass).then(response => {
          const data = response.data;
          if (data.success) {
            const url = this.domain + '/api/star/export_stars_file?timestamp=' + data.data;
            window.open(url);
            // 防止被拦截
            // winRef.location = url
            // this.$gmMessage(data.message)
            this.queryStarsubmit(this.starQueryForm);
          } else {
            this.$gmMessage(data.message, 'tip');
            this.checkAllData = [];
            this.delStarId = [];
            this.isCheckedAll = false;
          }
        });
        // this.$confirm('确认导出主播？', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning',
        //   iconClass: 'warning-icon'
        // })
        //   .then(() => {
        //     this.checkAllData.forEach(item => {
        //       this.delStarId.push(parseInt(item), 10)
        //     })
        //     let starinfopass = {
        //       star_ids: JSON.stringify(this.delStarId)
        //     }
        //     exportStars(starinfopass).then(response => {
        //       let data = response.data
        //       if (data.success) {
        //         let url = this.domain + 'api/star/export_stars_file?timestamp=' + data.data
        //         window.open(url)
        //         this.$gmMessage(data.message)
        //         this.queryStarsubmit(this.starQueryForm)
        //       } else {
        //         this.$gmMessage(data.message, 'tip')
        //         this.checkAllData = []
        //         this.delStarId = []
        //         this.isCheckedAll = false
        //       }
        //     })
        //   })
        //   .catch(() => {/* do nth */})
      }
    },
    // 弹框关闭重置表单验证提示
    closeAddDisplayDialog(_formName) {
      // this.$refs[formName].resetFields()
      this.displayInfoFormRef.resetFields();
    },
    // click-adddisplay-btn
    openAddDisplayDialog(item) {
      this.addDisplayDialogVisible = true;
      this.displayInfoForm = {
        star_id: item.star_id,
        star_name: item.star_name,
        title: '',
        display_type: '',
        pv: '',
        uv: '',
        display_time: '',
        is_presell: '',
      };
    },
    starKeyUp() {
      this.starSuggest.forEach(value => {
        if (value.value !== this.displayInfoForm.starName) {
          this.displayInfoForm.starId = '';
        }
      });
    },
    addDisplay(_formName) {
      // this.$refs[formName].validate((valid) => {
      this.displayInfoFormRef.validate(valid => {
        if (valid) {
          saveDisplay(this.displayInfoForm).then(response => {
            const data = response.data;
            if (data.success) {
              this.addDisplayDialogVisible = false;
              // this.$router.push({ path: '/data/display-info', query: { starName: this.displayInfoForm.star_name } })
              this.$router.push({
                name: RouterNameProjectManage.marketing.display.list,
                query: { starName: this.displayInfoForm.star_name },
              });
            } else {
              this.$gmMessage(data.message, 'tip');
            }
          });
        } else {
          return false;
        }
      });
    },
    starSearchSuggest() {
      // get all stars
      queryStarSug().then(response => {
        const result = response.data;
        if (result.success) {
          result.data.star_data.forEach(value => {
            this.starSuggest.push({
              value: value.star_name,
              starId: value.star_id,
            });
          });
        } else {
          if (result.error_code !== 100) {
            this.$message.error({ message: result.message });
          }
        }
      });
    },
    // 输入建议
    querySearch(queryString, cb) {
      const queryStarSuggest = this.queryStarSuggest;
      const results = queryString
        ? queryStarSuggest.filter(this.createFilter(queryString))
        : queryStarSuggest;
      cb(results);
    },
    // 输入建议
    createFilter(queryString) {
      return queryStarSuggest => {
        return queryStarSuggest.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    // 输入建议
    loadAll() {
      return this.starSuggest;
    },
    handleSelect(item) {
      this.starQueryForm.star_name = item.value;
    },
    downloadModelxlsx() {
      window.open(this.downloadUrlxlsx);
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.queryStar();
    },
    handleCurrentChange() {
      document.querySelectorAll('.list-scrollbar')[0].scrollTop = 0;
      this.queryStar();
    },
    uploadStarFile(param) {
      this.uploadLoading = true;
      const file = param.file;
      if (file.size > fileMaxSize) {
        this.$message.error(fileMaxSizeTips);
        this.uploadLoading = false;
        return;
      }
      const form = new FormData();
      form.append('file', file);
      form.append('operate', 'star');
      uploadFile(form).then(response => {
        const result = response.data;
        if (result.success) {
          this.$gmMessage({
            content: result.message,
            type: 'tip',
            showBtn: true,
            duration: 0,
          });
          setTimeout(() => {
            this.queryStar();
          }, 500);
          this.lotImportDialogVisible = false;
          this.uploadLoading = false;
        } else {
          this.$gmMessage(result.message, 'tip');
          this.uploadLoading = false;
        }
      });
    },
    uploadStarCostFile(param) {
      const file = param.file;
      if (file.size > fileMaxSize) {
        this.$message.error(fileMaxSizeTips);
        this.uploadLoading = false;
        return;
      }
      const form = new FormData();
      form.append('file', file);
      form.append('operate', 'star_cost');
      this.uploadCostLoading = true;
      uploadFile(form).then(response => {
        const result = response.data;
        if (result.success) {
          this.$gmMessage({
            content: result.message,
            type: 'tip',
            showBtn: true,
            duration: 0,
          });
          setTimeout(() => {
            this.queryStar();
          }, 500);
          this.lotImportDialogVisible = false;
          this.uploadCostLoading = false;
        } else {
          this.$gmMessage(result.message, 'tip');
          this.uploadCostLoading = false;
        }
      });
    },
    addStarDialog() {
      this.starInfoForm = {
        id: '',
        star_id: '',
        star_name: '',
        star_mobile: '',
        star_wechat: '',
        responsivity: null,
        sales_price_period: '',
        category: '',
        fans_number: '',
        wangwang_name: '',
        star_special_cost: '',
        star_special_price: '',
        star_mix_cost: '',
        star_mix_price: '',
      };
      this.isClickEdit = false;
      this.saveStarDialogVisible = true;
    },
    editDialogClose(formName) {
      this.queryStar();
      this.$refs[formName].resetFields();
    },
    queryStarsubmit() {
      this.categoryOptions.forEach(item => {
        if (this.starQueryForm.category === item.value) {
          this.starQueryForm.category = item.label;
        }
      });
      this.pagination.currentPage = 1;
      this.queryStar();
      // 重置数据
      this.checkAllData = [];
      this.delStarId = [];
      this.isCheckedAll = false;
      this.isLotDelete = false;
      this.isExport = false;
    },
    queryStar() {
      let minFansNumber = '';
      let maxFansNumber = '';
      this.searchStarLoading = true;
      this.fansNumberOptions.forEach(item => {
        if (item.value === this.starQueryForm.fans_number) {
          minFansNumber = item.min_fans_number;
          maxFansNumber = item.max_fans_number;
        }
      });
      const querystarpass = {
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        star_name: this.starQueryForm.star_name,
        category: this.starQueryForm.category,
        sales_price_period: this.starQueryForm.sales_price_period,
        min_fans_number: minFansNumber,
        max_fans_number: maxFansNumber,
        mix_or_special: this.starQueryForm.mix_or_special,
        min_pv: this.starQueryForm.min_pv,
        max_pv: this.starQueryForm.max_pv,
      };
      queryStars(querystarpass).then(response => {
        const result = response.data;
        if (result.success) {
          this.showRecentClickNum15 = [];
          this.pagination.total = result.data.total;
          this.starQueryData = result.data.data;
          result.data.data.forEach(item => {
            this.showRecentClickNum15.push({
              cateInfo: item.cate_click_num_items,
            });
          });
          this.searchStarLoading = false;
          if (this.starQueryData.length > 0) {
            this.notData = false;
          } else {
            this.notData = true;
          }
        } else {
          this.$gmMessage(result.message, 'tip');
        }
      });
    },
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
          if (starinfopass.category === '无') {
            this.$gmMessage('品类属性不能为“无”', 'tip');
          } else if (starinfopass.responsivity === 0) {
            this.$gmMessage('主播配合度不能为空', 'tip');
          } else {
            saveStar(starinfopass).then(response => {
              const result = response.data;
              if (result.success) {
                this.saveStarDialogVisible = false;
                this.$gmMessage(result.message);
                this.starInfoForm = {};
                this.starSuggest = [];
                this.starSearchSuggest();
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
    // 点击编辑主播信息
    openSaveDialog(val) {
      this.saveStarDialogVisible = true;
      this.starInfoForm = JSON.parse(JSON.stringify(val));
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
    openDeleteDialog(starId) {
      this.$confirm('确认删除主播？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const starinfo = {
            star_id: JSON.stringify(starId),
          };
          deleteStar(starinfo)
            .then(response => {
              const data = response.data;
              if (data.success) {
                this.$gmMessage(data.message);
                this.queryStar(this.starQueryForm);
              } else {
                this.$gmMessage(data.message, 'tip');
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          /* do nth */
        });
    },
    getSalesPricePeriod(val) {
      for (let i = 0; i < this.salesPriceOptions.length; i++) {
        const option = this.salesPriceOptions[i];
        if (val === option.value) {
          return option.label;
        }
      }
    },
    // 显示批量删除
    showDelete() {
      this.isLotDelete = true;
      this.isExport = false;
      this.checkAllData = [];
      this.isCheckedAll = false;
    },
    // 显示批量导出
    showExport() {
      this.isExport = true;
      this.isLotDelete = false;
      this.checkAllData = [];
      this.isCheckedAll = false;
    },
    showDisplay(scope) {
      // this.$router.push({ path: '/data/display-info', query: { starName: scope.star_name } })
      this.$router.push({
        name: RouterNameProjectManage.marketing.display.list,
        query: { starName: scope.star_name },
      });
    },
    categoryFormate,
  },
  mounted() {
    // 输入建议
    this.queryStarSuggest = this.loadAll();
  },
};
</script>

<style lang="scss">
@import '@/styles/vars.scss';
.page-section-star {
  .el-form-item--small .el-form-item__content,
  .el-form-item--small .el-form-item__label {
    line-height: 15px;
    padding-bottom: 4px;
  }
}
.card-head {
  .el-checkbox__label {
    border: 1px solid red;
    visibility: hidden;
    position: absolute;
    right: 0;
    top: 0;
    // display: none;
  }
}
.add-display-form {
  .el-form-item__label {
    padding-bottom: 0;
    line-height: 18px;
    margin-left: 10%;
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f1f2;
    padding: 15px 0;
    .el-button {
      width: 80px;
    }
  }
  .el-form-item__error {
    right: 10%;
    top: -16px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
}
.add-star-dialog {
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
}
.lot-import-dialog {
  .el-dialog__body {
    padding-bottom: 20px;
  }
}
.query-star {
  .el-form-item__content {
    width: 69%;
  }
  .el-form-item__label {
    padding-right: 4px;
    width: 29%;
    float: left;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.query-star-pv {
  .el-form-item__content {
    width: 70%;
    float: right;
  }
  .el-form-item__label {
    width: 29%;
    padding-right: 4px;
    float: left;
    max-height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.star-cost-desc {
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: var(--text-third-color);
}
</style>

<style lang="scss" scoped>
@import '../../assets/scss/starInfo.scss';
</style>
