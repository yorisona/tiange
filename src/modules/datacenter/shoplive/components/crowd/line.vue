<template>
  <div style="margin: 32px 32px 0 32px; height: 80px; text-align: center">
    <div style="width: 100%; height: 28px; display: flex">
      <div
        style="
          min-width: 80px;
          background: #00b8f0;
          padding-left: 24px;
          color: #ffffff;
          border-radius: 4px 0 0 4px;
          line-height: 28px;
          text-align: left;
        "
        :style="{ width: (obj.people_num_ratio || 0) + '%' }"
      >
        {{
          obj.people_num_ratio === null || obj.people_num_ratio === undefined
            ? '--'
            : (obj.people_num_ratio || 0) + '%'
        }}
      </div>
      <div
        style="
          flex: 1;
          min-width: 80px;
          background: var(--theme-color);
          text-align: right;
          padding-right: 24px;
          color: #ffffff;
          border-radius: 0 4px 4px 0;
          line-height: 28px;
        "
      >
        {{
          obj.second_people_num_ratio === null || obj.second_people_num_ratio === undefined
            ? '--'
            : (obj.second_people_num_ratio || 0) + '%'
        }}
      </div>
    </div>
    <div style="margin-top: 8px; display: flex; justify-content: space-between">
      <div
        style="
          font-weight: 400;
          font-size: 14px;
          color: #ffffff;
          text-align: left;
          min-width: 150px;
          border-bottom-left-radius: 100px;
          border-top-left-radius: 100px;
          width: 200px;
        "
      >
        <div
          style="
            font-weight: 400;
            font-size: 14px;
            color: var(--text-color);
            line-height: 20px;
            display: flex;
            justify-content: flex-start;
          "
        >
          <span>{{ obj.one_lable }}</span
          ><el-popover
            placement="top-start"
            title=""
            width="500"
            trigger="hover"
            :content="obj.issuccess ? onesuccessdetailstr : onefaildetailstr"
          >
            <el-button slot="reference">
              <!--                      <span class="icon-question">?</span>-->
              <!--<i class="el-icon-question" style="font-size: 16px; color: gray"></i
        >-->
              <tg-icon name="ico-icon_explain" style="font-size: 16px; color: #a4b2c2"></tg-icon>
            </el-button>
          </el-popover>
        </div>
        <div style="font-weight: 500; font-size: 14px; color: var(--text-color); line-height: 20px">
          {{
            obj.people_num === null || obj.people_num === undefined
              ? '--'
              : formatAmount(Number(obj.people_num || 0).toFixed(0), 'None', true)
          }}
        </div>
      </div>
      <div
        style="
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
          text-align: left;
          min-width: 150px;
          border-bottom-left-radius: 100px;
          border-top-left-radius: 100px;
          flex: 1;
          text-align: right;
          width: 200px;
        "
      >
        <div
          style="
            font-weight: 500;
            font-size: 14px;
            color: var(--text-color);
            line-height: 20px;
            display: flex;
            justify-content: flex-end;
          "
        >
          <span>{{ obj.two_lable }}</span
          ><el-popover
            placement="top-start"
            title=""
            width="500"
            trigger="hover"
            :content="obj.issuccess ? twosuccessdetailstr : twofaildetailstr"
          >
            <el-button slot="reference">
              <tg-icon name="ico-icon_explain" style="font-size: 16px; color: #a4b2c2"></tg-icon>
            </el-button>
          </el-popover>
        </div>
        <div style="font-weight: 400; font-size: 14px; color: var(--text-color); line-height: 20px">
          {{
            obj.second_people_num === null || obj.second_people_num === undefined
              ? '--'
              : formatAmount(Number(obj.second_people_num || 0).toFixed(0), 'None', true)
          }}
        </div>
      </div>
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
  computed: {
    onesuccessdetailstr() {
      return this.obj.one_lable === '首购人数'
        ? '在本场直播前的历史时间内没有购买过店铺的商品且在本场直播间的直播过程中购买店铺商品的用户'
        : this.obj.one_lable === '有互动人数'
        ? '在本场直播间有做过“点赞/评论/分享”行为且在本场直播间的直播过程中支付成功的用户'
        : this.obj.one_lable === '粉丝人数'
        ? '在本场直播间的直播过程中支付成功的用户中的粉丝用户，粉丝取的是：在本场直播结束的时间点正在关注抖音/抖音极速版/抖音火山版3端账号的用户，包含本场直播新增的粉丝。'
        : '';
    },
    twosuccessdetailstr() {
      return this.obj.two_lable === '复购人数'
        ? '在本场直播前的历史时间内购买过店铺的商品且在本场直播间的直播过程中购买店铺商品的用户'
        : this.obj.two_lable === '无互动人数'
        ? '在本场直播间没有做过“点赞/评论/分享”行为且在本场直播间购买商品的用户，包含退款'
        : this.obj.two_lable === '非粉丝人数'
        ? '在本场直播间的直播过程中支付成功的用户中的非粉丝用户，非粉丝取的是：在本场直播结束的时间点没有关注抖音/抖音极速版/抖音火山版3端账号的用户'
        : '';
    },
    onefaildetailstr() {
      return this.obj.one_lable === '观看40s+人数'
        ? '在本场直播间的直播过程中没有支付成功的用户中的观看直播时长大于等于40s 的用户'
        : this.obj.one_lable === '有互动人数'
        ? '在本场直播间有做过“点赞/评论/分享”行为且在本场直播间的直播过程中没有支付成功的用户'
        : this.obj.one_lable === '粉丝人数'
        ? '在本场直播间的直播过程中没有支付成功的用户中的粉丝用户，粉丝取的是：在本场直播结束的时间点正在关注抖音/抖音极速版/抖音火山版3端账号的用户，包含本场直播新增的粉丝。'
        : '';
    },
    twofaildetailstr() {
      return this.obj.two_lable === '无效观看人数'
        ? '在本场直播间的直播过程中没有支付成功的用户中的观看直播时长小于40s的用户'
        : this.obj.two_lable === '无互动人数'
        ? '在本场直播间没有做过“点赞/评论/分享”行为且在本场直播间的直播过程中没有支付成功的用户'
        : this.obj.two_lable === '非粉丝人数'
        ? '在本场直播间的直播过程中没有支付成功的用户中的非粉丝用户，非粉丝取的是：在本场直播结束的时间点没有关注抖音/抖音极速版/抖音火山版3端账号的用户'
        : '';
    },
  },
  /*watch: {
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
.el-button {
  border-width: 0;
  height: 20px;
  width: 24px;
  padding: 0 4px;
  background: transparent;
}
</style>
