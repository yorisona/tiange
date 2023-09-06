<template>
  <section>
    <el-table
      :data="productTableData"
      :header-row-style="{ fontSize: '15px', height: '48px' }"
      :header-cell-style="{
        background: 'var(--table-thead-th-bg-color)',
        color: 'var(--text-second-color)',
      }"
      v-loading="productTableLoading"
      stripe
      :size="size"
      @selection-change="handleSelectionChange"
      ref="liveTitle"
      class="product-table-wrapper"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="商品信息" max-width="250">
        <template v-slot="scope">
          <div class="pro-info">
            <p v-show="scope.row.shop_name !== ''">
              <span class="w52">店&#12288;铺：</span>
              <span class="size-normal">
                {{ scope.row.shop_name }}
                <b v-if="scope.row.category !== 0">- {{ categoryFormate(scope.row) }}</b>
              </span>
            </p>
            <p v-show="scope.row.shop_name === ''">
              <span class="w52">品&#12288;类：</span>
              <span class="size-normal">{{ categoryFormate(scope.row) }}</span>
            </p>
            <p
              style="
                white-space: nowrap;
                font-size: 13px;
                line-height: 18px;
                text-overflow: ellipsis;
                overflow: hidden;
              "
            >
              <span class="w52">商&#12288;品：</span>
              <span class="size-normal">
                <a :href="scope.row.product_url" target="_blank" title="点击跳转">
                  <i class="gm-icon-link pro-url"></i>
                </a>
                <el-popover trigger="hover" placement="top">
                  <span>商品名称: {{ scope.row.product_name }}</span>
                  <template slot="reference">
                    <span class="size-normal">{{ scope.row.product_name }}</span>
                  </template>
                </el-popover>
              </span>
            </p>
            <p>
              <span class="w52">活动价：</span>
              <span class="size-normal">{{
                scope.row.product_sales_price === -1
                  ? '未出单'
                  : scope.row.product_sales_price + '元'
              }}</span>
            </p>
            <p class="pro-tag">
              <span style="white-space: nowrap" class="w52">
                <em v-show="scope.row.is_top === 1">{{ scope.row.is_top === 1 ? '置顶' : '' }}</em>
                <em
                  :class="
                    scope.row.is_presell === 1 || scope.row.is_presell === 2
                      ? 'is-presell-pro'
                      : 'not-display-pro'
                  "
                  >{{ getIsPresell(scope.row) }}</em
                >
                <em :class="scope.row.is_display === 2 ? 'is-display-pro' : 'not-display-pro'">{{
                  getIsDisplay(scope.row)
                }}</em>
                <em v-show="scope.row.is_related_product === 2">{{
                  scope.row.is_related_product === 2 ? '关联商品' : ''
                }}</em>
              </span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column :render-header="customColumnHeaderSales">
        <template v-slot="scope">
          <div class="sales-desc">
            <p>
              <span>点击数：</span>
              <span>{{
                scope.row.product_click_num === -1 ? '--' : scope.row.product_click_num + ' 次'
              }}</span>
            </p>
            <p>
              <span>销售额：</span>
              <span class="many">{{
                scope.row.product_sales_amount === -1
                  ? '--'
                  : scope.row.product_sales_amount + ' 元'
              }}</span>
            </p>
            <p>
              <span>销售量：</span>
              <span>{{
                scope.row.product_sales_num === -1 ? '--' : scope.row.product_sales_num + ' 件'
              }}</span>
            </p>
            <p
              v-show="
                scope.row.product_click_num === -1 &&
                scope.row.product_sales_amount === -1 &&
                scope.row.product_sales_num === -1
              "
            >
              未出单
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="直播信息">
        <template v-slot="scope">
          <div class="live-info">
            <el-popover trigger="hover" placement="top">
              <p style="margin: 0">
                <span class="w70">直播标题：</span>
                <span>{{ scope.row.title }}</span>
              </p>
              <template slot="reference">
                <div>
                  <p v-show="scope.row.title !== ''">
                    <span class="w70">直播标题：</span>
                    <span>{{ getTitle(scope.row.title) }}</span>
                  </p>
                </div>
              </template>
            </el-popover>
            <p>
              <span class="w70">主播昵称：</span>
              <span class="color-blue">{{ scope.row.star_name }}</span>
            </p>
            <p>
              <span class="w70">主播&#12288;ID：</span>
              <span>{{ scope.row.star_id }}</span>
            </p>
            <!-- <p>
              <span>成本<b v-show="scope.row.display_price !== -1">/报价</b>:</span>
              <span>{{scope.row.display_cost === -1 ? '未出单':scope.row.display_cost + '元'}}<b v-show="scope.row.display_price !== -1">/{{scope.row.display_price + '元'}}</b></span>
            </p>-->
            <!-- <p><span>品&#12288;&#12288;类：</span><span>{{ categoryFormate(scope.row) }}</span></p> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="直播时间">
        <template v-slot="scope">
          <div class="live-time">
            <p>
              <span>直播日期：</span>
              <span>{{ showProDateFormat(scope.row.display_time) }}</span>
            </p>
            <p>
              <span>直播时间：</span>
              <span>{{ getDisplayPeriod(scope.row) || '--' }}</span>
            </p>
            <p>
              <span>直播时长：</span>
              <span>{{ getDuration(scope.row) }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label-class-name="proChangeInfo"
        width="130"
        :render-header="customColumnHeader"
      >
        <template v-slot="scope">
          <div class="pro-info">
            <p style="color: var(--text-des-color)">{{ scope.row.add_by }}</p>
            <p style="font-size: 14px">{{ addDateFormat(scope.row.gmt_create, 'YYYY-MM-DD') }}</p>
            <p style="color: var(--text-des-color)">{{ scope.row.modified_by }}</p>
            <p style="font-size: 14px">{{ addDateFormat(scope.row.gmt_modified, 'YYYY-MM-DD') }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60" align="center">
        <template v-slot="scope">
          <el-tooltip placement="left" effect="light" content="编辑">
            <p v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_product)">
              <i class="iconfont icon-bianji" @click="openEditProDialog(scope.row)"></i>
            </p>
          </el-tooltip>
          <el-tooltip placement="center" effect="light" content="删除" style="margin-top: 6px">
            <p v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_product)">
              <i class="iconfont icon-shanchu" @click="deleteProduct(scope.row)"></i>
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <template #empty>
        <div class="empty-box no_data" style="padding: 40px 0">
          <img src="@/assets/img/anchor_nodata.png" />
          <p>暂时木有内容呀~</p>
        </div>
      </template>
    </el-table>
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editProDialogVisible"
      append-to-body
      class="edit-product-info-dialog"
      top="10vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="closeProductDialog('proDialogFormData')"
    >
      <el-form
        size="small"
        :model="proDialogFormData"
        :inline="true"
        label-position="top"
        label-width="110px"
        ref="proDialogFormData"
      >
        <el-row>
          <el-form-item label="主播昵称">
            <el-input disabled v-model="proDialogFormData.star_name"></el-input>
          </el-form-item>
          <el-form-item
            label="店铺名称"
            prop="shop_name"
            :rules="[{ required: true, message: '店铺名称是必填项' }]"
          >
            <el-input
              name="shop_name"
              v-model="proDialogFormData.shop_name"
              placeholder="请输入店铺名称"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="商品名称"
            prop="product_name"
            :rules="[{ required: true, message: '商品名称是必填项' }]"
          >
            <el-input
              name="product_name"
              v-model="proDialogFormData.product_name"
              placeholder="请输入商品名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="活动价(客单价)"
            prop="product_sales_price"
            :rules="[{ required: true, message: '活动价(客单价)是必填项' }]"
          >
            <el-input
              name="product_sales_price"
              type="number"
              v-model="proDialogFormData.product_sales_price"
              placeholder="请输入内容"
              @mousewheel.native.prevent
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="商品链接"
            prop="product_url"
            :rules="[{ required: true, message: '商品链接是必填项' }]"
          >
            <el-input
              name="product_url"
              v-model="proDialogFormData.product_url"
              placeholder="请输入商品链接"
            ></el-input>
          </el-form-item>
          <el-form-item label="销售量">
            <el-input
              type="number"
              v-model="proDialogFormData.product_sales_num"
              placeholder="未出单请勿填写,未售出则填0"
              @mousewheel.native.prevent
            >
              <template #append>件</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="直播时间段"
            prop="display_period"
            :rules="[{ required: true, message: '直播时间段是必填项' }]"
          >
            <el-select name="display_period" v-model="proDialogFormData.display_period">
              <el-option
                v-for="(item, index) in livePeriodOption"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售额">
            <el-input
              type="number"
              v-model="proDialogFormData.product_sales_amount"
              placeholder="未出单请勿填写,未售出则填0"
              @mousewheel.native.prevent
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="直播日期"
            prop="display_time"
            :rules="[{ required: true, message: '直播日期是必填项' }]"
          >
            <el-date-picker
              name="display_name"
              v-model="proDialogFormData.display_time"
              :clearable="false"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="产品点击数"
            prop="product_click_num"
            :rules="[{ required: true, message: '产品点击数是必填项' }]"
          >
            <el-input
              name="product_click_num"
              type="number"
              v-model="proDialogFormData.product_click_num"
              placeholder="请输入内容"
              @mousewheel.native.prevent
            >
              <template #append>次</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="品类" required>
            <el-select v-model="proDialogFormData.category" required>
              <el-option
                v-for="(item, index) in categoryOptions"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="直播报价"
            prop="display_price"
            :rules="[{ required: true, message: '直播报价是必填项' }]"
          >
            <el-input
              type="number"
              name="display_price"
              v-model="proDialogFormData.display_price"
              placeholder="请输入内容"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="直播时长"
            prop="duration"
            :rules="[{ required: true, message: '直播时长是必填项' }]"
          >
            <el-select name="duration" v-model="proDialogFormData.duration">
              <el-option
                v-for="(item, index) in liveDurationOption"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="直播成本"
            prop="display_cost"
            :rules="[{ required: true, message: '直播成本是必填项' }]"
          >
            <el-input
              name="display_cost"
              type="number"
              v-model="proDialogFormData.display_cost"
              placeholder="请输入内容"
              @mousewheel.native.prevent
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item class="checkbox-par">
            <el-checkbox v-model="proDialogFormData.is_top" :true-label="1" :false-label="0"
              >是否置顶</el-checkbox
            >
            <el-checkbox
              style="margin-left: 4%"
              v-model="proDialogFormData.is_related_product"
              :true-label="2"
              :false-label="1"
              >是否为关联商品</el-checkbox
            >
          </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <el-row class="dialog-footer">
          <el-button class="big-button" size="small" @click="editProDialogVisible = false"
            >取消</el-button
          >
          <el-button
            class="big-button btn-blue"
            size="small"
            type="primary"
            @click="editProduct('proDialogFormData')"
            >保存</el-button
          >
        </el-row>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import {
  categoryFormate,
  getIsPresell,
  getIsDisplay,
  showProDateFormat,
  getDisplayPeriod,
  getDuration,
  addDateFormat,
} from '@/utils/format';
import {
  isPresellOptions,
  categoryOptions,
  isDisplayOptions,
  latestDisplayTimeOptions,
  livePeriodOption,
  liveDurationOption,
} from '@/const/options';
import { updateProduct, deleteProduct } from '@/api/display';
import { RIGHT_CODE } from '@/const/roleCode';

export default {
  name: 'productTable',
  props: ['productTableData', 'size'],
  data() {
    return {
      RIGHT_CODE,
      isPresellOptions,
      categoryOptions,
      isDisplayOptions,
      latestDisplayTimeOptions,
      livePeriodOption,
      liveDurationOption,

      productTableLoading: false,
      editProDialogVisible: false,
      proDialogFormData: {},
    };
  },
  methods: {
    getTitle(row) {
      let subLen;
      let width = this.$refs.liveTitle.bodyWidth;
      width = parseInt(width.substring(0, width.length - 2), 10);
      if (width >= 1500) {
        subLen = 16;
      } else if (width >= 1200) {
        subLen = 13;
      } else {
        subLen = 7;
      }
      if (row.length > subLen) {
        return row.substring(0, subLen - 1) + '..';
      } else {
        return row;
      }
    },
    handleSelectionChange(val) {
      this.$emit('pass-delete-data', val);
    },
    openEditProDialog(row) {
      this.editProDialogVisible = true;
      this.proDialogFormData = JSON.parse(JSON.stringify(row));
      if (this.proDialogFormData.category === 0) this.proDialogFormData.category = '无';
      for (const item in this.proDialogFormData) {
        if (this.proDialogFormData[item] === -1) this.proDialogFormData[item] = '';
      }
    },
    deleteProduct(row) {
      this.$confirm('此操作将永久删除文件, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const deletepass = { id: row.id };
          deleteProduct(deletepass).then(response => {
            const result = response.data;
            if (result.success) {
              this.$gmMessage(result.message);
              this.$emit('com-query-product');
            } else {
              this.$gmMessage(result.message, 'tip');
            }
          });
        })
        .catch(() => {
          /* do nth */
        });
    },
    closeProductDialog(formName) {
      this.$refs[formName].resetFields();
    },
    editProduct(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const updateProductpass = JSON.parse(JSON.stringify(this.proDialogFormData));
          updateProductpass.display_time = new Date(updateProductpass.display_time);
          const deleteArr = [
            'add_by',
            'flag',
            'gmt_create',
            'gmt_modified',
            'modified_by',
            'tag',
            'requirement_product_id',
            'title',
            'is_display',
            'is_presell',
          ];
          deleteArr.forEach(key => {
            delete updateProductpass[key];
          });
          if (updateProductpass.category === '无') {
            this.$gmMessage('品类属性不能为“无”', 'tip');
          } else {
            updateProduct(updateProductpass).then(response => {
              const result = response.data;
              if (result.success) {
                this.editProDialogVisible = false;
                this.$gmMessage(result.message);
                this.$emit('com-query-product'); // 查询商品
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
    customColumnHeader() {
      return (
        <div style="margin:0;padding:0;line-height:32px">
          <p style="margin:0;line-height:18px;font-size:14px">录入人/</p>
          <p style="margin:0;line-height:18px;font-size:14px">最终修改人</p>
        </div>
      );
    },
    //   <el-tooltip content="未出单商品则不填销售额和销量字段,若填写则认为商品已出单" placement="top" effect="light">
    //   <i class="el-icon-question" style="cursor:pointer;margin-left:2px"></i>
    // </el-tooltip>
    customColumnHeaderSales() {
      return <span>销售情况</span>;
    },
    categoryFormate,
    getIsPresell,
    getIsDisplay,
    showProDateFormat,
    getDisplayPeriod,
    getDuration,
    addDateFormat,
  },
};
</script>

<style lang="scss" scoped>
$color-primary: var(--theme-color);
::v-deep .el-checkbox__inner {
  margin-left: 3px;
}
::v-deep .el-dialog__header {
  padding: 15px 10px 15px;
}
::v-deep .el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.live-info,
.pro-info,
.live-price,
.sales-desc,
.live-time {
  p {
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 22px;
    color: var(--text-des-color);
    em {
      font-style: normal;
      border: 1px solid $color-primary;
      color: $color-primary;
      font-size: 14px;
      margin-right: 1px;
      padding: 0 2px;
      border-radius: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    b {
      font-weight: normal;
    }
    span {
      // overflow: hidden;
      // text-overflow: ellipsis;
      font-size: 14px;
    }
    .w70 {
      display: inline-block;
      width: 70px;
      vertical-align: top;
      text-align: right;
    }
    .w52 {
      display: inline-block;
      width: 52px;
      vertical-align: top;
      text-align: right;
      margin-right: 10px;
      font-size: 16px;
    }
    span:last-child {
      color: #666;
      font-size: 14px;
    }
    a {
      color: #666;
      text-decoration: none;
      .pro-url {
        vertical-align: middle;
        transform: scale(0.8);
      }
    }
  }
}
.live-info {
  p {
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    span:first-child {
      width: auto;
    }
    span:last-child {
      width: auto;
    }
  }
}
.pro-info {
  .pro-tag {
    white-space: normal;
    height: auto;
    line-height: auto;
    em {
      height: 20px;
      line-height: 20px;
      font-size: 14px;
    }
    .not-display-pro {
      color: var(--text-des-color);
      border-color: var(--text-des-color);
    }
  }
}
.proChangeInfo {
  height: 32px;
  line-height: 32px;
}
.edit-product-info-dialog {
  .el-form {
    .el-row {
      width: 84%;
      margin: 0 auto;
      .el-form-item {
        width: 43%;
        margin: 0 3% 15px 3%;
        .el-select,
        .el-input {
          width: 100%;
          border-radius: 10px;
        }
      }
      .checkbox-par {
        margin-top: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
<style lang="less">
.product-table-wrapper {
  th {
    padding: 5px 0;
    height: 50px;
    color: #666;
  }
  tr {
    height: 124px;
  }
}
.edit-product-info-dialog {
  .el-form {
    .el-form-item {
      // margin-bottom: 4px!important;
      position: relative;
      .el-form-item__label {
        line-height: 20px;
        padding: 0;
      }
      .el-form-item__error {
        position: absolute;
        right: 0;
        top: -16px;
      }
    }
  }
  .el-dialog__header {
    // height: 40px;
    // line-height: 40px;
    // padding: 0;
    .el-dialog__headerbtn {
      top: 12px;
    }
  }
  .el-dialog__footer {
    border-top: 1px solid #eee;
    padding-top: 20px;
    .el-button {
    }
  }
}

@media screen and (max-width: 1000px) {
  .edit-product-info-dialog .el-form .el-row .el-form-item {
    margin: 0 3% 0 3%;
  }
  .el-dialog__body {
    padding: 10px 10px 0;
  }
}
.el-table td,
.el-table th {
  border-bottom: none;
  text-align: left !important;
}
.color-blue {
  color: #396fff !important;
}
.icon-shanchu {
  margin-top: 5px;
}
</style>
