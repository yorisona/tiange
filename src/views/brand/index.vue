<template>
  <section class="requirement-index" style="min-width: 972px">
    <el-row class="search-requirement-row">
      <el-form class="search-bar2" :inline="true" size="small">
        <el-form class="search-bar2">
          <el-form-item label="提报日期:" class="media-cls">
            <el-date-picker
              v-model="times"
              unlink-panels
              type="daterange"
              size="small"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions1"
              :default-value="new Date().getTime() - 2592000000"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="品牌名称:">
            <!-- <el-input placeholder="品牌名" style="width: 100px" size="small" clearable v-model="brand_name"></el-input> -->
            <el-select
              ref="brandNameEdit"
              size="small"
              class="text-input"
              v-model="brand_name"
              clearable
              filterable
              placeholder="输入品牌名"
            >
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.brand_name"
                :value="item.brand_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="需求名称:">
            <el-input
              placeholder="输入需求名"
              style="width: 260px"
              size="small"
              clearable
              v-model="requirement_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="提报人:">
            <el-input
              placeholder="输入提报人"
              style="width: 260px"
              size="small"
              clearable
              v-model="add_by"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="clickQueryRequirement" size="small" class="btn-blue"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <tg-button type="negative" size="small" @click="resetRequirement">重置</tg-button>
          </el-form-item>
        </el-form>
      </el-form>
    </el-row>
    <el-row
      v-if="
        $store.getters['user/getUserRole'].includes(RIGHT_CODE.add_req) &&
        $store.getters['user/getUserRole'].includes(RIGHT_CODE.del_req)
      "
      class="search-requirement-row"
      style="margin-top: 12px"
    >
      <el-form :inline="true" :model="searchRequirementForm" size="small" class="btn-bar">
        <el-form-item>
          <el-button type="primary" class="btn-blue" @click="clickAddRequirement"
            >新建需求</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="" @click="handleDeleteRequirement">删除</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="box-sizing: border-box; z-index: 1; padding: 12px; background: #fff">
      <el-table
        :data="brandRequirementTable"
        stripe
        :header-row-style="{ fontSize: '14px', background: '#f0f1f2' }"
        :header-cell-style="{
          background: '#f0f1f2',
          height: '50px',
          color: 'var(--text-second-color)',
        }"
        class="brand-requirement-table"
        v-loading="brandRequirementTableLoading"
        :height="tableHeight + ''"
        @row-click="onRowClick"
        :row-style="{ height: '60px' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column prop="requirement_name" label="需求名称" show-overflow-tooltip align="center"> -->
        <el-table-column prop="requirement_name" label="需求名称">
          <template v-slot="scope">
            <div class="edit-box">
              <span v-show="editingId !== scope.row.id">{{ scope.row.requirement_name }}</span>
              <el-input
                :id="'input_' + scope.row.id"
                v-if="editingId === scope.row.id"
                size="mini"
                maxlength="24"
                v-model="scope.row.requirement_name"
                placeholder="请输入内容"
                @click.stop
                @keyup.enter.native="onInputBlur(scope.row)"
                @focus="focus(scope.row)"
                @blur="onInputBlur(scope.row)"
              ></el-input>
              <i
                v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_req)"
                v-show="editingId !== scope.row.id"
                class="edit-btn el-icon-edit"
                @click.stop="onEditClick(scope.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预算/元" align="right" width="150">
          <template v-slot="scope">
            <div>￥{{ formatMoney(scope.row.budget) }}</div>
          </template>
        </el-table-column>
        <el-table-column label="品牌名" width="300" align="center">
          <template v-slot="scope">
            <div class="brandname">
              {{ scope.row.brand_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="plan_count" label="已生成方案数" align="center" width="150" />
        <el-table-column prop="report_date" label="提报日期" align="center" width="150" />
        <el-table-column prop="add_by" label="需求提报人" align="center" width="150" />
        <template #empty>
          <div class="empty-box no_data" style="padding: 40px 0">
            <img src="@/assets/img/anchor_nodata.png" />
            <p>暂时木有内容呀~</p>
          </div>
        </template>
      </el-table>
    </el-row>
    <div style="margin-top: 14px; background: #fff; padding: 12px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.currentPage"
        :page-size.sync="pagination.pageSize"
        :page-sizes.sync="pagination.pageSizes"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
  </section>
</template>

<script>
import { queryRequirement, deleteRequirement, updateRequirement, queryBrand } from '@/api/brand';
import { displayTypeFormate, dateFormat, planStatusFormat } from '@/utils/format';
import { uploadFile } from '@/api/upload';
import { fileMaxSize, fileMaxSizeTips } from '@/utils/config';
import { formatTime } from '@/utils/tools';
import { domain } from '@/utils/variable';
import { RIGHT_CODE } from '@/const/roleCode';
import { RouterNameProjectManage } from '@/const/router';

export default {
  data() {
    return {
      RIGHT_CODE,
      uploadLoading: false,
      requirement_name: '',
      brand_name: '',
      add_by: '',
      searchRequirementForm: {
        requirement_name: '',
      },
      fileList: [],
      brandRequirementTable: [],
      brandRequirementTableLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 10,
      },
      tableHeight: 500,
      times: [],
      editingId: null, // 修改中的id
      // 选中的列表
      selectList: [],
      pickerOptions1: {
        disabledDate(date) {
          const ret = date.getTime() > new Date().getTime();
          return ret;
        },
      },
      brandList: [],
    };
  },
  created() {
    this.clickQueryRequirement();
    this.queryBrand();
  },
  mounted() {
    window.onresize = () => {
      this.setHeight();
    };
  },
  methods: {
    queryBrand() {
      const params = {
        page: 1,
        page_size: 0,
      };
      queryBrand(params).then(res => {
        if (res.data.success) {
          this.brandList = res.data.data.data;
        }
      });
    },
    formatMoney(num) {
      const str = num + '';
      const str0 = str.split('.')[0];
      const pointStr = str.split('.')[1] || '00';
      // ["8", "7", "6", "5", "4", "3", "2", "1"]
      return (
        str0
          .split('')
          .reverse()
          .reduce((prev, next, index) => {
            return (index % 4 ? next : next + ',') + prev;
          }) +
        '.' +
        pointStr
      );
    },
    // 获取需求列表
    async clickQueryRequirement() {
      // debugger
      this.brandRequirementTableLoading = true;
      const params = {
        status: 0,
        date_from: this.times.length > 0 ? formatTime(this.times[0].getTime()) : '',
        date_to: this.times.length > 0 ? formatTime(this.times[1].getTime()) : '',
        requirement_name: this.requirement_name,
        brand_name: this.brand_name,
        add_by: this.add_by,
        page: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
      };
      const response = await queryRequirement(params);
      this.brandRequirementTableLoading = false;
      if (response.data.success) {
        const { data, total } = response.data.data;
        this.pagination.total = total;
        this.brandRequirementTable = data;
      } else {
        this.$gmMessage(response.data.message, 'tip');
      }
      if (document.querySelector('.el-table__body-wrapper.is-scrolling-left'))
        document.querySelector('.el-table__body-wrapper.is-scrolling-left').scrollTop = 0;
      this.setHeight();
    },
    setHeight() {
      if (document.querySelector('.search-requirement-row')) {
        this.tableHeight =
          window.innerHeight -
          48 -
          46 -
          document.querySelector('.search-requirement-row').clientHeight -
          14 -
          46 -
          54;
      }
    },
    // 重置条件
    resetRequirement() {
      this.add_by = '';
      this.brand_name = '';
      this.requirement_name = '';
      this.times = [];
      this.clickQueryRequirement();
    },
    clickAddRequirement() {
      this.$router.push({
        name: RouterNameProjectManage.marketing.demand.create,
      });
    },
    goRequirementDetail(row) {
      this.$router.push({
        name: RouterNameProjectManage.marketing.demand.demand,
        params: { id: row.id },
      });
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleDeleteRequirement(_row) {
      if (this.selectList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要删除的需求',
        });
        return;
      }
      this.$confirm('此操作将永久删除数据，是否继续', '提示', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      })
        .then(() => {
          const arr = [];
          this.selectList.forEach(item => {
            arr.push(item.id);
          });
          const deleterequirementpass = {
            ids: JSON.stringify(arr),
          };
          deleteRequirement(deleterequirementpass).then(response => {
            const result = response.data;
            if (result.success) {
              this.$gmMessage('删除成功');
              this.clickQueryRequirement();
            } else {
              this.$gmMessage(result.message, 'tip');
            }
          });
        })
        .catch(() => {
          return false;
        });
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.clickQueryRequirement();
    },
    handleCurrentChange() {
      this.clickQueryRequirement();
    },
    downTemplate() {
      window.open(domain + '/template/brand_template.xlsx');
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
      form.append('file', file);
      // ('operate', 'brand/product')
      form.append('operate', 'brand');
      uploadFile(form).then(response => {
        const result = response.data;
        if (result.success) {
          this.$gmMessage({
            content: result.message,
            type: 'tip',
            duration: 0,
            showBtn: true,
          });
        } else {
          this.$gmMessage(result.message, 'tip');
        }
        this.uploadLoading = false;
      });
    },
    // 给方案结果加颜色
    checkColor(status) {
      let ret = '';
      if (status === 1) {
        ret = 'color: #1890FF;';
      } else if (status === 2) {
        ret = 'color: #4DCDB1;';
      }
      return ret;
    },
    displayTypeFormate,
    dateFormat,
    planStatusFormat,
    focus(row) {
      this.lastRequirementName = row.requirement_name;
    },
    // 需求名称失焦
    onInputBlur(row) {
      this.editingId = null;
      // 修改需求名
      const params = {
        requirement_id: row.id,
        requirement_name: row.requirement_name,
      };
      updateRequirement(params).then(res => {
        if (!res.data.success) {
          this.$message.error(res.data.message);
          row.requirement_name = this.lastRequirementName;
        }
      });
      // 编辑状态不能点击跳转
      setTimeout(() => {
        this.isEditing = false;
      }, 500);
    },
    // 点击编辑按钮
    onEditClick(row) {
      // debugger
      this.editingId = row.id;
      this.isEditing = true;
      this.$nextTick(() => {
        document.getElementById('input_' + this.editingId).focus();
      });
    },
    // table row click
    onRowClick(row, _column, _event) {
      if (!this.isEditing) {
        this.goRequirementDetail(row);
      }
    },
  },
};
</script>
<style lang="scss">
.requirement-index {
  .search-requirement-row {
    background: #fff;
    padding: 12px 12px 0;
    border-radius: 10px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .el-form-item__label {
    padding-right: 6px;
    // width: 72px;
  }
}
.search-requirement-row {
  .el-button--primary,
  .el-button--small {
    font-size: 14px;
    padding: 8px 15px;
  }
}
.brand-requirement-table {
  &.el-table tr {
    &:hover {
      background: #f5f7fd;
      .edit-btn {
        position: absolute;
        top: 4px;
        right: 0;
        display: inline;
        color: #cbcdd4;
        &:hover {
          color: #396fff;
        }
      }
    }
  }
  .brandname {
    cursor: pointer;
    &:hover {
      color: #396fff;
    }
  }
}
.btn-bar {
  display: inline-block;
}
.search-bar2 {
  // float: right;
  display: block;
}
</style>

<style lang="scss" scoped>
.edit-box {
  position: relative;
  display: inline-block;
  padding-right: 16px;
}
.edit-btn {
  cursor: pointer;
  display: none;
}
.hover-row .edit-btn {
  display: inline;
  color: #cbcdd4;
  &:hover {
    color: #396fff;
  }
}
/deep/ .el-table td {
  padding: 12px 0;
}
.el-table .cell {
  line-height: initial !important;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 12px;
}
/deep/ .el-table__fixed-right-patch {
  background: rgb(240, 241, 242) !important;
}
@import '@/styles/vars.scss';

@media screen and (max-width: 1310px) {
  .search-bar2 {
    .media-cls {
      .el-input__inner {
        width: 230px;
      }
      .el-input {
        width: 100%;
      }
    }
  }
}
@media screen and (max-width: 1060px) {
  .btn-bar {
    display: block;
  }
  .search-bar2 {
    float: none;
    display: inline-block;
    // width: 100%;
    .media-cls {
      width: initial;
      .el-input {
        width: 100%;
      }
    }
  }
}

// .search-requirement-row {
//   .el-form-item {
//     float: right;
//     &:first-child,
//     &:nth-child(2),
//     &:nth-child(3) {
//       float: left;
//     }
//   }
// }
// @media screen and (max-width: 1300px) {
//   .search-requirement-row {
//     .media-cls {
//       width: 130px !important;
//       .el-input {
//         width: 100%;
//       }
//     }
//   }
// }
// @media screen and (max-width: 1062px) {
//   .search-requirement-row {
//     .media-cls {
//       width: 80px !important;
//       .el-input {
//         width: 100%;
//       }
//     }
//   }
// }
.cell {
  margin-right: 20px;
}
</style>
