import { ref, defineComponent, h, onMounted, computed } from '@vue/composition-api';
// import { isEmpty } from '@/utils/func';
// import { Feishu_Department_and_User_List } from '@/services/performance';
import type { RightTreeOriginal } from '@/types/tiange/system';
import { useDialog } from '@/use/dialog';
import selectUser from './selectUser.vue';
import { GetRights, SaveUserRights } from '@/services/system';
import { GetAuthQueryUser } from '@/services/supplier';
import { Confirm } from '@/use/asyncConfirm';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';

// interface ITransFormDepartment extends Feishu.IDepartmentAndUser {
//   nodeType: number;
//   nodeId: string;
//   real_name: string;
// }
export default defineComponent({
  name: 'batchAuthorization',
  setup: (props, ctx) => {
    const treeData = ref<RightTreeOriginal[]>([]);
    /* 全选 */
    const checkAll = ref(false);
    const treeRef = ref<any>();
    const handleCheckAllChange = () => {
      // console.log('checkAll', checkAll.value, treeData.value);

      if (checkAll.value) {
        treeRef.value?.setCheckedNodes(treeData.value);
      } else {
        treeRef.value?.setCheckedKeys([]);
      }
    };
    const getAllRights = (node: any): any => {
      const codes = [];
      for (let i = 0; i < node.length; i++) {
        const children = node[i]?.sub_nodes;
        codes.push(node[i].right_code);
        if (children?.length > 0) {
          // console.log(children, 'node');
          codes.push(...getAllRights(children));
        }
      }
      return codes;
    };
    const allRights = () => {
      return getAllRights(treeData.value);
    };
    const onCheck = () => {
      const checkRight = treeRef.value?.getCheckedKeys();
      const allRight = allRights();
      checkAll.value = checkRight?.length === allRight.length;
      console.log(allRight.length, checkRight.length, 'value, isSelect');
    };
    /* 获取tree */
    /** 获取权限树 */
    const getRights = async () => {
      const { data: response } = await GetRights();
      if (response.success) {
        treeData.value = response.data;
        console.log(response.data, 11);
      }
    };
    onMounted(() => {
      getRights();
    });
    // const a = defineComponent({
    //   render() {
    //     return (
    //       <div>
    //         <h1>页面组件</h1>
    //         <button>自增</button>
    //       </div>
    //     );
    //   },
    // });

    /* 用户选择 */
    const selectedDepartment = ref<number[]>([]);
    const dialogSelectUser = useDialog({
      component: selectUser,
      title: '选择用户',
      width: '328px',
      okText: '确定',
      props: {},
      on: {
        submit(v: number[]) {
          selectedDepartment.value = v;
          queryUserList();
          dialogSelectUser.close();
        },
      },
    });
    const userList = ref<any>([]);
    const loading = ref(false);
    /* 查询用户列表 */
    const queryUserList = async (department_ids = selectedDepartment.value.join(',')) => {
      loading.value = true;
      const { data: response } = await GetAuthQueryUser({
        search_type: 2,
        page_num: 1,
        num: 1000,
        department_ids,
      });
      loading.value = false;
      if (response) {
        userList.value = response;
      }
    };
    const userCheckAll = ref(false);
    /* 用户列表全选状态 */
    const isIndeterminate = computed(() => {
      return (
        userCheckList.value.length > 0 &&
        userCheckList.value.length !== userList.value.length &&
        !userCheckAll.value
      );
    });
    const userCheckList = ref<any[]>([]);
    /* 用户列表点击事件 */
    const userCheckAllChange = (v: boolean) => {
      userCheckList.value = v ? userList.value.map((v: any) => v.id) : [];
    };
    const userCheckChange = (value: any[]) => {
      const checkedCount = value.length;
      userCheckAll.value = checkedCount === userList.value.length;
    };
    const editUserListBtn = ref(true);
    /* 删除用户 */
    const deleteUser = () => {
      if (!userCheckList.value.length) return;
      Confirm('是否删除用户？').then(() => {
        userList.value = userList.value.filter((v: any) => !userCheckList.value.includes(v.id));
        selectedDepartment.value = userList.value.map((v: any) => v.department_id);
        userCheckList.value = [];
        userCheckAll.value = false;
        ctx.root.$message.success('删除成功');
      });
    };
    /* 批量导入 */
    const beforeMerchantUpload = (config: any) =>
      ValidationFileUpload({ excel: true, fileSize: 5 })(config);
    const successMerchantUpload = (res: { data: any; success: boolean; message: string }) => {
      if (res && res.success) {
        const _userIds = userList.value.map((v: any) => v.id);
        userList.value.push(...res.data.filter((v: any) => !_userIds.includes(v.id)));
        // reload(true);
      } else {
        ctx.root.$message.error(res.message);
      }
    };
    /* 提交 */
    const mask = ref(false);
    const onSaveBtnClick = async () => {
      console.log(treeRef.value?.getCheckedKeys(), '111');
      const right_codes = treeRef.value?.getCheckedKeys();
      if (!userList.value.length) return ctx.root.$message.warning('请选择用户');
      if (!editUserListBtn.value) return ctx.root.$message.warning('请先完成用户确认');
      mask.value = true;
      SaveUserRights({
        user_ids: userList.value.map((v: any) => v.id),
        right_codes,
      }).then(res => {
        mask.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '保存成功');
          ctx.emit('submit');
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
      });
    };
    return {
      treeData,
      handleCheckAllChange,
      checkAll,
      treeRef,
      onCheck,
      isIndeterminate,
      userCheckList,
      userCheckAll,
      userList,
      dialogSelectUser,
      userCheckAllChange,
      userCheckChange,
      selectedDepartment,
      editUserListBtn,
      deleteUser,
      beforeMerchantUpload,
      successMerchantUpload,
      onSaveBtnClick,
      mask,
      loading,
    };
  },
  render() {
    return (
      <div class="batchAuthorization">
        <div class="subtitle">选择权限后可选择多用户进行批量授权</div>
        <div class="batchAuthorization-wrap">
          <div class="wrap-box pd-12">
            <div class="mgb-16">选择权限</div>
            <el-checkbox v-model={this.checkAll} onChange={this.handleCheckAllChange}>
              全选
            </el-checkbox>
            <el-tree
              ref="treeRef"
              popper-class="el-tree-popper-mini"
              data={this.treeData}
              node-key="right_code"
              show-checkbox={true}
              render-after-expand={false}
              onCheck-change={this.onCheck}
              // expand-on-click-node={false}
              // check-on-click-node={true}
              // filter-node-method={(value: string, data: any) => {
              //   if (isEmpty(value)) return true;
              //   return data.right_name.indexOf(value) !== -1;
              // }}
              render-content={(h: any, { data }: { data: any }) => {
                if (data.level === 3) {
                  return (
                    <div style="width:66px">
                      {data.right_name.length > 6 ? (
                        <el-popover
                          v-show={data.right_name.length > 6}
                          placement="top-start"
                          width="66"
                          trigger="hover"
                          content={data.right_name}
                        >
                          <span slot="reference">
                            {data.right_name.length > 6
                              ? `${data.right_name.substring(0, 6)}...`
                              : data.right_name}
                          </span>
                        </el-popover>
                      ) : (
                        <span>{data.right_name}</span>
                      )}
                    </div>
                  );
                }
                return <span>{data.right_name}</span>;
              }}
              props={{
                props: {
                  label: 'right_name',
                  children: 'sub_nodes',
                },
              }}
            />
          </div>
          <div class="wrap-box rt-box">
            <div class="rt-top">
              <div class="mgb-16">选择用户</div>
              <div class="btn-box">
                <tg-button
                  onClick={() => this.dialogSelectUser.show(this.selectedDepartment)}
                  class=" mgr-16"
                  icon="ico-btn-add"
                >
                  手动选择
                </tg-button>
                <tg-upload
                  action="/api/auth/batch/import_users"
                  // data="{ project_id: project_id }"
                  show-file-list={false}
                  beforeUpload={this.beforeMerchantUpload}
                  success={this.successMerchantUpload}
                >
                  <tg-button class="mgr-12" icon="ico-upload-lite">
                    批量导入
                  </tg-button>
                </tg-upload>
                <a
                  class="download"
                  // target="_blank"
                  href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/%E8%A6%81%E4%BF%AE%E6%94%B9%E6%9D%83%E9%99%90%E7%9A%84%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx"
                  download
                >
                  下载模板
                </a>
              </div>
              <dir class="subtitle">仅支持xlsx, xls文件格式上传，文件大小不超过5MB</dir>
              <div class="line"></div>
              <div class="edit-box">
                <div style="color:var(--text-third-color);">
                  共 <span style="color:#333">{this.userList.length}</span> 人
                </div>
                <div class="editBtn" onClick={() => (this.editUserListBtn = !this.editUserListBtn)}>
                  {this.editUserListBtn ? '编辑' : '完成'}
                </div>
              </div>
            </div>
            <div v-show={!this.editUserListBtn} class="delete-box" style="margin-bottom: 16px;">
              <el-checkbox
                disabled={this.userList.length === 0}
                indeterminate={this.isIndeterminate}
                v-model={this.userCheckAll}
                onChange={this.userCheckAllChange}
              >
                全选
              </el-checkbox>
              <div
                class="deleteBtn mgr-24"
                onClick={() => {
                  this.deleteUser();
                }}
                style={this.userCheckList.length || { color: '#C1C1C1', cursor: 'no-drop' }}
              >
                删除
              </div>
            </div>
            <div class="rt-bottom" v-loading={this.loading}>
              <div v-show={!this.editUserListBtn}>
                <el-checkbox-group
                  class="checkBox-wrap"
                  v-model={this.userCheckList}
                  onChange={this.userCheckChange}
                >
                  {this.userList.map((item: any) => {
                    return (
                      <el-checkbox label={item.id} class="checkBox-item">
                        {/* {item.username} */}
                        {item.username.length > 2 ? (
                          <el-popover
                            v-show={item.username.length > 2}
                            placement="top-start"
                            width="66"
                            trigger="hover"
                            content={item.username}
                          >
                            <span slot="reference">
                              {item.username.length > 2
                                ? `${item.username.substring(0, 2)}...`
                                : item.username}
                            </span>
                          </el-popover>
                        ) : (
                          <span>{item.username}</span>
                        )}
                      </el-checkbox>
                    );
                  })}
                </el-checkbox-group>
              </div>
              <div v-show={this.editUserListBtn} class="checkBox-wrap">
                {this.userList.map((item: any) => {
                  return (
                    <div class="checkBox-item">
                      {item.username.length > 2 ? (
                        <el-popover
                          v-show={item.username.length > 2}
                          placement="top-start"
                          width="66"
                          trigger="hover"
                          content={item.username}
                        >
                          <span slot="reference">
                            {item.username.length > 2
                              ? `${item.username.substring(0, 2)}...`
                              : item.username}
                          </span>
                        </el-popover>
                      ) : (
                        <span>{item.username}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <tg-mask-loading visible={this.mask} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
