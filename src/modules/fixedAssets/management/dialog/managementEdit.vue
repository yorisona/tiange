<script src="./managementEdit.tsx"></script>
<style lang="less" scoped>
.form-wrap {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    margin-right: 16px;
    margin-bottom: 18px;
    flex: 1 1 175px;
    /deep/.el-form-item__label {
      margin-bottom: -6px;
    }
  }
  .one-line {
    flex: 0 1 175px;
  }
}
.headPortrait {
  width: 90px;
  height: 90px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 18px;
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    margin-bottom: 4px;
  }
}
.managementEdit-box {
  position: relative;
  padding: 18px 2px 68px 18px;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f4f8ff;
  padding: 0 20px;
  border-radius: 0 0 4px 4px;
  height: 50px !important;
  text-align: center;
  line-height: 50px !important;
}
</style>
