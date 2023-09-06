<script src="./generalContract.tsx"></script>

<style lang="less">
@import './index.less';
</style>
<style lang="less" scoped>
.filter-form-div .filter-form-item {
  flex: 1;
  min-width: 304px;
}
.el-form-item {
  margin-right: 24px !important;
}
.el-form-item__content .el-input-group {
  width: 244px;
  vertical-align: top;
}
.el-select--medium {
  width: 244px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 244px;
}
/deep/ .el-form-item__label {
  width: 65px !important;
}
/*.el-table__fixed,
.el-table__fixed-right {
  background-color: white;
}
/deep/ .el-table__fixed,
.el-table__fixed-right {
  background-color: white;
}*/
// /deep/ .el-input--medium .el-input__inne {
//   height: 36px;
//   line-height: 36px;
// }
.depart-select-box {
  border-radius: 2px;
  border: 1px solid rgba(164, 178, 194, 0.5);
  padding: 0 10px;
  line-height: 27px;
  height: 28px;
  display: flex;
  justify-content: space-between;
  width: 204px;
  flex: 1;
  font-size: 12px;
  &:hover {
    /deep/ .el-icon-circle-close {
      color: #c0c4cc !important;
    }
    border-color: #5c82ff;
  }
}
/deep/ .table-field {
  flex: 1;
  margin-top: 10px;
  background: white;
  padding: 18px 18px 0;
  overflow: hidden;
  .el-table__fixed {
    background-color: transparent;
    bottom: 0;
  }
}
.pagination {
  padding: 0 18px;
  background: white;
}
</style>
