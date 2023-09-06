<template>
  <div class="achievementlist-container" v-if="AchievementList !== null">
    <el-button
      class="btn-blue"
      size="small"
      type="primary"
      @click="addAchievementHandle"
      v-show="
        Permission.canCreate &&
        (IsCurrentUser(CooperationDetail.add_by_id) || IsCurrentUser(CooperationDetail.manager_id))
      "
      >登记业绩</el-button
    >
    <el-table
      stripe
      v-if="Permission.canViewList"
      :data="AchievementList !== null ? AchievementList.data : []"
      style="width: 100%; margin-top: 15px; margin-bottom: 10px"
      :header-cell-style="{
        background: 'var(--table-thead-th-bg-color)',
        height: '42px',
        color: 'var(--text-second-color)',
        fontWeight: 'bold',
      }"
    >
      <template #empty>
        <table-no-data
          :isvertical="true"
          title="还没有收款记录哦~"
          :img="require('@/assets/img/cooperative/xt_nodata_note.png')"
          class="no_data"
        />
      </template>
      <el-table-column
        :formatter="
          (row, column, cellValue, index) =>
            (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
        "
        label="序号"
        width="60"
        align="center"
      />
      <el-table-column prop="achievement_uid" label="收款编号" width="90"></el-table-column>
      <el-table-column prop="gather_date" label="收款时间" width="100">
        <template #default="{ row }">
          <span>{{ row.gather_date ? row.gather_date : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gather_amount" :render-header="customColumnHeaderGather" width="100">
        <template #default="{ row }">
          <span class="txt-skamount">{{
            row.gather_amount_str ? `¥${row.gather_amount_str}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gather_way" label="收款信息" width="200">
        <template #default="{ row }">
          <p class="overflow-ellipsis">
            <el-popover
              placement="left"
              trigger="hover"
              :content="'方式:' + gatherWayListFormat(row.gather_way)"
            >
              <template slot="reference">
                <span class="txt-gwtitle">方式:</span>
              </template>
            </el-popover>
            <span class="txt-gwinfo">{{ gatherWayListFormat(row.gather_way) }}</span>
          </p>
          <!-- 打款公司名称 -->
          <p v-if="row.gather_way === 3" class="overflow-ellipsis">
            <el-popover
              placement="left"
              trigger="hover"
              :content="
                '打款公司名称:' +
                (row.gather_way_detail.pay_company_name
                  ? row.gather_way_detail.pay_company_name
                  : '--')
              "
            >
              <template slot="reference"><span class="txt-gwtitle">打款公司名称:</span></template>
            </el-popover>
            <span class="txt-gwinfo">{{
              row.gather_way_detail.pay_company_name ? row.gather_way_detail.pay_company_name : '--'
            }}</span>
          </p>
          <p v-if="row.gather_way === 1" class="overflow-ellipsis">
            <el-popover
              placement="left"
              trigger="hover"
              :content="'下单旺旺名:' + row.gather_way_detail.order_wangwang_id"
            >
              <template slot="reference"><span class="txt-gwtitle">下单旺旺名:</span></template>
            </el-popover>
            <span class="txt-gwinfo">{{ row.gather_way_detail.order_wangwang_id }}</span>
          </p>
          <p v-if="row.gather_way === 1" class="overflow-ellipsis">
            <el-popover
              placement="left"
              trigger="hover"
              :content="'任务Id:' + row.gather_way_detail.task_id"
            >
              <template slot="reference"><span class="txt-gwtitle">任务Id:</span></template>
            </el-popover>
            <span class="txt-gwinfo">{{ row.gather_way_detail.task_id }}</span>
          </p>
          <p v-if="row.gather_way === 1" class="overflow-ellipsis">
            <el-popover
              placement="left"
              trigger="hover"
              :content="
                '接单时间:' +
                (row.gather_way_detail.order_date ? row.gather_way_detail.order_date : '--')
              "
            >
              <template slot="reference"><span class="txt-gwtitle">接单时间:</span></template>
            </el-popover>
            <span class="txt-gwinfo">{{
              row.gather_way_detail.order_date ? row.gather_way_detail.order_date : '--'
            }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="gather_amount" label="退款金额" width="100">
        <template #default="{ row }">
          <span>{{ row.refund_amount_str ? `¥${row.refund_amount_str}` : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gather_way" :render-header="customColumnHeader" width="110">
        <template #default="{ row }">
          <span>{{ row.total_pay_amount ? `¥${row.total_pay_amount}` : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gather_way" :render-header="customColumnHeader2" width="110">
        <template #default="{ row }">
          <span class="txt-skamount">{{
            row.total_paid_amount ? `¥${row.total_paid_amount}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gather_amount" label="收款凭证" width="100">
        <template #default="{ row }">
          <p class="img-flex">
            <span>凭证：</span>
            <i
              v-if="row.gather_certificate_pic !== ''"
              class="iconfont icontupian"
              style="font-size: 30px !important; color: #396fff; cursor: pointer"
              @click="
                () => {
                  displayImg('收款凭证', row.gather_certificate_pic);
                }
              "
            ></i>
            <span v-else>--</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="gather_amount" label="是否开票" width="120">
        <template #default="{ row }">
          <p>
            <span class="txt-gwtitle">开票：</span>
            <span>{{ row.is_invoice === 0 ? '否' : row.is_invoice === 1 ? '是' : '--' }}</span>
          </p>
          <p class="img-flex">
            <span class="txt-gwtitle">凭证：</span>
            <!--  -->
            <span v-if="row.invoice_info && row.invoice_info.length > 0">
              <i
                class="iconfont icontupian"
                style="font-size: 30px !important; color: #396fff; cursor: pointer"
                @click="
                  () => {
                    invoice_show(row);
                  }
                "
              ></i>
            </span>
            <span v-else>&nbsp;&nbsp;--</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" fixed="right" align="center">
        <template #default="{ row }">
          <div v-if="row.invoice_info.length === 0">
            <div v-if="operationColRight(row)">
              <el-tooltip placement="left" effect="light" content="编辑" class="editor">
                <span v-show="Permission.canEdit">
                  <tg-icon name="ico-edit" @click="editAchievement(row)" />
                </span>
              </el-tooltip>
              <el-tooltip placement="top" effect="light" content="删除" class="delete">
                <span v-show="Permission.canDelete" style="margin-left: 10px">
                  <tg-icon name="ico-delete" @click="delAchievement(row)" />
                </span>
              </el-tooltip>
            </div>
            <span v-else>--</span>
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="Permission.canViewList"
      class="contract-pagination"
      style="margin-bottom: 10px"
      :current-page.sync="pagination.currentPage"
      :page-sizes.sync="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="AchievementList !== null ? AchievementList.total : 0"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
    />
    <!-- 登记业绩 -->
    <AddAchievementDialog ref="addAchievementDialog" />
    <!-- 预览图片 -->
    <image-dialog ref="imageDialog" :imgsrc="imgsrc" :title="imgtitle" />
    <!-- 上传开票信息 -->
    <InvoiceShowDialog
      ref="InvoiceShowDialog"
      :name="'发票'"
      :type="'certificate/cost_invoice_certificate '"
    />
  </div>
</template>

<script>
import InvoiceShowDialog from '@/views/customer/components/invoiceShow';
import { mapGetters, mapActions } from 'vuex';
import AddAchievementDialog from './AddAchievement';
import { deleteAchievement } from '@/api/cooperative';
import { showProDateFormat } from '@/utils/format';
import { gatherWayListFormat } from '@/const/cooperative';
import CurrentUserPower from '../../mixin/CurrentUserPower';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission, IsCurrentUser } from '@/use/permission';

export default {
  name: 'AchievementList',
  components: {
    AddAchievementDialog,
    InvoiceShowDialog,
  },
  mixins: [CurrentUserPower, CooperativeStore],
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(NEW_RIGHT_CODE.achievement_list);
      const canCreate = HasPermission(NEW_RIGHT_CODE.achievement_create);
      const canDelete = HasPermission(NEW_RIGHT_CODE.achievement_delete);
      const canEdit = HasPermission(NEW_RIGHT_CODE.achievement_edit);

      return { canViewList, canDelete, canCreate, canEdit };
    });
    return { Permission, IsCurrentUser };
  },
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
      },
      imgsrc: '', // 预览图片src
      imgtitle: '', // 预览图片标题
    };
  },
  computed: {
    ...mapGetters({
      AchievementList: 'cooperative/AchievementList',
    }),
  },
  methods: {
    operationColRight(row) {
      return (
        this.IsCurrentUser(row.add_by_id) || this.IsCurrentUser(this.CooperationDetail.manager_id)
      );
    },
    showProDateFormat,
    gatherWayListFormat,
    ...mapActions({
      GetAchievementList: 'cooperative/GetAchievementList',
    }),
    // 登记业绩
    addAchievementHandle() {
      this.$refs.addAchievementDialog.show();
      // this.reload();
    },
    // 获取分页数据
    getAchievementListByPage() {
      this.GetAchievementList({
        cooperation_id: this.CooperationDetail.cooperation_id,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
      });
    },
    // 翻页
    handleCurrentChange() {
      this.getAchievementListByPage();
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getAchievementListByPage();
    },
    // 编辑业绩
    editAchievement(row) {
      const page = JSON.parse(JSON.stringify(this.pagination));
      this.$refs.addAchievementDialog.show(row, page);
    },
    // 删除业绩
    async delAchievement(row) {
      //发送请求
      // deleteAchievement({ achievement_id: row.achievement_id }).then(res=>{
      //   console.log(res.data.success);
      // });
      // 判断如果有凭证图片或者打款为是，就无法删除
      // row.cost_infos.length!==0&&row.cost_infos[0].is_pay === 1
      // row.gather_certificate_pic !== ""
      if (row.cost_infos.length !== 0 && row.cost_infos[0].is_pay === 1) {
        this.$alert('该业绩已有成本被财务安排打款了，不允许删除哦。', '提示', {
          confirmButtonText: '我知道了',
          customClass: 'DeleteButton',
          iconClass: 'alert-icon',
        });
      } else {
        const msg = '此操作将永久删除数据，是否继续？';
        const result = await AsyncConfirm({ root: this }, msg);

        if (result) {
          deleteAchievement({ achievement_id: row.achievement_id }).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              this.getAchievementListByPage();
              // 更新成本
              this.GetCooperationDetail({
                customer_id: this.CustomerDetail.id,
                cooperation_id: this.CooperationDetail.cooperation_id,
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      }
    },
    // 预览图片
    displayImg(title, imgsrc) {
      this.imgsrc = imgsrc;
      this.imgtitle = title;
      this.$refs.imageDialog.show();
    },
    // 预览开票信息
    invoice_show(row) {
      this.$refs.InvoiceShowDialog.show(row);
    },
    customColumnHeader(h, { column: _column, $index: _index }) {
      return (
        <div style="margin:0;padding:0;line-height:32px">
          <p style="margin:0;line-height:18px;font-size:14px">成本安排</p>
          <p style="margin:0;line-height:18px;font-size:14px">
            金额
            <el-tooltip
              content="该笔业绩登记id下包含的所有需要安排成本金额的总和。"
              placement="top"
              effect="light"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
        </div>
      );
    },
    customColumnHeaderGather(h, { column: _column, $index: _index }) {
      return (
        <div style="margin:0;padding:0;height:30px;">
          <p style="margin:0;line-height:18px;font-size:14px;position:relative;top:9px;">
            收款金额
            <el-tooltip
              content="如发生退款，该字段为减去退款金额后的实际收款金额"
              placement="top"
              effect="light"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
        </div>
      );
    },
    customColumnHeader2(h, { column: _column, $index: _index }) {
      return (
        <div style="margin:0;padding:0;line-height:32px">
          <p style="margin:0;line-height:18px;font-size:14px">已安排成本</p>
          <p style="margin:0;line-height:18px;font-size:14px">
            金额
            <el-tooltip
              content="该笔业绩登记id下包含的财务实际已经打款出去的金额。"
              placement="top"
              effect="light"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </p>
        </div>
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.achievementlist-container {
  /deep/ .el-table {
    border-right-width: 0;
  }
  .txt-skamount {
    color: #ff731e;
  }
  .txt-gwtitle {
    font-size: 14px;
    color: var(--text-third-color);
  }
  .txt-gwinfo {
    font-size: 14px;
    color: var(--text-color);
  }
  .img-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.editor,
.delete {
  position: relative;
  .icon-shanchu {
    position: absolute;
    top: 1px;
  }
  .icon-bianji {
    position: absolute;
    bottom: -2px;
    margin-top: 3px;
  }
}
/deep/.el-message-box__content {
  padding: 10px 14px;
}
/deep/ .el-icon-question:before {
  color: #cdcdcd;
  margin-left: 2px;
}
.btn-blue {
  width: 90px;
  // height: 32px;
}
/deep/ .no_data {
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}

/deep/ .overflow-ellipsis {
  line-height: 24px;
}
</style>
