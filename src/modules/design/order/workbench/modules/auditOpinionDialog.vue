<script src="./auditOpinionDialog.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 14px 12px 60px;
  position: relative;
  /deep/ .el-form-item {
    margin: 0;
  }
  .line {
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, #d1d8e0 0%, #d1d8e0 50%, transparent 50%);
    background-size: 10px 1px;
    background-repeat: repeat-x;
    margin: 18px 0 11px;
  }
  .textarea-box {
    position: relative;
    .btn {
      position: absolute;
      right: 12px;
      bottom: 0;
      font-weight: 400;
      font-size: 12px;
      color: var(--theme-color);
      cursor: pointer;
    }
  }
  .textarea {
    /deep/textarea {
      background: #f7f7f7;
      border: 1px solid #e6e6e6;
      border-radius: 5px;
      font-size: 12px;
    }
  }
  .name {
    font-weight: 600;
    font-size: 14px;
    color: var(--text-color);
    margin-bottom: 8px;
  }
  .comments-box {
    min-height: 280px;
    max-height: 280px;
    overflow-y: auto;
    font-weight: 400;
    font-size: 14px;
    color: var(--text-color);
    .empty {
      margin-top: 50px;
      font-size: 12px;
      /deep/img {
        width: 188px !important;
        height: 102px !important;
      }
    }
  }
  .btn-box {
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(61, 132, 255, 0.1);
    height: 48px;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
}
</style>
