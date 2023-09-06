<template>
  <section class="page-section">
    <el-form :model="searchForm" :inline="true" size="small" class="search-form">
      <el-form-item label="选择日期:">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy.MM.dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '00:00:00']"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="searchForm.status" clearable>
          <el-option
            v-for="(item, key) in importedStatusOptions"
            :key="key"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="导入人:">
        <el-select v-model="searchForm.operator" filterable clearable>
          <el-option
            v-for="(item, index) in allAddBy"
            :key="index"
            :value="item"
            :label="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width: 60px; height: 30px; line-height: 13px"
          @click="clickSearch"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <tg-button type="negative" size="small" @click="resetSearch">重置</tg-button>
      </el-form-item>
    </el-form>

    <el-row class="table-row">
      <el-table
        stripe
        v-if="Permission.canViewImportLogList"
        :data="logsTableData"
        v-loading="logsTableLoading"
        :header-cell-style="{
          background: 'var(--table-thead-th-bg-color)',
          height: '48px',
          color: 'var(--text-second-color)',
        }"
      >
        <el-table-column label="操作模块" prop="operate" min-width="160" show-overflow-tooltip />
        <!--  :formatter="operateFormat" -->
        <el-table-column label="文件名称" prop="file_name" min-width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="120" align="center">
          <template v-slot="scope">
            <span :class="scope.row.status === '失败' ? 'is-failed' : ''">{{
              scope.row.status
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" min-width="200px" label="导入结果">
          <template #default="{ row }">
            <el-popover
              placement="bottom-start"
              trigger="hover"
              width="400"
              visible-arrow="false"
              :disabled="row.result.length < 20"
            >
              <p v-for="(item, index) in row.result.split('；')" :key="index">{{ item }}</p>
              <template slot="reference">
                <p>
                  {{ row.result.length > 20 ? row.result.substring(0, 20) + '...' : row.result }}
                </p>
              </template>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="导入人" prop="operator" min-width="120"></el-table-column>
        <el-table-column label="导入时间" prop="upload_date" min-width="120" show-overflow-tooltip>
          <template v-slot="scope">
            <span>{{ addDateFormat(scope.row.upload_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template v-slot="scope">
            <el-tooltip placement="top" trigger="hover" effect="light" content="查看详情">
              <i
                v-if="
                  scope.row.status === '成功' &&
                  $store.getters['user/getUserRole'].includes(RIGHT_CODE.view_import)
                "
                class="iconfont icon-daoruxiangqing"
                @click="clickLogDetail(scope.row)"
              ></i>
            </el-tooltip>
            <span class="icon-span" v-if="scope.row.status !== '成功'">--</span>
            <el-tooltip placement="top" trigger="hover" effect="light" content="下载文件">
              <i
                v-if="
                  scope.row.upload_file_path !== '' &&
                  $store.getters['user/getUserRole'].includes(RIGHT_CODE.view_import)
                "
                class="iconfont icon-xiazairizhi"
                @click="downloadLogsDetail(scope.row)"
              ></i>
            </el-tooltip>
            <span class="icon-span" v-if="scope.row.upload_file_path === ''">-</span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-box no_data" style="padding: 40px 0">
            <img src="@/assets/img/anchor_nodata.png" />
            <p>暂时木有内容呀~</p>
          </div>
        </template>
      </el-table>
    </el-row>
    <div class="page-box">
      <el-pagination
        v-if="Permission.canViewImportLogList"
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
    <el-dialog :title="logsDialogTitle" :visible.sync="logsDialogVisible">
      <logsTable :logsDetailData="logsDetailData"></logsTable>
    </el-dialog>
  </section>
</template>
<script>
import { queryLog } from '@/api/upload';
import { addDateFormat, operateFormat } from '@/utils/format';

import logsTable from './component/logDetail';
import { queryStarSug } from '@/api/star';
import { domain } from '@/utils/variable';
import { RIGHT_CODE } from '@/const/roleCode';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';

export default {
  components: { logsTable },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewImportLogList = HasPermission(NEW_RIGHT_CODE.import_logs_list);

      return { canViewImportLogList };
    });
    return { Permission };
  },
  data() {
    return {
      RIGHT_CODE,
      domain: domain,
      pickerOptions: {
        shortcuts: [
          {
            text: '前一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '前一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      searchForm: {
        date: '',
        status: '',
        operator: '',
      },
      allAddBy: [],
      importedStatusOptions: [
        {
          label: '成功',
          value: 1,
        },
        {
          label: '失败',
          value: -1,
        },
      ],
      logsTableData: [],
      logsTableLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 10,
      },
      logsDetailData: [],
      logsDialogVisible: false,
      logsDialogTitle: '导入品牌信息',
    };
  },
  activated() {
    queryStarSug().then(response => {
      const result = response.data;
      if (result.success) {
        this.allAddBy = result.data.user_data;
      }
    });
    this.clickSearch();
  },
  methods: {
    clickSearch() {
      const logpass = {
        operator: this.searchForm.operator,
        status: this.searchForm.status,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        start_time: '',
        end_time: '',
      };
      if (this.searchForm.date) {
        logpass.start_time = this.searchForm.date[0] === undefined ? '' : this.searchForm.date[0];
        logpass.end_time = this.searchForm.date[1] === undefined ? '' : this.searchForm.date[1];
      }
      this.logsTableLoading = true;
      queryLog(logpass).then(response => {
        const result = response.data;
        if (result.success) {
          this.pagination.total = result.data.total;
          this.logsTableData = result.data.data;
          this.logsTableLoading = false;
        } else {
          this.logsTableLoading = false;
        }
      });
    },
    resetSearch() {
      this.searchForm = {
        date: '',
        status: '',
        operator: '',
      };
      this.pagination = {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 10,
      };
      this.clickSearch();
    },
    downloadLogsDetail(val) {
      const url = this.domain + '/api/upload/download_upload_file?upload_log_id=' + val.id;
      window.open(url);
    },
    clickLogDetail(val) {
      this.isDisplay = true;
      this.logsDialogTitle = val.operate; // this.operateFormat(val)
      this.logsDetailData = val.result_detail;
      this.logsDialogVisible = true;
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit('handle-size-change', val);
      this.clickSearch();
    },
    handleCurrentChange() {
      this.clickSearch();
    },
    addDateFormat,
    operateFormat,
  },
};
</script>

<style lang="scss" scoped>
$color-primary: var(--theme-color);

.search-form {
  background: #fff;
  padding: 15px;
  line-height: 50px;
  border-radius: 10px;
  .el-form-item {
    margin-bottom: 0px;
    // .el-range-editor,
    // .el-select,
    // .el-input,
    // .el-button {
    //   // margin-top: 10px;
    // }
  }
}
.table-row {
  padding: 12px;
  background: #fff;
  border-radius: 10px;
  margin-top: 10px;
  .table-tips {
    color: $color-primary;
    line-height: 32px;
    font-weight: 600;
    i {
      margin-right: 8px;
    }
  }
  .el-table {
    // border: 1px solid #dedede;
    .is-failed {
      color: var(--error-color);
    }
  }
  .icon-span {
    display: inline-block;
    width: 30px;
    text-align: center;
  }
}
.page-box {
  padding: 10px;
  padding-left: 0;
  background: #fff;
}
/deep/ .el-tooltip__popper {
  width: 50px;
  border-color: #666;
}
/deep/ .el-dialog__title {
  line-height: 24px;
  font-weight: 600;
}
/deep/ .el-dialog__body {
  color: #666;
}
.iconfont {
  font-size: 24px;
  color: var(--text-des-color);
  cursor: pointer;
  margin: 0 3px;
}
/deep/ .el-table td {
  padding: 17px 0;
  min-height: 50px;
}
/deep/.el-table th {
  padding: 24px 0;
  min-height: 50px;
}
/deep/ .el-form-item.el-form-item--small {
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  > .el-form-item__content {
    vertical-align: middle;
  }
}
</style>
