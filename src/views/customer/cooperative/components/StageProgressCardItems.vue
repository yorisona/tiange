<template>
  <div>
    <el-dialog
      :visible="visible"
      ref="CooperationDetail"
      class="customer-dialog"
      :subtitle="addByFormat(CooperationDetail)"
      width="1024px"
      @close="handledialogCancel"
      :isfooter="false"
    >
      <template #title> <span>合作详情</span> </template>
      <div class="cooperationdetail-container" v-if="CooperationDetail !== null">
        <CustomerStageProgress
          ref="CustomerStageProgress"
          :isvertical="false"
          :stage="CooperationDetail.cooperation_status"
          :issimple="false"
          @step-operate="stepOperateHandle"
        />
        <div class="detail">
          <CardItems :items="bindCardItems(CooperationdetailStatus)" />
        </div>
        <slot />
      </div>
    </el-dialog>
    <!-- 新增合作 -->
    <AddCooperationDialog ref="addCooperationDialog" />
    <!-- 确认合作 -->
    <ConfirmCooperationDialog
      :visible="ConfirmCooperationDialogVisible"
      @dialog:close="ConfirmCooperationDialogVisible = false"
      ref="confirmCooperationDialog"
    />
    <!-- 执行项目 -->
    <ExecuteProjectDialog
      :visible="ExecuteProjectDialogVisible"
      @dialog:close="ExecuteProjectDialogVisible = false"
      ref="executeProjectDialog"
    />
    <!-- 执行结束 -->
    <ExecuteEndDialog
      ref="executeEndDialog"
      :visible="ExecuteEndDialogVisible"
      @dialog:close="ExecuteEndDialogVisible = false"
    />
    <!-- 新增场次 -->
    <!--<AddSceneDialog ref="addSceneDialog" />-->
    <!-- 新增场次 new-->
    <AddSessionDialog
      ref="addSceneDialog"
      :visible="AddSessionDialogVisible"
      @dialog:close="AddSessionDialogVisible = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CustomerStageProgress from './CustomerStageProgress';
import { addDateFormat } from '@/utils/format';
import AddCooperationDialog from '../cooperation/AddCooperation';
import ConfirmCooperationDialog from '../cooperation/ConfirmCooperation';
import CardItems from '@/modules/customer/cooperative/CardItems/index.vue';
import { cooperationTypeList } from '@/const/cooperative';
import ExecuteProjectDialog from '../execute_project/ExecuteProject';
import ExecuteEndDialog from '../execute_end/ExecuteEnd';
// import AddSceneDialog from '../data_entry/AddScene'
import AddSessionDialog from '../data_entry/AddSession';
import CooperativeStore from '@/views/customer/cooperative/mixin/CooperativeStore';

export default {
  name: 'StageProgressCardItems',
  components: {
    CustomerStageProgress,
    AddCooperationDialog,
    CardItems,
    ConfirmCooperationDialog,
    ExecuteProjectDialog,
    ExecuteEndDialog,
    // AddSceneDialog,
    AddSessionDialog,
  },
  mixins: [CooperativeStore],
  data() {
    return {
      visible: false,
      title: '',
      page: null,
      ConfirmCooperationDialogVisible: false,
      ExecuteProjectDialogVisible: false,
      ExecuteEndDialogVisible: false,
      AddSessionDialogVisible: false,
    };
  },
  methods: {
    ...mapActions({
      GetCooperation: 'cooperative/GetCooperation',
      GetAchievementList: 'cooperative/GetAchievementList',
      GetCoostList: 'cooperative/GetCoostList',
      GetCooperationAE: 'cooperative/GetCooperationAE',
      GetRebatesList: 'cooperative/GetRebatesList',
    }),
    // 显示
    show(page) {
      if (page) this.page = page;
      this.visible = true;
      // 调用子组件方法
      setTimeout(() => {
        this.$refs.CustomerStageProgress.activeShow();
      }, 10);
      // console.log(this.CooperationDetail.contract_uid);
    },
    // 转换合作类型
    convertCooperationType(types) {
      let typeStr = '';
      if (types.length > 0) {
        const _temp = cooperationTypeList.filter(el => types.indexOf(el.value) > -1);
        if (_temp) {
          typeStr = _temp.map(el => el.label).join(' / ');
        }
      }
      return typeStr;
    },
    // 绑定卡片项数据
    bindCardItems(type) {
      const carditems = [];
      switch (type) {
        case 1: // 意向客户阶段
          carditems.push({
            src: require('@/assets/img/cooperative/xt_khjl.png'),
            title: this.CooperationDetail.manager || '--',
            subtitle: '客户经理',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/xt_hzlx.png'),
            title: this.convertCooperationType(
              this.CooperationDetail.cooperation_type.split(',').map(el => parseInt(el, 10)),
            ),
            subtitle: '合作类型',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/xt_ys.png'),
            title: this.CooperationDetail.budget ? `${this.CooperationDetail.budget}` : '--',
            subtitle: '预算',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/pv_icon.png'),
            title: this.CooperationDetail.pv
              ? `${this.CooperationDetail.pv}<span style="color:#666666;font-size: 14px;font-weight: normal">(pv单价:${this.CooperationDetail.per_pv}元/个)</span>`
              : '--',
            subtitle: 'PV要求',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/uv_icon.png'),
            title: this.CooperationDetail.uv
              ? `${this.CooperationDetail.uv}<span style="color:#666666;font-size: 14px;font-weight: normal">(uv单价:${this.CooperationDetail.per_uv}元/个)</span>`
              : '--',
            subtitle: 'UV要求',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/gmv_icon.png'),
            title: this.CooperationDetail.gmv
              ? `${this.CooperationDetail.gmv}<span style="color:#666666;font-size: 14px;font-weight: normal">(roi:${this.CooperationDetail.roi_str})</span>`
              : '--',
            subtitle: 'GMV要求',
          });

          break;
        case 2: // 确定合作阶段
        case 3: // 执行项目阶段
        case 4: // 执行结束阶段
        case 5: // 数据入库阶段
          carditems.push({
            src: require('@/assets/img/cooperative/xt_xsje.png'),
            title: this.CooperationDetail.sale_amount_str
              ? `${this.CooperationDetail.sale_amount_str}`
              : '--',
            subtitle: '销售金额（元）',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/xt_yskje.png'),
            title: this.CooperationDetail.gather_amount_str
              ? `${this.CooperationDetail.gather_amount_str}`
              : '--',
            subtitle: '收款金额（元）',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/xt_dskje.png'),
            title: this.CooperationDetail.wait_gather_amount_str
              ? `${this.CooperationDetail.wait_gather_amount_str}`
              : '--',
            subtitle: '待收款金额（元）',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/xt_cbapje.png'),
            title: this.CooperationDetail.cost_amount_str
              ? `${this.CooperationDetail.cost_amount_str}`
              : '--',
            subtitle: '成本安排金额（元）',
          });
          carditems.push({
            src: require('@/assets/img/cooperative/xt_tk.png'),
            title: this.CooperationDetail.refund_total_amount_str
              ? `${this.CooperationDetail.refund_total_amount_str}`
              : '--',
            subtitle: '退款金额（元）',
          });
          break;
        default:
          break;
      }
      return carditems;
    },
    // 弹窗取消操作
    handledialogCancel() {
      this.GetCooperation({
        customer_id: this.CustomerDetail.id,
        num: this.page !== null ? this.page.pageSize : 10,
        page_num: this.page !== null ? this.page.currentPage : 1,
      });
      this.visible = false;
    },
    // 格式化添加人信息
    addByFormat(customer) {
      if (customer !== null) {
        return `创建人：${customer.add_by} ${addDateFormat(customer.gmt_create)}`;
      } else {
        return '';
      }
    },
    // 操作步骤
    stepOperateHandle({ stage, type }) {
      switch (type) {
        case 'edit': // 编辑
          switch (stage) {
            case 1: // 意向客户
              this.$refs.addCooperationDialog.show(this.CooperationDetail);
              break;
            case 2: // 确认合作
              this.$refs.confirmCooperationDialog.show('edit');
              this.ConfirmCooperationDialogVisible = true;
              break;
            case 3: // 执行项目
              this.$refs.executeProjectDialog.show('edit');
              this.ExecuteProjectDialogVisible = true;
              break;
            case 4: // 执行结束
              this.$refs.executeEndDialog.show('edit');
              this.ExecuteEndDialogVisible = true;
              break;
            case 5: // 数据入库
              this.$refs.addSceneDialog.show('edit');
              this.AddSessionDialogVisible = true;
              break;
            default:
              break;
          }
          break;
        case 'add': // 添加
          switch (stage) {
            case 2: // 添加确认合作
              this.$refs.confirmCooperationDialog.show();
              this.ConfirmCooperationDialogVisible = true;
              break;
            case 3: // 添加执行项目
              this.$refs.executeProjectDialog.show();
              this.ExecuteProjectDialogVisible = true;
              break;
            case 4: // 执行结束
              this.$refs.executeEndDialog.show();
              this.ExecuteEndDialogVisible = true;
              break;
            case 5: // 数据入库
              this.$refs.addSceneDialog.show();
              this.AddSessionDialogVisible = true;
              break;
            default:
              break;
          }
          break;
        case 'detail': // 详情
          this.SetCooperationdetailStatus(stage);
          this.handleCurrentActions(stage);
          break;
        default:
          break;
      }
    },
    // 触发当前Actions操作
    handleCurrentActions(status) {
      switch (status) {
        case 1: // 意向客户阶段
          this.GetCooperationDetail({
            // 获取合作详情
            cooperation_id: this.CooperationDetail.cooperation_id,
            customer_id: this.CustomerDetail.id,
          });
          break;
        case 2: // 确认合作阶段
          // 获取业绩记录
          this.GetAchievementList({
            cooperation_id: this.CooperationDetail.cooperation_id,
            num: 10,
            page_num: 1,
          });
          // 获取安排记录
          this.GetCoostList({
            cooperation_id: this.CooperationDetail.cooperation_id,
            num: 10,
            page_num: 1,
          });
          // 获取返点记录
          this.GetRebatesList({
            cooperation_id: this.CooperationDetail.cooperation_id,
            num: 10,
            page_num: 1,
          });
          break;
        case 3: // 执行项目阶段
          // 获取执行AE人员
          this.GetCooperationAE({
            cooperation_id: this.CooperationDetail.cooperation_id,
          });
          break;
        case 4: // 执行结束阶段
          this.GetCooperationDetail({
            // 获取合作详情
            cooperation_id: this.CooperationDetail.cooperation_id,
            customer_id: this.CustomerDetail.id,
          });
          break;
        case 5: // 数据录入阶段
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cooperationdetail-container {
  padding: 0 20px;
  .detail {
    width: 100%;
    background-color: #f2f6f9;
    overflow: hidden; // 创建BFC
    border-radius: 4px;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
}
</style>
