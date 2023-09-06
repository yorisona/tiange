<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-29 10:54:54
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-datacenter-shoplive {
  position: relative;
  background: white;
  margin-top: 2px;
  .tabs {
    position: relative;
    /deep/ .tg-tabs-header {
      position: fixed;
      width: 100%;
      height: 54px !important;
      padding-top: 4px;
      background-color: #fff;
      border-bottom: 1px solid #e3e8ec;
    }
    /deep/ .tg-tabs-body {
      position: fixed;
      width: 222px;
      right: 0px;
      // height: 54px;
      padding-top: 20px;
      background-color: #fff;
      // border-bottom: 1px solid #e3e8ec;
      line-height: 18px;
      height: 18px;
      .update-time {
        color: var(--text-third-color);
        z-index: 100;
        font-size: 12px;
        text-align: left;
      }
    }
  }
}
.tg-tabs-line {
  position: fixed;
  z-index: 10;
  top: 0;
}

.tg-page-container {
  background: white;
}
</style>
