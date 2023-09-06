<script src="./print.tsx"></script>
<style lang="less" scoped>
.print-wrap {
  padding: 23px 20px 24px 20px;
  max-height: 350px;
  overflow: auto;
  &_card {
    padding: 33px 20px 47px 20px;
    background: #ffffff;
    box-shadow: 0 2px 8px 0 #08122314;
    &_box {
      border: 1px solid #19232d;
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .text_box {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        flex: 1;
        span {
          font-weight: 600;
          font-size: 18px;
          color: #19232d;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 270px;
          text-align: center;
        }
      }
    }
  }
  .qrcode {
    width: 100px;
    height: 100px;
    padding: 10px;
    border-left: 1px solid #19232d;
  }
}
</style>
