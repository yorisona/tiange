<template>
  <el-dialog
    :visible="visible"
    ref="ExecuteProjectDialog"
    class="customer-dialog"
    width="800px"
    @close="onClose"
    :isfooter="true"
  >
    <template #title> <span>执行项目</span> </template>
    <div class="executeproject-container">
      <div class="box1">
        <CustomerStageProgress :isvertical="false" :stage="3" :issimple="true" />
      </div>
      <div class="box2">
        <p class="title">
          <span class="dian">*</span>
          <span class="info">指定执行AE</span>
          <span class="subinfo">（最少指定一位AE）</span>
        </p>
        <div class="tablelist">
          <el-table
            stripe
            :data="cooperationaes"
            border
            style="width: 100%; margin-top: 12px"
            :header-cell-style="{
              background: 'var(--table-thead-th-bg-color)',
              height: '42px',
              color: 'var(--text-second-color)',
              fontWeight: '600',
            }"
          >
            <el-table-column label="AE名称" width="250">
              <template #default="{ row }">
                <el-tooltip placement="top" effect="light" v-if="!row.is_allow_modify">
                  <template #content>
                    <div>
                      <i
                        class="iconfont iconjinggao"
                        style="font-size: 15px !important; color: rgba(242, 100, 103, 1)"
                      ></i>
                      <span style="color: rgba(242, 100, 103, 1); font-size: 12px"
                        >该ae已跟单，不允许修改</span
                      >
                    </div>
                  </template>
                  <el-input v-model="row.ae_name" :disabled="true" style="width: 97%"></el-input>
                </el-tooltip>
                <el-select
                  v-else
                  v-model="row.ae_id"
                  :placeholder="row.is_allow_modify ? '请选择' : row.ae_name"
                  :disabled="!row.is_allow_modify"
                >
                  <el-option
                    v-for="item in aes"
                    :key="item.ae_id"
                    :label="item.ae_name"
                    style="width: 100%"
                    :value="item.ae_id"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="预计跟单金额（元）">
              <template #default="{ row }">
                <el-input
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  @mousewheel.native.prevent
                  v-model="row.expect_amount"
                  placeholder="请输入"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="60">
              <template #default="{ row }">
                <span v-if="cooperationaes.length !== 1" v-show="row.is_allow_modify">
                  <i
                    class="el-icon-delete icon-del"
                    style="font-size: 20px; color: var(--text-des-color) !important"
                    @click="delAE(row)"
                  ></i>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="aes.length > 0" class="border-dashed" @click="addAE">
            <i class="el-icon-circle-plus"></i>点击添加
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <tg-button @click="onClose">取消</tg-button>
      <tg-button type="primary" @click="handledialogSubmit">确定</tg-button>
    </template>
  </el-dialog>
</template>

<script>
import CustomerStageProgress from '../components/CustomerStageProgress';
import { mapGetters, mapActions } from 'vuex';
import { queryUserNamesByRoles } from '@/api/customer';
import { RIGHT_CODE } from '@/const/roleCode';
import { saveAE } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  components: {
    CustomerStageProgress,
  },
  name: 'ExecuteProject',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [CooperativeStore],
  data() {
    return {
      RIGHT_CODE,
      aes: [],
      cooperationaes: [],
    };
  },
  computed: {
    ...mapGetters({
      CooperationAE: 'cooperative/CooperationAE',
    }),
  },
  watch: {
    CooperationAE: {
      handler: function (val) {
        const caes = JSON.parse(JSON.stringify(val));
        if (caes.length > 0) {
          this.cooperationaes = caes.map(c => ({
            ...c,
            id: Math.ceil(Math.random() * 10000),
          }));
        } else {
          this.cooperationaes = [];
        }
        this.getAEs(caes);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      GetCooperationAE: 'cooperative/GetCooperationAE',
    }),
    // 显示
    show(_type) {
      // this.$refs.ExecuteProjectDialog.dialogOpen();
      this.GetCooperationAE({
        cooperation_id: this.CooperationDetail.cooperation_id,
      });
    },
    // 获取客户经理
    getAEs(caes) {
      // 客户执行组长 客户执行
      queryUserNamesByRoles({ roles: '1007' }).then(res => {
        if (res.data.data) {
          const aes = res.data.data.map(c => ({ id: c.id, name: c.username }));
          if (aes.length <= 0) {
            this.aes = [];
            this.$message.error('暂无执行AE人员，请先添加执行AE人员');
          } else {
            this.rebindAES(aes, caes);
          }
        }
      });
    },
    // 重新绑定AE
    rebindAES(aes, caes) {
      const _temp = [];
      aes.map(a => {
        const _index = caes.findIndex(c => c.ae_id === a.id && !c.is_allow_modify);
        if (_index < 0) {
          _temp.push({
            ae_id: a.id,
            ae_name: a.name,
          });
        }
      });
      this.aes = _temp;
      if (this.cooperationaes.length === 0) {
        this.addAE();
      }
    },
    // 弹窗提交操作
    handledialogSubmit() {
      if (this.cooperationaes.length > 0) {
        const cooperationaes = JSON.parse(JSON.stringify(this.cooperationaes));
        const ae_infos = cooperationaes.map(a => ({
          ae_id: a.ae_id,
          expect_amount: a.expect_amount,
        }));
        saveAE({
          cooperation_id: this.CooperationDetail.cooperation_id,
          ae_infos,
        })
          .then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              // 更新合作详情
              this.GetCooperationDetail({
                customer_id: this.CustomerDetail.id,
                cooperation_id: this.CooperationDetail.cooperation_id,
              });
              // 更新合作详情状态
              this.SetCooperationdetailStatus(3);
              // 更新执行AE记录
              this.GetCooperationAE({
                cooperation_id: this.CooperationDetail.cooperation_id,
              });
              this.onClose();
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.$message.error('请先添加执行AE人员');
      }
    },
    // 添加AE
    addAE() {
      this.cooperationaes.push({
        id: Math.ceil(Math.random() * 10000),
        ae_id: '',
        ae_name: '',
        expect_amount: '',
        is_allow_modify: true,
      });
    },
    // 删除AE
    delAE(row) {
      const _index = this.cooperationaes.findIndex(c => c.id === row.id);
      this.cooperationaes.splice(_index, 1);
    },
    onClose() {
      this.$emit('dialog:close');
    },
  },
};
</script>

<style lang="less" scoped>
.executeproject-container {
  .form-block {
    padding-right: 100px;
    /deep/ .el-input__inner {
      border-radius: 2px;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
  }
  .title {
    padding: 15px 50px;
    .dian {
      color: #f26467;
    }
    .info {
      color: var(--text-color);
    }
    .subinfo {
      color: var(--text-des-color);
    }
  }
  .tablelist {
    padding: 0 50px 0px 50px;
    border-radius: 10px;
    .border-dashed {
      border: 1px dashed #d1d5e3;
      text-align: center;
      cursor: pointer;
      line-height: 39px;
      margin-top: 18px;
      color: #396fff;
      border-radius: 10px;
      i {
        color: #396fff;
        margin-right: 10px;
      }
    }
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
/deep/ .el-table th > .cell {
  font-size: 14px;
}
element.style {
  background: #f6f6f6;
  height: 42px;
  color: var(--text-second-color);
  font-weight: 600;
}
/deep/.el-table--border::after,
.el-table--group::after,
.el-table::before {
  z-index: -111;
}
/deep/ .el-table {
  border-radius: 10px;
}
/deep/ .common-dialog .el-dialog__footer {
  padding-top: 25px;
  padding-bottom: 15px;
}
</style>
