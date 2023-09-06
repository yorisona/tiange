<template>
  <common-dialog
    ref="AddCostDialog"
    :isAppendToBody="true"
    :title="title"
    :width="990"
    @dialog-cancel="handledialogCancel"
    @dialog-submit="handledialogSubmit"
    :isfooter="true"
  >
    <div class="addcost-container">
      <div class="box1">
        <sub-panel :title="'客户信息'" :iserect="true">
          <CustomerSimpleDetail />
        </sub-panel>
      </div>
      <div class="box2">
        <sub-panel :title="'安排成本'" :iserect="true">
          <div class="cost-form">
            <el-card
              class="box-card"
              shadow="hover"
              v-for="(item, index) in cost_info_list"
              :key="item.id"
              style="margin-top: 15px"
            >
              <template #header>
                <div class="clearfix">
                  <span class="title">请填写</span>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除当前表单"
                    placement="top-start"
                  >
                    <i
                      v-if="!isedite && cost_info_list.length !== 1"
                      class="iconfont icon-shanchu"
                      @click="deleteForm(item.id)"
                    ></i>
                  </el-tooltip>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="复制当前表单"
                    placement="top-start"
                  >
                    <i
                      v-if="!isedite"
                      class="iconfont icon-fuzhibiaodan"
                      @click="copyForm(item.id, index)"
                    ></i>
                  </el-tooltip>
                </div>
              </template>
              <el-form
                :model="item"
                :ref="`add_cost_form${item.id}`"
                :rules="add_cost_form_rules"
                label-width="160px"
                width="870"
                size="small"
              >
                <el-form-item label="关联业绩:" prop="cost_type">
                  <el-radio
                    v-model="item.cost_type"
                    :label="1"
                    style="width: 50%"
                    @change="val => costTypeChange(val, item)"
                  >
                    <el-select
                      size="small"
                      v-model="item.achievement_uid"
                      style="width: 100%"
                      filterable
                      placeholder="请搜索选择收款编号"
                      @change="val => selectAchievementUid(val, item)"
                    >
                      <el-option
                        v-for="item in achievement_uids"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-radio>
                  <el-radio
                    v-model="item.cost_type"
                    :label="2"
                    @change="val => costTypeChange(val, item)"
                    >借款</el-radio
                  >
                </el-form-item>
                <el-form-item
                  prop="borrowing_uid"
                  v-show="item.cost_type === 2"
                  class="cost-borrowing"
                >
                  <template #label>
                    关联垫款审批编号:
                    <el-popover
                      placement="top"
                      trigger="hover"
                      effect="light"
                      content="借款要先提交借款审批，审批通过后再关联成本安排"
                    >
                      <template slot="reference">
                        <i class="el-icon-question" style="cursor: pointer"></i>
                      </template>
                    </el-popover>
                  </template>
                  <el-select
                    size="small"
                    clearable
                    v-model="item.borrowing_uid"
                    style="width: 100%"
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="remoteBorrwing"
                    placeholder="请搜索并选择垫款审批编号"
                    @change="val => selectBorrowingUid(val, item)"
                  >
                    <el-option
                      v-for="item in isBorrwingList ? borrowing_list : []"
                      :key="item.approval_uid"
                      :label="item.approval_uid"
                      :value="item.approval_uid"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关联供应商合同:" prop="has_contract">
                  <el-radio
                    v-model="item.has_contract"
                    :label="1"
                    style="width: 50%"
                    @change="val => ContractTypeChange(val, item)"
                  >
                    <el-select
                      size="small"
                      v-model="item.contract_uid"
                      style="width: 100%"
                      filterable
                      placeholder="请搜索或选择供应商合同编号"
                      @change="val => selectCostContractUid(val, item)"
                    >
                      <el-option
                        v-for="item in contract_id_list"
                        :key="item"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </el-radio>
                  <el-radio
                    v-model="item.has_contract"
                    :label="2"
                    @change="val => ContractTypeChange(val, item)"
                    >无合同</el-radio
                  >
                </el-form-item>

                <el-form-item label="KOL名称:" prop="kol_id">
                  <el-select
                    size="small"
                    v-model="item.kol_id"
                    style="width: 100%; margin-top: 3px"
                    filterable
                    placeholder="请搜索选择KOL"
                    @change="val => selectKOL(val, item, index)"
                  >
                    <el-option
                      v-for="item in kolinfos"
                      :key="item.kol_id"
                      :label="item.kol_name"
                      :value="item.kol_id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机构名称:" prop="is_personal">
                  <el-radio
                    v-model="item.is_personal"
                    :label="2"
                    style="width: 50%"
                    @change="val => isPersonalChange(val, item)"
                  >
                    <el-select
                      size="small"
                      v-model="item.company_id"
                      style="width: 100%"
                      placeholder="请选择机构"
                      :disabled="item.kol_id === ''"
                      @change="val => selectCompany(val, item)"
                    >
                      <el-option
                        v-for="item in kol_company"
                        :key="item.company_id"
                        :label="item.company_name"
                        :value="item.company_id"
                      ></el-option>
                    </el-select>
                  </el-radio>
                  <el-radio
                    v-model="item.is_personal"
                    :label="1"
                    @change="val => isPersonalChange(val, item)"
                    >个人</el-radio
                  >
                  <p class="tip">
                    * 请先选择KOL再选择该KOL所属的机构,需要录入机构点击
                    <a @click="goKOL(index)">去录入 ></a> 录入后点击
                    <a @click="refreshKOL(index, item)">刷新</a>
                  </p>
                </el-form-item>
                <el-form-item class="business-date">
                  <template #label>
                    业务执行日期
                    <el-popover
                      placement="top"
                      trigger="hover"
                      effect="light"
                      content="kol开播的时间段"
                    >
                      <template slot="reference">
                        <i class="el-icon-question" style="cursor: pointer"></i>
                      </template>
                    </el-popover>
                  </template>
                  <el-date-picker
                    :clearable="false"
                    v-model="item.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    @change="date_change(index)"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="打款时间:" prop="pay_date">
                  <el-date-picker
                    :picker-options="pickerOptions0"
                    size="small"
                    placeholder="请选择打款时间"
                    style="width: 100%"
                    format="yyyy.MM.dd"
                    value-format="yyyy-MM-dd"
                    v-model="item.pay_date"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="打款金额:" prop="pay_amount">
                  <el-input
                    size="small"
                    placeholder="请输入打款金额"
                    type="number"
                    @mousewheel.native.prevent
                    v-model.number="item.pay_amount"
                    style="width: 100%"
                  >
                    <template #append>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="打款方式:" prop="pay_way">
                  <!-- 这里的做法应该是给 el-radio-group 加一个@change事件，但是我加上去不触发方法 -->
                  <el-radio-group v-model="item.pay_way">
                    <el-radio :label="1">银行卡</el-radio>
                    <el-radio :label="2">V任务</el-radio>
                    <el-radio
                      :label="3"
                      @click.native="
                        changePutAway(3);
                        item.approval_uid = '';
                      "
                      >对公银行</el-radio
                    >
                    <el-radio
                      :label="4"
                      @click.native="
                        changePutAway(4);
                        item.approval_uid = '';
                      "
                      >对公支付宝</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  prop="approval_uid"
                  v-if="item.pay_way === 4"
                  class="approver-uid"
                  label-width="160px"
                >
                  <template #label>
                    关联用款审批编号:
                    <el-popover
                      placement="top"
                      trigger="hover"
                      effect="light"
                      content="对公银行打款要先提交用款审批，审批通过后再关联成本安排"
                    >
                      <template slot="reference">
                        <i class="el-icon-question" style="cursor: pointer"></i>
                      </template>
                    </el-popover>
                  </template>
                  <el-select
                    size="small"
                    v-model="item.approval_uid"
                    style="width: 50%"
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="val => remoteApproval(val, item.pay_way)"
                    placeholder="请搜索并选择用款审批编号"
                    @change="val => selectApprovalId(val, item)"
                  >
                    <el-option
                      v-for="item in isApprovalList ? approval_uids : []"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  prop="approval_uid"
                  v-if="item.pay_way === 3"
                  class="approver-uid"
                  label-width="160px"
                >
                  <template #label>
                    关联用款审批编号:
                    <el-popover
                      placement="top"
                      trigger="hover"
                      effect="light"
                      content="对公银行打款要先提交用款审批，审批通过后再关联成本安排"
                    >
                      <template slot="reference">
                        <i class="el-icon-question" style="cursor: pointer"></i>
                      </template>
                    </el-popover>
                  </template>
                  <el-select
                    size="small"
                    v-model="item.approval_uid"
                    style="width: 50%"
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="val => remoteApproval(val, item.pay_way)"
                    placeholder="请搜索并选择用款审批编号"
                    @change="val => selectApprovalId(val, item)"
                  >
                    <el-option
                      v-for="item in isApprovalList ? approval_uids : []"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-row
                  v-if="item.pay_way === 2"
                  style="
                    margin-left: 96px;
                    background: #fff;
                    border-radius: 2px;
                    margin-bottom: 10px;
                    padding-right: 18px;
                    margin-top: 12px;
                  "
                >
                  <span v-for="(sub, i) in item.v_task_list" :key="i">
                    <el-col :span="11" class="border-box1">
                      <el-form-item
                        label="v任务链接"
                        :hide-required-asterisk="true"
                        :prop="'v_task_list.' + i + '.v_task_url'"
                        :rules="{
                          required: true,
                          message: '产品链接不能为空',
                          trigger: 'blur',
                        }"
                      >
                        <el-input
                          v-model.trim="sub.v_task_url"
                          placeholder="请输入v任务链接"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="11" class="border-box2">
                      <el-form-item
                        label="产品链接"
                        :hide-required-asterisk="false"
                        :prop="'v_task_list.' + i + '.item_url'"
                        :rules="{
                          required: true,
                          message: '产品链接不能为空',
                          trigger: 'blur',
                        }"
                      >
                        <el-input
                          v-model.trim="sub.item_url"
                          placeholder="请输入产品链接"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" class="border-box3" style="height: 55px">
                      <i
                        v-if="item.v_task_list.length !== 1"
                        style="line-height: 25px"
                        class="el-icon-delete icon-del"
                        @click="deleteUrlItem(index, i)"
                      ></i>
                    </el-col>
                  </span>
                  <el-col :span="24">
                    <el-button class="addLinkBtn" icon="el-icon-circle-plus" @click="addUrl(index)"
                      >点击添加</el-button
                    >
                  </el-col>
                </el-row>

                <el-form-item label="打款账户:" prop="pay_account">
                  <template #label>
                    <span>
                      打款账户
                      <el-tooltip placement="top" effect="light">
                        <template #content>
                          <div>
                            <p style="font-size: 13px; font-weight: 600; line-height: 20px">
                              时光机：
                            </p>
                            <p style="font-size: 12px; line-height: 20px">
                              支付宝名称：嘉兴市经开城南时光机营销策划工作室
                            </p>
                            <p style="font-size: 12px; line-height: 20px">
                              账户：gmrenwupaifa@163.com
                            </p>
                            <p style="font-size: 12px; line-height: 20px">淘宝会员名：GM任务派发</p>
                            <p
                              style="
                                font-size: 13px;
                                font-weight: 600;
                                margin-top: 10px;
                                line-height: 20px;
                              "
                            >
                              玥每映像：
                            </p>
                            <p style="font-size: 12px; line-height: 20px">
                              支付宝名称：嘉兴玥每映像文化传媒有限公司
                            </p>
                            <p style="font-size: 12px; line-height: 20px">
                              账户： yuemeiyx@126.com
                            </p>
                            <p
                              style="
                                font-size: 13px;
                                font-weight: 600;
                                margin-top: 10px;
                                line-height: 20px;
                              "
                            >
                              构美子账户：
                            </p>
                            <p style="font-size: 12px; line-height: 20px">
                              支付宝名称：嘉兴构美信息技术有限公司-子公司
                            </p>
                            <p style="font-size: 12px; line-height: 20px">账户： gmcwzy@126.com</p>
                          </div>
                        </template>
                        <i class="el-icon-question" style="cursor: pointer"></i>
                      </el-tooltip>
                    </span>
                  </template>
                  <el-radio v-model="item.pay_account" :label="1">时光机</el-radio>
                  <el-radio v-model="item.pay_account" :label="2">玥美映像</el-radio>
                  <el-radio v-model="item.pay_account" :label="3">构美子账户</el-radio>
                </el-form-item>
                <el-row
                  v-if="item.is_invoice === 1"
                  style="
                    margin-left: 96px;
                    background: #f6f6f6;
                    border-radius: 2px;
                    margin-bottom: 10px;
                    padding-top: 18px;
                    padding-right: 18px;
                    margin-top: 12px;
                  "
                >
                  <el-col :span="12"></el-col>
                </el-row>
                <el-form-item label="备 注:" prop="note">
                  <el-input
                    type="textarea"
                    :rows="1"
                    :maxlength="100"
                    placeholder="请输入备注"
                    style="width: 100%"
                    v-model="item.note"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-card>
            <div v-if="!isedite" class="border-dashed" @click="addForm">
              <i class="el-icon-circle-plus"></i>点击添加
            </div>
          </div>
        </sub-panel>
      </div>
    </div>
  </common-dialog>
</template>

<script>
import CustomerSimpleDetail from '../../components/CustomerSimpleDetail';
import { mapActions } from 'vuex';
import {
  getAchievementUIdsByCooperation,
  uploadCertificate,
  addCostList,
  updateCostList,
  getCostContractUid, //获取合作下的所有合同编号
  queryApprovalIdList,
  getQueryApprovalIdList, // 所有审批单
} from '@/api/cooperative';
import { queryKolNames, queryAllKolNames, queryCompanyByKol } from '@/api/medium';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default {
  name: 'AddCost',
  components: {
    CustomerSimpleDetail,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      //打款日期限制
      pickerOptions0: {
        disabledDate(time) {
          // 当前天数之前禁止打款，今日13点之后也禁止
          const myDate = new Date();
          if (myDate.getHours() > 13) {
            return time.getTime() < Date.now();
          } else {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
      },
      title: '',
      page: null,
      cost_info_list: [],
      borrowing_list: [],
      timeout: null, // 防抖
      add_cost_form: {
        date: [
          new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
          new Date().toLocaleDateString().replace('/', '-').replace('/', '-'),
        ],
        live_start_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 业务执行开始期
        live_end_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 业务执行结束日期
        contract_id: '', //供应商客户id
        contract_uid: '', //供应商合同编号
        has_contract: '', //关联供应商 1有合同 2无合同
        achievement_uid: '', // 业绩Uid
        cost_type: '', // 关联业绩 1 收款编号 2 借款
        kol_id: '', // kol
        company_id: '', // 机构Id
        is_personal: '', // 是否是个人 1 是 2 否
        pay_date: new Date().toLocaleDateString().replace('/', '-').replace('/', '-'), // 打款日期
        pay_amount: '', // 打款金额
        pay_way: '', // 打款方式 1 银行卡 2 v任务
        approval_uid: '', //审批编号Uid
        approval_val: '', // 对公银行-关联用款审批编号输入的值
        // v_task_url: '', // v任务链接
        // item_url: '', // 产品链接
        approval_id: '',
        v_task_list: [
          {
            v_task_url: '', // v任务链接
            item_url: '', // 产品链接
          },
        ],

        pay_account: '', // 打款账户 1 时光机 2 玥每映像 3 构美子账户
        // is_invoice: 0, // 是否开票
        tax_point: '', // 税点金额
        note: '', // 备注
        invoice_certificate_pic: '', // 开票凭证
      },
      add_cost_form_rules: {
        cost_type: [
          // 关联业绩
          { required: true, message: '请选择关联业绩', trigger: 'change' },
        ],
        has_contract: [
          // 关联供应商合同
          { required: true, message: '请选择关联供应商合同', trigger: 'change' },
        ],
        borrowing_uid: [
          // 关联供应商合同
          { required: true, message: '请选择关联借款审批编号', trigger: 'change' },
        ],
        kol_id: [
          // kol名称
          { required: true, message: '请选择KOL', trigger: 'change' },
        ],
        is_personal: [
          // 机构名称
          { required: true, message: '请选择机构名称', trigger: 'change' },
        ],
        pay_amount: [
          // 打款金额
          { required: true, message: '请输入打款金额', trigger: 'blur' },
        ],
        pay_way: [
          // 打款方式
          { required: true, message: '请选择打款方式', trigger: 'change' },
        ],
        // v_task_url: [
        //   { required: true, message: '请输入v任务链接', trigger: 'blur' }
        // ],
        // item_url: [
        //   { required: true, message: '请输入产品链接', trigger: 'blur' }
        // ],
        // tax_point: [
        //   { required: true, message: "请输入税点金额", trigger: "blur" }
        // ],
        pay_account: [
          // 打款账户
          { required: true, message: '请选择打款账户', trigger: 'change' },
        ],
        approval_uid: [
          // 关联业绩
          { required: true, message: '请关联用款审批编号', trigger: 'change' },
        ],
      },
      list: [], //供应商数据
      achievement_uids: [], // 业绩Uid集合
      contract_id_list: [], //供应商合同uid集合
      approval_uids: [], //  审批编号uid集合
      approval_list: [], //获取审批编号数据
      kols: [], // kols
      kolinfos: [],
      platforms_keys: [
        'kol_bili_info',
        'kol_douyin_info',
        'kol_kuaishou_info',
        'kol_wechat_info',
        'kol_weibo_info',
        'kol_xhs_info',
        'kol_yizhibo_info',
        'star_info',
      ],
      kol_company: [], // kol机构
      descriptionAccepts: ['jpg', 'jpeg', 'png'], // 扩展名
      isedite: false,
      kol_id: [],
      isBorrwingList: '',
      isApprovalList: '',
    };
  },

  methods: {
    // 关联垫款审批编号取消下拉
    remoteBorrwing(val) {
      this.isBorrwingList = val;
      getQueryApprovalIdList({
        approval_type: 3, // 审批类型为借款
        approval_uid: val,
        customer_id: this.CustomerDetail.id,
      }).then(({ data }) => {
        this.$set(this, 'borrowing_list', data.data || []);
      });
    },
    ...mapActions({
      GetAchievementList: 'cooperative/GetAchievementList',
      GetCoostList: 'cooperative/GetCoostList',
    }),
    changePutAway(val) {
      this.isApprovalList = '';
      if (!this.timeout) {
        this.timeout = setTimeout(() => {
          clearTimeout(this.timeout);
          this.timeout = null;
          if (val === 3 || val === 4) {
            this.getApprovalIdUIds(val);
          }
        }, 200);
      }
    },
    // 去录入
    goKOL(index) {
      if (this.kol_id.length === 0) {
        this.$message.warning('请先选择kol昵称');
        return false;
      }
      if (this.kol_id[index] === undefined) {
        this.$message.warning('请先选择kol昵称');
        return false;
      }

      let kol_name = '';
      for (let ii = 0, len = this.kolinfos.length; ii < len; ii++) {
        if (this.kolinfos[ii].kol_id === this.kol_id[index].kol_id) {
          kol_name = this.kolinfos[ii].kol_name;
          break;
        }
      }
      const { href } = this.$router.resolve({
        path: '/supplier/list',
        query: {
          kol_name: kol_name,
          kol_id: this.kol_id[index].kol_id,
        },
      });
      window.open(href, '_blank');
    },
    addUrl(index) {
      this.cost_info_list[index].v_task_list.push({
        v_task_url: '',
        item_url: '',
      });
    },
    deleteUrlItem(index, ii) {
      if (this.cost_info_list[index].v_task_list.length === 1) {
        this.$message.warning('链接至少有一个');
        return false;
      }
      this.cost_info_list[index].v_task_list.splice(ii, 1);
    },
    // 显示
    show(cost, page) {
      // borrowing_uid
      if (cost) {
        // 修改
        // 修改页面把date赋值回去
        this.costTypeChange(cost.cost_type, cost);
        cost.date = [];
        if (cost.live_start_date && cost.live_end_date) {
          cost.date[0] = cost.live_start_date;
          cost.date[1] = cost.live_end_date;
        }

        if (cost.pay_way_detail.length === 0) {
          cost.pay_way_detail.push({ v_task_url: '', item_url: '' });
        }
        this.title = '安排成本修改';
        // this.add_cost_form = Object.assign(this.add_cost_form, cost)
        if (page) this.page = page;
        this.isedite = true;
        const _add_cost_form = {
          borrowing_uid: cost.borrowing_uid, // 关联借款审批编号
          approval_id: cost.pay_way_detail[0].approval_id,
          approval_uid: cost.pay_way_detail[0].approval_uid, //关联用款审批编号uid
          contract_id: cost.has_contract === 2 ? '' : cost.contract_id,
          contract_uid: cost.contract_uid, //供应商合同uid
          has_contract: cost.has_contract, //供应商列表 1有合同 2无合同
          achievement_uid: cost.achievement_uid, // 业绩Uid
          cost_type: cost.cost_type, // 关联业绩 1 收款编号 2 借款
          kol_id: cost.kol_id, // kol
          company_id: cost.company_id === 0 ? '' : cost.company_id, // 机构Id
          is_personal: cost.is_personal, // 是否是个人 1 是 2 否
          pay_date: cost.pay_date, // 打款日期
          pay_amount: cost.pay_amount, // 打款金额
          pay_way: cost.pay_way, // 打款方式 1 银行卡 2 v任务 3对公银行
          // v_task_url: cost.pay_way_detail.v_task_url, // v任务链接
          // item_url: cost.pay_way_detail.item_url, // 产品链接
          v_task_list: cost.pay_way_detail, // v任务
          pay_account: cost.pay_account, // 打款账户 1 时光机 2 玥每映像 3 构美子账户
          // is_invoice: cost.is_invoice, // 是否开票
          // tax_point: cost.tax_point, // 税点金额
          note: cost.note, // 备注
          invoice_certificate_pic: cost.invoice_certificate_pic, // 开票凭证
          cost_id: cost.cost_id,
          live_start_date: cost.live_start_date,
          live_end_date: cost.live_end_date,
          date: cost.date, //业务执行日期
        };
        this.cost_info_list.push({
          ..._add_cost_form,
          ...{
            id: Math.ceil(Math.random() * 10000),
            cooperation_id: this.CooperationDetail.cooperation_id,
          },
        });
        queryCompanyByKol({ kol_id: cost.kol_id }).then(res => {
          this.kol_company = res.data.data;
        });
      } else {
        // 新增
        this.title = '安排成本';
        this.isedite = false;
        this.addForm();
      }

      this.getAchievementUIds();
      this.getAllKolName();
      this.$refs.AddCostDialog.dialogOpen();
      this.getCostContractUidSelect();
      this.getApprovalIdUIds();
      this.getQueryApprovalIdListData();
    },
    // 业务执行日期赋值
    date_change(index) {
      // console.log(this.cost_info_list[index].date[1]);
      if (this.cost_info_list[index].date) {
        this.cost_info_list[index].live_start_date = this.cost_info_list[index].date[0];
        this.cost_info_list[index].live_end_date = this.cost_info_list[index].date[1];
      }
      //  if (this.cost_info_list[index].date) {
      //         logpass.start_time = this.searchForm.date[0] === undefined ? '' : this.searchForm.date[0]
      //         logpass.end_time = this.searchForm.date[1] === undefined ? '' : this.searchForm.date[1]
      //       }
    },
    // 获取当前安排的成本编号
    getAchievementUIds() {
      getAchievementUIdsByCooperation({
        cooperation_id: this.CooperationDetail.cooperation_id,
      }).then(res => {
        this.achievement_uids = res.data.data.data.map(aa => aa.achievement_uid);
      });
    },
    // 获取当前安排的合同编号
    getCostContractUidSelect() {
      getCostContractUid({
        partner_type: 2,
      }).then(res => {
        this.contract_id_list = res.data.data.data.map(aa => aa.contract_uid);
        this.list = res.data.data.data;
      });
    },
    // 审批单列表
    getQueryApprovalIdListData() {
      getQueryApprovalIdList({
        approval_type: 3, // 审批类型为借款
        customer_id: this.CustomerDetail.id,
      }).then(({ data }) => {
        if (data.data) {
          this.$set(this, 'borrowing_list', data.data);
        }
      });
    },
    // 获取当前安排的审批编号
    getApprovalIdUIds(val) {
      queryApprovalIdList({
        approval_type: 1,
        level_three_types: val || null,
      }).then(res => {
        if (res.data.data && res.data.data.length > 0) {
          this.approval_uids = res.data.data.map(aa => aa.approval_uid);
        } else {
          this.approval_uids = new Array(0);
        }
        this.approval_list = res.data.data;
      });
    },
    // 获取所有kol
    getAllKolName() {
      const params = {};
      queryAllKolNames(params).then(res => {
        this.kolinfos = res.data.data;
      });
    },
    // 获取kol
    getKolNames() {
      queryKolNames().then(res => {
        const _result = res.data.data.data;
        const platforms_keys = JSON.parse(JSON.stringify(this.platforms_keys));
        // 过滤没有机构的KOL
        const _kolinfos = [];
        if (_result.length > 0) {
          _result.map(kk => {
            if (kk?.kol_info?.kol_name !== '') {
              const _kolinfo = {
                kol_id: kk.kol_info.kol_id,
                kol_name: kk.kol_info.kol_name,
                companys: [],
              };
              platforms_keys.map(pp => {
                if (kk[pp]?.company_id !== '' && kk[pp]?.company_name !== '') {
                  const _hscom = _kolinfo.companys.find(cc => cc.company_id === kk[pp].company_id);
                  if (!_hscom) {
                    _kolinfo.companys.push({
                      company_id: kk[pp].company_id,
                      company_name: kk[pp].company_name,
                    });
                  }
                }
              });
              if (_kolinfo.companys.length > 0) {
                _kolinfos.push(_kolinfo);
              }
            }
          });
        }
        this.kolinfos = _kolinfos;
      });
    },
    // 选择KOL
    selectKOL(val, item, index) {
      this.kol_company = [];
      item.company_id = '';
      queryCompanyByKol({ kol_id: val }).then(res => {
        this.kol_company = res.data.data;
      });
      this.kol_id[index] = { kol_id: val };
    },
    // 录入后刷新
    refreshKOL(index, item) {
      if (this.kol_id.length === 0) {
        this.$message.warning('请先选择kol昵称');
        return false;
      }
      if (!this.kol_id[index]) {
        this.$message.warning('请先选择kol昵称');
        return false;
      }
      this.kol_company = [];
      item.company_id = '';
      queryCompanyByKol({ kol_id: this.kol_id[index].kol_id }).then(res => {
        this.$message.success('刷新成功');
        this.kol_company = res.data.data;
      });
    },
    // 选择收款编号
    selectAchievementUid(val, item) {
      if (val) item.cost_type = 1;
      this.$set(item, 'borrowing_uid', '');
      this.add_cost_form_rules.borrowing_uid[0].required = false;
    },
    // 选择供应商Id
    selectCostContractUid(val, item) {
      if (val) item.has_contract = 1;
      for (let ii = 0; ii < this.list.length; ii++) {
        if (val === this.list[ii].contract_uid) {
          item.contract_id = this.list[ii].contract_id;
        }
      }
    },
    // 关联借款审批号
    selectBorrowingUid(val, item) {
      this.isBorrwingList = '';
      this.$set(item, 'borrowing_uid', val);
    },
    // 对公银行-关联用款审批编号输入的值
    remoteApproval(val, type) {
      this.add_cost_form.approval_val = val;
      this.isApprovalList = val;
      queryApprovalIdList({
        approval_type: 1,
        approval_uid: val,
        level_three_types: type || null,
      }).then(({ data }) => {
        this.approval_uids = [];
        this.$set(this, 'approval_uids', data.data.map(aa => aa.approval_uid) || []);
      });
    },
    // 选择合同审批
    selectApprovalId(val, item) {
      this.isApprovalList = '';
      for (let ii = 0; ii < this.approval_list.length; ii++) {
        if (val === this.approval_list[ii].approval_uid) {
          item.approval_id = this.approval_list[ii].id;
        }
      }
    },
    // 选择关联业绩
    costTypeChange(val, item) {
      if (val === 2) {
        item.achievement_uid = '';
        this.add_cost_form_rules.borrowing_uid[0].required = true;
      } else if (val === 1) {
        this.add_cost_form_rules.borrowing_uid[0].required = false;
      }
    },
    // 选择供应商合同编号
    ContractTypeChange(val, item) {
      if (val === 2) item.contract_uid = '';
    },
    // 选择kol
    isPersonalChange(val, item) {
      if (val === 1) item.company_id = '';
    },
    // 选择机构
    selectCompany(val, item) {
      if (val) item.is_personal = 2;
    },
    // 添加表单
    addForm() {
      const _add_cost_form = JSON.parse(JSON.stringify(this.add_cost_form));
      this.cost_info_list.push({
        ..._add_cost_form,
        ...{
          id: Math.ceil(Math.random() * 10000),
          cooperation_id: this.CooperationDetail.cooperation_id,
        },
      });
    },
    // 复制表单
    copyForm(id, index) {
      const _cost_info_list = JSON.parse(JSON.stringify(this.cost_info_list));
      // 复制生成在母本之下
      this.cost_info_list.splice(index, 0, {
        ..._cost_info_list[index],
        ...{
          id: Math.ceil(Math.random() * 10000),
          cooperation_id: this.CooperationDetail.cooperation_id,
        },
      });
      this.$message.success('表单复制成功');
    },
    // 删除表单
    async deleteForm(id) {
      const _cost_info_list = JSON.parse(JSON.stringify(this.cost_info_list));
      if (_cost_info_list.length <= 1) {
        this.$message.warning('表单至少有一个');
      } else {
        const msg = '确定删除该表单？';
        const result = await AsyncConfirm({ root: this }, msg);

        if (result) {
          const _currindex = _cost_info_list.findIndex(ff => ff.id === id);
          if (_currindex > -1) {
            this.cost_info_list.splice(_currindex, 1);
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
            // 出错后滚动到报错位置
            setTimeout(() => {
              const isError = document.getElementsByClassName('is-error');
              isError[0].querySelector('input').focus();
            }, 1);
            return false;
          }
        });
      });
    },
    /**
     * 上传文件成功时回调
     */
    uploadPlans(params, item) {
      const file = params.file;
      const fileType = file.name.split('.')[file.name.split('.').length - 1];
      const found = this.descriptionAccepts.find(type => {
        return type.toLowerCase() === fileType.toLowerCase();
      });
      if (!found) {
        this.$message.warning('上传格式不正确！');
        return;
      }
      const form = new FormData();
      form.append('file', file);
      form.append('type', 'certificate/cost_invoice_certificate');
      uploadCertificate(form)
        .then(data => {
          if (data.data) {
            item.invoice_certificate_pic = data.data.data.source;
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    /**
     * 删除凭证
     * @param
     */
    removePlan(item) {
      item.invoice_certificate_pic = '';
    },
    // 关闭弹窗
    handledialogCancel() {
      this.cost_info_list = [];
    },
    judgetoSelectHandle(name1, name2, err_msg) {
      const _cost_info_list = JSON.parse(JSON.stringify(this.cost_info_list));
      let _result = false;
      _cost_info_list.map(ff => {
        if (ff[name1] === 1 && ff[name2] === '') _result = true;
      });
      if (_result) {
        this.$message.error(err_msg);
      }
      return !_result;
    },

    // 弹窗确认操作
    handledialogSubmit() {
      const _cost_info_list = JSON.parse(JSON.stringify(this.cost_info_list));
      const _results = [];
      _cost_info_list.map(async ff => {
        const _result = await this.submitForm(`add_cost_form${ff.id}`);
        if (_result) {
          _results.push(_result);
        }
        if (_results.length === _cost_info_list.length) {
          this.submitHandle(_cost_info_list);
        }
      });
    },
    submitHandle(cost_info_list) {
      const _result = this.judgetoSelectHandle('cost_type', 'achievement_uid', '请选择收款编号');
      const _result2 = this.judgetoSelectHandle(
        'has_contract',
        'contract_uid',
        '请选择供应商合同编号',
      );
      if (_result) {
        if (this.isedite) {
          updateCostList(cost_info_list[0]).then(res => {
            if (res.data.success) {
              this.$message.success(res.data.message);
              // 更新客户信息
              this.GetCustomerDetail(this.CooperationDetail.customer_id);
              // 更新合作详情
              this.GetCooperationDetail({
                customer_id: this.CustomerDetail.id,
                cooperation_id: this.CooperationDetail.cooperation_id,
              });
              this.GetCoostList({
                cooperation_id: this.CooperationDetail.cooperation_id,
                num: this.page.pageSize,
                page_num: this.page.currentPage,
              });
              // 更新业绩登记表
              this.GetAchievementList({
                cooperation_id: this.CooperationDetail.cooperation_id,
                num: 10,
                page_num: 1,
              });
              this.$refs.AddCostDialog.dialogClose();
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          addCostList(cost_info_list)
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
                this.GetCoostList({
                  cooperation_id: this.CooperationDetail.cooperation_id,
                  num: 10,
                  page_num: 1,
                });
                // 更新业绩登记表
                this.GetAchievementList({
                  cooperation_id: this.CooperationDetail.cooperation_id,
                  num: 10,
                  page_num: 1,
                });
                this.$refs.AddCostDialog.dialogClose();
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(err => {
              this.$message.error('保存失败');
              console.error(err);
            });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.addcost-container {
  background: #f2f6f9;
  .cost-borrowing {
    position: relative;
    width: 595px;
    left: 160px;
    padding: 20px 30px;
    background-color: #f6f6f6;
    border-radius: 10px;
  }
  .box1 {
    background: #fff !important;
    border-radius: 10px;
    padding-top: 8px;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  .box2 {
    background: #fff !important;
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .addLinkBtn {
    width: 100%;
    border-radius: 10px;
    border: 1px dashed #d1d5e3;
    color: #396fff;
    font-size: 15px;
    padding: 5px;
    margin: 10px 0 20px;
    margin-left: 8px;
    // width: 545px;
  }
  .cost-form {
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
    .icon-shanchu {
      float: right;
      margin-top: 0 !important;
      cursor: pointer;
      color: #f05765 !important;
    }
    .icon-shanchu:before {
      content: '\E61C';
      color: #f05765;
      font-size: 20px;
    }
    .icon-fuzhibiaodan {
      float: right;
      cursor: pointer;
      margin-right: 5px;
    }
    .icon-fuzhibiaodan:before {
      content: '\E62C';
      color: #396fff;
      font-size: 22px;
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
    border: 1px dashed #e1e4eb;
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
  p.tip {
    color: #fe924b;
    line-height: initial;
    font-size: 12px;
    margin-bottom: -9px;
    margin: 5px 0;
    a {
      color: #396fff;
      font-weight: 600;
      padding: 0 5px;
      cursor: pointer;
    }
  }
}
/deep/ .el-card {
  border-radius: 10px;
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
/deep/ .el-input {
  width: 98%;
}
/deep/ .el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
/deep/ .el-textarea__inner {
  border-radius: 10px;
}
.el-icon-question:before {
  color: #cdcdcd;
}
.border-box1 {
  border-left: 1px solid #e7ecee;
  border-top: 1px solid #e7ecee;
  border-bottom: 1px solid #e7ecee;
  border-radius: 10px 0px 0px 10px;
  padding-top: 10px;
  margin-left: 8px;
  padding-right: 8px;
}
.border-box2 {
  // border-radius:0 10px 10px 0;
  padding-top: 10px;
  border-left: 1px solid #e7ecee;
  border-top: 1px solid #e7ecee;
  border-bottom: 1px solid #e7ecee;
  padding-right: 8px;
}
.border-box3 {
  border-radius: 0 10px 10px 0;
  padding: 13px 12px;
  border: 1px solid #e7ecee;
}
/deep/ .el-col-11 {
  width: 45.83333%;
}
/deep/.el-col-2 {
  width: 6.33333%;
}
/deep/ .el-icon-delete:before {
  content: '\E612';
  color: var(--icon-color);
  font-size: 18px;
}
.business-date {
  /deep/ .el-form-item__label:before {
    content: '*';
    color: var(--error-color);
    margin-right: 4px;
  }
}
// 审批编号
.approver-uid {
  background: #f6f6f6;
  border-radius: 10px;
  padding: 15px 20px;
  margin-left: 140px;
  /deep/ .el-form-item__error {
    right: 60px;
  }
}
</style>
