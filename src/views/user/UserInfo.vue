<!--
 * @Description: 用户管理
 * @Author: your name
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2020-12-14 14:03:28
 * @LastEditors: 矢车
 -->
<style lang="scss">
@import '@/styles/vars.scss';
.iconfont {
  cursor: pointer;
}
.icon-zhongxinshenhe {
  color: var(--text-des-color);
}
.icon-zhongxinshenhe:before {
  font-size: 22px;
}
.edit-user-dialog {
  .el-form-item__label {
    line-height: 16px;
    padding-bottom: 0;
  }
  .el-select {
    width: 100%;
  }
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .el-dialog__footer {
    border-top: 1px solid #f2f2f2;
  }
}
.user-info-wrapper {
  border-radius: 10px;
  .el-button--primary {
    width: 60px;
    padding: 8px 0;
    text-align: center;
    font-size: 14px;
  }

  .table-user {
    padding-left: 20px;
    font-size: 14px;
    color: #666;
    height: 56px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .user-status {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    &.user-status-0 {
      background-color: #ff7b00;
    }
    &.user-status-1 {
      background-color: #3eaf90;
    }
    &.user-status-2 {
      background-color: #999999;
    }
    &.user-status-4 {
      background-color: #e91313;
    }
  }
  .user-status-0 {
    color: #ff7b00;
  }
  .user-status-1 {
    color: #3eaf90;
  }
  .user-status-2 {
    color: #999999;
  }
  .user-status-4 {
    color: #e91313;
  }
  .search-wrap {
    white-space: nowrap;
    background: #fff;
    border-radius: 10px;
    padding: 5px 0 5px 12px;
    .el-input__inner {
      border-radius: 10px;
    }
  }
  .no-data {
    margin: 200px 0;
    p {
      color: var(--text-des-color);
      margin-top: 5px;
    }
  }
  .oprate-icon-btn {
    display: block;
    width: 34px;
    height: 34px;
    display: inline-block;
    cursor: pointer;
    &.approval-icon {
      background-image: url(../../assets/img/contract_opreate_icon_edit_1.png);
      &:hover {
        background-image: url(../../assets/img/contract_opreate_icon_edit_2.png);
      }
    }
    &.re-approval-icon {
      background-image: url(../../assets/img/re_icon_default.png);
      &:hover {
        background-image: url(../../assets/img/re_icon_hover.png);
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

/deep/ .el-form--inline .el-form-item {
  margin-right: 40px;
}
.edit-user-dialog {
  .el-form-item {
    width: 80%;
    margin-left: 10%;
  }
}
.el-select .el-input {
  width: 130px;
}
.pls-search .el-input-group__prepend {
  background-color: #fff;
}
.confirm-change {
  float: right;
}
.userinfo-customer-dialog {
  /deep/ .el-dialog__header {
    background: #f2f6f9;
    padding: 0;
    border-bottom: #efefef solid 1px;
    .userinfo-customer-dialog-header {
      // background: #F8F8F8;
      background: #f2f6f9;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: var(--text-color);
      font-weight: 600;
      padding-left: 10px;
    }
    .el-dialog__headerbtn {
      top: 10px;
      right: 10px;
      i.el-dialog__close {
        color: #0b1536 !important;
        font-size: 30px;
        opacity: 0.5;
      }
    }
  }
  /deep/ .el-dialog__body {
    .approval-content {
      text-align: center;
      padding: 50px 0;
      // .el-radio {
      //   & + .el-radio {
      //     padding-left: 60px;
      //   }
      //   span.el-radio__input,
      //   span.el-radio__label {
      //     vertical-align: text-top;
      //     font-size: 16px;
      //   }
      // }
    }
    .edit-content {
      width: 540px;
      margin: 0 auto;
      .edit-input {
        display: inline-block;
        width: 428px;
        .el-input__inner {
          border-radius: 10px;
        }
      }
      .el-form-item__content {
        margin-bottom: 15px;
      }
    }
  }
  /deep/ .el-dialog__footer {
    border-top: #f5f5f5 solid 1px;
    padding: 20px;
    .el-button {
      width: 100px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>
<style lang="scss">
.oprate-tips {
  height: 24px;
  line-height: 24px;
  padding: 0 12px;
  font-size: 12px;
  color: #666;
  min-width: initial;
}
.delete-user-confirm.el-message-box {
  .el-message-box__content {
    text-align: center;
    height: initial;
    .el-message-box__status {
      position: initial;
    }
    .el-message-box__message {
      top: initial;
    }
  }
}
</style>

<template>
  <section class="user-info-wrapper mgt-10">
    <tg-block>
      <el-form
        :inline="true"
        :model="displayQuery"
        ref="searchForm"
        style="overflow: hidden; display: flex; flex-wrap: wrap"
      >
        <el-form-item label="所属部门：" prop="department">
          <el-select
            v-model="displayQuery.department"
            size="small"
            style="width: 180px"
            clearable
            placeholder="请选择"
            @change="handleDepartChange"
            @clear="queryUserList"
          >
            <el-option
              v-for="item in departList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色：" prop="role">
          <el-select
            v-model="displayQuery.role"
            size="small"
            style="width: 150px"
            clearable
            no-data-text="请先选择部门"
            placeholder="请选择"
            @clear="queryUserList"
          >
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="is_checked">
          <el-select
            v-model="displayQuery.is_checked"
            size="small"
            style="width: 150px"
            clearable
            placeholder="请选择"
            @clear="queryUserList"
          >
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="用户信息：">
          <el-input
            v-model="displayQuery.username"
            placeholder="请输入用户名 / 手机号 / 工号"
            class="pls-search"
            style="width: 237px"
            clearable
            @clear="queryUserList"
          ></el-input>
        </el-form-item>
        <el-form-item class="serach-reset-btns">
          <tg-button type="primary" size="small" @click="queryUserInfosubmit">查询</tg-button>
          <tg-button type="negative" size="small" class="mgl-10" @click="handleResetClick"
            >重置</tg-button
          >
        </el-form-item>
      </el-form>
    </tg-block>
    <tg-block class="mgt-10">
      <el-table
        :header-cell-style="{
          background: 'var(--table-thead-th-bg-color)',
          height: '48px',
          color: 'var(--text-second-color)',
        }"
        stripe
        :data="displayData"
        v-loading="userInfoDisplay_loading"
      >
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" class-name="table-user" min-width="60" />
        <!-- <el-table-column prop="username" label="角色名">
          <template #default="{row}">
            {{row.user_roles && row.user_roles[0] ? row.user_roles[0].role_name : '--'}}
          </template>
        </el-table-column>
        -->
        <el-table-column prop="work_id" label="工号" class-name="table-user" min-width="60">
          <template #default="{ row }">
            {{ row.work_id || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" class-name="table-user">
          <template #default="{ row }">
            {{ row.phone || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="所属部门">
          <template #default="{ row }">
            {{ row.user_roles && row.user_roles[0] ? row.user_roles[0].department : '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="所属角色">
          <template #default="{ row }">
            {{ row.user_roles && row.user_roles[0] ? row.user_roles[0].role_name : '--' }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="register_time_str" label="包含用户数" width="120">
          <template #default="{row}">
           {{row.update_user && row.update_user[0] ? row.update_user[0].department : '--'}}
          </template>
        </el-table-column> -->
        <el-table-column prop="register_time_str" label="注册时间" min-width="100">
          <template #default="{ row }">
            {{ addDateFormat(row.register_time_str, 'YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time_str" label="最后登录" min-width="120">
          <template #default="{ row }">
            {{ row.last_login_time_str || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="is_checked" label="状态" align="center" min-width="80">
          <template #default="{ row }">
            <span :class="`user-status-${row.is_checked}`">{{ stateFormat(row.is_checked) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80">
          <template #default="{ row }">
            <el-popover placement="top" content="编辑" popper-class="oprate-tips" trigger="hover">
              <template slot="reference">
                <tg-icon
                  name="ico-edit"
                  style="font-size: 20px"
                  v-if="row.is_checked === 1 || row.is_checked === 2"
                  @click="handleEditClick(row)"
                />
              </template>
            </el-popover>
            <el-popover placement="top" content="审核" popper-class="oprate-tips" trigger="hover">
              <template slot="reference">
                <i
                  v-if="row.is_checked === 0"
                  class="iconfont icon-shenhe"
                  @click="handleApprovalClick(row)"
                ></i>
              </template>
            </el-popover>
            <el-popover
              placement="top"
              content="重新审核"
              popper-class="oprate-tips"
              trigger="hover"
            >
              <template slot="reference">
                <i
                  v-if="row.is_checked === 4"
                  class="iconfont icon-zhongxinshenhe"
                  @click="handleEditClick(row)"
                ></i>
              </template>
            </el-popover>
            <el-popover
              placement="top"
              content="删除用户"
              popper-class="oprate-tips"
              trigger="hover"
            >
              <template slot="reference">
                <i
                  v-if="row.is_checked === 2"
                  class="iconfont icon-shanchu"
                  @click="handleDeleteClick(row)"
                ></i>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <template #empty>
          <div class="no-data">
            <img src="@/assets/img/pls_import_product.png" />
            <p>没有找到用户</p>
          </div>
        </template>
      </el-table>
      <!-- 分页 -->
      <div class="block" style="margin: 16px 0 12px 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pagination.currentPage"
          :page-sizes.sync="pagination.pageSizes"
          :page-size.sync="pagination.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </tg-block>
    <!-- 审核弹窗 -->
    <el-dialog
      :visible="approvalDialogVisible"
      class="userinfo-customer-dialog"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="approvalDialogVisible = false"
    >
      <template #title>
        <div class="userinfo-customer-dialog-header">审核</div>
      </template>
      <div class="approval-content">
        <el-radio-group v-model="approvalForm.is_checked">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="4">拒绝</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <div class="userinfo-customer-dialog-footer">
          <tg-button @click="approvalDialogVisible = false" style="margin-right: 15px"
            >取消</tg-button
          >
          <tg-button type="primary" @click="handleApprovalSubmitClick">确定</tg-button>
        </div>
      </template>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog
      :visible="editDialogVisible"
      class="userinfo-customer-dialog"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleEditDialogClose"
    >
      <template #title>
        <span style="display: inline-block; padding-left: 20px">编辑用户</span>
      </template>
      <div class="edit-content">
        <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="110px">
          <el-form-item label="用户角色：" prop="role">
            <el-cascader
              v-model="editForm.role_selected_arr"
              class="edit-input"
              :options="departList"
              size="small"
              separator=">"
              placeholder="请选择用户角色"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="修改用户名：" prop="username">
            <el-input
              v-model="editForm.username"
              class="edit-input"
              size="small"
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item label="修改密码：" prop="password">
            <el-input
              v-model="editForm.password"
              type="password"
              class="edit-input"
              size="small"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item label="状态：" prop="is_checked">
            <el-radio-group v-model="editForm.is_checked" style="display: inline-flex">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="userinfo-customer-dialog-footer">
          <tg-button @click="handleEditDialogClose">取消</tg-button>
          <tg-button type="primary" class="mgl-10" @click="handleEditSubmitClick">确定</tg-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>
<script>
import { queryUser, UpdateUser, deleteUser } from '@/api/user';
import { loginRequired } from '@/utils/init';
import { getAllRoles } from '@/api/auth';
import { addDateFormat } from '@/utils/format';
// import {getUserInfo} from '@/api/auth'
// import { USER_ROLE } from '@/utils/config'
import { RIGHT_CODE } from '@/const/roleCode';
import { userStatus } from '@/const/options';

const editFormRules = {
  role: [{ required: true, message: '请选择用户角色', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  is_checked: [{ required: true, message: '请选择用户状态', trigger: 'blur' }],
};

export default {
  data() {
    return {
      departList: [],
      roleList: [],
      userStatus,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      displayQuery: {
        username: '',
        department: '',
        role: '',
        is_checked: '',
      },
      updateUserInfo: {
        userId: '',
        username: '',
        role: '',
        is_checked: '',
        roleOptions: [
          {
            value: 0,
            label: '客户执行',
          },
          {
            value: 1,
            label: '管理员',
          },
          {
            value: 2,
            label: '客户经理',
          },
          {
            value: 3,
            label: '项目经理',
          },
        ],
        stateOptions: [
          {
            value: 0,
            label: '未审核',
          },
          {
            value: 1,
            label: '已审核',
          },
          {
            value: 2,
            label: '禁用',
          },
        ],
      },
      editUserData: [],
      displayData: [],
      userInfoDisplay_loading: false,
      dialogTableVisible: false,

      // 审核
      approvalDialogVisible: false,
      approvalForm: {
        id: undefined,
        is_checked: undefined,
      },
      editDialogVisible: false,
      editForm: {
        id: undefined,
        username: undefined,
        role: undefined,
        role_selected_arr: undefined,
        is_checked: undefined,
        password: undefined,
      },
      editFormRules,
    };
  },
  created() {
    const roleArr = this.$store.getters['user/getUserRole'];
    if (!roleArr.includes(RIGHT_CODE.view_users)) {
      this.$router.push({ path: '/' });
    }

    loginRequired();
    // this.select()
    this.queryUserList();
    this.getDepartList();
  },
  methods: {
    addDateFormat,
    // 每页数量发生变化
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryUserList();
    },
    // 翻页
    handleCurrentChange() {
      this.queryUserList();
    },
    // 点击查询按钮
    queryUserInfosubmit() {
      this.pagination.currentPage = 1;
      this.queryUserList();
    },
    // 获取列表
    queryUserList() {
      const data = this.displayQuery;
      this.userInfoDisplay_loading = true;
      this.displayQuery.num = this.pagination.pageSize;
      this.displayQuery.page_num = this.pagination.currentPage;
      queryUser(data)
        .then(res => {
          const data = res.data;
          if (data.success) {
            this.pagination.total = data.data.total;
            this.displayData = data.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
          this.userInfoDisplay_loading = false;
        })
        .catch(() => {
          this.userInfoDisplay_loading = false;
        });
    },
    // 匹配状态名称
    stateFormat(isChecked) {
      let stateName = '--';
      const state = this.userStatus.find(item => item.value === isChecked);
      if (state) stateName = state.label;
      return stateName;
    },
    // 获取所有部门
    getDepartList() {
      getAllRoles().then(res => {
        // console.log(res)
        if (res.data.success) {
          this.departList = res.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message,
          });
        }
      });
    },
    // 部门选项选择事件
    handleDepartChange(depart) {
      this.roleList = [];
      this.displayQuery.role = undefined;
      const department = this.departList.find(item => item.value === depart);
      if (department) {
        this.roleList = department.children;
      }
    },
    // 重置
    handleResetClick() {
      this.$refs.searchForm.resetFields();
      this.pagination.currentPage = 1;
      this.queryUserList();
    },
    // 点击审核按钮
    handleApprovalClick(row) {
      // console.log(row)
      this.approvalDialogVisible = true;
      this.approvalForm.is_checked = row.is_checked;
      this.approvalForm.id = row.id;
    },
    // 点击审核弹窗保存
    handleApprovalSubmitClick() {
      if (!this.approvalForm.is_checked) {
        return this.$message({
          type: 'warning',
          message: '请选择审核状态',
          duration: 2000,
          showClose: true,
        });
      }

      UpdateUser(this.approvalForm).then(res => {
        if (res.data.success) {
          // 初始化数据
          this.displayData = [];
          this.approvalDialogVisible = false;
          this.queryUserList();
          this.$message({
            type: 'success',
            message: res.data.message,
            duration: 2000,
            showClose: true,
          });
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message,
            duration: 2000,
            showClose: true,
          });
        }
      });
    },
    // 点击编辑按钮
    handleEditClick(row) {
      this.editDialogVisible = true;
      // const detail = row
      for (const key in this.editForm) {
        if (row[key]) {
          this.editForm[key] = row[key];
        }
      }
      // this.editForm = detail
      this.editForm.role_selected_arr = [
        parseInt(row.user_roles[0].department_code, 10),
        row.user_roles[0].role_code,
      ];
      // debugger
    },
    // 点击编辑弹窗保存
    handleEditSubmitClick() {
      this.editForm.role = this.editForm.role_selected_arr[1];
      this.$refs.editForm.validate(valid => {
        if (valid) {
          // console.log(this.editForm)
          UpdateUser(this.editForm).then(res => {
            if (res.data.success) {
              this.displayData = [];
              this.editDialogVisible = false;
              this.queryUserList();
              this.$refs.editForm.resetFields();
            }
            this.$message({
              type: res.data.success ? 'success' : 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          });
        }
      });
    },
    // 关闭编辑弹窗处理方法
    handleEditDialogClose() {
      this.editDialogVisible = false;
      this.$refs.editForm.resetFields();
    },
    // 禁用的优化删除操作
    handleDeleteClick(row) {
      // debugger
      this.$confirm(`此操作将永久删除用户【${row.username}】, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-user-confirm',
      })
        .then(() => {
          deleteUser({
            id: row.id,
          }).then(res => {
            if (res.data.success) {
              this.queryUserList();
              this.$message({
                type: 'success',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
            } else if (res.data.message) {
              this.$message({
                type: 'warning',
                message: res.data.message,
                duration: 2000,
                showClose: true,
              });
            }
          });
        })
        .catch(() => {
          /* do nth */
        });
    },
  },
};
</script>
