<template>
  <div style="margin: 12px 24px 0 18px; height: 70px; text-align: center">
    <div class="titlediv" style="width: 100%; text-align: left; padding-left: 6px">
      {{ obj.one_lable
      }}{{
        (obj.people_num === null && obj.second_people_num === null) ||
        (obj.people_num === undefined && obj.second_people_num === undefined)
          ? '--'
          : formatAmount(Number(obj.people_num + obj.second_people_num).toFixed(0), 'None', true)
      }}
    </div>
    <div
      v-if="obj.one_lable !== '直播间曝光次数：'"
      style="width: 100%; height: 28px; display: flex; margin-top: 2px"
    >
      <div class="titlediv" style="width: 60px; text-align: right; padding-right: 12px">
        {{
          obj.people_num_ratio === null || obj.people_num_ratio === undefined
            ? '--'
            : obj.people_num_ratio + '%'
        }}
      </div>
      <div
        style="
          min-width: 80px;
          background: #39a1fe;
          padding-left: 12px;
          color: #ffffff;
          border-radius: 4px 0 0 4px;
          line-height: 28px;
          text-align: left;
        "
        :style="{ width: (obj.people_num_ratio || 0) + '%' }"
      >
        {{
          obj.people_num === null || obj.people_num === undefined
            ? '--'
            : formatAmount(Number(obj.people_num || 0).toFixed(0), 'None', true)
        }}
      </div>
      <div
        style="
          flex: 1;
          min-width: 80px;
          background: #0fc97c;
          text-align: right;
          padding-right: 12px;
          color: #ffffff;
          border-radius: 0 4px 4px 0;
          line-height: 28px;
        "
      >
        {{
          obj.second_people_num === null || obj.second_people_num === undefined
            ? '--'
            : formatAmount(Number(obj.second_people_num || 0).toFixed(0), 'None', true)
        }}
      </div>
      <div class="titlediv" style="width: 60px; text-align: left; padding-left: 12px">
        {{
          obj.second_people_num_ratio === null || obj.second_people_num_ratio === undefined
            ? '--'
            : obj.second_people_num_ratio + '%'
        }}
      </div>
    </div>
    <div
      v-else
      style="padding-left: 6px; width: 100%; height: 28px; display: flex; margin-top: 2px"
    >
      暂无数据
    </div>
  </div>
</template>

<script>
import { formatAmount } from '@/utils/string';

export default {
  name: 'line',
  props: {
    obj: {
      required: false,
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      formatAmount,
    };
  },
  computed: {},
  /* watch: {
    //监听器的作用就是用来监听数据是否发生了变化，变化后可以进行一些其他操作
    //只要没有发生变化，就没有办法进行其他的操作

    obj: {
      handler(oldVal, newVal) {
        console.log(oldVal);
        console.log(newVal);
      },
      deep: true,
    },
  },*/
  created() {},
};
</script>

<style scoped>
.titlediv {
  font-weight: 400;
  font-size: 14px;
  color: var(--text-color);
  line-height: 28px;
}
</style>
