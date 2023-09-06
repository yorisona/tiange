<!--
 * @Author: 肖槿
 * @Date: 2021-07-22 14:47:34
 * @Description: input数字区间
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-07-22 17:34:58
 * @FilePath: \goumee-star-frontend\src\modules\supplier\kolManage\inputRange.vue
-->
<template>
  <div :class="defClass">
    <input
      v-model="min"
      maxLength="12"
      @focus="focusHandler"
      @blur="blurHandler"
      @input="inputHandler($event, 'min')"
      autocomplete="off"
      class="el-range-input"
    />
    <span class="el-range-separator">~</span>
    <input
      v-model="max"
      maxLength="12"
      @focus="focusHandler"
      @blur="blurHandler"
      @input="inputHandler($event, 'max')"
      autocomplete="off"
      style="margin-left: 10px"
      class="el-range-input"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from '@vue/composition-api';
import { getPositiveNumber } from '@/utils/string';
export default defineComponent({
  name: 'InputRange',
  props: {
    size: {
      type: String,
      default: 'small',
    },
    value: {
      type: Array,
      default: () => [],
    },
  },
  setup(prop, ctx) {
    const defClass = ref([
      'xiaojin-input-range',
      'el-date-editor',
      'el-range-editor',
      'el-input__inner',
      'el-date-editor--daterange',
      'el-range-editor--small',
      'el-range-input',
    ]);
    const min = ref('');
    const max = ref('');
    const focusHandler = () => {
      if (!defClass.value.includes('is-active')) {
        defClass.value.push('is-active');
      }
    };
    const blurHandler = () => {
      if (defClass.value.includes('is-active')) {
        const idx = defClass.value.findIndex(item => item === 'is-active');
        idx !== -1 && defClass.value.splice(idx, 1);
      }
    };
    const inputHandler = (event: any, key: any) => {
      const val = getPositiveNumber(event.target.value);
      if (key === 'min') {
        min.value = val;
      } else {
        max.value = val;
      }
      event.target.value = val;
    };
    watch(
      () => prop.value,
      val => {
        min.value = (val[0] as any) ?? '';
        max.value = (val[1] as any) ?? '';
      },
    );
    watch(
      () => min.value,
      val => {
        ctx.emit('input', [val, max.value]);
      },
    );
    watch(
      () => max.value,
      val => {
        ctx.emit('input', [min.value, val]);
      },
    );
    onMounted(() => {
      defClass.value.push('el-range-editor--' + prop.size);
      min.value = (prop.value[0] as any) ?? '';
      max.value = (prop.value[1] as any) ?? '';
    });
    return {
      defClass,
      focusHandler,
      blurHandler,
      inputHandler,
      min,
      max,
    };
  },
});
</script>

<style lang="less" scoped>
.xiaojin-input-range {
  min-width: 150px;
  & input.el-range-input {
    width: 50px;
  }
}
</style>
