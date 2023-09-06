<!--
 * @Description: 新增返点
 * @Author: 神曲
 * @LastEditTime: 2019-03-03
 * @LastEditors: 神曲
 -->
<template>
  <common-dialog
    ref="AddAchievementDialog"
    :isAppendToBody="true"
    :title="title"
    :width="990"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
    :isfooter="true"
  >
    <div class="addachievement-container">
      <div class="box1">
        <sub-panel :title="'客户信息'" :iserect="true">
          <CustomerSimpleDetail />
        </sub-panel>
      </div>
      <!-- <div class="box2"> -->

      <el-form
        :inline="true"
        ref="add_rebates_form"
        :model="add_rebates_form"
        :rules="add_rebates_form_rules"
        label-width="170px"
      >
        <div class="form-block">
          <div class="box2">
            <sub-panel :title="'打款信息'" :iserect="true">
              <div>
                <el-form-item label="关联业绩:" prop="achievement_uid">
                  <el-select
                    size="small"
                    v-model="add_rebates_form.achievement_uid"
                    style="width: 120%; padding-right: 6px"
                    filterable
                    placeholder="搜索并选择收款编号"
                    @change="val => selectAchievementUid(val, add_rebates_form)"
                  >
                    <el-option
                      v-for="add_rebates_form in achievement_uids"
                      :key="add_rebates_form"
                      :label="add_rebates_form"
                      :value="add_rebates_form"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="该笔业绩收款金额:"
                  prop="gather_amount_str"
                  class="gatherAmountStr-bgc"
                >
                  <span class="gatherAmountStr" style="width: 400px">{{
                    add_rebates_form.gather_amount ? add_rebates_form.gather_amount : '--'
                  }}</span>
                </el-form-item>
              </div>
              <el-form-item label="打款时间:" prop="pay_date">
                <el-date-picker
                  size="small"
                  placeholder="请选择打款时间"
                  style="width: 115%"
                  format="yyyy.MM.dd"
                  value-format="yyyy-MM-dd"
                  v-model="add_rebates_form.pay_date"
                ></el-date-picker>
              </el-form-item>

              <el-form-item label="返点打款金额:" prop="rebate_amount" class="rebateAmount">
                <el-input
                  v-model.number="add_rebates_form.rebate_amount"
                  type="number"
                  size="small"
                  @mousewheel.native.prevent
                  placeholder="0.00"
                  style="width: 120%"
                >
                  <!--  ref="rebateAmount_dom" -->
                  <template #append>元</template>
                </el-input>
              </el-form-item>
            </sub-panel>
          </div>
          <div class="box3">
            <sub-panel :title="'银行卡信息'" :iserect="true">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="银行卡号:" prop="bank_card_number">
                    <el-input
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      v-model="add_rebates_form.bank_card_number"
                      size="small"
                      @mousewheel.native.prevent
                      placeholder="请输入银行卡号"
                      style="width: 120%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="身份证号:" prop="id_card">
                    <el-input
                      oninput="value=value.replace(/[/W]/g,'')"
                      v-model="add_rebates_form.id_card"
                      size="small"
                      placeholder="请输入身份证号"
                      style="width: 120%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="开户行:" prop="bank_name">
                    <el-input
                      v-model="add_rebates_form.bank_name"
                      size="small"
                      placeholder="请输入开户行"
                      style="width: 120%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="真实姓名:" prop="real_name">
                    <el-input
                      v-model="add_rebates_form.real_name"
                      size="small"
                      maxlength="10"
                      placeholder="请输入真实姓名"
                      style="width: 120%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="手机号:" prop="bank_phone">
                    <el-input
                      @mousewheel.native.prevent
                      v-model="add_rebates_form.bank_phone"
                      size="small"
                      placeholder="请输入银行卡绑定的手机号"
                      style="width: 120%"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14">
                  <el-form-item label="身份证照片:" prop="id_card_pic">
                    <el-upload
                      list-type="picture-card"
                      action
                      :class="{ 'has-img': add_rebates_form.id_card_pic }"
                      :http-request="uploadImage"
                      :data="{ key: 'id_card_pic' }"
                      :show-file-list="false"
                      :accept="imageAccepts.join(',')"
                    >
                      <span v-if="add_rebates_form.id_card_pic">
                        <img
                          :src="add_rebates_form.id_card_pic + '?Authorization=' + getToken()"
                          alt
                          v-if="add_rebates_form.id_card_pic"
                        />
                        <i class="el-icon-error" @click="removePic('id_card_pic')"></i>
                      </span>
                      <i v-else class="iconfont iconshangchuantupian grey-color"></i>
                      <template #tip>
                        <span
                          class="el-upload__tip line-height25 grey-color"
                          v-if="!add_rebates_form.id_card_pic"
                        >
                          图片大小：不高于2M
                          <br />支持扩展名：.jpg .jpeg
                        </span>
                      </template>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <div class="box4">
                  <el-form-item label="银行卡照片:" prop="bank_card_pic">
                    <el-upload
                      list-type="picture-card"
                      action
                      :class="{ 'has-img': add_rebates_form.bank_card_pic }"
                      :http-request="uploadImage"
                      :data="{ key: 'bank_card_pic' }"
                      :show-file-list="false"
                      :accept="imageAccepts.join(',')"
                    >
                      <span v-if="add_rebates_form.bank_card_pic">
                        <img
                          :src="add_rebates_form.bank_card_pic + '?Authorization=' + getToken()"
                        />
                        <i class="el-icon-error" @click="removePic('bank_card_pic')"></i>
                      </span>
                      <i v-else class="iconfont iconshangchuantupian grey-color"></i>
                      <template #tip>
                        <span
                          class="el-upload__tip line-height25 grey-color"
                          v-if="!add_rebates_form.bank_card_pic"
                        >
                          图片大小：不高于2M
                          <br />支持扩展名：.jpg .jpeg
                        </span>
                      </template>
                    </el-upload>
                  </el-form-item>
                </div>
              </el-row>
            </sub-panel>
          </div>
        </div>
      </el-form>

      <!-- </div> -->
    </div>
  </common-dialog>
</template>

<script>
import CustomerSimpleDetail from '../../components/CustomerSimpleDetail';
import {
  getAchievementUIdsByCooperation,
  saveRebate, //保存返点
  uploadFile, //上传照片
} from '@/api/cooperative';
import { gatherWayList } from '@/const/cooperative';
import { mapActions } from 'vuex';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { getToken } from '@/utils/token';
export default {
  name: 'AddAchievement',
  components: {
    CustomerSimpleDetail,
  },
  mixins: [CooperativeStore],
  data() {
    // 自定义验证
    const validateBudget = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入返点金额'));
      }
      if (value > this.add_rebates_form.gather_amount) {
        callback(new Error('不得高于业绩收款金额'));
        // console.log(this.add_rebates_form.gather_amount)
      } else {
        callback();
      }
    };

    return {
      getToken,
      gatherWayList, // 收款方式
      title: '',
      page: null,
      add_rebates_form: {
        bank_card_number: '', //银行卡号
        bank_phone: '', //手机号
        id_card: '', //身份证
        real_name: '', //真实姓名
        bank_name: '', //开户行
        achievement_uid: '', // 业绩编号
        cost_type: '', // 关联业绩 1 收款编号 2 借款
        pay_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 打款日期
        rebate_amount: '', // 返点金额
        bank_card_pic: '', // 银行卡照片
        id_card_pic: '', //身份证照片
      },
      imageAccepts: ['jpg', 'jpeg'], //支持格式
      achievement_uids: [], // 业绩Uid集合
      list: [], //所有数据的集合
      gather_amount_strs: [],
      // 表单验证规则
      add_rebates_form_rules: {
        achievement_uid: [
          // 关联业绩
          { required: true, message: '请选择关联业绩', trigger: 'change' },
        ],
        rebate_amount: [{ required: true, validator: validateBudget, trigger: 'change' }],
        bank_card_number: [{ required: true, message: '请输入银行卡号', trigger: 'change' }],
        bank_name: [{ required: true, message: '请输入开户行', trigger: 'change' }],
        // 仅中英文
        real_name: [
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            required: true,
            message: '请输入真实姓名',
            trigger: 'change',
          },
        ],
        // 仅字母数字
        id_card: [
          {
            pattern: /^[0-9a-zA-Z]+$/,
            required: true,
            message: '请输入正确身份证号',
            trigger: 'change',
          },
        ],
        // 手机号
        bank_phone: [
          {
            required: false,
            pattern: /^[0-9]+$/,
            trigger: 'change',
            message: '仅可输入阿拉伯数字',
          },
        ],
      },
      descriptionAccepts: ['jpg', 'jpeg', 'png'], // 扩展名
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      GetAchievementList: 'cooperative/GetAchievementList',
      GetRebatesList: 'cooperative/GetRebatesList',
    }),
    // 选择收款编号
    selectAchievementUid(val, add_rebates_form) {
      if (val) add_rebates_form.cost_type = 1;
      // 业绩对应的金额
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].achievement_uid === val) {
          this.add_rebates_form.gather_amount = this.list[i].gather_amount;
        }
      }
    },
    /**
     * 删除银行卡等照片
     * @param type
     */
    removePic(type) {
      this.add_rebates_form[type] = '';
    },
    // 显示
    show(rebates, page) {
      if (rebates) {
        // 编辑中查询业绩编号
        this.getAchievementUIds();
        // 修改
        this.title = '安排返点修改';
        this.add_rebates_form = Object.assign(this.add_rebates_form, rebates);

        this.add_rebates_form = {
          ...JSON.parse(JSON.stringify(this.add_rebates_form)),
        };
        if (page) this.page = page;
      } else {
        // 新增
        this.title = '安排返点';
        this.getAchievementUIds();
      }
      this.$refs.AddAchievementDialog.dialogOpen();
      this.$nextTick(() => {
        this.$refs.add_rebates_form.clearValidate();
      });
    },
    // 取消弹窗
    handledialogCancel() {
      this.$refs.add_rebates_form.resetFields();
      const add_rebates_form = {
        bank_card_number: '', //银行卡号
        bank_phone: '', //手机号
        id_card: '', //身份证
        real_name: '', //真实姓名
        bank_name: '', //开户行
        achievement_uid: '', // 业绩编号
        pay_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 打款时间
        rebate_amount: '', // 返点金额
        gather_certificate_pic: '', // 收款凭证
        bank_card_pic: '', // 银行卡照片
        id_card_pic: '', //身份证照片
      };
      this.$refs.add_rebates_form.clearValidate();
      this.add_rebates_form = add_rebates_form;
    },
    // 弹窗确定操作
    handledialogSubmit() {
      this.$refs.add_rebates_form.validate(pass => {
        if (pass) {
          let add_rebates_form = JSON.parse(JSON.stringify(this.add_rebates_form));
          add_rebates_form = {
            ...add_rebates_form,
            ...{ cooperation_id: this.CooperationDetail.cooperation_id },
          };
          saveRebate(add_rebates_form)
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.message);
                // 更新客户信息
                this.GetCustomerDetail(this.CooperationDetail.customer_id);
                // 更新合作详情
                this.GetCooperationDetail({
                  customer_id: this.CustomerDetail.id,
                  cooperation_id: this.CooperationDetail.cooperation_id,
                });
                if (this.page === null) {
                  // // 新增
                  // // 更新业绩列表
                  // this.GetAchievementList({
                  //   cooperation_id: this.CooperationDetail.cooperation_id,
                  //   num: 10,
                  //   page_num: 1
                  // });
                  // 新增
                  // 更新返点更新列表
                  this.GetRebatesList({
                    cooperation_id: this.CooperationDetail.cooperation_id,
                    num: 10,
                    page_num: 1,
                  });
                } else {
                  // // 修改
                  // // 更新业绩列表
                  // this.GetAchievementList({
                  //   cooperation_id: this.CooperationDetail.cooperation_id,
                  //   num: this.page.pageSize,
                  //   page_num: this.page.currentPage
                  // });
                  // 修改
                  // 更新返点更新列表
                  this.GetRebatesList({
                    cooperation_id: this.CooperationDetail.cooperation_id,
                    num: this.page.pageSize,
                    page_num: this.page.currentPage,
                  });
                }
                this.$refs.AddAchievementDialog.dialogClose();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              this.$message.error('保存失败');
              console.error(err);
            });
        }
      });
    },
    // 获取当前安排的成本编号
    getAchievementUIds() {
      getAchievementUIdsByCooperation({
        cooperation_id: this.CooperationDetail.cooperation_id,
      }).then(res => {
        this.achievement_uids = res.data.data.data.map(a => a.achievement_uid);
        this.list = res.data.data.data;
      });
    },
    // rebateAmount(){
    //   console.log(this.$refs.rebateAmount_dom.value);
    // },
    // 上传身份证照片
    uploadImage(params) {
      // const this = this;
      const file = params.file;
      const type = params.data.key;
      const fileType = file.name.split('.')[1];
      const found = this.imageAccepts.find(type => {
        return type.toLowerCase() === fileType.toLowerCase();
      });
      if (!found) {
        this.$message.error('上传文件格式不正确！');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.$message.error('上传文件大小不能超过 2MB!');
        return;
      }
      this.loading = true;
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'rebate/id_card_pic');
      uploadFile(form)
        .then(data => {
          this.loading = false;
          if (data.data) {
            this.add_rebates_form[type] = data.data.data.source;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-upload--picture-card {
  .el-icon-error {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 14px;
  }
  .grey-color {
    color: #cdcecf;
  }
}
// 下单时间
.OrderDate {
  margin-top: 10px;
  /deep/ .el-form-item__content {
    margin-left: 101px !important;
  }
  /deep/ .el-form-item__label {
    width: 91px !important;
    padding: 0;
  }
  /deep/ .el-input__inner {
    width: 222px;
  }
}
.addachievement-container {
  // padding: 0 20px;
  background: #f2f6f9;
  .form-block {
    position: relative;
    // padding-right: 100px;
    /deep/ .el-input__inner {
      border-radius: 10px;
      height: 32px;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
    //附件
    .fujian-list {
      display: inline-block;
      float: left;
      margin-right: 20px;
      line-height: 35px;
      i {
        color: var(--text-des-color);
      }
    }
    /deep/ .el-input-group__prepend {
      padding: 0 10px !important;
      background: none;
      border: none;
      color: var(--text-color);
    }
  }
}
.box1 {
  background: #fff !important;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box2 {
  background: #fff !important;
  margin-top: 10px;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box3 {
  background: #fff !important;
  margin-top: 10px;
  padding-top: 8px;
  border-radius: 10px;
  padding-bottom: 10px;
  // position: relative;
  padding-bottom: 60px;
}
.box4 {
  position: absolute;
  bottom: -60px;
}
/deep/ .el-radio__inner {
  width: 24px;
  height: 24px;
  background-color: #fff;
}
/deep/ .has-img {
  img {
    border-radius: 10px;
    max-width: 200px;
    max-height: 200px;
  }
  .el-upload--picture-card {
    // width: 50%;
    border: none;
    background: none;
  }
}
.line-height25 {
  line-height: 25px;
  // width: calc(100% - 68px);
  float: right;
  margin-top: 30px;
  display: inline-block;
  color: var(--text-des-color);
}
/deep/ .content-text {
  padding-left: 30px;
}
/deep/ .el-input--suffix .el-input__inner {
  padding-right: 9px;
}
/deep/ .el-form-item__error {
  right: -37px;
}
.gatherAmountStr {
  color: #ff731e;
  font-weight: 600;
  width: 400px;
}
.gatherAmountStr-bgc {
  border-radius: 10px;
  background: rgba(245, 248, 250, 1);
  margin-left: 35px;
  padding: 0 5px;
  /deep/ .el-form-item__label {
    width: 130px !important;
  }
}
/deep/ .el-upload--picture-card {
  width: 75px;
  height: 75px;
  line-height: 75px;
  background: rgba(249, 251, 252, 1);
  margin-right: 10px;
  position: relative;
  img {
    // width: 100%;
    height: 100%;
  }
}
/deep/ .el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
.rebateAmount {
  /deep/ .el-input__inner {
    border-radius: 10px 0 0 10px !important;
  }
}
</style>
