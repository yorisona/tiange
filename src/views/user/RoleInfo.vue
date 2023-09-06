<!--
 * @Description: 用户管理
 * @Author: your name
 * @Date: 2019-08-06 09:35:27
 * @LastEditTime: 2019-08-16 15:13:43
 * @LastEditors: Please set LastEditors
 -->
<style lang="scss" scoped>
$color-primary: var(--theme-color);
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
.sale-chance-wrap {
  background-color: #f8f8f8;
  padding: 5px 12px;
  line-height: 26px;
  margin: 10px 0;
  .chance-checkbox {
    margin: 0 5px 0 0;
    min-width: 110px;
  }
}
.sale-chance-wrap1 {
  text-align: left;
  padding: 6px 12px;
  line-height: 25px;
  .chance-checkbox {
    margin: 0 7px 0 0;
    min-width: 90px;
  }
}

.user-info-wrapper {
  .el-button--primary {
    padding: 8px 0;
    text-align: center;
    font-size: 14px;
  }
  .table-user {
    padding-left: 20px;
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .user-status {
    position: relative;
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: $color-primary;
      left: -12px;
      top: 6px;
    }
    &.user-status-0::before {
      background: #ff8549;
    }
    &.user-status-1::before {
      background: #2877ff;
    }
    &.user-status-2::before {
      background: #999999;
    }
    &.user-status-4::before {
      background: #f34b60;
    }
  }

  .no-data {
    margin: 200px 0;
    p {
      color: var(--text-des-color);
      margin-top: 5px;
    }
  }
  .serach-reset-btns {
    .el-button {
      vertical-align: middle;
      width: 60px;
      height: 30px;
      padding: 0;
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
.el-checkbox {
  color: var(--text-des-color);
}
</style>

<style lang="scss" scoped>
@import '@/styles/vars.scss';

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
    background: #f8f8f8;
    padding: 0;
    border-bottom: #efefef solid 1px;
    .userinfo-customer-dialog-header {
      // background: #F8F8F8;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: var(--text-second-color);
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
      .el-radio {
        & + .el-radio {
          padding-left: 60px;
        }
        span.el-radio__input,
        span.el-radio__label {
          vertical-align: text-top;
          font-size: 14px;
        }
      }
    }
    .edit-content {
      margin: 0 auto;
      .edit-input {
        display: inline-block;
        width: 483px;
        .el-input__inner {
          border-radius: 10px;
          color: #dedede;
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
      border-radius: 10px;
      height: 36px;
      padding: 0;
      text-align: center;
      font-size: 12px;
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
.el-table td,
.el-table th {
  padding: 8px 0;
  min-height: 50px;
}
</style>

<template>
  <section class="user-info-wrapper mgt-10">
    <tg-block>
      <el-form
        :inline="true"
        :model="roleQuery"
        ref="searchForm"
        style="overflow: hidden; display: flex"
      >
        <el-form-item label="所属部门：" prop="department">
          <el-select
            v-model="roleQuery.department"
            size="small"
            style="width: 150px"
            clearable
            placeholder="请选择"
            @change="handleDepartChange"
            @clear="queryRoleList"
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
        stripe
        :header-cell-style="{
          background: 'var(--table-thead-th-bg-color)',
          height: '48px',
          color: 'var(--text-second-color)',
        }"
        :data="roleData"
        v-loading="userInfoDisplay_loading"
      >
        <el-table-column label="序号" type="index" align="center" width="100"></el-table-column>
        <el-table-column prop="role_name" label="角色名" class-name="table-user" width="200" />
        <el-table-column
          prop="department_str"
          label="所属部门"
          class-name="table-user"
          width="200"
        />
        <el-table-column prop="user_num" label="包含用户数" class-name="table-user" width="200" />
        <el-table-column label="操作" class="operation" min-width="300">
          <template #default="{ row }">
            <el-popover placement="top" content="编辑" popper-class="oprate-tips" trigger="hover">
              <template slot="reference">
                <tg-icon name="ico-edit" style="font-size: 20px" @click="handleEditClick(row)" />
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
    <!-- 编辑弹窗 -->
    <el-dialog
      :visible="editDialogVisible"
      class="userinfo-customer-dialog list-left"
      width="990px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleEditDialogClose"
    >
      <template #title> <span>编辑角色</span> </template>
      <div class="edit-content">
        <el-form :model="editForm" :rules="editFormRules" ref="editForm">
          <el-form-item label="角色名:" prop="role_name">
            <el-input
              v-model="editForm.role_name"
              class="edit-input"
              size="small"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-table
          stripe
          :data="powerData"
          class="list-left"
          style="width: 100%; margin-top: 9px"
          :cell-style="{ padding: '10px 0px' }"
          :row-style="{ backgroundColor: 'var(--table-thead-th-bg-color)' }"
          :show-header="false"
          :highlight-current-row="false"
          :default-expand-all="true"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div class="sale-chance-wrap1">
                <el-checkbox-group
                  v-model="props.row.checkedPowers"
                  @change="val => handleCheckedPowersChange(val, props.row)"
                >
                  <el-checkbox
                    style="font-weight: 400 !important; width: 23%"
                    class="chance-checkbox"
                    v-for="(right, index) in props.row.powers"
                    :label="right.code"
                    :key="index"
                    >{{ right.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </template>
          </el-table-column>
          <el-table-column>
            <template v-slot="scope">
              <el-checkbox
                style="font-weight: 600 !important; color: #333"
                v-model="scope.row.isSelectAll"
                @change="val => handleCheckdPowersAllChange(val, scope.row)"
                >{{ scope.row.name }}</el-checkbox
              >
            </template>
          </el-table-column>
        </el-table>
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
import { deleteUser } from '@/api/user';
import { loginRequired } from '@/utils/init';
import { getAllRoles, queryRole, getAllRights, UpdateRole } from '@/api/auth';
import { RIGHT_CODE } from '@/const/roleCode';
import { userStatus } from '@/const/options';
import { mapGetters, mapMutations } from 'vuex';

const editFormRules = {
  role_name: { required: true, message: '请输入角色名称', trigger: 'blur' },
};

export default {
  data() {
    return {
      powerData: [],
      activeNames: ['1'],
      departList: [],
      roleList: [],
      rightCodes: [],
      userStatus,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30],
        total: 0,
      },
      roleQuery: {
        department: '',
      },
      roleData: [],
      userInfoDisplay_loading: false,
      dialogTableVisible: false,
      editDialogVisible: false,
      editForm: {
        role_code: undefined,
        role_name: undefined,
        right_codes: [],
        user_num: undefined,
      },
      editFormRules,
    };
  },
  computed: {
    ...mapGetters({
      UsersInfo: 'user/getUserInfo',
    }),
  },
  created() {
    const roleArr = this.$store.getters['user/getUserRole'];
    if (!roleArr.includes(RIGHT_CODE.view_users)) {
      this.$router.push({ path: '/' });
    }
    loginRequired();
    // this.select()
    this.queryRoleList();
    this.getDepartList();
    this.getRights();
  },
  methods: {
    ...mapMutations({
      updateUserPower: 'user/updateUserPower',
      updateUserMenuPower: 'user/updateUserMenuPower',
    }),
    // 选择每一个
    handleCheckedPowersChange(val, row) {
      row.isSelectAll = row.checkedPowers.length === row.powers.length;
    },
    // 全选每一项
    handleCheckdPowersAllChange(val, row) {
      if (val) {
        row.powers.map(p => (p.isSelect = true));
        row.checkedPowers = row.powers.map(p => p.code);
      } else {
        row.powers.map(p => (p.isSelect = false));
        row.checkedPowers = [];
      }
    },
    // 判断是否选择
    judgeCheckdPowers() {
      let selPowers = [];
      this.powerData.map(p => {
        selPowers = selPowers.concat(p.checkedPowers);
      });
      return selPowers;
    },
    // 每页数量发生变化
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.queryRoleList();
    },
    // 翻页
    handleCurrentChange() {
      this.queryRoleList();
    },
    // 点击查询按钮
    queryUserInfosubmit() {
      this.pagination.currentPage = 1;
      this.queryRoleList();
    },
    // 获取角色列表
    queryRoleList() {
      const data = this.roleQuery;
      this.userInfoDisplay_loading = true;
      this.roleQuery.num = this.pagination.pageSize;
      this.roleQuery.page_num = this.pagination.currentPage;
      queryRole(data)
        .then(res => {
          const data = res.data;
          if (data.success) {
            this.pagination.total = data.data.total;
            this.roleData = data.data.data;
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
    // 获取所有权限
    getRights() {
      getAllRights().then(res => {
        if (res.data.success) {
          this.rightCodes = res.data.data;
        } else {
          this.$message({
            type: 'warning',
            message: res.data.message,
          });
        }
      });
    },
    // 绑定权限数据
    bindPowerData() {
      const powersData = [];
      const rightCodes = JSON.parse(JSON.stringify(this.rightCodes));
      const rightData = JSON.parse(JSON.stringify(this.editForm.right_codes));
      if (rightCodes) {
        rightCodes.map(r => {
          const newpower = {
            name: `${r.page_name}【模块】`,
            powers: [],
            isSelectAll: false,
            checkedPowers: [],
          };
          if (r.rights && r.rights.length > 0) {
            r.rights.map(rc => {
              if (rightData.indexOf(rc.value) > -1) newpower.checkedPowers.push(rc.value);
              newpower.powers.push({
                code: rc.value,
                name: rc.label,
              });
            });
            if (newpower.checkedPowers.length === newpower.powers.length)
              newpower.isSelectAll = true;
          }
          powersData.push(newpower);
        });
      }
      this.powerData = powersData;
    },
    // 部门选项选择事件
    handleDepartChange(depart) {
      this.roleList = [];
      this.roleQuery.role = undefined;
      const department = this.departList.find(item => item.value === depart);
      if (department) {
        this.roleList = department.children;
      }
    },
    // 重置
    handleResetClick() {
      this.$refs.searchForm.resetFields();
      this.pagination.currentPage = 1;
      this.queryRoleList();
    },
    // 点击编辑按钮
    handleEditClick(row) {
      this.editDialogVisible = true;
      const editForm = {
        role_code: row.role_code,
        role_name: row.role_name,
        right_codes: row.right_code_list,
      };
      this.editForm = editForm;
      this.bindPowerData();
    },
    // 点击编辑弹窗保存
    handleEditSubmitClick() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          const selPowers = this.judgeCheckdPowers();
          if (selPowers.length <= 0) {
            this.$message.warning('请选择权限');
            return;
          }
          this.editForm.right_codes = selPowers;
          UpdateRole(this.editForm).then(res => {
            if (res.data.success) {
              // 更新当前用户的权限
              this.updateUserRole(this.editForm);
              this.roleData = [];
              this.editDialogVisible = false;
              this.queryRoleList();
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
    // 更新用户角色
    updateUserRole(roleinfo) {
      if (roleinfo && roleinfo.role_code === this.UsersInfo.role) {
        // 按钮更新权限
        this.updateUserPower(roleinfo.right_codes);
        // 菜单权限
        this.updateUserMenuPower(this.$router.options.routes[3].children);
      }
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
              this.queryRoleList();
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
