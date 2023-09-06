<template>
  <tg-block class="mgt-10" title="合作列表" v-if="CooperationList !== null">
    <div class="btns-line">
      <tg-button
        type="primary"
        icon="ico-btn-add"
        v-show="Permission.canCreate"
        @click="addCooperation"
        >新增合作</tg-button
      >
      <tg-button
        type="negative"
        icon="ico-btn-delete"
        v-show="Permission.canDelete"
        @click="delCooperation"
        :disabled="multipleSelectionIds.length === 0"
        >删除</tg-button
      >
    </div>
    <!-- [表格] -->
    <el-table
      stripe
      v-if="Permission.canViewList"
      :data="CooperationList !== null ? CooperationList.data : []"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <template #empty>
        <span>您还没有合作记录哦~</span>
        <a @click="addCooperation" v-if="Permission.canCreate">去新增&gt;&gt;</a>
      </template>
      <el-table-column type="selection" :width="50" fixed="left" />
      <el-table-column
        :formatter="
          (row, column, cellValue, index) =>
            (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
        "
        label="序号"
        width="60"
        fixed="left"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="follower" label="客户阶段" header-align="center" align="center">
        <template #default="{ row }">
          <el-popover placement="top-start" title="当前客户阶段" :width="100" trigger="hover">
            <CustomerStageProgress :isvertical="true" :stage="row.cooperation_status" />
            <template slot="reference">
              <span class="txt-stag hover-link">{{
                customerStageList[row.cooperation_status - 1].value
              }}</span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="sale_amount_str"
        label="销售金额"
        header-align="right"
        align="right"
        :width="120"
      >
        <template #default="{ row }">
          <span>{{ row.sale_amount_str ? `￥${row.sale_amount_str}` : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :render-header="customColumnHeader"
        header-align="right"
        align="right"
        :width="120"
      >
        <template #default="{ row }">
          <span>{{ row.gather_amount_str ? `￥${row.gather_amount_str}` : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款金额" header-align="right" align="right" :width="120">
        <template #default="{ row }">
          <span>{{ row.refund_total_amount_str ? `￥${row.refund_total_amount_str}` : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost_amount_str"
        label="成本安排金额"
        header-align="right"
        align="right"
        :width="120"
      >
        <template #default="{ row }">
          <span>{{ row.cost_amount_str ? `￥${row.cost_amount_str}` : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="wait_gather_amount_str"
        label="待收款金额"
        header-align="right"
        align="right"
        :width="120"
      >
        <template #default="{ row }">
          <span class="txt-dskamount">{{
            row.wait_gather_amount_str ? `￥${row.wait_gather_amount_str}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="manager" label="客户经理" header-align="center" align="center">
      </el-table-column>
      <el-table-column label="执行 ae" header-align="center" align="center">
        <template #default="{ row }" style="color: red">
          <more-items :items="row.ae.length > 0 ? row.ae.map(a => a.ae_name) : []" />
        </template>
      </el-table-column>
    </el-table>
    <!-- [分页] -->
    <el-pagination
      :current-page.sync="pagination.currentPage"
      :page-sizes.sync="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="CooperationList !== null ? CooperationList.total : 0"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
      style="margin-top: 14px"
      v-if="Permission.canViewList && CooperationList.total > 0"
    />
  </tg-block>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CustomerStageProgress from '../../components/CustomerStageProgress';
import { customerStageList } from '@/const/cooperative';
import { deleteCooperation } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';

export default {
  name: 'CustomerCooperationList',
  components: {
    CustomerStageProgress,
  },
  mixins: [CooperativeStore],
  setup(props, ctx) {
    const Permission = computed(() => {
      /** 客户列表/店铺详情 合作 */
      const canViewList = HasPermission(NEW_RIGHT_CODE.customer_collaboration_list);
      const canCreate = HasPermission(NEW_RIGHT_CODE.customer_collaboration_create);
      const canDelete = HasPermission(NEW_RIGHT_CODE.customer_collaboration_delete);

      return { canCreate, canDelete, canViewList };
    });

    return { Permission };
  },
  data() {
    return {
      customerStageList,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
      },
      multipleSelectionIds: [],
    };
  },
  computed: {
    ...mapGetters({
      CooperationList: 'cooperative/CooperationList',
    }),
  },
  methods: {
    ...mapActions({
      GetCooperation: 'cooperative/GetCooperation',
      GetAchievementList: 'cooperative/GetAchievementList',
      GetCoostList: 'cooperative/GetCoostList',
      GetCooperationAE: 'cooperative/GetCooperationAE',
      GetRebatesList: 'cooperative/GetRebatesList',
    }),
    customColumnHeader(h) {
      return h('span', [
        '收款金额',
        <el-tooltip
          popper-class="tg-tooltip-thead-theme"
          content="如发生退款，该字段为减去退款金额后的实际收款金额"
          placement="bottom-start"
          effect="light"
        >
          <i class="el-icon-question" />
        </el-tooltip>,
      ]);
    },
    // 新增合作
    addCooperation() {
      // this.$refs.addCooperation.show();
      this.$emit('cooperation:create');
    },
    // 删除合作
    async delCooperation() {
      const multipleSelectionIds = JSON.parse(JSON.stringify(this.multipleSelectionIds));
      if (multipleSelectionIds && multipleSelectionIds.length > 0) {
        const result = await AsyncConfirm(
          { root: this },
          `此操作将删除 ${multipleSelectionIds.length} 个合作数据, 是否继续?`,
        );

        if (result) {
          deleteCooperation({
            cooperation_ids: multipleSelectionIds,
          })
            .then(res => {
              this.$message({
                type: res.data.success ? 'success' : 'warning',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
              if (res.data.success) {
                this.getCooperationByPage();
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: '删除失败，稍后重试',
                duration: 2000,
                showClose: true,
              });
              console.log(error.message);
            });
          // })
          // .catch(() => {
          //   /* do nth */
          // });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '至少选择一条要删除的数据',
          duration: 2000,
          showClose: true,
        });
      }
    },
    // 获取分页数据
    getCooperationByPage() {
      this.GetCooperation({
        customer_id: this.CustomerDetail.id || 0,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
      });
    },
    // 翻页
    handleCurrentChange() {
      this.getCooperationByPage();
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getCooperationByPage();
    },
    // 多选
    handleSelectionChange(data) {
      this.multipleSelectionIds = data.map(cc => cc.cooperation_id);
    },
    // 点击合作行
    handleRowClick(row) {
      // 重置合作详情数据
      this.ResetCurrentAERecordList();
      // 获取详情数据
      this.GetCooperationDetail({
        cooperation_id: row.cooperation_id,
        customer_id: this.CustomerDetail.id,
      });
      this.SetCooperationdetailStatus(row.cooperation_status);
      // 触发Actions
      this.handleCurrentActions(row.cooperation_id, row.cooperation_status);
      // this.$refs.cooperationDetailMainDialog.show(this.pagination);
      this.$emit('cooperation:show', this.pagination);
    },
    // 触发当前Actions操作
    handleCurrentActions(cooperation_id, status) {
      switch (status) {
        case 1: // 意向客户阶段
          this.GetCooperationDetail({
            // 获取合作详情
            cooperation_id,
            customer_id: this.CustomerDetail.id,
          });
          break;
        case 2: // 确认合作阶段
          // 获取业绩记录
          this.GetAchievementList({
            cooperation_id,
            num: 10,
            page_num: 1,
          });
          // 获取安排记录
          this.GetCoostList({
            cooperation_id,
            num: 10,
            page_num: 1,
          });
          // 获取返点记录
          this.GetRebatesList({
            cooperation_id,
            num: 10,
            page_num: 1,
          });
          break;
        case 3: // 执行项目阶段
          // 获取执行AE人员
          this.GetCooperationAE({ cooperation_id });
          break;
        case 4: // 执行结束阶段
          this.GetCooperationDetail({
            // 获取合作详情
            cooperation_id,
            customer_id: this.CustomerDetail.id,
          });
          break;
        case 5: // 数据录入阶段
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
/deep/ .el-table thead {
  border-bottom: 1px solid red;
}
.detail-content {
  .hz-container {
    margin-top: 10px;
    margin-left: 50px;
  }
  .hz-table {
    margin-left: 50px;
    margin-top: 10px;
    .txt-stag {
      color: $color-primary;
      cursor: pointer;
      font-size: 16px;
    }
    .txt-dskamount {
      color: #ff731e;
    }
  }
}
.btn-blue {
  width: 100px;
  height: 36px;
}
.delete-kol-alert.el-message-box .el-message-box__content {
  height: initial;
}
.delete-kol-alert.el-message-box .el-message-box__content .el-message-box__message {
  top: 0;
}
.el-dialog__body {
  margin: 10px;
  background: #fff !important;
  border-radius: 10px;
}
.click_detail {
  color: var(--text-des-color);
  font-size: 14px;
  margin-left: 20px;
}
</style>
