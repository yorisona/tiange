<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-23 15:33:59
-->
<script src="./live.screen.tsx"></script>
<style lang="less" scoped>
.live-screen-dialog-container {
  .screen-body {
    padding: 18px 18px 24px;
    // height: 764px;
    .screen-img {
      width: 282px;
      height: 505px;
      // height: 666px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f9fc;
      /deep/ .el-image__inner {
        object-fit: contain;
      }
    }
    .screen-upload {
      margin-top: 24px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
