<!--
 * @Author: 矢车
 * @Date: 2020-12-28 15:07:25
 * @LastEditors: 矢车
 * @LastEditTime: 2020-12-30 17:25:57
 * @Description: -表格分页器组件
-->

<template>
  <div style="margin-top: 20px">
    <el-pagination
      @current-change="currentChange"
      background
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';

export default {
  props: {
    total: {
      type: Number,
      default: () => 0,
    },
  },
  emit: ['c_currentChange'],
  setup(props, ctx) {
    const paginationData = reactive({
      num: 10,
      page_num: 1,
    });

    // 当前页改变
    const currentChange = currentPage => {
      ctx.emit('c_currentChange', currentPage);
    };

    return {
      ...toRefs(paginationData),
      currentChange,
    };
  },
};
</script>
