<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-tree-select-container {
  width: 100%;
}
.tree-container {
  // padding-right: 16px;
  max-height: 360px;
  overflow-y: auto;
  .el-tree {
    overflow-y: hidden;
  }
}
.tree-select-reference {
  position: relative;
  display: inline-block;
  width: 100%;
  /deep/ .el-input {
    .el-input__inner {
      cursor: pointer;
    }
    .el-input__suffix {
      width: 25px;
      top: 1px;
      .arrow-icon {
        transform: rotate(0deg);
        transition: transform 0.2s linear;
        &.rotate {
          transform: rotate(-180deg);
          transition: transform 0.2s linear;
        }
      }
      .close-icon {
        cursor: pointer;
        display: none;
      }
    }
    &:hover {
      .input-suffix[clearable] {
        .arrow-icon {
          display: none;
        }
        .close-icon {
          display: inline-block;
        }
      }
    }
  }
}
.tree-select-tags {
  position: absolute;
  left: 0;
  top: 0;
  height: 28px;
  line-height: 28px;
  display: flex;
  align-items: center;
  & > span {
    height: 20px;
    line-height: 20px;
    background: #f4f4f5;
    padding: 0 5px;
    color: #909399;
    font-size: 12px;
    margin: 2px 0 2px 6px;
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
  }
  & .el-icon-close {
    color: white;
    background-color: #c0c4cc;
    flex-shrink: 0;
    border-radius: 50%;
    cursor: pointer;
    height: 16px;
    width: 16px;
    font-size: 12px;
    transform: scale(0.7);
    line-height: 16px;
    right: -2px;
    top: 0;
    position: relative;
    &:before {
      display: block;
      transform: translate(2px, 0px);
    }
  }
}
</style>

<style lang="less">
.tg-tree-select-popover {
  .popper__arrow {
    left: 20px !important;
  }
  .tree-container .el-tree .el-tree-node .el-checkbox {
    padding-top: 0;
    .el-checkbox__input {
      padding-top: 0;
    }
  }
}
</style>
