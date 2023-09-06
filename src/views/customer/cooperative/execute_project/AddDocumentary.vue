<template>
  <common-dialog
    ref="AddDocumentaryDialog"
    :isAppendToBody="true"
    :title="title"
    :width="990"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
    :isfooter="true"
  >
    <div class="adddocumentary-container">
      <div class="box1">
        <sub-panel :title="'客户信息'" :iserect="true">
          <CustomerSimpleDetail />
        </sub-panel>
      </div>
      <div class="box2">
        <sub-panel
          :title="
            CurrentAE !== null && CurrentAE.ae_name !== undefined
              ? `跟单 AE：${CurrentAE.ae_name}`
              : ''
          "
          :iserect="true"
        >
          <div class="documentary-form">
            <el-card
              class="box-card"
              shadow="hover"
              v-for="(item, index) in documentary_info_list"
              :key="item.id"
              style="margin-top: 15px"
            >
              <template #header>
                <div class="clearfix">
                  <span class="title">请填写</span>
                  <i
                    v-if="!isedite && documentary_info_list.length !== 1"
                    class="iconfont icon-shanchu"
                    @click="deleteForm(item.id)"
                  ></i>
                </div>
              </template>
              <el-form
                :model="item"
                :ref="`add_documentary_form${item.id}`"
                :rules="add_documentary_form_rules"
                label-width="105px"
                size="small"
              >
                <el-form-item label="跟单平台:" prop="kol_id">
                  <el-radio>淘宝</el-radio>
                </el-form-item>
                <el-form-item label="KOL名称:" prop="kol_id">
                  <el-select
                    size="small"
                    v-model="item.kol_id"
                    style="width: 100%; margin-top: 3px; margin-bottom: 3px"
                    filterable
                    placeholder="请搜索选择KOL"
                  >
                    <el-option
                      v-for="item in kolinfos"
                      :key="item.kol_id"
                      :label="item.kol_name"
                      :value="item.kol_id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="报价金额:" prop="price_amount">
                  <el-input
                    size="small"
                    placeholder="请输入报价金额"
                    type="number"
                    v-model.number="item.price_amount"
                    style="width: 100%; margin-top: 5px"
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>

                <el-form-item label="成本金额:" prop="cost_amount">
                  <el-input
                    size="small"
                    placeholder="请输入成本金额"
                    type="number"
                    v-model.number="item.cost_amount"
                    style="width: 100%; margin-top: 5px"
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="成本是否安排:" prop="is_cost_arrange">
                  <el-radio v-model="item.is_cost_arrange" :label="1">是</el-radio>
                  <el-radio v-model="item.is_cost_arrange" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="直播日期:" prop="live_date">
                  <el-date-picker
                    size="small"
                    placeholder="请选择直播日期"
                    style="width: 100%"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    v-model="item.live_date"
                  >
                  </el-date-picker>
                </el-form-item>
                <!--<el-form-item label="商品名称:" prop="item_name">-->
                <!--<el-input size="small" placeholder="请输入商品名称" v-model.trim="item.item_name" style="width: 100%;">-->
                <!--</el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="商品链接:" prop="item_url">-->
                <!--<el-input size="small" placeholder="请输入商品链接" v-model.trim="item.item_url" style="width: 100%;">-->
                <!--</el-input>-->
                <!--</el-form-item>-->

                <span style="float: left; margin-left: 32px; color: #606266">商品名称:</span>
                <el-row
                  style="
                    margin-left: 104px;
                    background: #f6f6f6;
                    border-radius: 2px;
                    margin-bottom: 10px;
                    padding-top: 18px;
                    padding-right: 18px;
                    margin-top: 12px;
                  "
                >
                  <span
                    v-for="(sub, i) in item.item_list"
                    :key="i"
                    style="float: left"
                    class="text-c"
                  >
                    <el-col :span="8">
                      <el-form-item
                        label="商品名称:"
                        :hide-required-asterisk="true"
                        :prop="'item_list.' + i + '.item_name'"
                        :rules="{
                          required: true,
                          message: '商品名称不能为空',
                          trigger: 'blur',
                        }"
                      >
                        <el-input
                          size="small"
                          placeholder="请输入商品名称"
                          v-model.trim="sub.item_name"
                          style="width: 100%"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item
                        label="商品链接:"
                        :hide-required-asterisk="true"
                        :prop="'item_list.' + i + '.item_url'"
                        :rules="{
                          required: true,
                          message: '商品链接不能为空',
                          trigger: 'blur',
                        }"
                      >
                        <el-input
                          size="small"
                          placeholder="请输入商品链接"
                          v-model.trim="sub.item_url"
                          style="width: 100%"
                        >
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7">
                      <el-form-item :rules="{ required: true }" label="样品是否安排:">
                        <el-radio v-model="sub.is_sample_arrange" :label="1">是</el-radio>
                        <el-radio v-model="sub.is_sample_arrange" :label="0">否</el-radio>
                      </el-form-item>
                    </el-col>
                    <el-col :span="1">
                      <i
                        v-if="documentary_info_list[index].item_list.length !== 1"
                        style="line-height: 25px"
                        class="el-icon-delete icon-del"
                        @click="deleteUrlItem(index, i)"
                      ></i>
                    </el-col>
                  </span>
                  <el-col :span="20">
                    <el-button class="addLinkBtn" icon="el-icon-circle-plus" @click="addUrl(index)"
                      >点击添加</el-button
                    >
                  </el-col>
                </el-row>

                <el-form-item label="备 注:" prop="note">
                  <el-input
                    type="textarea"
                    :rows="2"
                    :maxlength="50"
                    placeholder="请输入备注"
                    style="width: 100%"
                    v-model="item.note"
                  >
                  </el-input>
                </el-form-item>
              </el-form>
            </el-card>
            <div v-if="!isedite" class="border-dashed" @click="addForm">
              <i class="el-icon-circle-plus"></i>新增表单
            </div>
          </div>
        </sub-panel>
      </div>
    </div>
  </common-dialog>
</template>

<script>
import CustomerSimpleDetail from '../components/CustomerSimpleDetail';
import { mapGetters, mapActions } from 'vuex';
import { queryAllKolNames } from '@/api/medium';
import { addDocumentaryList, updateDocumentary } from '@/api/cooperative';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default {
  name: 'AddDocumentary',
  components: {
    CustomerSimpleDetail,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      page: null,
      isedite: false,
      title: '',
      documentary_info_list: [],
      add_documentary_form: {
        kol_id: '', // kol
        price_amount: '', // 报价金额
        cost_amount: '', // 成本金额
        is_cost_arrange: 0, // 成本是否安排
        // item_name: '', // 商品名称
        // item_url: '', // 商品链接
        item_list: [
          {
            item_name: '',
            item_url: '',
            is_sample_arrange: 0,
          },
        ],
        live_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 直播日期
        // is_sample_arrange: 0, // 样品是否安排
        note: '', // 备注
      },
      add_documentary_form_rules: {
        kol_id: [
          // kol名称
          { required: true, message: '请选择KOL', trigger: 'change' },
        ],
        price_amount: [
          // 报价金额
          { required: true, message: '请输入报价金额', trigger: 'blur' },
        ],
      },
      kolinfos: [],
    };
  },
  computed: {
    ...mapGetters({
      CurrentAE: 'cooperative/CurrentAE',
    }),
  },
  methods: {
    ...mapActions({
      GetCurrentAERecordList: 'cooperative/GetCurrentAERecordList',
      GetCurrentAE: 'cooperative/GetCurrentAE',
    }),
    // 新增商品
    addUrl(index) {
      this.documentary_info_list[index].item_list.push({
        item_name: '',
        item_url: '',
        is_sample_arrange: 0,
      });
    },
    // 删除商品
    deleteUrlItem(index, index2) {
      if (this.documentary_info_list[index].item_list.length === 1) {
        this.$message.warning('链接至少有一个');
        return false;
      }
      this.documentary_info_list[index].item_list.splice(index2, 1);
    },
    // 显示
    show(documentary, page) {
      if (documentary) {
        this.title = '修改登记跟单';
        if (page) this.page = page;
        this.isedite = true;
        const _add_documentary_form = {
          documentary_id: documentary.documentary_id,
          kol_id: documentary.kol_id, // kol
          price_amount: documentary.price_amount, // 报价金额
          cost_amount: documentary.cost_amount, // 成本金额
          is_cost_arrange: documentary.is_cost_arrange, // 成本是否安排
          // item_name: documentary.item_name, // 商品名称
          // item_url: documentary.item_url, // 商品链接
          item_list: documentary.item_list, // 商品链接列表
          live_date: documentary.live_date, // 直播日期
          // is_sample_arrange: documentary.is_sample_arrange, // 样品是否安排
          note: documentary.note, // 备注
        };
        this.documentary_info_list.push({
          ..._add_documentary_form,
          ...{
            id: Math.ceil(Math.random() * 10000),
            cooperation_id: this.CooperationDetail.cooperation_id,
            ae_id: this.CurrentAE !== null ? this.CurrentAE.ae_id : 0,
          },
        });
      } else {
        this.title = '新增登记跟单';
        this.addForm();
      }
      this.getAllKolName();
      this.$refs.AddDocumentaryDialog.dialogOpen();
    },
    // 获取所有kol
    getAllKolName() {
      const params = { platform: 'tb' };
      queryAllKolNames(params).then(res => {
        this.kolinfos = res.data.data;
      });
    },
    // 添加表单
    addForm() {
      const _add_documentary_form = JSON.parse(JSON.stringify(this.add_documentary_form));
      this.documentary_info_list.push({
        ..._add_documentary_form,
        ...{
          id: Math.ceil(Math.random() * 10000),
          cooperation_id: this.CooperationDetail.cooperation_id,
          ae_id: this.CurrentAE !== null ? this.CurrentAE.ae_id : 0,
        },
      });
    },
    // 删除表单
    async deleteForm(id) {
      const _documentary_info_list = JSON.parse(JSON.stringify(this.documentary_info_list));
      if (_documentary_info_list.length <= 1) {
        this.$message.error('表单至少有一个');
      } else {
        const msg = '确定删除该表单？';
        const result = await AsyncConfirm({ root: this }, msg);

        if (result) {
          const _currindex = _documentary_info_list.findIndex(el => el.id === id);
          if (_currindex > -1) {
            this.documentary_info_list.splice(_currindex, 1);
          }
        }
      }
    },
    // 提交验证表单
    submitForm(formName) {
      return new Promise(resolve => {
        this.$refs[formName][0].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },
    // 取消弹窗
    handledialogCancel() {
      this.documentary_info_list = [];
    },
    // 弹窗确认
    handledialogSubmit() {
      const _documentary_info_list = JSON.parse(JSON.stringify(this.documentary_info_list));
      const _results = [];
      _documentary_info_list.map(async el => {
        const _result = await this.submitForm(`add_documentary_form${el.id}`);
        if (_result) {
          _results.push(_result);
        }
        if (_results.length === _documentary_info_list.length) {
          this.submitHandle(_documentary_info_list);
        }
      });
    },
    submitHandle(documentary_info_list) {
      if (this.isedite) {
        // 编辑
        updateDocumentary(documentary_info_list[0]).then(res => {
          if (res.data.success) {
            this.$message.success(res.data.message);
            // 更新合作详情
            this.GetCooperationDetail({
              customer_id: this.CustomerDetail.id,
              cooperation_id: this.CooperationDetail.cooperation_id,
            });
            // 更新跟单列表
            this.GetCurrentAERecordList({
              cooperation_id: this.CooperationDetail.cooperation_id,
              ae_id: this.CurrentAE.ae_id,
              num: this.page.pageSize,
              page_num: this.page.currentPage,
            });
            // 更新当前跟单AE
            this.GetCurrentAE({
              ae_id: this.CurrentAE.ae_id,
            });
            this.$refs.AddDocumentaryDialog.dialogClose();
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        // 新增
        addDocumentaryList(documentary_info_list)
          .then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              // 更新合作详情
              this.GetCooperationDetail({
                customer_id: this.CustomerDetail.id,
                cooperation_id: this.CooperationDetail.cooperation_id,
              });
              // 更新跟单列表
              this.GetCurrentAERecordList({
                cooperation_id: this.CooperationDetail.cooperation_id,
                ae_id: this.CurrentAE.ae_id,
                num: 10,
                page_num: 1,
              });
              // 更新当前跟单AE
              this.GetCurrentAE({
                ae_id: this.CurrentAE.ae_id,
              });
              this.$refs.AddDocumentaryDialog.dialogClose();
            } else {
              this.$message.error(res.data.message);
            }
          })
          .catch(err => {
            this.$message.error('保存失败');
            console.error(err);
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.adddocumentary-container {
  background: #f2f6f9 !important;
  .box1 {
    padding-top: 8px;
    background: #fff;
    border-radius: 10px;
    padding-bottom: 10px;
  }
  .box2 {
    padding-top: 8px;
    background: #fff;
    border-radius: 10px;
    margin-top: 10px;
    padding-bottom: 10px;
  }
  /deep/ .el-form-item__label {
    padding-right: 5px;
  }
  .el-radio + .el-radio {
    margin-left: 10px;
  }
  // padding: 0 20px;
  .addLinkBtn {
    width: 100%;
    border: 1px dashed #d1d5e3;
    color: #396fff;
    font-size: 15px;
    padding: 5px;
    margin: 10px 0 20px;
    // margin-left: 15px;
    width: 720px;
  }
  .documentary-form {
    width: 870px;
    margin: 0 auto;
    .form-block {
      padding-right: 100px;
      /deep/ .el-input__inner {
        border-radius: 2px;
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
      }
    }
    .title {
      font-weight: 600;
      color: #666666;
    }
    .icon-del {
      float: right;
      padding: 3px 0;
      font-size: 16px;
      cursor: pointer;
      color: var(--text-des-color);
    }
    .icon-shanchu {
      float: right;
      padding: 3px 0;
      cursor: pointer;
    }
    .icon-shanchu:before {
      color: #f05765 !important;
      font-size: 18px;
    }
    /deep/ .el-card__header {
      background-color: #f6f6f6;
      padding: 12px 18px;
    }
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
  }
  .border-dashed {
    border: 1px dashed #d1d5e3;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    line-height: 39px;
    margin-top: 18px;
    color: #396fff;
    i {
      color: #396fff;
      margin-right: 10px;
    }
  }
}
/deep/ .el-radio__inner {
  width: 24px;
  height: 24px;
}
/deep/ .el-input-group__append {
  color: var(--text-color);
  background: rgba(246, 246, 246, 1);
  border-radius: 0px 10px 10px 0px;
}
.text-c {
  /deep/ .el-form-item__label {
    text-align: center;
  }
}
/deep/ .el-radio__label {
  font-size: 14px;
  padding-left: 3px;
}
/deep/ .el-textarea__inner {
  border-radius: 10px !important;
}
/deep/ .common-dialog .el-dialog__footer {
  padding-top: 25px;
  padding-bottom: 15px;
}
</style>
