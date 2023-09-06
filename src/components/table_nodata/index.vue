<template>
  <div
    v-if="!isvertical"
    style="
      color: #a9a6aa;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin: 30px 0;
    "
  >
    <i class="iconfont icon-weixiao" style="font-size: 27px !important"></i>
    <span style="margin-left: 5px; font-size: 14px">{{ title }}</span>
  </div>
  <div
    v-else
    style="
      color: #a9a6aa;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 30px 0;
    "
  >
    <img v-if="img" :src="img" alt="" srcset="" />
    <i v-else class="iconfont icon-weixiao" style="font-size: 27px !important"></i>
    <p style="margin-top: 5px; font-size: 14px">{{ title }}</p>
    <p v-if="subtitle && subtitle !== ''" class="subtitle">
      {{ subtitle }}
    </p>
  </div>
</template>

<script>
/**
 * 没有数据的表格展示 (下面参数带改造, 无法注释 )
 */
export default {
  name: 'TableNoData',
  props: ['title', 'img', 'isvertical', 'subtitle'],
};
</script>

<style lang="less" scoped>
.subtitle {
  background: rgba(246, 246, 247, 1);
  border-radius: 15px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(126, 129, 144, 1);
  padding: 3px 20px;
  margin-top: 10px;
}
</style>
