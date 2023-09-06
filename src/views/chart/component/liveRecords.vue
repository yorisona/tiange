<template>
  <section>
    <!-- 搜索条件、操作按钮s -->
    <el-row class="search-display-row">
      <el-form
        :inline="true"
        :model="searchDisplayForm"
        class="search-display-item"
        label-position="right"
        label-width="84px"
      >
        <el-row type="flex" justify="space-between">
          <el-form-item label="直播日期:">
            <el-date-picker
              size="small"
              placeholder="选择日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              v-model="searchDisplayForm.displayTime"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="最近直播:">
            <el-select
              placeholder="选择最近直播日期"
              v-model="searchDisplayForm.latestDisplayTime"
              size="small"
              clearable
            >
              <!-- <el-option v-for="(item, index) in latestDisplayTimeOptions" :key="index" :value="item.value" :label="item.label"></el-option> -->
              <el-option value="7" label="最近一周"></el-option>
              <el-option value="15" label="最近15天"></el-option>
              <el-option value="30" label="最近一个月"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="录 入 人:">
            <el-select v-model="searchDisplayForm.addBy" size="small" filterable clearable>
              <el-option
                v-for="(item, index) in allAddBy"
                :key="index"
                :value="item"
                :label="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-form-item label="是否预售:">
            <el-select
              placeholder="选择是否预售"
              v-model="searchDisplayForm.isPresell"
              size="small"
              clearable
            >
              <!-- <el-option v-for="(item, index) in isPresellOptions" :key="index" :value="item.value" :label="item.label"></el-option> -->
              <el-option value="1" label="预售场"></el-option>
              <el-option value="2" label="预热场"></el-option>
              <el-option value="0" label="非预售场"></el-option>
              <el-option value="-1" label="未录入"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否出单:">
            <el-select
              placeholder="选择是否已出单"
              size="small"
              clearable
              v-model="searchDisplayForm.isDisplay"
            >
              <!-- <el-option v-for="(item, index) in isDisplayOptions" :key="index" :value="item.value" :label="item.label"></el-option> -->
              <el-option value="2" label="已出单"></el-option>
              <el-option value="1" label="未出单"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button
              style="width: 60px; height: 30px; padding: 0"
              type="primary"
              size="small"
              @click="searchDisplay"
              >查询</el-button
            >
            <tg-button
              class="mgl-10"
              type="negative"
              size="small"
              style="width: 60px"
              @click="resetCondition"
              >重置</tg-button
            >
          </el-form-item>
        </el-row>
      </el-form>
    </el-row>
    <!-- main-table -->
    <el-row style="background: #fff; padding: 12px" class="live-records-table">
      <el-row v-if="canExportDisplay" class="search-display-button">
        <el-button type="primary" class="btn-blue big-button" size="small" @click="exportStarSubmit"
          >导出</el-button
        >
      </el-row>
      <el-table
        v-loading="displayData_loading"
        @selection-change="handleSelectionChange"
        :data="displayData"
        stripe
        :header-row-style="{ fontSize: '15px' }"
        :header-cell-style="{
          background: 'var(--table-thead-th-bg-color)',
          height: '48px',
          color: 'var(--text-second-color)',
        }"
        @row-click="handleDisplayClick"
      >
        <el-table-column prop="id" label="场次ID" v-if="false"> </el-table-column>
        <el-table-column type="selection" v-if="canExportDisplay"> </el-table-column>
        <el-table-column prop="title" min-width="110" label="直播标题/日期" show-overflow-tooltip>
          <template v-slot="scope">
            <p class="live-title">{{ scope.row.title === '' ? '-' : scope.row.title }}</p>
            <p class="live-time">{{ showZhCnDate(scope.row.displayTime) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="直播类型" min-width="100">
          <template v-slot="scope">
            <p>
              {{ getDisplayType(scope.row.displayType) }}
              <span v-show="scope.row.isPresell === 1" class="is-pre pre-tag">预售</span>
              <span v-show="scope.row.isPresell === 0" class="not-pre pre-tag">非预售</span>
              <span v-show="scope.row.isPresell === -1" class="not-write pre-tag">未录入</span>
              <span v-show="scope.row.isPresell === 2" class="pre-tag is-pre">预热</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="总销售情况" min-width="100" :render-header="TotalSales">
          <template v-slot="scope">
            <div>
              <p
                class="sales-desc"
                v-show="scope.row.displaySalesAmount !== 0 || scope.row.isDisplay === 2"
              >
                销售额:
                {{
                  scope.row.displaySalesAmount === -1
                    ? '未出单'
                    : scope.row.displaySalesAmount + ' 元'
                }}
              </p>
              <p
                class="sales-desc"
                v-show="scope.row.displaySalesNum !== 0 || scope.row.isDisplay === 2"
              >
                销售量:
                {{
                  scope.row.displaySalesNum === -1 ? '未出单' : scope.row.displaySalesNum + ' 件'
                }}
              </p>
              <span class="is-get-form is-gray" v-show="scope.row.isDisplay === 1">未出单</span>
              <span class="is-get-form" v-show="scope.row.isDisplay === 2">已出单</span>
              <el-tooltip
                v-if="
                  (scope.row.displaySalesAmount > 0 || scope.row.displaySalesNum > 0) &&
                  scope.row.isDisplay === 1
                "
                placement="right"
                content="该销售数据为关联商品的销售数据，所以此处为【未出单】"
                effect="light"
              >
                <i class="el-icon-warning" style="cursor: pointer; margin-left: 2px"></i>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="products_num" label="总商品数" min-width="76" align="right">
        </el-table-column>
        <el-table-column prop="pv" label="总PV/万" min-width="76" align="right"> </el-table-column>
        <el-table-column prop="products_click_num" label="总点击数" min-width="76" align="right">
        </el-table-column>
        <el-table-column label="录入人" min-width="124" show-overflow-tooltip align="right">
          <template v-slot="scope">
            <div>
              <p style="margin: 0">{{ scope.row.add_by }}</p>
              <p style="margin: 0; font-size: 12px; color: var(--text-des-color)">
                {{ addDateFormat(scope.row.addTime) }}
              </p>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-box no_data" style="padding: 40px 0">
            <img src="@/assets/img/anchor_nodata.png" />
            <p>暂时木有内容呀~</p>
          </div>
        </template>
      </el-table>
      <div class="block" style="margin: 16px 0 10px 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size.sync="pagination.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-row>
  </section>
</template>

<script>
import { queryDisplays, exportDisplays } from '@/api/display'; // , updateDisplay saveDisplay , deleteDisplay
import { addDateFormat, showZhCnDate } from '@/utils/format'; // displayTypeFormate,dateFormat,
// import {fileMaxSize, fileMaxSizeTips} from '@/utils/config'
import { queryStarSug } from '@/api/star';
// import {getUserInfo} from '@/api/auth'
// import {uploadFile} from '@/api/upload'
import {
  displayTypeOptions,
  isPresellOptions,
  isDisplayOptions,
  latestDisplayTimeOptions,
} from '@/const/options'; // , presellSelectOption
import { domain } from '@/utils/variable';
// import { USER_ROLE } from '@/utils/config'
import { RIGHT_CODE } from '@/const/roleCode';

export default {
  props: {
    starName: String,
    starId: String,
  },
  data() {
    return {
      // lotImportDialogVisible: false,
      isPresellOptions,
      isDisplayOptions,
      latestDisplayTimeOptions,
      searchDisplayForm: {
        starName: '',
        addBy: '',
        displayTime: '',
        latestDisplayTime: '',
        isDisplay: '',
        isPresell: '',
      },
      allAddBy: [],

      domain: domain,
      canExportDisplay: false, // 有没有导出权限
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 100,
      },
      displayData: [],
      displayData_loading: true,
      dialogTableVisible: false,
      displayTypeOptions,
      searchConditions: {
        num: 1000,
      },
      currentStarName: '',
      currentstarId: '',
      isSameStar: false,
      displaySelection: [],
    };
  },
  created() {
    // 判断是否存在导出权限
    const roleArr = this.$store.getters['user/getUserRole'];
    this.canExportDisplay = roleArr.includes(RIGHT_CODE.export_display);

    queryStarSug(this.searchConditions).then(response => {
      // debugger
      const result = response.data;
      if (result.success) {
        this.allStars = [];
        result.data.star_data.forEach(item => {
          this.allStars.push({
            value: item.star_name,
            star_id: item.star_id,
          });
        });
        this.allAddBy = result.data.user_data;
      } else {
        if (result.error_code !== 100) {
          this.$gmMessage(result.message, 'tip');
        }
      }
    });
    const queryDataKey = Object.keys(this.$route.query);
    if (queryDataKey.length > 0) {
      queryDataKey.forEach(key => {
        this.searchDisplayForm[key] = this.$route.query[key];
      });
    }
    // KOL详情中，淘宝合作直播模块，直播场次组件上传过来的starName
    if (!this.$route.query.starName && this.starName) {
      this.searchDisplayForm.starName = this.starName;
    }
    this.queryDisplays();
  },
  methods: {
    // 当表格数据发生勾选操作
    handleSelectionChange(val) {
      this.displaySelection = [];
      val.forEach(item => {
        this.displaySelection.push(item.id);
      });
    },
    // 搜索场次
    searchDisplay() {
      const queryData = JSON.parse(JSON.stringify(this.searchDisplayForm));
      Object.keys(queryData).forEach(key => {
        if (queryData[key] === '' || queryData[key] === null) delete queryData[key];
      });
      // this.$router.push({path: '/data/display-info', query: queryData})
      this.searchDisplayForm = queryData;
      this.pagination.currentPage = 1;
      this.queryDisplays();
      // console.log(this.searchDisplayForm)
    },
    // 计算场次的类型 预售 预热等等
    getDisplayType(val) {
      this.displayTypeOptions.forEach(item => {
        if (val === item.value) {
          val = item.label;
        }
      });
      return val;
    },
    // 导出方法
    exportStarSubmit: function () {
      if (this.searchDisplayForm.starName === null || this.searchDisplayForm.starName === '') {
        this.isSameStar = false;
      }
      if (this.isSameStar) {
        const exportpass = {
          star_id: '',
        };
        if (this.displaySelection.length > 0) {
          exportpass['live_ids'] = JSON.stringify(this.displaySelection);
        }
        this.allStars.forEach(item => {
          if (item.value === this.searchDisplayForm.starName) {
            exportpass.star_id = item.star_id;
          }
        });
        exportDisplays(exportpass).then(response => {
          const data = response.data;
          if (data.success) {
            const url = this.domain + '/api/star/export_star_file?timestamp=' + data.data;
            window.open(url);
            this.$gmMessage(data.message);
          } else {
            this.$gmMessage(data.message, 'tip');
          }
        });
      } else {
        this.$gmMessage('请先查询您要导出的主播', 'tip');
      }
    },
    // 翻页 每页数量发生变化
    handleSizeChange: function (val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.queryDisplays();
    },
    // 翻页
    handleCurrentChange: function () {
      this.queryDisplays();
    },
    // 查询场次
    queryDisplays: function () {
      const displaypass = {
        star_id: this.starId,
        star_name: this.searchDisplayForm.starName,
        add_by: this.searchDisplayForm.addBy,
        display_time: this.searchDisplayForm.displayTime,
        latest_display_time: this.searchDisplayForm.latestDisplayTime,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        is_display: this.searchDisplayForm.isDisplay,
        is_presell: this.searchDisplayForm.isPresell,
      };
      this.displayData_loading = true;
      queryDisplays(displaypass)
        .then(response => {
          const data = response.data;
          if (data.success) {
            if (data.data.total === 0) {
              this.isSameStar = false;
            } else {
              this.isSameStar = true;
            }
            this.pagination.total = data.data.total;
            this.displayData = [];
            for (const ii in data.data.data) {
              this.displayData.push({
                id: data.data.data[ii].id,
                title: data.data.data[ii].title,
                starId: data.data.data[ii].star_id,
                starName: data.data.data[ii].star_name,
                displayType: data.data.data[ii].display_type,
                pv: data.data.data[ii].pv,
                displayTime: data.data.data[ii].display_time,
                add_by: data.data.data[ii].add_by,
                modified_by: data.data.data[ii].modified_by,
                isPresell: data.data.data[ii].is_presell,
                modifiedTime: data.data.data[ii].gmt_modified,
                addTime: data.data.data[ii].gmt_create,
                isDisplay: data.data.data[ii].is_display,
                displaySalesAmount: data.data.data[ii].display_sales_amount,
                displaySalesNum: data.data.data[ii].display_sales_num,
                uv: data.data.data[ii].uv,
                products_num: data.data.data[ii].products_num,
                products_click_num: data.data.data[ii].products_click_num,
              });
            }
            this.displayData.forEach(item => {
              if (item.add_by === '') {
                item.add_by = ' - ';
              }
              if (item.modified_by === '') {
                item.modified_by = ' - ';
              }
              if (item.displaySalesAmount === -1) item.displaySalesAmount = 0;
              if (item.displaySalesNum === -1) item.displaySalesNum = 0;
              if (item.uv === -1) item.uv = '未录入';
              if (item.pv === -1) item.pv = '未录入';
            });
            this.displayData_loading = false;
          } else {
            if (data.error_code !== 100) {
              this.$gmMessage(data.message, 'tip');
            }
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    // displayTypeFormate,
    // categoryFormate,
    // dateFormat,
    addDateFormat,
    showZhCnDate,
    // 重置搜索条件
    resetCondition() {
      this.searchDisplayForm.addBy = '';
      this.searchDisplayForm.displayTime = '';
      this.searchDisplayForm.latestDisplayTime = '';
      this.searchDisplayForm.isDisplay = '';
      this.searchDisplayForm.isPresell = '';
      this.searchDisplay();
    },
    // 直播场次，点击单个场次
    handleDisplayClick(row) {
      // window.open(`/product-detail?displayId=${row.id}&currentstarId=${row.starId}&currentStarName=${row.starName}`)
      const link = document.createElement('a');
      link.setAttribute(
        'href',
        `/product-detail?displayId=${row.id}&currentstarId=${row.starId}&currentStarName=${row.starName}`,
      );
      link.setAttribute('target', '_blank');
      link.click();
    },
    // 总销售情况的表头小提示
    TotalSales() {
      return (
        <span>
          总销售情况
          <el-tooltip placement="top" effect="light">
            <template slot="content">
              <div>
                <p>
                  未出单（有销售数据）：该销售额或销售量属于关联商品的情况下，显示【未出单】状态。
                </p>
                <p>未出单（无销售数据）：没有录入销售数据的情况下，系统默认显示【未出单】状态。</p>
                <p>已出单：有录入销售数据，且商品不是关联商品，显示【已出单】状态。</p>
                <p>关联商品：关联商品指，直播间商品中，非构美平台合作的商品。</p>
              </div>
            </template>
            <i class="el-icon-question" style="cursor:pointer;margin-left:2px"></i>
          </el-tooltip>
        </span>
      );
    },
  },
};
</script>

<style lang="scss">
@import '@/styles/vars.scss';

.search-display-item {
  .el-form-item__label {
    width: 29%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-form-item__content {
    width: 70%;
    .el-input {
      width: 100%;
    }
  }
}
.upload-display-falied {
  .el-dialog__body {
    padding-top: 0;
  }
}
.addDisplay-dialog {
  .el-form-item__error {
    margin-right: 10%;
    top: -16px;
  }
  .el-form-item__label {
    padding-bottom: 0;
    line-height: 18px;
    margin-left: 10%;
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f1f2;
    padding: 15px 20px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
}
.el-table td,
.el-table th {
  padding: 8px 0;
  min-height: 50px;
}
// 修改新增样式 by BaiQing 2019-4-18
.live-records-table {
  ::v-deep .live-title {
    color: #666;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 165px;
    display: block;
  }
  .live-time {
    color: var(--text-des-color);
  }
  td .cell {
    cursor: pointer;
  }
}
.search-display-button {
  margin-bottom: 12px;
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/displayInfo.scss';
</style>
