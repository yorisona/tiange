<!--
 * @Description: 数据入库
 * @Author: 棠棣
 * @Date: 2019-12-09 09:35:27
 * @LastEditTime: 2019-12-10 11:15:00
 * @LastEditors: 棠棣
 -->
<template>
  <el-dialog
    :visible="visible"
    ref="AddSceneDialog"
    class="customer-dialog"
    width="990px"
    @close="handledialogCancel"
    :isfooter="false"
  >
    <template #title> <span>新增场次</span> </template>
    <div class="addscene-container">
      <div class="box1">
        <CustomerStageProgress :isvertical="false" :stage="5" :issimple="true" />
      </div>
      <div class="box2">
        <div class="addsceneform">
          <div class="header">
            <div class="medium-title">
              <div
                v-for="item in CooperationAE"
                :key="item.ae_id"
                :class="['title', { current: item.ae_id === CurrentAE.ae_id }]"
                @click="val => changeCurrentType(val, item)"
              >
                <tg-label :label="item.ae_name" checked />
              </div>
            </div>
          </div>
          <!-- AE跟单记录 -->
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
            >
              <template #empty>
                <table-no-data
                  :isvertical="true"
                  title="还没有跟单记录哦~"
                  class="no_aedocumentarylist"
                  :img="require('@/assets/img/cooperative/xt_nodata_note.png')"
                ></table-no-data>
              </template>
              <el-table-column
                :formatter="
                  (row, column, cellValue, index) =>
                    (pagination.currentPage - 1) * pagination.pageSize + (index + 1)
                "
                label="序号"
                width="70"
                fixed="left"
                align="center"
              />
              <el-table-column label="跟单信息" width="280">
                <template #default="{ row }">
                  <p>
                    直播日期：
                    <span class="color-3" v-if="row.live_date !== ''">{{ row.live_date }}</span>
                    <span v-else>--</span>
                  </p>
                  <p>
                    kol名称：<span>{{ row.kol_name }}</span>
                  </p>
                  <p>
                    报价金额：
                    <span class="txt-skamount color-red">{{
                      row.price_amount_str ? `￥${row.price_amount_str}` : '--'
                    }}</span>
                  </p>
                  <div>
                    <p style="float: left">商品名称/链接：</p>
                    <a
                      v-if="row.item_list.length > 0"
                      :href="row.item_list[0].item_url"
                      style="text-decoration: none"
                      target="_blank"
                    >
                      <i
                        class="iconfont iconfujian"
                        style="color: #5c82ff; font-size: 15px; float: left"
                      ></i>
                      <span class="linkSpan" style="color: #333">{{
                        row.item_list[0].item_name
                      }}</span>
                    </a>
                    <span v-else>--</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="录入场次信息">
                <template #default="{ row }">
                  <div style="display: flex" @click="flag2">
                    <el-form>
                      <!-- :model="numberValidateForm" ref="numberValidateForm" -->
                      <div style="display: flex">
                        <el-form-item
                          class="position-r"
                          label="直播标题:"
                          style="float: left; width: 245px; margin-top: 10px"
                          :rules="{ required: true }"
                        >
                          <!--  v-model.trim="row.enterForm.liveTitle" -->
                          <!-- v-model.trim="numberValidateForm.title"  -->
                          <el-input
                            v-model.trim="row.enterForm.liveTitle"
                            placeholder="请输入"
                            size="mini"
                            style="width: 152px"
                          ></el-input>
                        </el-form-item>

                        <el-form-item
                          class="position-r"
                          style="float: left; width: 245px; margin-top: 10px"
                          label="场次PV:"
                          :rules="{ required: true }"
                        >
                          <!-- v-model.number="row.enterForm.pv" -->
                          <!--  v-model.number="numberValidateForm.pv" -->
                          <el-input
                            placeholder="请输入"
                            size="mini"
                            type="number"
                            v-model.number="row.enterForm.pv"
                            style="width: 152px"
                            @mousewheel.native.prevent
                          >
                            <template #append>万</template>
                          </el-input>
                        </el-form-item>
                      </div>
                      <!-- <el-form-item
                          label="场次PV:"
                          :rules="{required: true}"
                          style="float: left;width: 230px;line-height: 40px;margin-top: 10px"
                        >
                          <el-input
                            placeholder="请输入"
                            size="mini"
                            type="number"
                            v-model.number="row.enterForm.pv"
                            style="width: 135px;"
                          >
                            <template #append>万</template>
                          </el-input>
                        </el-form-item> -->
                      <el-form-item
                        label="直播类型:"
                        style="width: 50%"
                        :rules="{ required: true }"
                      >
                        <el-radio
                          style="float: left; margin-top: 8px"
                          v-model="row.enterForm.liveType"
                          label="0"
                          >混播</el-radio
                        >
                        <el-radio
                          style="float: left; margin-top: 8px"
                          v-model="row.enterForm.liveType"
                          label="1"
                          >专场</el-radio
                        >
                      </el-form-item>
                      <el-form-item label="是否预售场:" :rules="{ required: true }">
                        <el-radio
                          style="float: left; margin-top: 8px"
                          v-model="row.enterForm.preSale"
                          label="0"
                          >非预售场</el-radio
                        >
                        <el-radio
                          style="float: left; margin-top: 8px"
                          v-model="row.enterForm.preSale"
                          label="1"
                          >预售场</el-radio
                        >
                        <el-radio
                          style="float: left; margin-top: 8px"
                          v-model="row.enterForm.preSale"
                          label="2"
                          >预热场</el-radio
                        >
                      </el-form-item>
                    </el-form>
                  </div>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" align="center" width="100">
                <template #default="{ row }">
                  <div v-if="row.is_show_add_click">
                    <el-button
                      class="btnStyle"
                      type="primary"
                      size="small"
                      :disabled="isAddingEditing"
                      @click="addDocumentary(row)"
                      >添加</el-button
                    >
                  </div>
                  <span v-else>--</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
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
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CustomerStageProgress from '../components/CustomerStageProgress';
import { ROLE_CODE, RIGHT_CODE } from '@/const/roleCode';
import { presellSelectOption, displayTypeOptions } from '@/const/options';
import { domain } from '@/utils/variable';
import { saveDisplay } from '@/api/display';
import PubSub from 'pubsub-js';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'AddScene',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CustomerStageProgress,
    // AeList,
  },
  mixins: [CooperativeStore],
  computed: {
    ...mapGetters({
      CooperationAE: 'cooperative/CooperationAE',
      CurrentAE: 'cooperative/CurrentAE',
      CurrentAERecordList: 'cooperative/CurrentAERecordList',
    }),
  },
  data() {
    return {
      isAddingEditing: false, // 当点击添加和保存修改的按钮时，限制重复点击
      activeName: '0',
      domain,
      ROLE_CODE,
      RIGHT_CODE,
      checkStar: false,
      displayTypeOptions,
      allStars: [],
      isAdminUser: true,
      presellSelectOption,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
      },
      shopLink: [],
      // 验证input
      //  numberValidateForm: {
      //   title: '',
      //   pv: ''
      // }
    };
  },
  methods: {
    flag2() {
      this.isAddingEditing = false;
    },
    ...mapActions({
      GetCurrentAERecordList: 'cooperative/GetCurrentAERecordList',
      GetCurrentAE: 'cooperative/GetCurrentAE',
    }),

    // 添加
    addDocumentary(row) {
      this.isAddingEditing = true;
      if (!row.enterForm.liveTitle) {
        this.$message.warning('请输入直播标题');
        this.isAddingEditing = false;
        return false;
      }
      if (!row.enterForm.pv) {
        this.$message.warning('请输入场均PV');
        this.isAddingEditing = false;
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
            // 更新合作详情
            this.GetCooperationDetail({
              customer_id: this.CustomerDetail.id,
              cooperation_id: this.CooperationDetail.cooperation_id,
            });
            // 更新合作详情状态
            this.SetCooperationdetailStatus(5);
            // 推送消息
            this.addSceneToData();
            // 添加成功提示
            this.$message({
              center: true,
              dangerouslyUseHTMLString: true,
              iconClass: 'icon-style',
              customClass: 'mess',
              message: '<span style="color:#fff;">添加成功！</span>',
            });
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

    changeCurrentType(val, item) {
      item.is_need_add_display = true;
      this.GetCurrentAE(JSON.parse(JSON.stringify(item)));
    },
    show() {
      const role = this.$store.getters['user/getUserRole'];
      if (role === ROLE_CODE.customer_manager) {
        this.isAdminUser = false;
      }
      this.getAEDocumentaryListByPage();
    },

    // 取消弹窗
    handledialogCancel() {
      this.onClose();
      this.getAEDocumentaryListByPage1();
      this.isAddingEditing = false;
    },
    // 保存场次
    saveDisplays: function (formName) {
      // 判断验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.allStars.forEach(item => {
            if (
              this.displayInfoForm.starName === item.value &&
              this.displayInfoForm.starId === item.star_id
            ) {
              this.checkStar = true;
            }
          });
          if (this.checkStar) {
            const displaypass = {
              star_id: this.displayInfoForm.starId,
              star_name: this.displayInfoForm.starName,
              title: this.displayInfoForm.title,
              display_type: this.displayInfoForm.displayType,
              pv: this.displayInfoForm.pv,
              display_time: this.displayInfoForm.displayTime,
              is_presell: this.displayInfoForm.isPresell,
              uv: this.displayInfoForm.uv,
              cooperation_id: this.CooperationDetail.cooperation_id,
            };
            if (displaypass.is_presell) {
              displaypass.is_presell = 1;
            } else {
              displaypass.is_presell = 0;
            }
            saveDisplay(displaypass)
              .then(response => {
                const data = response.data;
                if (data.success) {
                  this.$message.success(data.message);
                  // 更新合作详情
                  this.GetCooperationDetail({
                    customer_id: this.CustomerDetail.id,
                    cooperation_id: this.CooperationDetail.cooperation_id,
                  });
                  // 更新合作详情状态
                  this.SetCooperationdetailStatus(5);
                  // 推送消息
                  this.addSceneToData();
                  this.onClose();
                } else {
                  this.$message.error(data.message);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            this.$message.error('请检查主播ID和主播昵称');
          }
        } else {
          return false;
        }
      });
    },

    // 推送消息
    addSceneToData() {
      PubSub.publish('addScene', true);
    },
    onClose() {
      this.$emit('dialog:close');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars.scss';
/deep/ .el-table__empty-block {
  .no_aedocumentarylist {
    img {
      width: 110px !important;
      height: 110px !important;
      margin-bottom: 10px;
    }
  }
}
.addscene-container {
  background: #f2f6f9;
  padding-bottom: 20px;
  .line {
    border: 5px solid #f5f5f5;
  }
  .addsceneform {
    padding: 20px;

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      border-bottom: #efefef solid 1px;
      .medium-title {
        font-size: 0;
        text-align: center;
        background: #fff;
        margin-bottom: 10px;
        .title {
          display: inline-block;
          height: 30px;
          color: #666;
          box-sizing: border-box;
          line-height: 30px;
          background: #fff;
          font-size: 14px;
          cursor: pointer;
          span {
            display: inline-block;
            // vertical-align: top;

            position: relative;
          }
          &.current {
            font-size: 16px !important;
          }
          &.current::after {
            height: 11px;
            position: absolute;
            left: 11px;
            bottom: 3px;
            z-index: -1;
          }
        }
      }
    }
  }

  .el-form-item__error {
    margin-right: 10%;
    top: -16px;
  }
  /deep/ .el-form-item__label {
    padding-bottom: 0;
    /*line-height: 15px;*/
    /*margin-left: 10%;*/
  }
  .el-dialog__footer {
    border-top: 1px solid #f0f1f2;
    padding: 15px 20px;
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__header {
    background: #f8f8f8;
    border-bottom: #efefef solid 1px;
    color: var(--text-second-color);
    .el-dialog__headerbtn .el-dialog__close {
      color: var(--icon-color) !important;
      position: relative;
      top: -7px;
    }
  }
}
.box1 {
  background: #fff !important;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 13px;
}
.box2 {
  background: #fff !important;
  border-radius: 10px;
  margin-top: 10px;
  padding-top: 10px;
}
.box2 {
  p {
    font-size: 12px !important;
    color: var(--text-third-color);
    margin: 5px 0;
    span {
      color: var(--text-color);
      font-size: 14px;
    }
    .color-red {
      color: #ff731e;
    }
  }
}
/deep/ .el-input-group__append {
  border-radius: 0 10px 10px 0;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
.position-r {
  position: relative;
  /deep/ .el-form-item__error {
    position: absolute;
    top: -11px;
    left: 26px;
    width: 80%;
  }
}
/deep/ .el-radio__inner {
  width: 24px;
  height: 24px;
}
.btnStyle {
  width: 70px;
  height: 30px;
  border-radius: 10px;
}
</style>
<style>
/* 添加成功提示框 */
.mess {
  min-width: 180px !important;
  width: 180px;
  height: 80px;
  background-color: #000 !important;
  opacity: 0.6 !important;
  top: 300px;
  border-radius: 10px;
}
.addscene-container .el-dialog__headerbtn i {
  color: #909399 !important;
  position: relative;
  top: -3px;
}
.addscene-container .dialog-footer {
  display: block;
  text-align: center;
  margin-top: 20px;
}
</style>
