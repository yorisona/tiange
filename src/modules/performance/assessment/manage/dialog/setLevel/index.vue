<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 24px;

  .el-select {
    width: 100%;
  }
  .level-way {
    margin-bottom: 18px;
    margin-right: 0 !important;
  }
  .level-box-header {
    display: flex;
    margin-bottom: 8px;
    .level-range,
    .level-name {
      color: var(--text-third-color);
      font-size: 12px;
      width: 88px;
    }
    .level-range {
      margin-left: 16px;
    }
  }
  .levels-box {
    display: grid;
    grid-template-columns: 104px 88px 1fr 100px 20px;
    grid-row-gap: 12px;
    // grid-column-gap: 16px;
    align-items: center;

    .score {
      color: var(--text-second-color);
      svg {
        color: var(--text-third-color);
      }
    }

    svg {
      width: 100%;
    }

    .el-form-item {
      margin-bottom: 0 !important;
    }
  }

  .add {
    display: flex;
    column-gap: 6px;
    align-items: center;
    margin-top: 12px;
    .icon-add {
      width: 16px;
      height: 16px;
      border-radius: 16px;
      background: var(--theme-color);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      svg {
        display: block;
        &:hover {
          color: #ffffff !important;
        }
      }
    }
  }
}
</style>
