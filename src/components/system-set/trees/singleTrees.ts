/*
 * @Author: 矢车
 * @Date: 2020-12-30 16:53:47
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-21 17:33:04
 * @Description: 单选树形组件
 */
// @ts-nocheck
import { reactive, toRefs } from '@vue/composition-api';

export default {
  props: {
    /** 展示数据 */
    c_treeData: {
      type: Array,
    },
  },
  emits: ['handleTreeDataCall'],
  setup(props, ctx) {
    const data = reactive({
      /** 默认显示节点字段配置 */
      defaultProps: {
        label: 'department_name',
        children: 'sub_nodes',
      },
    });

    /** 1. 复选框被选中回调 */
    const check = data => {
      // 实现单选
      ctx.refs.single_tree.setCheckedKeys([]);
      ctx.refs.single_tree.setCheckedKeys([data.id]);
      // 回传数据
      ctx.emit('handleTreeDataCall', data);
    };

    /** 2. 编辑用户的时候设置选中 */
    const editCheck = data => {
      // 设置树选中
      ctx.refs.single_tree.setCheckedKeys([data.department_info.id]);
    };

    /** 3. 清空所有选中状态 */
    const resetCheck = () => {
      ctx.refs.single_tree.setCheckedKeys([]);
    };

    return {
      ...toRefs(data),
      check,
      editCheck,
      resetCheck,
    };
  },
};
