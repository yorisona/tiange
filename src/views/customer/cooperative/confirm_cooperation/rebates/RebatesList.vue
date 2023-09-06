<!--
 * @Description: 返点安排表详情列表
 * @Author: 神曲
 * @LastEditTime: 2019-03-03
 * @LastEditors: 神曲
 -->
<template>
  <div class="RebatesList-container" v-if="RebatesList !== null">
    <el-button
      v-show="
        Permission.canCreate &&
        (IsCurrentUser(CooperationDetail.add_by_id) ||
          IsCurrentUser(CooperationDetail.manager_id) ||
          judgeAEPower())
      "
      size="small"
      class="btn-blue"
      type="primary"
      @click="addCostHandle"
      >新增返点</el-button
    >
    <el-table
      stripe
      v-if="Permission.canViewList"
      :data="RebatesList !== null ? RebatesList.data : []"
      style="width: 100%; margin-top: 15px; margin-bottom: 10px"
      :header-cell-style="{
        background: 'var(--table-thead-th-bg-color)',
        height: '42px',
        color: 'var(--text-second-color)',
        fontWeight: '600',
      }"
    >
      <template #empty>
        <table-no-data
          :isvertical="true"
          title="还没有安排返点记录哦~"
          :img="require('@/assets/img/cooperative/xt_nodata_note.png')"
          class="no_data"
        ></table-no-data>
      </template>
      <el-table-column
        :formatter="
          (row, column, cellValue, index) =>
            (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
        "
        label="序号"
        width="60"
        fixed="left"
        align="center"
      />

      <el-table-column prop="achievement_uid" label="关联业绩" width="150">
        <template #default="{ row }">
          <span>{{ row.achievement_uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业绩收款金额" min-width="120">
        <template #default="{ row }">
          <p class>
            <span class="color-red">{{ row.gather_amount_str || '--' }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="打款时间" min-width="100">
        <template #default="{ row }">
          <p class>
            <span>{{ row.pay_date || '--' }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="返点打款金额" width="120">
        <template #default="{ row }">
          <span class="txt-skamount">{{
            row.rebate_amount_str ? `￥${row.rebate_amount_str}` : '--'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120" label="银行卡信息">
        <template #default="{ row }">
          <p>
            <span class="txt-gwtitle">银行卡信息:</span>
            <el-popover placement="bottom" trigger="hover" popper-class="tipbankinfo">
              <template slot="reference">
                <i
                  class="iconfont icon-yinhangka"
                  style="font-size: 15px !important; color: #396fff; cursor: pointer"
                ></i>
              </template>
              <div>
                <div style>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconbank" />
                  </svg>
                  <span>银行卡信息</span>
                </div>
                <div
                  style="
                    width: 100%;
                    height: 1px;
                    background: rgba(238, 239, 241, 1);
                    border-radius: 2px;
                    margin: 5px 0;
                  "
                ></div>
                <div style="display: flex; flex-direction: row; justify-content: space-around">
                  <div style="padding-right: 60px">
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">真实姓名：</label>
                      {{ row.real_name || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">开户行：</label>
                      {{ row.bank_name || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">银行卡号：</label>
                      {{ row.bank_card_number || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">身份证号：</label>
                      {{ row.id_card || '--' }}
                    </p>
                    <p style="line-height: 24px; color: #666">
                      <label style="color: var(--text-des-color)">手机号：</label>
                      {{ row.bank_phone || '--' }}
                    </p>
                  </div>
                  <div>
                    <a
                      style="border-radius: 10px; position: relative; display: block"
                      v-if="row.bank_card_pic"
                      :href="row.bank_card_pic + '?Authorization=' + getToken()"
                      target="_blank"
                    >
                      <img
                        style="width: 76px; height: 57px; border-radius: 10px"
                        :src="row.bank_card_pic + '?Authorization=' + getToken()"
                        alt
                      />
                      <div
                        style="
                          width: 100%;
                          background: #000;
                          opacity: 0.4;
                          line-height: 20px;
                          position: absolute;
                          bottom: 0;
                          color: #fff;
                          text-align: center;
                          font-size: 12px;
                          border-radius: 0px 0px 10px 10px;
                        "
                      >
                        银行卡照片
                      </div>
                    </a>
                    <span v-else style="border-radius: 10px; position: relative; display: block">
                      <img
                        style="width: 76px; height: 57px; border-radius: 10px"
                        src="@/assets/img/default_img.png"
                        alt
                      />
                      <div
                        style="
                          width: 100%;
                          background: #000;
                          opacity: 0.4;
                          line-height: 20px;
                          position: absolute;
                          bottom: 0;
                          color: #fff;
                          text-align: center;
                          font-size: 12px;
                          border-radius: 0px 0px 10px 10px;
                        "
                      >
                        暂无照片
                      </div>
                    </span>
                    <a
                      style="
                        border-radius: 10px;
                        position: relative;
                        display: block;
                        margin-top: 5px;
                      "
                      v-if="row.id_card_pic"
                      :href="row.id_card_pic + '?Authorization=' + getToken()"
                      target="_blank"
                    >
                      <img
                        style="width: 76px; height: 57px; border-radius: 10px"
                        :src="row.id_card_pic + '?Authorization=' + getToken()"
                        alt
                      />
                      <div
                        style="
                          width: 100%;
                          background: #000;
                          opacity: 0.4;
                          line-height: 20px;
                          position: absolute;
                          bottom: 0;
                          color: #fff;
                          text-align: center;
                          font-size: 12px;
                          border-radius: 0px 0px 10px 10px;
                        "
                      >
                        身份证照片
                      </div>
                    </a>
                    <span
                      v-else
                      style="
                        border-radius: 10px;
                        position: relative;
                        display: block;
                        margin-top: 5px;
                      "
                    >
                      <img
                        style="width: 76px; height: 57px; border-radius: 10px"
                        src="@/assets/img/default_img.png"
                        alt
                      />
                      <div
                        style="
                          width: 100%;
                          background: #000;
                          opacity: 0.4;
                          line-height: 20px;
                          position: absolute;
                          bottom: 0;
                          color: #fff;
                          text-align: center;
                          font-size: 12px;
                          border-radius: 0px 0px 10px 10px;
                        "
                      >
                        暂无照片
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </el-popover>
          </p>
        </template>
      </el-table-column>

      <el-table-column label="是否打款" width="90">
        <template #default="{ row }">
          <p>
            <span class="txt-gwtitle">打款：</span>
            <span>{{ row.is_pay === 0 ? '否' : row.is_pay === 1 ? '是' : '--' }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="打款凭证" align="center" min-width="90">
        <template #default="{ row }">
          <p></p>
          <span v-if="!(row.pay_certificate_pic !== '') && !Permission.canUploadEvidence">--</span>
          <div v-else>
            <p v-if="row.pay_certificate_pic !== ''">
              <span style="white-space: nowrap">
                &nbsp;&nbsp;凭证:
                <i
                  class="iconfont icontupian txt-center"
                  style="
                    font-size: 30px !important;
                    color: #396fff;
                    cursor: pointer;
                    vertical-align: middle; ;
                  "
                  @click="
                    () => {
                      displayImg('打款凭证', row.pay_certificate_pic);
                    }
                  "
                ></i>
              </span>
            </p>
            <p v-else>&nbsp;&nbsp;凭证：--</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="{ row }">
          <div v-if="row.is_pay !== 1">
            <div
              class="editor_delete"
              v-if="
                IsCurrentUser(row.add_by_id) ||
                IsCurrentUser(CooperationDetail.manager_id) ||
                judgeAEPower()
              "
            >
              <el-tooltip placement="left" effect="light" content="编辑" class="editor">
                <span v-show="Permission.canEdit">
                  <tg-icon name="ico-edit" @click="editCost(row)" />
                </span>
              </el-tooltip>
              <el-tooltip placement="top" effect="light" content="删除" class="delete">
                <span v-show="Permission.canDelete" style="margin-left: 10px">
                  <tg-icon name="ico-delete" @click="delCost(row)" />
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
      :total="RebatesList !== null ? RebatesList.total : 0"
      @current-change="handleCurrentChange"
      @size-change="handlePageSizeChange"
    ></el-pagination>
    <!-- 成本安排 -->
    <AddRebates ref="AddRebatesDialog" />
    <!-- 预览图片 -->
    <image-dialog ref="imageDialog" :imgsrc="imgsrc" :title="imgtitle" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddRebates from './AddRebates';
import { showProDateFormat } from '@/utils/format';
import { delRebate } from '@/api/cooperative';
import { getToken } from '@/utils/token';
import CurrentUserPower from '../../mixin/CurrentUserPower';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission, IsCurrentUser } from '@/use/permission';

export default {
  name: 'TgRebatesList',
  components: {
    AddRebates,
  },
  mixins: [CurrentUserPower, CooperativeStore],
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canCreate = HasPermission(NEW_RIGHT_CODE.rebate_create);
      const canEdit = HasPermission(NEW_RIGHT_CODE.rebate_edit);
      const canDelete = HasPermission(NEW_RIGHT_CODE.rebate_delete);
      const canViewList = HasPermission(NEW_RIGHT_CODE.rebate_list);
      const canUploadEvidence = HasPermission(NEW_RIGHT_CODE.rebate_upload_edit_pay_evidence);

      return { canViewList, canCreate, canEdit, canDelete, canUploadEvidence };
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
      RebatesList: 'cooperative/RebatesList',
    }),
  },
  methods: {
    getToken,
    showProDateFormat,
    ...mapActions({
      GetAchievementList: 'cooperative/GetAchievementList',
      // GetCoostList: "cooperative/GetCoostList",
      GetRebatesList: 'cooperative/GetRebatesList',
    }),
    // 获取分页数据
    getRebatesListByPage() {
      this.GetRebatesList({
        cooperation_id: this.CooperationDetail.cooperation_id,
        num: this.pagination.pageSize,
        page_num: this.pagination.currentPage,
      });
    },
    // 安排返点
    addCostHandle() {
      this.$refs.AddRebatesDialog.show();
    },
    // 编辑返点
    editCost(row) {
      const page = JSON.parse(JSON.stringify(this.pagination));
      this.$refs.AddRebatesDialog.show(row, page);
    },
    // 删除返点
    async delCost(row) {
      const msg = '此操作将永久删除数据，是否继续？';
      const result = await AsyncConfirm({ root: this }, msg);

      if (result) {
        delRebate({ rebate_id: row.rebate_id }).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            this.getRebatesListByPage();
            // 更新成本
            this.GetCooperationDetail({
              customer_id: this.CustomerDetail.id,
              cooperation_id: this.CooperationDetail.cooperation_id,
            });
            // 更新业绩登记表
            this.GetAchievementList({
              cooperation_id: this.CooperationDetail.cooperation_id,
              num: 10,
              page_num: 1,
            });
          } else {
            this.$message.error(res.data.message);
          }
        });
      }
    },
    // 翻页
    handleCurrentChange() {
      this.getRebatesListByPage();
    },
    // 每页条数改变
    handlePageSizeChange(pageSize) {
      this.pagination.currentPage = 1;
      this.pagination.pageSize = pageSize;
      this.getRebatesListByPage();
    },
    // 预览图片
    displayImg(title, imgsrc) {
      this.imgsrc = imgsrc;
      this.imgtitle = title;
      this.$refs.imageDialog.show();
    },
  },
};
</script>

<style lang="scss" scoped>
.lookMore {
  color: #396fff;
  text-decoration: underline;
  cursor: pointer;
}
.RebatesList-container {
  /deep/ .el-table {
    border-right-width: 0;
  }
  .txt-skamount {
    color: #ff731e;
  }
  .tax {
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
  .txt-gwinfo-color {
    color: #396fff;
  }
  .img-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .link {
    color: #396fff;
    font-size: 12px;
    cursor: pointer;
    text-decoration: none;
  }
}
.editor_delete {
  position: relative;
}
.editor,
.delete {
  .icon-shanchu {
    position: absolute;
    top: -14px;
    right: 30px;
    margin-top: 0 !important;
  }
  .icon-bianji {
    position: absolute;
    bottom: -12px;
    left: 0px;
  }
}
.btn-blue {
  width: 90px;
  // height: 32px;
}
/deep/ .el-table td {
  padding: 18px 0;
}
/deep/ .no_data {
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}
</style>
