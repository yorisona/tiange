/*
 * @Author: 矢车
 * @Date: 2020-12-29 18:05:30
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-08 17:43:05
 * @Description: 新增/编辑用户
 */
// @ts-nocheck
import { ref, toRefs, reactive, onMounted, watch, nextTick } from '@vue/composition-api';
import { enumBussinessType, enumUserStatus } from '@/utils/enumFunc';
import { getDepartmentTree, getJobList, postSaveUser } from '@/api/system';
import { popoverShow, popoverHide, selectControlPopoverHide } from '@/utils/tree-other';
import { ElInput } from 'element-ui/types/input';

import singleTrees from '@/components/system-set/trees/singleTrees.vue';

export default {
  components: {
    singleTrees,
  },
  props: {
    /** 类型字符串 */
    type: {
      type: String,
      default: '新增',
    },
    /** 用户id */
    id: {
      type: Number,
    },
  },
  setup(props, ctx) {
    const usernameRef = ref<ElInput | undefined>(undefined);
    const isDialog = ref(false);
    const formData = reactive({
      // 表单数据
      form: {
        username: '',
        phone: '',
        job_id: '',
        department_id: '',
        business_type: [],
        password: undefined,
        is_checked: 1,
      },
      // 表单中不需要提交单需要用到的
      form_other: {
        department_name: '',
        job_list: [],
        isVerify: false,
      },
      // 表单规则
      rules: {
        username: [{ required: true, message: '请输入用户花名', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        job_id: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        department_id: [{ required: true, message: '请选择部门', trigger: 'change' }],
        business_type: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        is_checked: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      // 部门树结构数据
      treeData: [],
    });

    onMounted(() => {
      getDepartmenttree();
    });

    // 1. 获取部门树
    const getDepartmenttree = async () => {
      const res = await getDepartmentTree();
      if (res.data.success) {
        formData.treeData = res.data.data;
      }
    };

    // 2. 获取子组件选择传来的部门数据
    const p_handleTreeDataCall = departmentData => {
      formData.form_other.department_name = departmentData.department_name;
      formData.form.department_id = departmentData.id;
      // 获取岗位数据
      formData.form.job_id = '';
      // 清除表单验证红框
      formData.form_other.isVerify = false;
      getJobLists();
    };

    // 3. 获取岗位数据
    const getJobLists = async () => {
      const res = await getJobList({
        department_id: formData.form.department_id,
      });
      if (res.data.success) {
        formData.form_other.job_list = res.data.data;
      }
    };

    // 4. 当前是编辑
    const editClick = editDatas => {
      formData.form.username = editDatas.username;
      formData.form.phone = editDatas.phone;
      formData.form.department_id = editDatas.department_id;
      formData.form_other.department_name = editDatas.department_info?.department_name || '';
      formData.form.job_id = editDatas.job_id;
      getJobLists(); // 岗位数据回显
      formData.form_other.job_name = editDatas.job_info.job_name;
      // 如果不做个判断，如果是空，一进来就会行表单验证，因为表单验证写的是change，为了兼容老数据为空的情况
      if (editDatas.business_type.length) {
        formData.form.business_type = editDatas.business_type;
      }
      formData.form.is_checked = editDatas.is_checked;

      // 部门选中回显(放到异步执行,不然获取不到refs)
      setTimeout(() => {
        // 设置树节点勾选
        ctx.refs.singleTree.editCheck(editDatas);
      }, 0);
    };

    // 5. 清除表单数据(注意，用 destory-on-close 必须要里面是个组件才行)
    const resetForm = () => {
      formData.form.username = '';
      formData.form.phone = '';
      formData.form.department_id = '';
      formData.form_other.department_name = '';
      formData.form.job_id = '';
      formData.form_other.job_name = '';
      formData.form.business_type = [];
      formData.form.is_checked = 1;
      formData.form.password = undefined;
      formData.form_other.isVerify = false;
    };

    // 6. 提交表单校验
    const submitForm = formName => {
      if (formData.form.department_id) {
        formData.form_other.isVerify = false;
      } else {
        formData.form_other.isVerify = true;
      }
      ctx.refs[formName].validate(async valid => {
        if (valid) {
          if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(formData.form.phone)) {
            ctx.root.$message({
              type: 'error',
              message: '手机号格式不正确',
            });
            return;
          }

          const payload = {
            ...formData.form,
          };

          if (props.type === '编辑') {
            payload.id = props.id;
          }
          const res = await postSaveUser(payload);
          if (res.data.success) {
            ctx.root.$message({
              type: 'success',
              message: '保存成功',
            });
            ctx.parent.getData(); // 刷新列表
            ctx.emit('save:done');
            isDialog.value = false;
          } else {
            ctx.root.$message({
              type: 'error',
              message: res.data.message,
            });
          }
        } else {
          return false;
        }
      });
    };

    // 7. 关闭 dialog 回调
    const closeDialog = () => {
      resetForm();
      ctx.emit('cancel');
    };

    const onCancelClick = () => {
      isDialog.value = false;
      ctx.emit('cancel');
    };

    watch(
      () => isDialog.value,
      newIsDialog => {
        if (newIsDialog) {
          if (!formData.form.username) {
            nextTick(() => {
              usernameRef.value?.focus();
            });
          }
        }
      },
    );

    return {
      usernameRef,
      isDialog,
      ...toRefs(formData),
      getDepartmenttree,
      editClick,
      submitForm,
      getJobLists,
      enumBussinessType,
      enumUserStatus,
      resetForm,
      p_handleTreeDataCall,
      closeDialog,
      selectControlPopoverHide,
      popoverShow,
      popoverHide,
      onCancelClick,
    };
  },
};
