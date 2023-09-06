<template>
  <section class="page-section-brand">
    <el-row class="search-requirement-row">
      <el-form class="search-bar" :inline="true" size="small">
        <el-form-item label="状态:" class="media-cls">
          <el-select
            v-model="statusText"
            placeholder="请选择"
            style="width: 120px"
            @change="changeSelect"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提报日期:" class="media-cls">
          <el-date-picker
            v-model="times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item class="media-cls">
          <el-input placeholder="请输入品牌名称" clearable v-model="requirement_name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clickQueryBrand">查询</el-button>
        </el-form-item>
        <el-form-item>
          <tg-button type="negative" size="small" @click="resetRequirement">重置</tg-button>
        </el-form-item>
      </el-form>
      <el-form
        v-if="
          $store.getters['user/getUserRole'].includes(RIGHT_CODE.add_brand) &&
          $store.getters['user/getUserRole'].includes(RIGHT_CODE.del_brand)
        "
        :inline="true"
        size="small"
        class="btn-bar"
      >
        <el-form-item>
          <el-button type="primary" @click="clickAddBrand">新增品牌</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleDeleteRequirement">删除</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="box-sizing: border-box; z-index: 1">
      <el-table
        :data="queryBrandTable"
        stripe
        :header-row-style="{ fontSize: '14px' }"
        :header-cell-style="{
          background: 'var(--table-thead-th-bg-color)',
          height: '50px',
          color: 'var(--text-second-color)',
        }"
        class="brand-requirement-table"
        v-loading="queryBrandTableLoading"
        :height="tableHeight + ''"
        @row-click="onRowClick"
        :row-style="{ height: '60px' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="brand_name" label="品牌名称" min-width="140"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <div class="icon-status status1" v-if="scope.row.status">启用中</div>
            <div class="icon-status status2" v-else>停用</div>
          </template>
        </el-table-column>
        <el-table-column prop="add_by" label="录入人" align="center"></el-table-column>
        <el-table-column
          prop="create_time_str"
          label="录入时间"
          show-overflow-tooltip
          align="center"
          min-width="95"
        />
        <el-table-column label="操作" align="center">
          <template v-slot="scope">
            <div>
              <el-switch
                v-model="scope.row.status"
                @change="changeStatus(scope.row)"
                :disabled="!$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_brand)"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <empty-common detail-text="暂时木有内容呀~"></empty-common>
        </template>
      </el-table>
    </el-row>
    <div style="margin-top: 14px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
    <el-dialog
      class="dialog-anthor-list"
      :visible.sync="addBrandVisible"
      title="新增品牌"
      @close="addBrandVisible = false"
      top="10vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col :span="4" align="right" style="font-size: 16px; line-height: 32px"
          >品牌名称：</el-col
        >
        <el-col :span="20">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag.value }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            maxlength="12"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput"
            >+ 新增</el-button
          >
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addBrandVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveBrand">完成</el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { queryBrand, updateBrand, createBrand, brandNameExists } from '@/api/brand';
import { displayTypeFormate, dateFormat, planStatusFormat } from '@/utils/format';
// import { uploadFile } from '@/api/upload'
// import { fileMaxSize, fileMaxSizeTips } from '@/utils/config'
import { formatTime } from '@/utils/tools';
import { RIGHT_CODE } from '@/const/roleCode';

export default {
  data() {
    return {
      RIGHT_CODE,
      uploadLoading: false,
      statusText: '',
      status: -1,
      // 状态列表
      statusList: [
        {
          value: -1,
          label: '全部',
        },
        {
          value: 0,
          label: '使用中',
        },
        {
          value: 1,
          label: '停用',
        },
      ],
      requirement_name: '',
      queryBrandTable: [],
      queryBrandTableLoading: false,
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
      // 新增品牌
      addBrandVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
    };
  },
  created() {
    this.clickQueryBrand();
  },
  mounted() {
    window.onresize = () => {
      this.setHeight();
    };
  },
  methods: {
    // 获取品牌列表
    async clickQueryBrand() {
      // debugger
      this.queryBrandTableLoading = true;
      const params = {
        status: this.status,
        date_from: this.times.length > 0 ? formatTime(this.times[0].getTime()) : '',
        date_to: this.times.length > 0 ? formatTime(this.times[1].getTime()) : '',
        name: this.requirement_name,
        page: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
      };
      const response = await queryBrand(params);
      this.queryBrandTableLoading = false;
      if (response.data.success) {
        const { data, total } = response.data.data;
        this.pagination.total = total;
        data.forEach(item => {
          item.status = !item.flag;
        });
        this.queryBrandTable = data;
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
          54 +
          56;
      }
    },
    // 重置条件
    resetRequirement() {
      this.requirement_name = '';
      this.times = [];
      this.statusText = '';
      this.status = -1;
      this.clickQueryBrand();
    },
    // 新增品牌
    clickAddBrand() {
      this.addBrandVisible = true;
    },
    // 判断品牌名是否存在
    brandNameExists(name, fn) {
      const params = {
        brand_name: name,
      };
      brandNameExists(params).then(res => {
        fn(res.data);
      });
    },
    // 保存新增品牌
    saveBrand() {
      if (this.dynamicTags.length === 0) {
        this.$message.error('请输入品牌名称');
        return;
      }
      const name = [];
      this.dynamicTags.forEach(item => {
        name.push(item.value);
      });
      const params = {
        name: JSON.stringify(name),
      };
      createBrand(params).then(res => {
        if (res.data.success) {
          this.addBrandVisible = false;
          // 清空标签
          this.dynamicTags = [];
          // 刷新列表
          this.clickQueryBrand();
        } else {
          this.$message.error(res.data.message);
        }
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
            brand_id: JSON.stringify(arr),
            flag: 2,
          };
          updateBrand(deleterequirementpass).then(response => {
            const result = response.data;
            if (result.success) {
              // this.$gmMessage(result.message)
              this.$gmMessage('删除成功');
              this.clickQueryBrand();
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
      this.clickQueryBrand();
    },
    handleCurrentChange() {
      this.clickQueryBrand();
    },
    displayTypeFormate,
    dateFormat,
    planStatusFormat,
    // table row click
    onRowClick(_row, _column, _event) {
      // if (!this.editingId) {
      // debugger
      // }
    },
    // 切换滑块
    changeStatus(row, _val) {
      const params = {
        brand_id: JSON.stringify([row.id]),
        flag: row.status ? 0 : 1,
      };
      updateBrand(params).then(() => {
        // do nth
      });
    },
    // 选择状态
    changeSelect(val) {
      this.status = val;
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      if (this.dynamicTags.length >= 10) {
        this.$message.error('一次最多添加10个品牌');
        return;
      }
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      const inputValue = this.inputValue;
      if (inputValue) {
        let count = 0;
        this.dynamicTags.forEach(item => {
          if (item.value === inputValue) {
            count++;
          }
        });
        if (count > 0) {
          this.$message.error('该品牌重复添加了，请更改');
          return;
        }
        this.brandNameExists(inputValue, data => {
          if (data.success && !data.data) {
            this.dynamicTags.push({
              right: 1,
              value: inputValue,
            });
          } else {
            this.$message.error('该品牌名已存在！');
          }
        });
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
  },
};
</script>
<style lang="scss">
.search-requirement-row {
  .el-button--primary {
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
  .icon-status {
    &::before {
      width: 8px;
      height: 8px;
      display: inline-block;
      background: #396fff;
      content: '';
      border-radius: 50%;
      vertical-align: top;
      margin-top: 7px;
    }
    &.status1 {
      color: #666;
    }
    &.status2 {
      color: var(--text-des-color);
      &::before {
        background: var(--text-des-color);
      }
    }
  }
}
.btn-bar {
  display: inline-block;
}
.search-bar {
  float: right;
  display: block;
  // .el-form-item {
  //   float: right;
  // }
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

.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  vertical-align: top;
}
.page-section-brand {
  vertical-align: top;
  padding: 12px;
  background: #fff;
  // margin-top: 10px;
}

@media screen and (max-width: 1371px) {
  .search-bar {
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
  .search-bar {
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
</style>
