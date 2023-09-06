<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-dialog-indicator-container {
  .outer-list {
    height: 268px;
    padding: 12px 0 8px;
    overflow: overlay;
    /deep/ .smooth-dnd-container {
      .smooth-dnd-ghost {
        background-color: #edfaff;
      }
      .animated.smooth-dnd-draggable-wrapper {
        .drag-item {
          background-color: white;
          .hover-icon,
          .drag-tips {
            visibility: hidden;
          }
        }
      }
    }
    .drag-item {
      // padding: 5px 16px 5px 10px;
      padding-left: 10px;
      cursor: pointer;
      position: relative;
      // display: flex;
      // justify-content: space-between;
      // align-items: center;
      .left {
        display: flex;
        align-items: center;
        padding-left: 18px;
        .hover-icon {
          // width: 6px;
          height: 10px;
          // background-color: red;
          visibility: hidden;
          margin-right: 4px;
          flex-shrink: 0;
        }
        /deep/ .el-checkbox {
          flex: 1;
          padding: 5px 16px 5px 0;
          .el-checkbox__input {
            line-height: 0;
          }
        }
      }
      &:hover {
        background-color: #edfaff;
        .hover-icon,
        .drag-tips {
          visibility: visible;
        }
      }
      .drag-tips {
        font-size: 12px;
        color: #c1c1c1;
        visibility: hidden;
        top: 6px;
        right: 16px;
        height: 18px;
        line-height: 18px;
        user-select: none;
        pointer-events: none;
        position: absolute;
      }
    }
  }
  .header {
    padding: 5px 24px;
    /deep/ .el-checkbox {
      .el-checkbox__label {
        font-weight: 600;
      }
    }
  }
  .header-line {
    height: 1px;
    background-color: #e5e5e5;
    margin: 12px 24px;
  }
  /deep/ .el-checkbox {
    .el-checkbox__input {
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
        &:after {
          top: 1px;
          left: 4px;
        }
      }
    }
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>
