<template>
  <div class="sales-follow-detail">
    <tg-card class="flex-none" :padding="[0, 18, 18, 18]">
      <div class="task-num">
        <div class="num">任务编号：{{ taskDetail.mission_no }}</div>
        <div
          :class="[
            taskDetail.status === 0 ? 'process' : taskDetail.status === 2 ? 'reached' : 'closed',
            'base',
          ]"
        >
          {{ taskDetail.status === 0 ? '跟进中' : taskDetail.status === 2 ? '已合作' : '已关闭' }}
        </div>
        <div v-if="taskDetail.status === 0" style="margin-left: 18px">
          <el-tooltip
            trigger="hover"
            placement="top"
            content="编辑"
            effect="light"
            popper-class="sales-popper-class"
          >
            <span v-if="taskDetail.is_editable">
              <tg-icon name="ico-edit" style="font-size: 15px; width: 44px" @click="handleEdit" />
            </span>
          </el-tooltip>
          <el-tooltip
            placement="top"
            content="指派"
            effect="light"
            popper-class="sales-popper-class"
          >
            <span v-if="taskDetail.is_reallocateable">
              <tg-icon
                name="ico-assign"
                style="font-size: 15px; width: 44px"
                @click="handleAppoint"
              />
            </span>
          </el-tooltip>

          <el-tooltip
            placement="top"
            content="关闭"
            effect="light"
            popper-class="sales-popper-class"
          >
            <span v-if="taskDetail.is_closeable">
              <tg-icon
                name="ico-power"
                style="font-size: 15px; width: 44px"
                @click="handleTaskClose"
              />
            </span>
          </el-tooltip>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-start; flex-wrap: wrap">
        <div class="task-item">
          <p class="label">客户名称：</p>
          <p class="content">{{ taskDetail.customer_name }}</p>
        </div>
        <div class="task-item">
          <p class="label">客户意向：</p>
          <p class="content">
            <span v-if="taskDetail.customer_intention === 1">标三</span>
            <span v-else-if="taskDetail.customer_intention === 2">方案</span>
            <span v-else-if="taskDetail.customer_intention === 3">重点</span>
            <span v-else>预测</span>
          </p>
        </div>
        <div class="task-item">
          <p class="label">业务类型：</p>
          <p class="content">
            {{
              taskDetail.business_type === 1
                ? '营销业务'
                : taskDetail.business_type === 2
                ? '淘宝店播'
                : taskDetail.business_type === 8
                ? '淘宝甄选'
                : taskDetail.business_type === 7
                ? '本地生活'
                : '抖音店播'
            }}
          </p>
        </div>
        <div class="task-item" v-if="taskDetail.business_type === 1">
          <p class="label">合作类型：</p>
          <p class="content">{{ cooperation_type_name }}</p>
        </div>
        <div class="task-item">
          <p class="label">联系人：</p>
          <p class="content">{{ taskDetail.contact_name }}</p>
        </div>
        <div class="task-item">
          <p class="label">手机/微信：</p>
          <p class="content">
            <span
              >{{ taskDetail.phone ? taskDetail.phone : '--' }} /
              {{ taskDetail.wechat ? taskDetail.wechat : '--' }}</span
            >
          </p>
        </div>
        <div class="task-item">
          <p class="label">预估金额：</p>
          <p class="content">
            {{ numberMoneyFormat(taskDetail.estimate_money, 2) }}
          </p>
        </div>
        <div class="task-item">
          <p class="label">预计到账：</p>
          <p class="content">{{ taskDetail.estimate_time | emptyData }}</p>
        </div>
        <div class="task-item">
          <p class="label">客户经理：</p>
          <p class="content">{{ taskDetail.customer_manager | emptyData }}</p>
        </div>
      </div>

      <el-row>
        <el-col :span="24">
          <div class="task-item">
            <p class="label" style="width: 80px">备注：</p>
            <p style="flex: 1; color: var(--text-color); line-height: 22px; margin-top: 4px">
              {{ taskDetail.remark | emptyData }}
            </p>
          </div>
        </el-col>
      </el-row>
    </tg-card>
    <tg-card class="mgt-10 flex-auto" :padding="[12, 18, 12, 18]">
      <div class="btns-line">
        <tg-button
          v-if="taskDetail.status === 0 && is_addable"
          @click="handleRecord"
          type="primary"
          icon="ico-btn-add"
          >新增记录
        </tg-button>
      </div>
      <el-table stripe :data="list" v-loading="loading">
        <el-table-column label="客户情况">
          <template slot-scope="scope">
            <div>{{ scope.row.customer_info | emptyData }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="follow_time" label="跟进日期" width="160">
        </el-table-column>
        <el-table-column align="center" label="下次跟进" width="160">
          <template slot-scope="scope">
            <div class="line-clamp-2">{{ scope.row.next_time | emptyData }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="follow_person_name" label="跟进人" width="115">
        </el-table-column>
        <template #empty>
          <empty-common detail-text="暂无跟进记录 "></empty-common>
        </template>
      </el-table>
    </tg-card>
    <el-dialog
      class="tg-dialog-classic"
      :visible="taskCloseVisible"
      width="372px"
      top="132px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="handleTaskCloseAction"
    >
      <template #title>关闭任务</template>
      <el-form
        ref="formTaskCloseRef"
        :model="formTaskClose"
        :rules="formTaskCloseRules"
        label-width="100px"
      >
        <el-form-item
          label="跟进结果："
          size="medium"
          style="margin-right: 20px; margin-bottom: 30px; margin-top: 20px"
          prop="status"
        >
          <el-select
            v-model="formTaskClose.status"
            class="select"
            placeholder="请选择跟进结果"
            style="width: 240px"
            clearable
          >
            <el-option label="未达成合作" :value="1" />
            <el-option label="确认合作" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <tg-button @click="handleTaskCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleTaskSaveAction('formTaskCloseRef')">保存</tg-button>
      </template>
    </el-dialog>
    <el-dialog
      class="tg-dialog-classic"
      :visible="appointVisible"
      width="372px"
      top="132px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="handleAppointCloseAction"
    >
      <template #title>重新指派</template>
      <div class="dialog-customer-manager"><span>客户经理：</span> {{ managerName }}</div>
      <el-form
        ref="formAppointRef"
        :model="formAppoint"
        :rules="formAppointRules"
        label-width="110px"
      >
        <el-form-item
          label="新客户经理："
          size="medium"
          prop="customer_manager"
          style="margin-bottom: 30px"
        >
          <el-select
            filterable
            placeholder="请输入客户经理"
            v-model="formAppoint.customer_manager"
            size="medium"
            style="width: 236px"
          >
            <el-option
              v-for="(item, index) in customerManagerList"
              :key="index"
              :label="item.username"
              :value="item.id"
            >
              <span>{{ item.username }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <tg-button @click="handleAppointCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleAppointSaveAction('formAppointRef')"
          >保存
        </tg-button>
      </template>
    </el-dialog>

    <el-dialog
      class="tg-dialog-classic"
      :visible="recordVisible"
      width="608px"
      top="132px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="handleRecordCloseAction"
    >
      <template #title>新增记录</template>
      <el-form
        ref="formRecordRef"
        :model="formRecord"
        :rules="formRecordRules"
        label-width="100px"
        style="margin-top: 20px"
      >
        <el-form-item label="跟进时间：" size="medium" prop="follow_time">
          <el-date-picker
            v-model="formRecord.follow_time"
            type="date"
            :picker-options="pickerOptions1"
            value-format="yyyy.MM.dd"
            format="yyyy.MM.dd"
            placeholder="请选择跟进时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下次跟进：" size="medium">
          <el-date-picker
            v-model="formRecord.next_time"
            type="date"
            :picker-options="pickerOptions2"
            value-format="yyyy.MM.dd"
            format="yyyy.MM.dd"
            placeholder="请选择下次跟进时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户情况：" size="medium" prop="customer_info">
          <el-input
            clearable
            maxlength="200"
            show-word-limit
            type="textarea"
            v-model="formRecord.customer_info"
            class="remark-input"
            placeholder="请输入文本"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <div class="dialog-record-customer-manager" style="color: var(--text-color)">
        <span>客户经理：</span> {{ managerName }}
      </div>
      <template #footer>
        <tg-button @click="handleRecordCloseAction">取消</tg-button>
        <tg-button type="primary" @click="handleRecordSaveAction('formRecordRef')">保存</tg-button>
      </template>
    </el-dialog>
    <SalesFollowEditDialog
      :salesFollowDetail="formEdit"
      @edit-detail-success="handleEditSuccess"
      @edit-close="handleEditCloseAction"
      :dialog-visible="editVisible"
    />
  </div>
</template>

<script>
import { RouterNameSales } from '@/const/router';
import { numberMoneyFormat } from '@/utils/formatMoney';
import SalesFollowEditDialog from './dialog/sales.follow.edit.vue';
import {
  AddFollowLog,
  CloseFollow,
  GetCustomerList,
  GetCustomerManagerList,
  GetDetail,
  GetFollowList,
  Reassign,
} from '@/api/sales.follow.detail';
import { inject } from '@vue/composition-api';

const day = new Date();
day.setTime(day.getTime());
const today = day.getFullYear() + '.' + (day.getMonth() + 1) + '.' + day.getDate();

export default {
  name: 'detail',
  components: {
    SalesFollowEditDialog,
  },
  computed: {
    cooperation_type_name() {
      const cooperationMap = new Map([
        [1, '直播'],
        [2, '视频'],
        [3, '图文'],
      ]);

      const cooperation_type_names = this.taskDetail.cooperation_type.map(item =>
        cooperationMap.get(item),
      );

      return cooperation_type_names.join('/');
    },
  },
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now(); //当天之前的时间可选
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; //当天之后的时间可选
        },
      },
      routes: [
        {
          name: RouterNameSales.follow,
          title: '销售管理',
        },
        {
          name: RouterNameSales.follow,
          title: '客户跟进',
        },
        {
          path: '',
          title: '任务详情',
        },
      ],
      taskDetail: {
        mission_no: '',
        customer_uid: '',
        customer_name: '',
        business_type: 1,
        cooperation_type: [],
        customer_intention: '',
        contact_name: '',
        estimate_money: '',
        estimate_time: '',
        remark: '',
        phone: '',
        wechat: '',
        status: 0,
        is_closeable: true,
        is_editable: true,
        is_reallocateable: true,
      },
      list: [],
      is_addable: null,
      loading: false,
      appointVisible: false, // 指派弹框系列
      formAppoint: {
        customer_manager: '',
      },
      customerManagerList: [],
      formAppointRules: {
        customer_manager: {
          required: true,
          message: '请输入客户经理',
          trigger: ['change', 'blur'],
        },
      },
      taskCloseVisible: false, // 关闭任务弹框系列
      formTaskClose: {
        status: '',
      },
      formTaskCloseRules: {
        status: {
          required: true,
          message: '请选择跟进结果',
          trigger: ['change', 'blur'],
        },
      },
      recordVisible: false, // 新增跟进任务弹框系列
      formRecord: {
        follow_time: today,
        next_time: '',
        customer_info: '',
      },
      formRecordRules: {
        follow_time: { required: true, message: '请选择跟进时间', trigger: ['change', 'blur'] },
        customer_info: { required: true, message: '请输入客户情况', trigger: ['change', 'blur'] },
      },
      editVisible: false, // 编辑跟进任务弹框系列
      formEdit: {
        customer_uid: '',
        customer_name: '',
        business_type: 1,
        cooperation_type: [],
        customer_intention: 1,
        contact_name: '',
        estimate_money: '',
        estimate_time: '',
        remark: '',
        phone: '',
        wechat: '',
      },
      customerListLoading: false,
      customerList: [],
      managerName: '',
    };
  },
  filters: {
    emptyData(data) {
      if (data === '' || data === undefined || data === null) {
        return '--';
      } else {
        return data;
      }
    },
  },
  mounted() {
    const showBackTitleHandle = inject('showBackTitleHandle');
    showBackTitleHandle(this.routes);
  },
  created() {
    this.getDetail();
    this.getList();
    const vuexData = localStorage.getItem('vuex');
    this.managerName = JSON.parse(vuexData).user.userinfo.username;
  },
  methods: {
    numberMoneyFormat,
    inputLoanAmountCost(index, value) {
      const val = value.replace(/[^\d.]+/gu, '').replace(/^0+(?=\d)/gu, '') ?? '';
      const result = /\d+(?:\.\d{0,2})?/gu.exec(val) ?? [''];
      this.formEdit.estimate_money = result[0];
    },
    async getDetail() {
      const res = await GetDetail(this.$route.params.id);
      if (res.data.success) {
        this.taskDetail = res.data.data;
        this.taskDetail.estimate_money = this.taskDetail.estimate_money
          ? this.taskDetail.estimate_money / 100
          : '';
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },

    async getList() {
      this.loading = true;
      const params = {
        mission_id: this.$route.params.id,
      };
      const res = await GetFollowList(params);
      if (res.data.success) {
        const list = res.data.data.data;
        this.list = list;
        this.is_addable = res.data.data.is_addable;
        this.loading = false;
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },
    async getManagerList() {
      const params = {
        roles: 1008,
      };
      const res = await GetCustomerManagerList(params);
      if (res.data.success) {
        this.customerManagerList = res.data.data;
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },

    /**
     *@description: 指派客户经理弹框系列
     *@author: 棠棣
     *@since: 2021/1/22 14:07
     */
    handleAppoint() {
      this.managerName = this.taskDetail.customer_manager;
      this.getManagerList();
      this.appointVisible = true;
    },
    handleAppointCloseAction() {
      this.appointVisible = false;
      this.formAppoint = {
        customer_manager: '',
      };
    },
    handleAppointSaveAction(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            mission_id: this.$route.params.id,
            customer_manager_uid: this.formAppoint.customer_manager,
          };
          const res = await Reassign(params);
          if (res.data.success) {
            this.getDetail();
            this.appointVisible = false;
            this.formAppoint = {
              customer_manager: '',
            };
            this.$message({
              type: 'success',
              message: '指派成功！',
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    },

    /**
     *@description: 关闭任务弹框系列
     *@author: 棠棣
     *@since: 2021/1/22 14:21
     */
    handleTaskClose() {
      this.taskCloseVisible = true;
    },
    handleTaskCloseAction() {
      this.taskCloseVisible = false;
      this.formTaskClose = {
        status: '',
      };
    },
    handleTaskSaveAction(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            mission_id: this.$route.params.id,
            status: this.formTaskClose.status,
          };
          const res = await CloseFollow(params);
          if (res.data.success) {
            this.taskCloseVisible = false;
            this.formTaskClose = {
              status: '',
            };
            this.getDetail();
            this.$message({
              type: 'success',
              message: '操作成功！',
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    },

    /**
     *@description: 新增记录弹框系列
     *@author: 棠棣
     *@since: 2021/1/22 15:02
     */
    handleRecord() {
      this.recordVisible = true;
    },
    handleRecordCloseAction() {
      this.recordVisible = false;
      this.formRecord = {
        follow_time: today,
        next_time: '',
        customer_info: '',
      };
    },
    handleRecordSaveAction(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const params = {
            mission_id: this.$route.params.id,
            ...this.formRecord,
          };
          const res = await AddFollowLog(params);
          if (res.data.success) {
            this.recordVisible = false;
            this.formRecord = {
              follow_time: today,
              next_time: '',
              customer_info: '',
            };
            this.getList();
            this.$message({
              type: 'success',
              message: '保存成功！',
            });
          } else {
            this.$message({
              type: 'error',
              message: '操作失败！',
            });
          }
        } else {
          return false;
        }
      });
    },

    /**
     *@description: 编辑跟进弹框系列
     *@author: 棠棣
     *@since: 2021/1/22 17:13
     */
    handleEdit() {
      this.editVisible = true;
      this.formEdit = JSON.parse(JSON.stringify(this.taskDetail));
    },
    handleEditCloseAction() {
      this.editVisible = false;
    },

    handleEditSuccess() {
      this.editVisible = false;
      this.getDetail();
    },

    async getCustomerList(query) {
      const res = await GetCustomerList({ shop_name: query });
      if (res.data.success) {
        this.customerList = res.data.data;
      } else {
        this.$message({
          type: 'error',
          message: res.data.message,
        });
      }
    },
    handleCustomerFocus() {
      if (!this.formEdit.customer_uid) {
        this.customerList = [];
      }
    },
  },
};
</script>

<style lang="less">
.sales-popper-class.is-light.el-tooltip__popper {
  color: var(--text-color);
  font-size: 14px;
  border: 1px solid rgba(164, 178, 194, 0.5);
  box-shadow: 0 1px 4px 0 rgba(var(--theme-rgb-color), 0.06);

  .popper__arrow {
    border-top-color: rgba(164, 178, 194, 0.5);
    box-shadow: 0 1px 4px 0 rgba(var(--theme-rgb-color), 0.06);
  }
}

.sales-follow-detail {
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: auto;
  overflow-y: overlay;
  .el-form-item__content {
    .el-date-editor.el-input {
      width: 480px;
    }
  }

  .el-tooltip {
    position: relative;

    .icon {
      color: #6a7b92;
      &:hover {
        cursor: pointer;
        color: var(--theme-color);
      }
    }
    &:not(:first-child):before {
      content: ' ';
      border-left: 1px solid rgba(164, 178, 194, 0.3);
      display: inline-block;
      height: 14px;
      position: absolute;
      top: 3px;
    }
  }

  .el-button--text {
    font-weight: 400;
  }

  .more-one-item {
    .el-form-item__label {
      line-height: 23px;
    }
  }

  .more-one {
    font-size: 12px;
    color: var(--text-des-color);
    line-height: 0;
    margin-top: 4px;
    text-align: center;
    padding-left: 15px;
  }

  .task-num {
    display: flex;
    padding: 15px 0 7px 0;
    align-items: center;
    height: 52px;

    .num {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
    }

    .base {
      border-radius: 10px;
      margin-left: 4px;
      padding: 1px 5px;
      font-size: 10px;
    }

    .process {
      background: rgba(255, 122, 54, 0.1);
      border: 1px solid #ff7a36;
      color: #ff7a36;
    }

    .reached {
      background: #f9fcfb;
      border: 1px solid #3eaf90;
      color: #3eaf90;
    }

    .closed {
      background: #fbfbfb;
      border: 1px solid var(--text-des-color);
      color: var(--text-des-color);
    }

    .button-box {
      margin-left: auto;

      .button-item {
        width: 30px;
      }
    }
  }

  .task-item {
    display: flex;
    font-size: 14px;
    line-height: 30px;
    flex: 0 0 33.33%;

    .label {
      width: 80px;
      color: #a4b2c2;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .content {
      color: var(--text-color);
      min-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .table-title {
    display: flex;

    h3 {
      font-size: 14px;
      color: var(--text-color);
      line-height: 10px;
    }

    .button-add {
      margin-left: auto;
      padding: 5px 0;
    }
  }

  .dialog-customer-manager {
    margin: 20px 0 15px 40px;
  }

  .dialog-record-customer-manager {
    margin: 20px 0 30px 30px;
  }

  .remark-input {
    width: 480px;
    height: 76px;

    .el-textarea__inner {
      height: 76px;
    }
  }

  .edit-input-item {
    width: 480px;
  }
}
</style>
