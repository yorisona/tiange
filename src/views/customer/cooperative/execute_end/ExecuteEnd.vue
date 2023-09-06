<template>
  <el-dialog
    :visible="visible"
    ref="ExecuteEndDialog"
    class="customer-dialog"
    width="800px"
    @close="handledialogCancel"
    :isfooter="true"
  >
    <template #title> <span>执行结束</span> </template>
    <div class="executeend-container">
      <div class="box1">
        <CustomerStageProgress :isvertical="false" :stage="4" :issimple="true" />
      </div>
      <div class="box2">
        <div class="end-form">
          <el-form
            ref="executeend_form"
            :model="executeend_form"
            :rules="executeend_form_rules"
            label-width="120px"
          >
            <el-form-item label="项目执行结果:" prop="end_type" class="color-3">
              <el-radio class="color-6" v-model="executeend_form.end_type" :label="1"
                >项目正常结束</el-radio
              >
              <el-radio v-model="executeend_form.end_type" :label="2">项目意外终止</el-radio>
            </el-form-item>
            <el-form-item
              prop="unexpected_terminate_type"
              label-width="15px"
              v-if="executeend_form.end_type === 2"
            >
              <div style="background: #f6f6f6; border-radius: 10px; padding: 18px">
                <el-radio-group
                  v-model="executeend_form.unexpected_terminate_type"
                  @change="changeHandle"
                >
                  <el-radio :label="'1'" class="color-3">补播</el-radio>
                  <el-radio :label="'2'" class="color-3">退款</el-radio>
                  <el-radio :label="'3'" class="color-3">其他</el-radio>
                </el-radio-group>
                <el-form-item
                  v-if="executeend_form.unexpected_terminate_type === '3'"
                  label=" "
                  prop="unexpected_terminate_detail"
                  style="margin-left: -110px"
                >
                  <el-input
                    size="small"
                    placeholder="请输入（不超过 50字）"
                    v-model.number="executeend_form.unexpected_terminate_detail"
                    style="width: 345px"
                  >
                  </el-input>
                </el-form-item>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <template #footer>
      <tg-button @click="handledialogCancel">取消</tg-button>
      <tg-button type="primary" @click="handledialogSubmit">确定</tg-button>
    </template>
  </el-dialog>
</template>

<script>
import CustomerStageProgress from '../components/CustomerStageProgress';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { StopCooperation } from '@/api/cooperative';

export default {
  name: 'ExecuteEnd',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CustomerStageProgress,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      isedite: false,
      executeend_form: {
        end_type: '', // 项目执行结果 1-正常结束，2-意外终止
        unexpected_terminate_type: '', // 意外终止后续类型，1-补播，2-退款，3-其他
        unexpected_terminate_detail: '',
      },
      executeend_form_rules: {
        end_type: [
          // 结束类型
          { required: true, message: '请选择项目执行结果', trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    // 显示
    show(type) {
      if (type) {
        this.isedite = true;
        this.executeend_form = {
          end_type: this.CooperationDetail.end_type,
          unexpected_terminate_type: this.CooperationDetail.end_detail
            ? this.CooperationDetail.end_detail.unexpected_terminate_type
            : '',
          unexpected_terminate_detail: this.CooperationDetail.end_detail
            ? this.CooperationDetail.end_detail.unexpected_terminate_detail
            : '',
        };
      }
    },
    // 取消窗口
    handledialogCancel() {
      this.$refs.executeend_form.resetFields();
      // this.$refs.ExecuteEndDialog.dialogClose();
      this.onClose();
    },
    // 窗口提交按钮
    handledialogSubmit() {
      this.$refs.executeend_form.validate(pass => {
        if (pass) {
          StopCooperation({
            cooperation_id: this.CooperationDetail.cooperation_id,
            ...JSON.parse(JSON.stringify(this.executeend_form)),
            is_update: this.isedite ? 1 : 0,
          }).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              // 更新合作详情
              this.GetCooperationDetail({
                customer_id: this.CustomerDetail.id,
                cooperation_id: this.CooperationDetail.cooperation_id,
              });
              // 更新合作详情状态
              this.SetCooperationdetailStatus(4);
              this.onClose();
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    // 选择
    changeHandle() {
      this.executeend_form.executeend_form = '';
    },
    onClose() {
      this.$emit('dialog:close');
    },
  },
};
</script>

<style lang="less" scoped>
.executeend-container {
  .line {
    border: 1px solid #f5f5f5;
  }
  .end-form {
    padding: 15px 50px 0px 50px;
  }
  .form-block {
    padding-right: 100px;
    /deep/ .el-input__inner {
      border-radius: 2px;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  /deep/ .el-form-item__error {
    text-align: left;
  }
}
/deep/ .el-dialog__body {
  background: #f2f6f9 !important;
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
  padding-bottom: 90px;
}
/deep/ .el-radio__input.is-checked + .el-radio__label {
  color: var(--text-color);
}
/deep/ .el-radio {
  color: #666666;
}
/deep/ .el-radio__inner {
  border-radius: 100%;
  width: 24px;
  height: 24px;
  background-color: #fff;
  cursor: pointer;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.color-3 {
  color: var(--text-color);
}
/deep/ .el-form-item .el-form-item {
  display: inline-block;
  margin-right: 20px;
}
/deep/ .el-form-item__label {
  color: var(--text-des-color);
}
.color-3 {
  /deep/ .el-form-item__label {
    color: var(--text-color);
  }
}
</style>
