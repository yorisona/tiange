<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-28 13:29:19
-->
<script src="./funnel.tsx"></script>
<style lang="less" scoped>
.tg-datacenter-shoplive-funnel {
  .funnel-data {
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .funnel-line-left {
    margin-right: -85px;
    width: 195px;
    padding-left: 45px;
    .line-part-top {
      height: 97px;
      width: 41px;
      margin-top: 27px;
      display: block;
    }
    .line-text-container {
      margin-left: -35px;
      width: 144px;
      height: 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .line-part-bottom {
      // background: blue;
      height: 116px;
      width: 152px;
      display: block;
    }
  }
  .funnel-items {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 54px;
      margin-top: 12px;
      color: white;
      position: relative;
      font-size: var(--small-font-size);
      &:first-of-type {
        margin-top: 0;
      }
      .img {
        width: 100%;
        height: 100%;
      }
      .text {
        right: 20px;
        position: absolute;
        font-size: 16px;
        color: white;
      }
    }
  }
  .funnel-line-right {
    margin-left: 16px;
    .line-container {
      display: flex;
      margin-top: 2px;
      align-items: center;
      &:first-of-type {
        margin-top: 30px;
      }
      > img {
        width: 26px;
        height: 65px;
        margin-right: 16px;
      }
    }
  }
  .label {
    margin-top: 6px;
    color: var(--text-second-color);
    height: 18px;
    line-height: 18px;
  }
  .value {
    color: var(--text-color);
    font-weight: 500;
    font-size: 16px;
    height: 16px;
    line-height: 16px;
  }
}
</style>
