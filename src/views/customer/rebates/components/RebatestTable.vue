<!--
 * @Description: 侧边栏返点安排表列表
 * @Author: 神曲
 * @LastEditTime: 2019-03-03
 * @LastEditors: 神曲
 -->
<template>
  <div class="achievementtable-container">
    <div class="result-list">
      <div class="opreate-btns">
        <el-button
          type="primary"
          class="btn-blue big-button"
          v-if="Permission.canExport && dataSource.total !== 0"
          size="small"
          @click="handleExportClick"
          >导出</el-button
        >
      </div>
      <el-alert
        :closable="false"
        style="margin-top: 12px; padding: 9px 21px; border: 1px solid rgba(255, 122, 54, 0.5)"
        type="warning"
        show-icon
      >
        <template #title>
          <span
            >本页面即将下线，新的版块【财务管理-付款管理】已上线，请尽可能转至新版块工作，新版块如有不满足使用需求的地方请反馈给</span
          >
          <a href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=ujndl23">当归</a>
        </template>
      </el-alert>
      <div class="list cost-list">
        <el-table
          stripe
          v-if="Permission.canViewList"
          :data="dataSource !== null ? dataSource.data : []"
          style="width: 100%; margin-top: 15px; margin-bottom: 10px"
          :header-cell-style="{
            background: 'var(--table-thead-th-bg-color)',
            height: '42px',
            color: 'var(--text-second-color)',
            fontWeight: 'bold',
          }"
          @selection-change="handleSelectionChange"
        >
          <template #empty>
            <table-no-data
              :isvertical="true"
              title="暂时木有内容呀~"
              class="no_data"
              :img="require('@/assets/img/cooperative/xt_nodata_cost.png')"
            />
          </template>
          <el-table-column type="selection" width="50"></el-table-column>
          <el-table-column
            :formatter="
              (row, column, cellValue, index) => (page.page_num - 1) * page.num + (index + 1)
            "
            label="序号"
            width="80"
            fixed="left"
            align="center"
          />
          <el-table-column prop="manager" label="客户经理" width="120">
            <template #default="{ row }">
              <span>{{ row.manager || '--' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="manager" label="店铺名称" width="150">
            <template #default="{ row }">
              <span>{{ row.shop_name || '--' }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="achievement_uid" label="关联业绩" width="160">
            <template #default="{ row }">
              <span>{{ row.achievement_uid }}</span>
            </template>
          </el-table-column>
          <el-table-column label="业绩收款金额" min-width="100">
            <template #default="{ row }">
              <p class>
                <span class="color-red">{{ row.gather_amount_str || '--' }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column min-width="120" label="打款信息">
            <template #default="{ row }">
              <p>
                <span class="txt-gwtitle">打款时间:</span>
                <span class="txt-gwinfo">{{ row.pay_date }}</span>
              </p>
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
                        <span
                          v-else
                          style="border-radius: 10px; position: relative; display: block"
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
          <el-table-column label="返点打款金额" min-width="120">
            <template #default="{ row }">
              <span class="txt-skamount">{{
                row.rebate_amount_str ? `￥${row.rebate_amount_str}` : '--'
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否打款" align="center" min-width="90">
            <template #default="{ row }">
              <!-- :disabled="row.pay_certificate_pic !== ''" -->
              <el-switch
                v-if="Permission.canUploadEvidence"
                :value="row.is_pay === 1"
                active-text="是"
                inactive-text="否"
                @change="val => switchChangeHandle(val, row)"
                :disabled="true"
              ></el-switch>
              <span v-else>{{ row.is_pay === 1 ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="打款凭证" align="center" min-width="90">
            <template #default="{ row }">
              <p></p>
              <span v-if="!(row.pay_certificate_pic !== '') && !Permission.canUploadEvidence"
                >--</span
              >
              <div v-else>
                <p v-if="row.pay_certificate_pic !== ''">
                  <span style="white-space: nowrap">
                    &nbsp;凭证:
                    <i
                      class="iconfont icontupian txt-center"
                      style="
                        font-size: 30px !important;
                        color: #396fff;
                        cursor: pointer;
                        vertical-align: middle;
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
                <!-- <p>
                  <span v-if="Permission.canUploadEvidence">
                    <el-button
                      v-if="row.pay_certificate_pic !== ''"
                      size="mini"
                      style="font-size: 12px; margin: 3px 0"
                      @click="
                        () => {
                          uploadHandel(row);
                        }
                      "
                      >重新上传</el-button
                    >
                    <el-button
                      v-else
                      size="mini"
                      style="font-size: 12px; margin: 3px 0; color: #396fff; border-color: #396fff"
                      @click="
                        () => {
                          uploadHandel(row);
                        }
                      "
                      >上传凭证</el-button
                    >
                  </span>
                </p> -->
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="Permission.canViewList"
          class="contract-pagination"
          style="margin-bottom: 10px"
          :current-page.sync="page.page_num"
          :page-sizes.sync="page.pageSizes"
          :page-size="page.num"
          layout="total, prev, pager, next, sizes, jumper"
          :total="dataSource !== null ? dataSource.total : 0"
          @current-change="handleCurrentChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </div>
    <!-- 预览凭证 -->
    <image-dialog ref="imageDialog" :imgsrc="imgsrc" :title="imgtitle" />
    <!-- 上传开票凭证 -->
    <CertificateUploadDialog
      ref="certificateUploadDialog"
      :id="rebate_id"
      :name="'打款凭证'"
      :type="'certificate/rebate_pay_certificate'"
      @upload-close="dialogCancelHandle"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getToken } from '@/utils/token';
import CertificateUploadDialog from '@/views/customer/components/CertificateUpload.vue';
import { updateRebateIsPay } from '@/api/cooperative';

import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { computed } from '@vue/composition-api';
import { HasPermission } from '@/use/permission';

export default {
  name: 'RebatestTable',
  props: ['page', 'dataSource'],
  components: {
    CertificateUploadDialog,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canViewList = HasPermission(NEW_RIGHT_CODE.rebate_list);
      const canExport = HasPermission(NEW_RIGHT_CODE.rebate_export);
      const canCreate = HasPermission(NEW_RIGHT_CODE.rebate_create);
      const canUploadEvidence = HasPermission(NEW_RIGHT_CODE.rebate_upload_edit_pay_evidence);

      return { canViewList, canExport, canCreate, canUploadEvidence };
    });
    return { Permission };
  },
  data() {
    return {
      imgsrc: '',
      imgtitle: '',
      multipleSelectionIds: [],
      rebate_id: '',
      achievement_uid: '',
      getToken,
    };
  },
  computed: {
    ...mapGetters({
      UserRoles: 'user/getUserRole',
    }),
  },
  methods: {
    // 翻页
    handleCurrentChange(val) {
      this.$emit('change-page', {
        type: 'index',
        data: val,
      });
    },
    // 页大小变化
    handlePageSizeChange(val) {
      this.$emit('change-page', {
        type: 'size',
        data: val,
      });
    },
    // 导出
    handleExportClick() {
      const multipleSelectionIds = JSON.parse(JSON.stringify(this.multipleSelectionIds));
      this.$emit('exort', multipleSelectionIds);
    },
    // 预览图片
    displayImg(title, imgsrc) {
      this.imgsrc = imgsrc;
      this.imgtitle = title;
      this.$refs.imageDialog.show();
    },
    // 多选
    handleSelectionChange(data) {
      this.multipleSelectionIds = data.map(cc => cc.rebate_id);
    },
    // 上传凭证
    uploadHandel(row) {
      this.rebate_id = row.rebate_id;
      this.$refs.certificateUploadDialog.show();
    },
    // 关闭上传弹窗
    dialogCancelHandle(flag) {
      if (!flag) {
        this.$emit('upload-handle');
      }
      this.rebate_id = '';
    },
    // 切换变化
    switchChangeHandle(val, row) {
      updateRebateIsPay({
        is_pay: val ? 1 : 0,
        rebate_id: row.rebate_id,
      }).then(res => {
        if (res.data.success) {
          this.$message.success('更新成功');
          this.$emit('upload-handle');
        } else {
          this.$message.error('更新失败');
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
.achievementtable-container {
  .result-list {
    padding: 12px;
    background: #fff;
    margin-top: 12px;
    border-radius: 10px;
    .opreate-btns {
      margin-bottom: 12px;
      .el-button {
        min-width: 80px;
      }
    }
    .contract-pagination {
      padding: 0;
      margin-top: 12px;
      /deep/ .el-input.el-input--mini.el-input--suffix {
        margin: 0;
      }
    }
    .txt-skamount {
      color: #ff731e;
    }
    .txt-gwtitle {
      font-size: 14px;
      color: var(--text-des-color);
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
}
.overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rect-100-36 {
  width: 100px;
  height: 36px;
}
/deep/ .el-icon-question:before {
  color: #cdcdcd;
  margin-left: 2px;
}
/deep/ .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  span {
    font-size: 12px;
  }
}
/*显示文字*/
/deep/ .el-switch__label.is-active {
  display: block;
}
/deep/ .no_data {
  img {
    width: 110px;
    margin-bottom: 10px;
  }
}
</style>
