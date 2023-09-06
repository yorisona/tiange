<template>
  <el-dialog
    class="customer-dialog tg-dialog-vcenter"
    :visible.sync="visible"
    ref="AddCooperationDialog"
    :isDestroyOnClose="true"
    width="810px"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
    :isfooter="true"
  >
    <template #title>
      <span>{{ title }}</span>
    </template>
    <tg-block>
      <CustomerStageProgress :isvertical="false" :stage="1" :issimple="true" />
    </tg-block>
    <tg-block class="addcooperation-container mgt-10">
      <el-form
        ref="add_cooperation_form"
        :model="add_cooperation_form"
        :rules="add_cooperation_form_rules"
        label-width="120px"
      >
        <div class="form-block">
          <el-form-item label="客户经理：" prop="manager_id">
            <el-select
              v-model="add_cooperation_form.manager_id"
              placeholder="请选择客户经理"
              style="width: 110%; margin-bottom: 5px"
            >
              <el-option
                v-for="item in managers"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="合作类型：" prop="cooperation_type" style="width: 108%">
            <span v-if="checked">
              <check-all
                ref="cooperationTypeCheckall"
                :dataitems="cooperationTypeList"
                value="value"
                label="label"
                :selectitems="add_cooperation_form.cooperation_type"
                @check-all-click="cooperationTypeCheckAll"
                @check-click="cooperationTypeCheck"
              />
            </span>
            <span v-else>---</span>
          </el-form-item>
          <el-form-item label="预 算：" prop="budget">
            <el-input
              placeholder="请输入预算"
              type="number"
              @mousewheel.native.prevent
              v-model.number="add_cooperation_form.budget"
              style="width: 110%"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="PV要求：" prop="pv" style="float: left; width: 205px">
              <el-input
                placeholder="请输入"
                type="number"
                @mousewheel.native.prevent
                v-model.number="add_cooperation_form.pv"
                style="width: 145px"
              >
                <template #append>个</template>
              </el-input>
            </el-form-item>
            <el-form-item
              label="UV要求:"
              prop="uv"
              style="float: left; width: 210px; margin-left: 14px"
            >
              <el-input
                placeholder="请输入"
                type="number"
                @mousewheel.native.prevent
                v-model.number="add_cooperation_form.uv"
                style="width: 150px"
              >
                <template #append>个</template>
              </el-input>
            </el-form-item>
            <el-form-item label="GMV要求：" prop="pv" style="float: left; margin-left: 27px">
              <el-input
                placeholder="请输入"
                type="number"
                @mousewheel.native.prevent
                v-model.number="add_cooperation_form.gmv"
                style="width: 150px"
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="其他要求：" prop="note">
            <el-input
              type="textarea"
              :rows="4"
              :maxlength="200"
              placeholder="请输入需求描述"
              style="width: 110%"
              v-model="add_cooperation_form.note"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="方 案：" prop="plan">
            <div>
              <el-upload
                class="kol-upload"
                action=""
                :http-request="uploadPlans"
                :show-file-list="false"
                :accept="descriptionAccepts.join(',')"
              >
                <template #trigger>
                  <el-button
                    class="mr10 big-button btn-blue"
                    size="small"
                    type="primary"
                    v-loading="loading"
                    >上传文件</el-button
                  >
                </template>
                <template #tip>
                  <span class="el-upload__tip">
                    支持扩展名：.docx .pdf .jpg .xlsx .xls（最多上传2个文件）
                  </span>
                </template>
              </el-upload>
            </div>
            <div class="fujian-list clearfix" v-for="item in add_cooperation_form.plan" :key="item">
              <i class="iconfont iconfujian mr5"></i>
              <span class="brand-color mr5">{{
                decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
              }}</span>
              <i class="el-icon-error" @click="removePlan()"></i>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </tg-block>
    <template #footer>
      <tg-button @click="handledialogCancel">取消</tg-button>
      <tg-button type="primary" @click="handledialogSubmit">保存</tg-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import { cooperationTypeList } from '@/const/cooperative';
import CustomerStageProgress from '../components/CustomerStageProgress';
import { queryUserNamesByRoles } from '@/api/customer';
import { uploadFile, saveCooperation } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'AddCooperation',
  components: {
    CustomerStageProgress,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      visible: false,
      isAddingEditing: false,
      title: '',
      cooperationTypeList,
      add_cooperation_form: {
        customer_id: 0, // 客户ID
        cooperation_id: 0, // 合作ID
        manager_id: '', // 客户经理
        cooperation_type: [], // 合作类型，1-直播，2-视频，3-图文
        budget: '', // 预算
        pv: '',
        uv: '',
        gmv: '',
        note: '', // 其他要求
        plan: [], // 方案
      },
      // 验证规则
      add_cooperation_form_rules: {
        manager_id: [{ required: true, message: '请选择客户经理', trigger: 'change' }],
        cooperation_type: [
          { type: 'array', required: true, message: '请至少选择一个合作类型', trigger: 'blur' },
        ],
      },
      managers: [],
      descriptionAccepts: ['docx', 'pdf', 'jpg', 'xlsx', 'xls'],
      loading: false,
      checked: false,
    };
  },
  created() {
    /* do nth */
  },
  methods: {
    ...mapActions({
      GetCooperation: 'cooperative/GetCooperation',
    }),
    // 合作类型全选/反选
    cooperationTypeCheckAll(val) {
      if (val) {
        this.add_cooperation_form.cooperation_type = JSON.parse(
          JSON.stringify(this.cooperationTypeList),
        ).map(cc => cc.value);
      } else {
        this.add_cooperation_form.cooperation_type = [];
      }
    },
    // 选择合作类型
    cooperationTypeCheck(val) {
      this.isAddingEditing = false;
      this.add_cooperation_form.cooperation_type = val;
    },
    // 获取客户经理
    getManagers() {
      this.isAddingEditing = false;
      // 客户经理，大客户经理
      queryUserNamesByRoles({ roles: '1008' }).then(res => {
        if (res.data.data) {
          this.managers = res.data.data.map(cc => ({ id: cc.id, name: cc.username }));
        }
      });
    },
    // 显示
    show(cooperation) {
      if (cooperation) {
        // 修改
        this.title = '修改合作';
        this.add_cooperation_form = Object.assign(this.add_cooperation_form, cooperation);
        this.add_cooperation_form.cooperation_type = cooperation.cooperation_type
          .split(',')
          .map(cc => parseInt(cc, 10));
      } else {
        // 新增
        this.title = '新增合作';
        // const _this = this;
        setTimeout(() => {
          this.$refs.cooperationTypeCheckall.init();
        }, 30);
      }
      this.getManagers();
      // this.$refs.AddCooperationDialog.dialogOpen();
      this.visible = true;
      this.checked = true;
    },
    // 弹窗取消操作
    handledialogCancel() {
      this.add_cooperation_form.cooperation_type = [];
      this.$refs.add_cooperation_form.resetFields();
      this.visible = false;
      this.checked = false;
    },
    resetForm() {
      this.add_cooperation_form.cooperation_type = [];
      this.add_cooperation_form.gmv = '';
      this.$refs.add_cooperation_form.resetFields();
    },
    // 弹窗确定操作
    handledialogSubmit() {
      this.$refs.add_cooperation_form.validate(pass => {
        this.isAddingEditing = true;
        if (pass) {
          let add_cooperation_form = JSON.parse(JSON.stringify(this.add_cooperation_form));

          if (add_cooperation_form.cooperation_id === 0) {
            delete add_cooperation_form.cooperation_id;
          }
          add_cooperation_form = {
            ...add_cooperation_form,
            ...{ customer_id: this.CustomerDetail.id },
          };
          saveCooperation(add_cooperation_form)
            .then(res => {
              if (res.data.success) {
                this.$message.success(res.data.message);
                if (!add_cooperation_form?.cooperation_id) {
                  // 新增
                  // 添加合作
                  this.GetCooperation({
                    customer_id: this.CustomerDetail.id,
                    num: 10,
                    page_num: 1,
                  });

                  this.checked = false;
                } else {
                  // 修改
                  // 更新客户信息
                  this.GetCustomerDetail(this.CustomerDetail.id);
                  // 更新合作
                  this.GetCooperationDetail({
                    customer_id: this.CustomerDetail.id,
                    cooperation_id: add_cooperation_form.cooperation_id,
                  });
                  this.checked = false;
                }
                // this.$refs.AddCooperationDialog.dialogClose();
                this.visible = false;

                this.resetForm();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              console.error(err);
            });
        }
      });
    },
    /**
     * 上传文件成功时回调
     */
    uploadPlans(params) {
      // const this = this;
      const file = params.file;
      const fileType = file.name.split('.')[file.name.split('.').length - 1];
      const found = this.descriptionAccepts.find(type => {
        return type.toLowerCase() === fileType.toLowerCase();
      });
      if (!found) {
        this.$message.error('上传格式不正确！');
        return;
      }
      if (this.add_cooperation_form.plan.length === 2) {
        this.$message.error('最多上传2个文件！');
        return;
      }
      this.loading = true;
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'plan');
      uploadFile(form)
        .then(data => {
          this.loading = false;
          if (data.data) {
            this.add_cooperation_form.plan.push(data.data.data.source);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 删除方案
     * @param index
     */
    removePlan(index) {
      this.add_cooperation_form.plan.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.addcooperation-container {
  .csp-container {
    padding: 12px 65px;
    margin-bottom: 10px;
  }
  .form-block {
    padding-right: 100px;
    padding-bottom: 10px;
    /deep/ .el-input__inner {
      // border-top-left-radius: 10px;
      height: 32px;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  .line {
    border: 1px solid #fff;
  }
  //附件
  .fujian-list {
    display: inline-block;
    margin-right: 20px;
    line-height: 35px;
    i {
      color: var(--text-des-color);
    }
  }
}

/deep/ .el-checkbox__label {
  // line-height: 45px;
}
//选择框边距
/deep/ .checkall-container .sale-chance-wrap[data-v-d1e6b7e6] {
  padding: 5px 30px;
}
// 选择框字体颜色
/deep/ .el-checkbox {
  // color: #666;
}
.el-upload__tip {
  color: var(--icon-color);
}
/deep/ .el-dialog__header .sub {
  float: left;
  margin-left: 0 !important;
}
/deep/ .csp-container .horizontal-container[data-v-2348385f] .el-steps .el-step__line {
  top: 18px;
}
/deep/ .common-dialog .el-dialog__footer {
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>
