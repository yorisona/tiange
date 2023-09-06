<template>
  <div class="aedocumentarylist-container" v-if="CurrentAERecordList !== null">
    <el-table
      stripe
      :data="CurrentAERecordList !== null ? CurrentAERecordList.data : []"
      style="width: 100%; margin-top: 15px; margin-bottom: 10px"
      :header-cell-style="{
        background: 'var(--table-thead-th-bg-color)',
        height: '42px',
        color: 'var(--text-second-color)',
        fontWeight: 'bold',
      }"
      class="ae-documentary-list"
    >
      <template #empty>
        <table-no-data
          :isvertical="true"
          title="还没有跟单记录哦~"
          class="no_aedocumentarylist"
          :img="require('@/assets/img/cooperative/xt_nodata_note.png')"
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
      <el-table-column prop="kol_name" label="KOL名称" width="100"></el-table-column>
      <el-table-column prop="price_amount" label="报价金额" width="100">
        <template #default="{ row }">
          <span class="txt-skamount">{{
            row.price_amount_str ? `￥${row.price_amount_str}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cost_amount" label="成本金额" width="100">
        <template #default="{ row }">
          <span class="txt-skamount">{{
            row.cost_amount_str ? `￥${row.cost_amount_str}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_cost_arrange" label="成本是否安排" width="120" align="center">
        <template #default="{ row }">
          <span v-if="row.is_cost_arrange === 0">否</span>
          <span v-if="row.is_cost_arrange === 1">是</span>
          <span v-if="row.is_cost_arrange === ''">--</span>
        </template>
      </el-table-column>
      <el-table-column prop="cost_amount" label="商品名称 / 链接" width="130">
        <template #default="{ row }">
          <a
            v-if="row.item_list.length > 0"
            :href="row.item_list[0].item_url"
            style="color: #5c82ff; text-decoration: none"
            target="_blank"
          >
            <i class="iconfont iconfujian" style="font-size: 15px; float: left"></i>
            <span class="linkSpan">{{ row.item_list[0].item_name }}</span>
            <p
              v-if="row.item_list.length > 1"
              class="moreP"
              @click.prevent="handleBtnMore(row.item_list)"
            >
              更多商品 >
            </p>
          </a>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="直播日期" width="100">
        <template #default="{ row }">
          <span v-if="row.live_date !== ''">{{ row.live_date }}</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_sample_arrange" label="样品是否安排" width="120" align="center">
        <template #default="{ row }">
          <span v-if="row.item_list[0].is_sample_arrange === 0">否</span>
          <span v-if="row.item_list[0].is_sample_arrange === 1">是</span>
          <span v-if="row.item_list[0].is_sample_arrange === ''">--</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="60">
        <template #default="{ row }">
          <el-popover
            placement="top-start"
            trigger="click"
            v-if="row.note !== ''"
            :content="row.note"
          >
            <template slot="reference">
              <span style="color: #396fff; cursor: pointer; font-size: 13px">备注</span>
            </template>
            <p class="overflow-ellipsis">{{ row.note }}</p>
          </el-popover>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" align="center" class fixed="right">
        <template #default="{ row }">
          <div
            v-if="UserRoles.includes(RIGHT_CODE.add_documentary) && CurrentAE.ae_id === UserInfo.id"
          >
            <el-tooltip placement="left" effect="light" content="编辑" class="editor">
              <tg-icon name="ico-edit" @click="editDocumentary(row)" />
            </el-tooltip>
            <el-tooltip placement="right" effect="light" content="删除" class="delete">
              <tg-icon name="ico-delete" @click="delDocumentary(row)" style="margin-left: 10px" />
            </el-tooltip>
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="contract-pagination"
      :current-page.sync="pagination.currentPage"
      :page-sizes.sync="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="CurrentAERecordList !== null ? CurrentAERecordList.total : 0"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
    ></el-pagination>
    <!-- 登记跟单 -->
    <AddDocumentary ref="addDocumentaryDialog" />
    <!-- 更多商品 -->
    <AEListDialog ref="AEListDialog" :shop-link="shopLink" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { RIGHT_CODE } from '@/const/roleCode';
import AddDocumentary from './AddDocumentary';
import AEListDialog from '../components/AEListDialog';
import { deleteDocumentary } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default {
  name: 'AEDocumentaryList',
  components: {
    AddDocumentary,
    AEListDialog,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      RIGHT_CODE,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
      },
      shopLink: [],
    };
  },
  computed: {
    ...mapGetters({
      CurrentAE: 'cooperative/CurrentAE',
      CurrentAERecordList: 'cooperative/CurrentAERecordList',
    }),
  },
  methods: {
    ...mapActions({
      GetCurrentAERecordList: 'cooperative/GetCurrentAERecordList',
      GetCurrentAE: 'cooperative/GetCurrentAE',
    }),
    // 查看更多
    handleBtnMore(detail) {
      this.shopLink = detail;
      setTimeout(() => {
        this.$refs.AEListDialog.show();
      }, 30);
    },
    // 编辑
    editDocumentary(row) {
      const page = JSON.parse(JSON.stringify(this.pagination));
      this.$refs.addDocumentaryDialog.show(row, page);
    },
    // 删除
    async delDocumentary(row) {
      const msg = '此操作将永久删除数据，是否继续？';
      const result = await AsyncConfirm({ root: this }, msg);

      if (result) {
        deleteDocumentary({ documentary_id: row.documentary_id }).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            this.getAEDocumentaryListByPage();
            // 更新当前AE金额
            this.GetCurrentAE({
              ae_id: this.CurrentAE.ae_id,
            });
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
    },
    // 获取分页数据
    getAEDocumentaryListByPage() {
      this.GetCurrentAERecordList({
        cooperation_id: this.CooperationDetail.cooperation_id,
        ae_id: this.CurrentAE.ae_id,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
      });
    },
    // 翻页
    handleCurrentChange() {
      this.getAEDocumentaryListByPage();
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getAEDocumentaryListByPage();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-table__empty-block {
  .no_aedocumentarylist {
    img {
      width: 110px !important;
      height: 110px !important;
      margin-bottom: 10px;
    }
  }
}
.linkSpan {
  color: var(--text-color);
  display: inline-block;
  width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  margin-left: 3px;
}
.moreP {
  color: #396fff;
  text-decoration: underline;
}
.aedocumentarylist-container {
  /deep/ .el-table {
    border-right-width: 0;
  }
  .txt-skamount {
    color: #ff731e;
  }
  .txt-gwtitle {
    font-size: 12px;
    color: var(--text-third-color);
  }
  .txt-gwinfo {
    font-size: 14px;
    color: var(--text-color);
  }
}
.editor {
  position: relative;
  .icon-bianji {
    position: absolute;
    left: -4px;
    top: -8px;
  }
}
.position-r {
  position: relative;
  .delete {
    position: absolute;
    right: 28px;
    top: -9px;
  }
}

/deep/ .el-table.ae-documentary-list {
  .cell * {
    line-height: 24px;
  }
  svg.icon {
    cursor: pointer;
  }
}
</style>
