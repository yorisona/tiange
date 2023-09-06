import { ref, defineComponent, h, computed } from '@vue/composition-api';
import type { RightTreeOriginal } from '@/types/tiange/system';
import { GetRights, SaveUserRight } from '@/services/system';
import { OptionType } from '@/types/base/advanced';
import { GetUsers } from '@/services/supplier'; //GetSubordinatesRightTree
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';

const typyMap = new Map<number, string>([
  [0, '全部'],
  [1, '仅展示勾选的权限'],
  [2, '仅展示未勾选的权限'],
]);
type code = {
  right_code: number;
  right_name: string;
};
export default defineComponent({
  name: 'editAuthorization',
  setup(props, ctx) {
    const treeData = ref<RightTreeOriginal[]>([]);
    const getRights = async () => {
      const { data: response } = await GetRights();
      if (response.success) {
        treeData.value = response.data;
      }
    };
    /* 默认选中 */
    const userInfo = ref<any>({});
    const show = async (value: any) => {
      // console.log(value, 'vs');
      userInfo.value = value;
      await getRights();
      if (!value?.right_codes?.length) return;
      treeRef.value?.setCheckedKeys(value.right_codes.map((i: code) => i.right_code));
      onCheck();
    };
    /* 复制员工权限 */
    const executor = ref<number>();
    const whetherTheCopyWasSuccessfulOrNot = ref(false);
    const copyPermissions = async () => {
      if (!executor.value || isSuccessful.value) return;
      whetherTheCopyWasSuccessfulOrNot.value = false;
      // const username = search_executor_list.value.find(
      //   (i: OptionType) => i.value === executor.value,
      // );
      const { right_codes } = search_executor_info.value.find((i: any) => i.id === executor.value);

      // const { data } = await GetSubordinatesRightTree({ username });

      if (right_codes?.length) {
        treeRef.value?.setCheckedKeys(right_codes?.map((i: code) => i.right_code));
        whetherTheCopyWasSuccessfulOrNot.value = true;
      } else {
        ctx.root.$message.error('该员工未配置权限，无法复制');
      }
    };
    const isSuccessful = computed(() => {
      return whetherTheCopyWasSuccessfulOrNot.value && executor.value;
    });
    /* 搜索花名 */
    const search_executor_list = ref<OptionType<number>[]>([]);
    const search_executor_info = ref<any>();
    const search_executor = async (search: string) => {
      GetUsers({
        search_value: search,
        search_type: 2,
        is_checked: 1,
      }).then((res: any) => {
        whetherTheCopyWasSuccessfulOrNot.value = false;
        search_executor_info.value = res.data;
        search_executor_list.value = res.data.map((item: any) => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      });
    };
    const dropdownText = ref<string>('全部');
    const treeRef = ref<any>();
    // 显示出未勾选的节点 checked
    const filterNodeMethod = (value: boolean | string, data: any, node: any) => {
      // 判断传值必须是 boolean 类型
      if (typeof value === 'boolean') {
        // 注意使用属性 node
        const b = value ? node.checked : !node.checked;
        return b;
      }
      return true;
    };
    /* 提交 */
    const password = ref<number>();
    const mask = ref(false);
    const onSaveBtnClick = async () => {
      // console.log(treeRef.value?.getCheckedNodes(), 'treeRef.value?.getCheckedNodes()');
      mask.value = true;
      const right_codes = treeRef.value?.getCheckedKeys();
      console.log(right_codes, 'right_codes');

      SaveUserRight({
        user_id: userInfo.value.id,
        right_codes,
        new_password: password.value,
        avatar: userInfo.value.avatar,
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
    const onCheck = () => {
      const checkRight = treeRef.value?.getCheckedKeys();
      const allRight = allRights();
      checkAll.value = checkRight?.length === allRight.length;
      console.log(allRight.length, checkRight.length, 'value, isSelect');
    };
    /* 全选 */
    const checkAll = ref(false);
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
    const handleCheckAllChange = () => {
      // console.log('checkAll', checkAll.value, treeData.value);

      if (checkAll.value) {
        treeRef.value?.setCheckedNodes(treeData.value);
      } else {
        treeRef.value?.setCheckedKeys([]);
      }
    };
    /* 上传头像 */
    const uploadMethod = {
      beforeDataUpload(config: any) {
        console.log(config, 'config');

        return ValidationFileUpload({ image: true, fileSize: 10 })(config);
      },
      dataSuccessHandle(res: any) {
        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上传失败');
        } else {
          const url = res.data.source;
          // formData.value.detail_file = [url];
          userInfo.value.avatar = url;
          // formRef.value?.clearValidate('detail_file');
        }
      },
    };
    return {
      show,
      treeData,
      executor,
      search_executor,
      isSuccessful,
      search_executor_list,
      dropdownText,
      filterNodeMethod,
      treeRef,
      onSaveBtnClick,
      copyPermissions,
      password,
      mask,
      userInfo,
      onCheck,
      checkAll,
      handleCheckAllChange,
      ...uploadMethod,
    };
  },
  render() {
    return (
      <div class="editAuthorization-box">
        <div class="header-box">
          <div>
            <tg-upload
              action="/api/resources/upload_file"
              data={{ type: 'visual_design', storage: 2 }}
              beforeUpload={this.beforeDataUpload}
              success={this.dataSuccessHandle}
              show-file-list={false}
            >
              <div class="headPortrait">
                {this.userInfo.avatar ? (
                  <img src={this.userInfo.avatar} class="headPortrait" alt="avatar" />
                ) : (
                  <i class="el-icon-plus avatar-uploader-icon" />
                )}
              </div>
            </tg-upload>
          </div>
          <div class="header-itme">
            <div>
              <span class="label">花名：</span>
              <span class="value">{this.userInfo.username}</span>
            </div>
            <div>
              <span class="label">手机号：</span>
              <span class="value">{this.userInfo.phone}</span>
            </div>
            <div>
              <span class="label">部门：</span>
              {/* <span class="value">{this.userInfo?.department_info?.department_name}</span> */}
              {this.userInfo?.department_info?.department_name?.length > 12 ? (
                <el-popover
                  placement="top-start"
                  trigger="hover"
                  content={this.userInfo?.department_info?.department_name}
                >
                  <span slot="reference">
                    {`${this.userInfo?.department_info?.department_name.substring(0, 12)}...`}
                  </span>
                </el-popover>
              ) : (
                <span class="value">{this.userInfo?.department_info?.department_name}</span>
              )}
            </div>
            <div>
              <span class="label">岗位：</span>
              <span class="value">{this.userInfo?.job_info?.job_name}</span>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <div class="mgb-16">
          <span>复制其他员工权限：</span>
          <el-select
            placeholder="请输入并选择花名"
            popper-class="el-select-popper-mini"
            style="width:200px;"
            v-model={this.executor}
            filterable={true}
            size="mini"
            remote={true}
            clearable
            // disabled={isDisable_contract_id}
            onClear={() => {
              this.executor = undefined;
              this.search_executor_list = [];
              this.treeRef?.setCheckedKeys(
                this.userInfo.right_codes.map((i: code) => i.right_code),
              );
            }}
            remote-method={this.search_executor}
          >
            {this.search_executor_list.map((item, key) => (
              <el-option key={key} value={item.value} label={item.label} />
            ))}
          </el-select>

          <span
            class="confirmReplication"
            style={this.executor || { color: '#C1C1C1', cursor: 'no-drop' }}
            onClick={this.copyPermissions}
          >
            <span
              v-show={this.isSuccessful && this.executor}
              class="el-icon-success"
              style="margin-right:4px;color:#33BA5D;"
            ></span>
            <span style={this.isSuccessful && { color: 'var(--disabled-color)' }}>
              {this.isSuccessful ? '复制成功' : '确认复制'}
            </span>
          </span>
        </div>
        <div class="wrap-box">
          <div class="mgb-8 permissionList-box">
            <span style="color: var(--text-third-color)">权限列表</span>
            <el-dropdown
              onCommand={(v: number) => {
                this.dropdownText = typyMap.get(v) || '全部';
                if (v === 0) {
                  this.treeRef.filter('');
                } else if (v === 1) {
                  this.treeRef.filter(true);
                } else {
                  this.treeRef.filter(false);
                }
              }}
            >
              <span class="el-dropdown-link" style="font-size:12px">
                {this.dropdownText}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                {Array.from(typyMap).map(([key, value]) => (
                  <el-dropdown-item key={key} command={key} style="font-size:12px">
                    {value}
                  </el-dropdown-item>
                ))}
                {/* <el-dropdown-item>全部</el-dropdown-item>
                <el-dropdown-item>仅展示勾选的权限</el-dropdown-item>
                <el-dropdown-item>仅展示未勾选的权限</el-dropdown-item> */}
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-checkbox
            style="margin-bottom:2px"
            v-model={this.checkAll}
            onChange={this.handleCheckAllChange}
          >
            全选
          </el-checkbox>
          <div class="tree-box">
            <el-tree
              popper-class="el-tree-popper-mini"
              ref="treeRef"
              data={this.treeData}
              node-key="right_code"
              show-checkbox={true}
              render-after-expand={false}
              filter-node-method={this.filterNodeMethod}
              // check-on-click-node={true}
              onCheck-change={this.onCheck}
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
        </div>
        <div class="mgt-16">
          <span>重置密码：</span>
          <el-input
            placeholder="请输入新密码"
            style="width:200px;"
            v-model={this.password}
            size="mini"
            clearable
            type="password"
          />
        </div>
        <tg-mask-loading visible={this.mask} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
