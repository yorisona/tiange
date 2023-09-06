<!--
 * @Brief: 场景对比
-->
<template>
  <div>
    <el-dialog
      class="customer-dialog tg-dialog-vcenter"
      :visible="visiable"
      append-to-body
      :close-on-click-modal="false"
      @close="handleCloseAction"
    >
      <template #title>场景对比</template>
      <div class="news-body">
        <template v-for="(item, index) in formList">
          <div class="select-item" :key="index">
            <el-image :src="imgTokenUrl(item.live_screenshot_url)" lazy>
              <template #error>
                <el-image
                  :src="emptyGoods"
                  style="height: 120px; width: 120px; margin: 180px 80px"
                ></el-image>
              </template>
            </el-image>
            <div class="title">{{ gettimeStr(item.live_start_time, item.live_end_time) }}</div>
            <div>
              进入率（人数）：<span>{{ item.exposure_watch_ucnt_ratio }}%</span>
            </div>
            <div>
              进入率（人次）：<span>{{ item.exposure_watch_times_ratio }}%</span>
            </div>
            <div class="change" v-if="item.change_tips && item.change_tips.length > 0">
              变更信息：<span class="yingzhuang" v-if="item.change_tips.includes(1)">硬装</span
              ><span class="dengguang" v-if="item.change_tips.includes(2)">灯光</span
              ><span class="jiwei" v-if="item.change_tips.includes(3)">机位</span
              ><span class="chenlie" v-if="item.change_tips.includes(4)">陈列</span
              ><span class="tiepian" v-if="item.change_tips.includes(5)">贴片</span
              ><span class="tiaose" v-if="item.change_tips.includes(6)">调色</span>
            </div>
            <div class="change" v-else>变更信息：--</div>
          </div>
        </template>
        <div v-if="formList.length < 1" style="margin: auto 20px">
          <empty-common />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./scene.contrast.ts"></script>
<style>
.tpc .el-time-spinner__wrapper {
  width: 100% !important;
}
.tpc .el-time-spinner__wrapper:nth-of-type(2) {
  display: none !important;
}
</style>
<style lang="less" scoped>
/deep/.el-dialog {
  min-width: 300px;
  max-width: 90%;
  width: auto;
}
.header-title {
  height: 40px;
  background: rgba(255, 122, 54, 0.06);
  width: 100%;

  font-size: 12px;
  color: #ff7a36;
  line-height: 40px;
  padding: 0px 20px;
  /deep/ .ico-warn {
    width: 20px;
    font-size: 16px;
    top: -1px;
    color: #ff7a36;
    height: 20px;
    margin-top: -3px;
    margin-right: 5px;
    vertical-align: middle;
  }
}
.news-body {
  height: 630px;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  /*flex-wrap: wrap;//不要换行*/
  width: 100%;
  padding: 18px;
  column-gap: 20px;
  .select-item {
    display: flex;
    justify-content: left;
    flex-direction: column;
    width: 280px !important;
    margin-bottom: 0px;
    div {
      font-size: 12px;
      line-height: 17px;
      color: var(--text-second-color);
      margin-bottom: 4px;
      &.title,
      span {
        font-weight: 600;
        color: var(--text-color);
      }
      &.change {
        span {
          font-weight: 400;
          color: #556ff6;
          padding: 1px 2px;
          display: inline-block;
          background: rgba(85, 111, 246, 0.08);
          margin-right: 4px;
          border-radius: 2px;
          &.yingzhuang {
            color: #556ff6;
            background: rgba(85, 111, 246, 0.08);
          }
          &.dengguang {
            color: #00f7e9;
            background: rgba(0, 247, 233, 0.08);
          }
          &.jiwei {
            color: #ff6a39;
            background: rgba(255, 106, 57, 0.08);
          }
          &.chenlie {
            color: #ffbd00;
            background: rgba(255, 189, 0, 0.08);
          }
          &.tiepian {
            color: #00ce59;
            background: rgba(0, 206, 89, 0.08);
          }
          &.tiaose {
            color: #ff6fcd;
            background: rgba(255, 111, 205, 0.08);
          }
        }
      }
    }
    .el-image {
      height: 498px;
      width: 280px;
      margin-bottom: 10px;
      background: #f5f9fc;
      /deep/.el-image__inner {
        object-fit: contain;
      }
    }
  }
}
</style>
