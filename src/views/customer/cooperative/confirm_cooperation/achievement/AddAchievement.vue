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
      <div class="box2">
        <sub-panel :title="'登记业绩'" :iserect="true">
          <el-form
            ref="add_achievement_from"
            :model="add_achievement_from"
            :rules="add_achievement_from_rules"
            label-width="140px"
          >
            <div class="form-block">
              <el-form-item label="收款编号:" prop="achievement_uid">
                <span>{{ add_achievement_from.achievement_uid }}</span>
              </el-form-item>
              <!-- <el-form-item label="收款时间:" prop="gather_date">
                <el-date-picker
                  size="small"
                  placeholder="请选择收款时间"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                  v-model="add_achievement_from.gather_date"
                ></el-date-picker>
              </el-form-item> -->
              <el-form-item label="收款方式:" prop="gather_way">
                <el-radio-group v-model="add_achievement_from.gather_way">
                  <el-radio v-for="item in gatherWayList" :label="item.value" :key="item.value">{{
                    item.label
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- v任务 -->
              <el-form-item label v-show="add_achievement_from.gather_way === 1" class="v-bgc">
                <el-row :gutter="20">
                  <el-col :span="11">
                    <el-input
                      placeholder="请输入"
                      v-model.trim="add_achievement_from.order_wangwang_id"
                      style="width: 100%"
                    >
                      <template #prepend>
                        <span style="color: var(--error-color); margin-right: 3px">*</span
                        >下单旺旺名:
                      </template>
                    </el-input>
                  </el-col>
                  <el-col :span="11">
                    <!--  -->
                    <el-input
                      placeholder="请输入"
                      type="number"
                      @mousewheel.native.prevent
                      v-model.number="add_achievement_from.task_id"
                      style="width: 100%; position: relative"
                      @input="taskIdIsRepeatChange"
                    >
                      <template #prepend>
                        <span class="msgname">{{ msgname }}</span>
                        <span style="color: var(--error-color); margin-right: 3px">*</span>任务Id:
                      </template>
                    </el-input>
                  </el-col>
                </el-row>
                <el-form-item label="接单时间:" prop="order_date" class="OrderDate">
                  <el-date-picker
                    size="small"
                    placeholder="请选择接单时间"
                    style="width: 100%"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    v-model="add_achievement_from.order_date"
                  ></el-date-picker>
                </el-form-item>
              </el-form-item>
              <!-- 对公银行 -->

              <el-form-item
                label="打款公司名称:"
                prop="pay_company_name"
                v-show="add_achievement_from.gather_way === 3"
                class="PayCompanyName"
              >
                <span
                  style="
                    color: var(--error-color);
                    margin-right: 3px;
                    position: absolute;
                    z-index: 2020;
                    left: -108px;
                  "
                  >*</span
                >
                <el-input
                  placeholder="请输入打款公司名称"
                  v-model.trim="add_achievement_from.pay_company_name"
                  style="width: 90%; margin-bottom: 5px"
                ></el-input>
              </el-form-item>
              <el-form-item label="收款金额(元):" prop="gather_amount">
                <el-input
                  placeholder="请输入收款金额"
                  type="number"
                  @mousewheel.native.prevent
                  v-model.number="add_achievement_from.gather_amount"
                  style="width: 100%; margin-bottom: 5px"
                ></el-input>
              </el-form-item>
              <el-form-item label="收款凭证:" prop="gather_certificate_pic">
                <div>
                  <el-upload
                    class="kol-upload"
                    action
                    :http-request="uploadPlans"
                    :show-file-list="false"
                    :accept="descriptionAccepts.join(',')"
                  >
                    <template #trigger>
                      <el-button class="big-button" size="small" type="primary" v-loading="loading"
                        >上传文件</el-button
                      >
                    </template>
                    <template #tip>
                      <span class="el-upload__tip" style="margin-left: 10px"
                        >支持扩展名：.jpg .jpeg .png</span
                      >
                    </template>
                  </el-upload>
                </div>
                <div
                  class="fujian-list clearfix"
                  v-if="add_achievement_from.gather_certificate_pic !== ''"
                >
                  <i class="iconfont iconfujian mr5"></i>
                  <span class="brand-color mr5">{{
                    add_achievement_from.gather_certificate_pic.split('/')[
                      add_achievement_from.gather_certificate_pic.split('/').length - 1
                    ] || '--'
                  }}</span>
                  <i class="el-icon-error" @click="removePlan()"></i>
                </div>
              </el-form-item>
              <el-form-item label="是否开票:" prop="is_invoice">
                <el-radio-group v-model="add_achievement_from.is_invoice">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </sub-panel>
      </div>
    </div>
  </common-dialog>
</template>

<script>
import CustomerSimpleDetail from '../../components/CustomerSimpleDetail';
import {
  getAchievementUid,
  uploadCertificate,
  saveAchievement,
  taskIdIsRepeat,
} from '@/api/cooperative';
import { gatherWayList } from '@/const/cooperative';
import { mapActions } from 'vuex';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'AddAchievement',
  components: {
    CustomerSimpleDetail,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      msgname: '',
      gatherWayList, // 收款方式
      title: '',
      page: null,
      add_achievement_from: {
        achievement_uid: '', // 业绩编号
        // gather_date: new Date()
        //   .toLocaleDateString()
        //   .replace("/", "-")
        //   .replace("/", "-"), // 收款时间
        gather_way: '', // 1-构美网（v任务），2-支付宝，3-对公银行
        gather_amount: '', // 收款金额
        order_wangwang_id: '', // 下单旺旺名
        task_id: '', // 任务Id
        gather_certificate_pic: '', // 收款凭证
        is_invoice: 0, // 是否开票
        order_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 接单时间
        pay_company_name: '', //打款公司名称
      },
      // 表单验证规则
      add_achievement_from_rules: {
        gather_amount: [{ required: true, message: '请输入收款金额', trigger: 'blur' }],
        gather_way: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
        order_date: [{ required: true, message: '请输入接单时间', trigger: 'change' }],
        // pay_company_name: [
        //   { required: true, message: "请输入打款公司名称", trigger: "input" }
        // ]
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
    // 判断任务id是否重复
    taskIdIsRepeatChange() {
      const id = {
        // Authorization:this.Authorization,
        customer_id: this.CustomerDetail.id,
        task_id: this.add_achievement_from.task_id,
        achievement_id: this.add_achievement_from.achievement_id,
      };
      taskIdIsRepeat(id).then(res => {
        if (res.data.data === true) {
          this.msgname = '该任务id已存在';
        } else {
          this.msgname = '';
        }
        // }
      });
    },
    // 显示
    show(achievement, page) {
      this.msgname = '';
      if (achievement) {
        // 修改
        this.title = '登记业绩修改';
        this.add_achievement_from = Object.assign(this.add_achievement_from, achievement);
        this.add_achievement_from = {
          ...JSON.parse(JSON.stringify(this.add_achievement_from)),
          ...achievement.gather_way_detail,
        };
        if (page) this.page = page;
      } else {
        // 新增
        this.title = '登记业绩';
        // 获取收款编号
        this.getAchievementId();
      }
      this.$refs.AddAchievementDialog.dialogOpen();
    },
    // 取消弹窗
    handledialogCancel() {
      this.$refs.add_achievement_from.resetFields();
      const add_achievement_from = {
        achievement_uid: '', // 业绩编号
        // gather_date: new Date()
        //   .toLocaleDateString()
        //   .replace("/", "-")
        //   .replace("/", "-"), // 收款时间
        gather_way: '', // 1-构美网（v任务），2-支付宝，3-对公银行
        gather_amount: '', // 收款金额
        order_wangwang_id: '', // 下单旺旺名
        task_id: '', // 任务Id
        gather_certificate_pic: '', // 收款凭证
        is_invoice: 0, // 是否开票
        order_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 接单时间
        pay_company_name: '', //打款公司名称
      };
      this.add_achievement_from = add_achievement_from;
    },
    // 弹窗确定操作
    handledialogSubmit() {
      this.$refs.add_achievement_from.validate(pass => {
        if (pass) {
          let add_achievement_from = JSON.parse(JSON.stringify(this.add_achievement_from));
          add_achievement_from = {
            ...add_achievement_from,
            ...{ cooperation_id: this.CooperationDetail.cooperation_id },
          };
          if (add_achievement_from.gather_way === 1) {
            // v任务
            if (add_achievement_from.order_wangwang_id === '') {
              this.$message.error('下单旺旺名不能为空！');
              return;
            }
            if (add_achievement_from.task_id === '') {
              this.$message.error('任务Id不能为空！');
              return;
            }
          }
          if (add_achievement_from.gather_way === 3) {
            // v任务
            if (add_achievement_from.pay_company_name === '') {
              this.$message.error('请输入打款公司名称');
              return;
            }
          }
          saveAchievement(add_achievement_from)
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
                // 更新返点更新列表
                this.GetRebatesList({
                  cooperation_id: this.CooperationDetail.cooperation_id,
                  num: 10,
                  page_num: 1,
                });
                if (this.page === null) {
                  // 新增
                  // 更新业绩列表
                  this.GetAchievementList({
                    cooperation_id: this.CooperationDetail.cooperation_id,
                    num: 10,
                    page_num: 1,
                  });
                } else {
                  // 修改
                  // 更新业绩列表
                  this.GetAchievementList({
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
    // 获取收款编号
    getAchievementId() {
      getAchievementUid().then(res => {
        if (res && res.data && res.data.data) {
          this.add_achievement_from.achievement_uid = res.data.data;
        }
      });
    },
    /**
     * 上传文件成功时回调
     */
    uploadPlans(params) {
      const file = params.file;
      const fileType = file.name.split('.')[file.name.split('.').length - 1];
      const found = this.descriptionAccepts.find(type => {
        return type.toLowerCase() === fileType.toLowerCase();
      });
      if (!found) {
        this.$message.error('上传格式不正确！');
        return;
      }
      // if (file.size > 2 * 1024 * 1024) {
      //   this.$message.error('上传图片需小于2M')
      //   return
      // }
      this.loading = true;
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'certificate/achievement_gather_certificate');
      uploadCertificate(form)
        .then(data => {
          this.loading = false;
          if (data.data) {
            this.add_achievement_from.gather_certificate_pic = data.data.data.source;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 删除凭证
     * @param
     */
    removePlan() {
      this.add_achievement_from.gather_certificate_pic = '';
    },
  },
};
</script>

<style lang="scss" scoped>
// 打款公司名称
.PayCompanyName {
  background: #f6f6f6;
  border-radius: 10px;
  padding: 15px 0px;
  margin-left: 140px;
  /deep/ .el-form-item__error {
    right: 60px;
  }
}
// v任务背景
.v-bgc {
  /deep/ .el-row {
    padding-top: 15px;
  }
  /deep/ .el-form-item__content {
    background: #f6f6f6;
    border-radius: 10px;
  }
}
// 接单时间
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
    padding-right: 100px;
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
/deep/ .el-radio__inner {
  width: 24px;
  height: 24px;
  background-color: #fff;
}
.msgname {
  color: #f26467;
  position: absolute;
  top: 10px;
  right: 10px;
  top: 32px;
  right: -250px;
  font-size: 12px;
  z-index: 2020;
}
</style>
