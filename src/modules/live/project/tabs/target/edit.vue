<script src="./edit.tsx"></script>
<style lang="less" scoped>
.operation {
  margin: 0px 20px;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;

    .calendar-date-range {
      font-size: 14px;
      color: var(--text-color);
      font-weight: 400;
    }

    .tips {
      font-size: 12px;
      color: var(--text-third-color);
      margin-left: 12px;
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .calendar-type-group {
      width: 92px;
      height: 32px;
      background: #ffffff;
      border: 1px solid var(--border-line-color);
      border-radius: 16px;
      display: flex;

      span {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: var(--text-second-color);
        font-weight: 400;
        cursor: pointer;

        &:first-child {
          border-right: solid 1px var(--border-line-color);
        }

        &.active {
          color: var(--theme-color);
          font-weight: 600;
        }
      }
    }
  }
}
.filter-form-item-btn {
  display: flex;
  justify-content: center;
}
.contract-checkbox-group {
  display: block;
  margin-top: 16px;
  /deep/ .el-checkbox {
    margin-right: 15px;
  }

  /deep/.el-checkbox__label {
    color: var(--text-color);
    width: 95px;
    display: inline-block;
    overflow: hidden; /*超出部分隐藏*/
    white-space: nowrap; /*不换行*/
    text-overflow: ellipsis; /*超出部分文字以...显示*/
    line-height: 1;
    vertical-align: middle;
    padding-left: 6px;
  }
}
/deep/.project-edit > svg.icon {
  width: 22px;
  height: 22px;
  color: var(--text-third-color);
}
.targetlistdiv {
  overflow: auto;
  bottom: 58px;
  top: 30px;
  width: 100%;
  position: absolute;
}
/deep/.el-checkbox__input.is-checked + .el-checkbox__label {
  color: var(--text-color);
}
/deep/.el-checkbox + .el-checkbox {
  margin-left: 0px;
  line-height: 24px;
  height: 24px;
}
/deep/ el-checkbox__inner {
  border: 1px solid #dcdfe6;
}
.anchordiv {
  margin: 0px 18px 0px 18px;
  padding-top: 6px;
  height: 16px;
  display: flex;
  justify-content: flex-end;
}
/deep/.el-dialog__header {
  background: rgba(var(--theme-rgb-color), 0.06);
  padding: 0 0 0 24px;
  font-size: 14px;
  color: var(--text-color);
}
/deep/.el-dialog {
  margin-top: 22vh !important;
}

/deep/.el-dialog__body {
  padding: 24px;
}
</style>
