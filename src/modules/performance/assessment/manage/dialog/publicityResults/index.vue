<script src="./index.tsx"></script>
<style lang="less" scoped>
.publicityResults-box {
  padding: 18px 24px;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-color);
  max-height: 500px;
  .btn-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-gap: 12px;
    margin: 8px 0 24px;
  }
  .content-box {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 24px;
    align-items: center;
    .item {
      display: flex;
      align-items: center;
      grid-gap: 10px;
    }
    .headPortrait {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 1px solid #e5e5e5;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar-uploader-icon {
        font-size: 24px;
        color: #c1c1c1;
      }
    }
  }
}
</style>
