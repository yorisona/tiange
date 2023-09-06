<script src="./index.tsx"></script>
<style lang="less" scoped>
.dialog-container {
  padding: 0px;
  width: 100%;
  height: 750px;
  font-size: 28px;
  overflow: hidden;
  overflow-y: auto;
  .empty {
    flex: 1 1 0;
  }
  .scale-body-container {
    max-height: 750px;
    overflow: hidden;
  }
  .scale-body {
    display: flex;
    flex-direction: column;
    width: 750px;
    max-height: 1500px;
    transform: scale(0.5);
    transform-origin: left top;
  }

  .header {
    display: flex;
    height: 144px;
    font-size: 28px;
    .left,
    .right {
      flex: 1 1 0;
    }

    .date {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 10px;
      .day {
        font-size: 80px;
        font-weight: 600;
        align-self: center;
        grid-row-end: span 2;
        color: var(--text-color);
      }
      .year {
        align-self: end;
      }
      .week {
        align-self: start;
        color: var(--text-third-color);
      }
    }
  }
  .content {
    padding: 14px 0 16px 0;
    background: #f7f7f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    flex: 1;
    .new {
      width: 686px;
      background: #ffffff;
      border-radius: 12px;
      margin-bottom: 14px;
      display: flex;
      flex-direction: column;
      padding: 30px;
      .title {
        font-size: 32px;
        color: var(--text-color);
        letter-spacing: 1px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 30px 0 16px 0;
      }
      .new-content {
        font-size: 28px;
        color: var(--text-second-color);
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .new-footer {
        margin-top: 24px;
        display: flex;
        color: var(--text-third-color);
        .form {
        }
      }
    }
  }
}
</style>
