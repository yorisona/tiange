<!--
 * @Description: 数据入库-table(暂未用)
 * @Author: 棠棣
 * @Date: 2019-12-09 09:35:27
 * @LastEditTime: 2019-12-10 10:14:56
 * @LastEditors: 棠棣
 -->
<template>
  <div class="aedocumentarylist-container" v-if="CurrentAERecordList !== null">
    <el-table
      stripe
      :data="CurrentAERecordList !== null ? CurrentAERecordList.data : []"
      style="width: 100%; margin-top: 15px; margin-bottom: 10px"
      :header-cell-style="{
        background: '#F5F6F9',
        height: '42px',
        color: '#666666',
        fontWeight: 'bold',
      }"
    >
      <template #empty>
        <table-no-data
          class="no_aedocumentarylist"
          :isvertical="true"
          title="还没有跟单记录哦~"
          :img="require('@/assets/img/cooperative/xt_nodata_note.png')"
        ></table-no-data>
      </template>
      <el-table-column
        :formatter="
          (row, column, cellValue, index) =>
            (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
        "
        label="序号"
        width="50"
        fixed="left"
        align="center"
      >
      </el-table-column>
      <el-table-column label="跟单信息" width="230">
        <template #default="{ row }">
          <p>
            直播日期：
            <span v-if="row.live_date !== ''">{{ row.live_date }}</span>
            <span v-else>--</span>
          </p>
          <p>kol名称：{{ row.kol_name }}</p>
          <p>
            报价金额：<span class="txt-skamount">{{
              row.price_amount_str ? `￥${row.price_amount_str}` : '--'
            }}</span>
          </p>
          <p>
            <span style="float: left">商品名称/链接：</span>
            <a
              v-if="row.item_list.length > 0"
              :href="row.item_list[0].item_url"
              style="color: #5c82ff; text-decoration: none"
              target="_blank"
            >
              <i class="iconfont iconfujian" style="font-size: 15px; float: left"></i>
              <span class="linkSpan">{{ row.item_list[0].item_name }}</span>
            </a>
            <span v-else>--</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="录入场次信息">
        <template #default="{ row }">
          <div style="display: flex">
            <el-form>
              <el-form-item label="直播标题:" style="float: left; width: 223px">
                <el-input
                  placeholder="请输入"
                  size="mini"
                  v-model.trim="row.enterForm.liveTitle"
                  style="width: 140px"
                ></el-input>
              </el-form-item>
              <el-form-item label="场均PV:" style="float: left; width: 155px">
                <el-input
                  placeholder="请输入"
                  size="mini"
                  type="number"
                  v-model.number="row.enterForm.pv"
                  style="width: 80px"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
              <el-form-item label="直播类型:" style="width: 100%; margin-top: 40px">
                <el-radio v-model="row.enterForm.liveType" label="0">混播</el-radio>
                <el-radio v-model="row.enterForm.liveType" label="1">专场</el-radio>
              </el-form-item>
              <el-form-item label="是否预售场:">
                <el-radio v-model="row.enterForm.preSale" label="0">非预售场</el-radio>
                <el-radio v-model="row.enterForm.preSale" label="1">预售场</el-radio>
                <el-radio v-model="row.enterForm.preSale" label="2">预热场</el-radio>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="70">
        <template #default="{ row }">
          <div
            v-if="UserRoles.includes(RIGHT_CODE.add_documentary) && CurrentAE.ae_id === UserInfo.id"
          >
            <el-button type="primary" size="small" @click="addDocumentary(row)">添加</el-button>
          </div>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="contract-pagination"
      background
      :current-page.sync="pagination.currentPage"
      :page-sizes.sync="pagination.pageSizes"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, sizes, jumper"
      :total="CurrentAERecordList !== null ? CurrentAERecordList.total : 0"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { RIGHT_CODE } from '@/const/roleCode';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { saveDisplay } from '@/api/display';
export default {
  name: 'AeList',
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
    // 添加
    addDocumentary(row) {
      if (!row.enterForm.liveTitle) {
        this.$message.warning('请输入直播标题');
        return false;
      }
      if (!row.enterForm.pv) {
        this.$message.warning('请输入场均PV');
        return false;
      }
      const displaypass = {
        star_id: row.star_id,
        star_name: row.star_name,
        title: row.enterForm.liveTitle,
        display_type: row.enterForm.liveType,
        pv: row.enterForm.pv,
        display_time: row.live_date,
        is_presell: row.enterForm.preSale,
        uv: '',
        documentary_id: row.documentary_id,
        cooperation_id: row.cooperation_id,
      };
      saveDisplay(displaypass)
        .then(response => {
          const data = response.data;
          if (data.success) {
            this.getAEDocumentaryListByPage();
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取分页数据
    getAEDocumentaryListByPage() {
      this.GetCurrentAERecordList({
        cooperation_id: this.CooperationDetail.cooperation_id,
        ae_id: this.CurrentAE.ae_id,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        is_need_add_display: true,
      });
    },
    getAEDocumentaryListByPage1() {
      this.GetCurrentAERecordList({
        cooperation_id: this.CooperationDetail.cooperation_id,
        ae_id: this.CurrentAE.ae_id,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
        is_need_add_display: false,
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
/deep/ .el-input__inner {
  padding: 0 5px;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
/deep/ .el-radio + .el-radio {
  margin-left: 5px;
}
/deep/ .el-form-item__content {
  line-height: 40px;
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
</style>
