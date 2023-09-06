<script src="./index.tsx"></script>
<style lang="less" scoped>
.calendar-container {
  background-color: #ffffff;
  padding: 0 18px 18px 18px;
  position: relative;

  .tg-calendar-custom {
    min-width: 1160px;
  }

  .calendar-cell {
    padding: 40px 10px 10px;
    height: 100%;
    width: 100%;
    overflow: hidden;

    .info {
      padding: 3px 0;
      display: flex;
      font-size: 12px;
      align-items: center;
      width: 100%;
      overflow: hidden;

      .projects {
        flex: 1;
        overflow: hidden;
        display: flex;
        & > span {
          white-space: nowrap;
          word-break: break-all;
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .project_name {
          white-space: nowrap;
          word-break: break-all;
          flex: 1;
          display: block;
          padding-left: 8px;
          color: var(--theme-color);
          text-overflow: ellipsis;
          overflow: hidden;
          cursor: pointer;
        }
        .tip {
          display: block;
          padding-left: 8px;
          color: var(--text-third-color);
          cursor: default;
        }
      }
    }
  }

  .no-appointment-yet {
    width: 100%;
    height: 100%;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #878787;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    padding: 18px 0 16px 0;
    border-top: solid 1px #e5e5e5;
    margin-top: 14px;

    .date-switch {
      display: flex;
      align-items: center;

      .btn-circle {
        width: 28px;
        height: 28px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        border-radius: 16px;
        font-size: 18px;
        color: var(--text-second-color);
        border: 1px solid #e5e5e5;
        cursor: pointer;
      }

      .live-date {
        margin: 0 18px;
        color: var(--text-color);
        font-weight: 400;
        font-size: 16px;
      }
    }
    .tips {
      color: var(--text-third-color);
    }
  }
}
</style>
