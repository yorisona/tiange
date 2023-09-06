<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 16:21:43
 * @LastEditTime: 2020-04-28 14:57:49
 * @LastEditors: 神曲
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
@import '../../assets/scss/starInfo.scss';
#cooperation {
  .fl {
    float: left;
  }
  /deep/ .el-input__inner {
    border-radius: 2px;
  }
  .condition {
    min-height: 47px;
    background: #fff;
    // line-height: 62px;
    padding-left: 10px;
    padding-top: 15px;
    .c-item {
      display: inline-block;
      margin-right: 14px;
      line-height: 32px;
      margin-bottom: 15px;
      vertical-align: middle;
      &.cost {
        vertical-align: middle;
      }
      &.btn-group {
        .el-button {
          font-size: 14px;
          padding-top: 8px;
          padding-bottom: 8px;
        }
      }
      span {
        margin-right: 9px;
        color: #666;
      }
      .cost-type {
        /deep/ .el-input .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          border-right: none;
        }
      }
      .cost-input {
        /deep/ .el-input__inner {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
  .result-list {
    background: #fff;
    padding: 12px;
    margin-top: 12px;
    .btn-group {
      .el-button {
        width: 80px;
        font-size: 14px;
        padding: 8px 0;
      }
    }
    .result-table {
      margin-top: 12px;
      /deep/ .el-table .el-table__header-wrapper {
        background: #f5f6f9;
      }
      /deep/ .el-table tr {
        cursor: pointer;
      }
      .avatar-wrap {
        margin-right: 10px;
        .avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
        }
      }
      .info-wrap {
        text-align: left;
        .star-name {
          color: #5c82ff;
          font-size: 14px;
          font-weight: 600;
          width: 140px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .wangwang-name {
          color: #666;
          width: 140px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      /deep/ .el-rate__icon {
        font-size: 14px;
      }
      .pageBox {
        /deep/ .el-pagination {
          padding: 0;
          margin-top: 12px;
          .el-select .el-input {
            margin: 0;
          }
        }
      }
    }
  }
  .add-display-form {
    .el-form-item__label {
      padding-bottom: 0;
      line-height: 18px;
      margin-left: 10%;
      display: inline-block;
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
}
</style>
<style>
.add-star-dialog .el-form-item--small .el-form-item__label {
  line-height: 15px;
  padding-bottom: 4px;
}
.add-star-dialog .el-dialog {
  min-width: 800px;
  max-width: 800px;
}
.add-star-dialog .el-dialog__header {
  background: #f8f8f8;
  padding: 0;
  border-bottom: #efefef solid 1px;
  text-align: left !important;
}
.add-star-dialog .el-dialog__headerbtn {
  top: 18px;
}
.add-star-dialog .el-dialog__header .el-dialog__headerbtn i {
  color: var(--text-second-color) !important;
}
.add-star-dialog .dialog-min-width {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
}
.add-star-dialog .cutom-header span {
  color: #666 !important;
  line-height: 50px;
  display: inline-block;
  width: 120px;
  text-align: center;
  cursor: pointer;
}
.add-star-dialog .cutom-header span.active {
  background: #fff;
  color: #5c82ff !important;
  position: relative;
}
.add-star-dialog .cutom-header span.active::after {
  content: ' ';
  display: block;
  width: 100%;
  height: 2px;
  position: absolute;
  left: 0;
  bottom: -2px;
  background: #fff;
}
.add-star-dialog .dialog-footer {
  padding-top: 40px;
  text-align: center;
}
/* 批量导入 */
.add-star-dialog .el-row {
  width: 600px !important;
}
.add-star-dialog .upload-wrap {
  padding: 78px 0;
}
.add-star-dialog .upload-wrap .el-upload {
  /* background: #ccc; */
  width: 100%;
  height: 100%;
}
.add-star-dialog .upload-wrap .el-upload button {
  display: block;
  width: 100%;
  height: 100%;
  background: #fcfcfc;
  border-radius: 0;
  border: #d0d0d0 dashed 1px;
}
.upload-icon {
  width: 78px;
  height: 70px;
  background: url(../../assets/img/import_icon.png) 0 0 no-repeat;
  margin: 0 auto;
}
.add-star-dialog .upload-wrap .el-upload button:hover .upload-icon {
  background-position: -78px 0;
}
.icon-title {
  color: #666;
  margin: 30px 0 13px;
  font-size: 16px;
}
.icon-tip {
  color: #bbbbbb;
}
.add-star-dialog .upload-wrap .download-btns {
  text-align: center;
}
.add-star-dialog .upload-wrap .download-btns button {
  /* width: 300px;
  height: 240px; */
  width: auto !important;
  display: inline-block;
  margin: 20px 0;
  text-decoration: none;
  color: #666;
  width: 140px;
  height: 34px;
  line-height: 34px;
  border-radius: 2px;
  font-size: 14px;
  border: solid 1px #dcdcdc;
  background: #f6f6f6;
  padding: 0 20px;
}
.add-star-dialog .upload-wrap .download-btns button:hover {
  background: #f2f2f2;
  color: #555;
}
.add-star-dialog .upload-wrap .download-btns button:active {
  border-color: #396fff;
}

.add-star-dialog .upload-wrap .upload-btn {
  width: 300px;
  height: 240px;
  display: block;
  float: left;
  margin-bottom: 30px;
}
.add-star-dialog .el-dialog--center .el-dialog__body {
  text-align: left;
}
</style>

<template>
  <div id="cooperation">
    <div class="condition">
      <div class="c-item">
        <span>搜索主播</span>
        <el-input
          placeholder="主播昵称/淘客ID"
          size="small"
          style="width: 170px"
          v-model="condition.star_name"
        ></el-input>
      </div>
      <div class="c-item">
        <span>粉丝数</span>
        <el-select
          v-model="condition.fans_number"
          placeholder="请选择"
          size="small"
          style="width: 160px"
        >
          <el-option
            v-for="item in fansNumberOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="c-item cost">
        <span class="fl">成本</span>
        <el-select
          class="cost-type fl"
          v-model="condition.cost_mix_or_special"
          placeholder="请选择"
          size="small"
          style="width: 73px"
        >
          <el-option
            v-for="item in mixSpeicalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          class="cost-input fl"
          type="number"
          v-model="condition.min_cost"
          placeholder="输入成本"
          size="small"
          style="width: 86px"
          @mousewheel.native.prevent
        ></el-input>
        <em class="fl" style="margin: 0 5px">-</em>
        <el-input
          class="fl"
          type="number"
          v-model="condition.max_cost"
          placeholder="输入成本"
          size="small"
          style="width: 86px"
          @mousewheel.native.prevent
        ></el-input>
      </div>
      <div class="c-item cost">
        <span class="fl">报价</span>
        <el-select
          class="cost-type fl"
          v-model="condition.price_mix_or_special"
          placeholder="请选择"
          size="small"
          style="width: 73px"
        >
          <el-option
            v-for="item in mixSpeicalOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          class="cost-input fl"
          type="number"
          v-model="condition.min_price"
          placeholder="输入报价"
          size="small"
          style="width: 86px"
          @mousewheel.native.prevent
        ></el-input>
        <em class="fl" style="margin: 0 5px">-</em>
        <el-input
          class="fl"
          type="number"
          v-model="condition.max_price"
          placeholder="输入报价"
          size="small"
          style="width: 86px"
          @mousewheel.native.prevent
        ></el-input>
      </div>
      <div class="c-item btn-group">
        <el-button type="primary" size="small" @click="search">查询</el-button>
        <tg-button type="negative" size="small" @click="reset">重置</tg-button>
      </div>
    </div>
    <div class="result-list">
      <div class="btn-group">
        <el-button type="primary" size="small" @click="addStarDialog">新增主播</el-button>
        <!-- <el-button type="primary" size="small" @click="lotImportDialogVisible = true">批量导入</el-button> -->
        <el-button type="primary" size="small" @click="exportStar">导出</el-button>
        <!--  :disabled="selectedStar.length === 0" -->
        <el-button size="small" @click="confirmDelete">删除</el-button>
      </div>
      <div class="result-table">
        <el-table
          stripe
          style="width: 100%"
          :header-cell-style="{
            background: '#f0f1f2',
            height: '48px',
            color: 'var(--text-second-color)',
          }"
          :data="starQueryData"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="45"> </el-table-column>
          <el-table-column prop="star_name" label="昵称/淘客ID" width="220" align="center">
            <template v-slot="scope">
              <div class="avatar-wrap fl">
                <img :src="scope.row.pic_url" class="avatar" />
              </div>
              <div class="info-wrap fl">
                <el-tooltip :content="scope.row.star_name" placement="top" effect="light">
                  <p class="star-name">{{ scope.row.star_name }}</p>
                </el-tooltip>
                <el-tooltip :content="scope.row.wangwang_name" placement="top" effect="light">
                  <p class="wangwang-name">{{ scope.row.wangwang_name }}</p>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="star_category" label="品类" :render-header="categoryTips">
            <template v-slot="scope">
              {{ scope.row.star_category || '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="responsivity" label="配合度" width="120">
            <template v-slot="scope">
              <el-rate
                disabled
                text-color="#ff9900"
                void-color="#E7E7E7"
                v-model="scope.row.responsivity"
              ></el-rate>
            </template>
          </el-table-column>
          <el-table-column prop="fans_number" label="粉丝数/万" align="right"> </el-table-column>
          <el-table-column prop="star_mix_cost" label="混播成本/元" align="right">
          </el-table-column>
          <el-table-column prop="star_mix_price" label="混播报价/元" align="right">
          </el-table-column>
          <el-table-column prop="star_special_cost" label="专场成本/元" align="right">
          </el-table-column>
          <el-table-column prop="star_special_price" label="专场报价/元" align="right">
          </el-table-column>
          <template #empty>
            <div class="empty-box no_data" style="padding: 40px 0">
              <img src="@/assets/img/anchor_nodata.png" />
              <p>暂时木有内容呀~</p>
            </div>
          </template>
        </el-table>
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
    </div>
    <!-- add-star-edit-starinfo -->
    <el-dialog
      :visible.sync="saveStarDialogVisible"
      class="add-star-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @closed="editDialogClose('starInfoForm')"
      append-to-body
      custom-class="dialog-min-width"
      center
    >
      <template #title>
        <div class="cutom-header">
          <span
            :class="['dialog-tab', dialogShowBlockIndex === 0 ? 'active' : '']"
            @click="dialogShowBlockIndex = 0"
            >新增主播</span
          >
          <span
            :class="['dialog-tab', dialogShowBlockIndex === 1 ? 'active' : '']"
            @click="dialogShowBlockIndex = 1"
            >批量导入</span
          >
        </div>
      </template>
      <div v-show="dialogShowBlockIndex === 0">
        <el-form
          :model="starInfoForm"
          :inline="true"
          size="small"
          label-position="top"
          ref="starInfoForm"
        >
          <el-row>
            <el-form-item
              class="label-item"
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
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="small"
            @click="
              editDialogClose('starInfoForm');
              saveStarDialogVisible = false;
            "
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
      <div class="upload-wrap" v-show="dialogShowBlockIndex === 1">
        <el-row>
          <el-upload
            :action="''"
            :http-request="uploadStarFile"
            :show-file-list="false"
            class="upload-btn"
          >
            <el-button
              size="mini"
              type="primary"
              :loading="uploadLoading"
              style="border-right: none"
            >
              <div class="upload-icon"></div>
              <p class="icon-title">批量导入主播基本信息</p>
              <p class="icon-tip">点击此处选择要导入的文件</p> </el-button
            ><!-- 批量导入主播基本信息 -->
          </el-upload>
          <el-upload
            :action="''"
            :http-request="uploadStarCostFile"
            :show-file-list="false"
            class="upload-btn"
          >
            <el-button size="mini" type="primary" :loading="uploadCostLoading">
              <div class="upload-icon"></div>
              <p class="icon-title">批量导入主播成本报价</p>
              <p class="icon-tip">点击此处选择要导入的文件</p> </el-button
            ><!-- 批量导入主播成本报价 -->
          </el-upload>
        </el-row>
        <el-row class="download-btns">
          <el-button size="mini" type="info" plain @click="downloadModelxlsx"
            >下载主播基本信息模板</el-button
          >
          <el-button size="mini" type="info" plain @click="downloadStarCostModel"
            >下载主播成本报价模板</el-button
          >
        </el-row>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import {
  fansNumberOptions,
  mixSpeicalOptions,
  categoryOptions,
  salesPriceOptions,
} from '@/const/options';
import { queryStars, saveStar, exportStars, deleteStar } from '@/api/star'; // , deleteStar, queryStarSug, exportStars
import { fileMaxSize, fileMaxSizeTips } from '@/utils/config';
import { uploadFile } from '@/api/upload';
import { domain } from '@/utils/variable';
import { RouterNameProjectManage } from '@/const/router';

// const tableData = [{
//   star_name: '薇娅viya',
//   wangwang_name: '123',
//   pic_url: '//img.alicdn.com/imgextra/i2/69226163/TB2YEitX3aTBuNjSszfXXXgfpXa_!!69226163-0-beehive-scenes.jpg_310x310.jpg',
//   category_items: ['2', '个护'],
//   responsivity: 4,
//   fans_number: 422.13,
//   star_mix_cost: 213,
//   star_mix_price: 213,
//   star_special_cost: 1231,
//   star_special_price: 213
// }]
export default {
  name: 'cooperation',
  data() {
    return {
      uploadLoading: false,
      uploadCostLoading: false,
      fansNumberOptions, // 粉丝数选项
      mixSpeicalOptions, // 专场混播选项
      categoryOptions, // 品类选项
      salesPriceOptions, // 客单价选项
      condition: {
        star_name: '',
        fans_number: '',
        cost_mix_or_special: 'mix',
        min_cost: '',
        max_cost: '',
        price_mix_or_special: 'mix',
        min_price: '',
        max_price: '',
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      isClickEdit: false,
      saveStarDialogVisible: false,
      starInfoForm: {}, // 主播信息表单
      notData: false, // 无数据标志
      starQueryData: [],
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
      lotImportDialogVisible: false, // 批量导入弹窗是否显示
      downloadUrlxlsx: domain + '/template/template.xlsx',
      downloadModelStarCost: domain + '/template/star_cost_price_template.xlsx',
      selectedStar: [], // 选中的主播
      domain,
      loading: false, // table上的loading
      dialogShowBlockIndex: 0,
    };
  },
  mounted() {
    this.queryStar();
  },
  methods: {
    // 搜索
    search() {
      // console.log(JSON.stringify(this.condition))
      this.queryStar();
    },
    // 重置
    reset() {
      this.condition = {
        star_name: '',
        fans_number: '',
        cost_mix_or_special: 'mix',
        min_cost: '',
        max_cost: '',
        price_mix_or_special: 'mix',
        min_price: '',
        max_price: '',
      };
      this.queryStar();
    },
    // 新增主播
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
    // 关闭回调
    editDialogClose(formName) {
      this.queryStar();
      this.$refs[formName].resetFields();
    },
    // 查询主播
    queryStar() {
      this.loading = true; // 显示loading
      let minFansNumber = '';
      let maxFansNumber = '';
      this.fansNumberOptions.forEach(item => {
        if (item.value === this.condition.fans_number) {
          minFansNumber = item.min_fans_number;
          maxFansNumber = item.max_fans_number;
        }
      });
      const querystarpass = {
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        star_name: this.condition.star_name,
        // category: this.starQueryForm.category,
        // sales_price_period: this.starQueryForm.sales_price_period,
        min_fans_number: minFansNumber,
        max_fans_number: maxFansNumber,
        // mix_or_special: this.starQueryForm.mix_or_special,
        // min_pv: this.starQueryForm.min_pv,
        // max_pv: this.starQueryForm.max_pv
      };

      // 处理两个价格
      querystarpass[this.condition.cost_mix_or_special + '_min_cost'] =
        this.condition.min_cost || null;
      querystarpass[this.condition.cost_mix_or_special + '_max_cost'] =
        this.condition.max_cost || null;
      querystarpass[this.condition.price_mix_or_special + '_min_price'] =
        this.condition.min_price || null;
      querystarpass[this.condition.price_mix_or_special + '_max_price'] =
        this.condition.max_price || null;
      // debugger
      queryStars(querystarpass).then(response => {
        const result = response.data;
        if (result.success) {
          // this.showRecentClickNum15 = []
          this.pagination.total = result.data.total;
          this.starQueryData = result.data.data;
          // result.data.data.forEach(item => {
          //   this.showRecentClickNum15.push({
          //     cateInfo: item.cate_click_num_items
          //   })
          // })
          this.loading = false;
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
    // 提交保存主播
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
                // this.starSuggest = []
                // this.starSearchSuggest()
                // 在有搜索条件的情况之下，新增主播可能不在当前搜索条件范围之内，所以重置搜索条件并加载数据
                this.reset();
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
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.queryStar();
    },
    handleCurrentChange() {
      document.querySelectorAll('.list-scrollbar')[0].scrollTop = 0;
      this.queryStar();
    },
    // 导入主播
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
          // this.$gmMessage({
          //   content: result.message,
          //   type: 'tip',
          //   showBtn: true,
          //   duration: 0
          // })

          this.$gmMessage({
            content: result.message,
            type: 'success',
            showBtn: true,
            duration: 0,
            submutConfig: {
              visible: true,
              primaryText: '查看结果',
              infoText: '继续导入',
              callback: () => {
                this.saveStarDialogVisible = false;
                this.$router.push({
                  name: RouterNameProjectManage.marketing.importLog,
                });
              },
            },
          });
          this.reset();
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
            type: 'success',
            showBtn: true,
            duration: 0,
            submutConfig: {
              visible: true,
              primaryText: '查看结果',
              infoText: '继续导入',
              callback: () => {
                this.saveStarDialogVisible = false;
                this.$router.push({
                  name: RouterNameProjectManage.marketing.importLog,
                });
              },
            },
          });
          this.reset();
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
    downloadStarCostModel() {
      window.open(this.downloadModelStarCost);
    },
    downloadModelxlsx() {
      window.open(this.downloadUrlxlsx);
    },
    // 选择事件
    handleSelectionChange(val) {
      this.selectedStar = val;
    },
    // 导出主播
    exportStar() {
      if (this.selectedStar.length === 0) {
        this.$gmMessage('请先选择主播', 'tip');
      } else {
        // this.selectedStar.forEach(item => {
        //   this.delStarId.push(parseInt(item), 10)
        // })
        const ids = this.selectedStar.map(item => item.star_id);
        // debugger
        const starinfopass = {
          star_ids: JSON.stringify(ids),
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
            // this.queryStarsubmit(this.starQueryForm)
            this.queryStar();
          } else {
            this.$gmMessage(data.message, 'tip');
            this.selectedStar = [];
            // this.delStarId = []
            // this.isCheckedAll = false
          }
        });
      }
    },
    // 删除
    confirmDelete() {
      if (this.selectedStar.length === 0) {
        this.$gmMessage('请先选择主播', 'tip');
      } else {
        this.$confirm('确认删除主播？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        })
          .then(() => {
            // this.selectedStar.forEach(item => {
            //   this.delStarId.push(parseInt(item), 10)
            // })
            const ids = this.selectedStar.map(item => item.star_id);
            const starinfopass = {
              star_id: JSON.stringify(ids),
            };
            deleteStar(starinfopass).then(response => {
              const data = response.data;
              if (data.success) {
                this.$gmMessage(data.message);
                // this.queryStarsubmit(this.starQueryForm)
                this.queryStar();
              } else {
                this.$gmMessage(data.message, 'tip');
                this.selectedStar = [];
                // this.delStarId = []
                // this.isCheckedAll = false
              }
            });
          })
          .catch(() => {
            /* do nth */
          });
      }
    },
    // 点击一条数据
    handleRowClick(row) {
      // console.log(row)
      // this.$router.push({
      //   path: '/star-personal',
      //   query: {
      //     starName: row.star_name,
      //     starId: row.star_id,
      //   },
      // });
    },
    // 品类表头小提示
    categoryTips() {
      return (
        <span>
          品类
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <p>
                系统自动获取，该主播在淘宝直播间，历史出售的商品品类中出现频次最多的前三个品类。
              </p>
              <p>
                例：该场直播间共挂出10个商品链接，其中5个美妆商品，2个女装商品，2个个护商品，1个零食商品，那么该主播品类为：美妆/女装/个护。
              </p>
            </div>
            <i class="el-icon-question" style="cursor:pointer;margin-left:2px"></i>
          </el-tooltip>
        </span>
      );
    },
  },
};
</script>
