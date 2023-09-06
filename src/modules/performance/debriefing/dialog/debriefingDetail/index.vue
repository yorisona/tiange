<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-debriefing-detail-page-container {
  //max-height: 700px;
  padding: 24px;
  .title-field {
    display: flex;
    justify-content: center;
    position: relative;
    .title {
      font-weight: 600;
      font-size: 16px;
      color: var(--text-color);
    }
    .name-and-time {
      position: absolute;
      font-size: 14px;
      color: var(--text-third-color);
      text-align: right;
      top: 1px;
      right: 0;
      .name {
      }
      .time {
        margin-left: 16px;
      }
    }
  }
  .grade-field {
    margin: 30px 0 38px;
    display: grid;
    grid-template-columns: 174px 1fr;
    column-gap: 24px;
    .grade-container {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .grade-value {
        //width: 100px;
        height: 68px;
        font-weight: 600;
        font-size: 44px;
        color: var(--text-color);
        text-align: center;
        line-height: 68px;
      }
      .grade-label {
        //display: flex;
        //align-items: center;
        //justify-content: center;
        //margin-top: 10px;
        //padding: 4px 8px;
        //opacity: 0.85;
        //background-image: linear-gradient(180deg, var(--theme-color) 0%, #51afff 100%);
        //box-shadow: 0 2px 4px 0 #2155b042;
        //border-radius: 4px;
        font-weight: 400;
        font-size: 14px;
        color: var(--text-third-color);
      }
      .grade-level {
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 140px;
        height: 46px;
        background: #2877ff1a;
        border-radius: 23px;
        color: var(--text-color);
        font-size: 20px;
        > span:last-of-type {
          font-size: 24px;
          font-weight: 600;
        }
      }
    }
    .grade-detail {
      .grade-dimension-list {
        margin-top: 18px;
        display: grid;
        //grid-auto-flow: row;
        row-gap: 10px;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        //.grade-dimension-item {
        //  display: grid;
        //  grid-template-columns: 56px 1fr 24px;
        //  align-items: center;
        .dimension-name {
          text-align: right;
          font-size: 14px;
          color: var(--text-third-color);
        }
        .dimension-ratio-info {
          margin: 0 16px 0 8px;
          height: 16px;
          //background: var(--theme-color);
          background: #f1f4f9;
          border-radius: 4px;
          position: relative;
          &:before {
            border-radius: 4px;
            position: absolute;
            content: '';
            left: 0;
            top: 0;
            height: 100%;
            width: var(--dimension-ratio);
            background-color: var(--theme-color);
          }
        }
        .dimension-grade {
          font-size: 14px;
          color: var(--text-color);
        }
        //}
      }
    }
  }
  .other-field {
    margin-top: 24px;
    .other-item-list {
      margin-top: 16px;
      margin-left: 9px;
      .other-item {
        margin-top: 12px;
        display: flex;
        .label {
          padding-top: 6px;
          flex-shrink: 0;
          font-size: 12px;
          color: var(--text-third-color);
          line-height: 18px;
        }
        .content {
          flex: 1;
          padding: 6px 8px;
          font-weight: 400;
          font-size: 12px;
          color: var(--text-second-color);
          line-height: 18px;
          background: #a4b2c217;
          border-radius: 2px;
        }
        &.label-top {
          margin-top: 18px;
          flex-direction: column;
          &:first-of-type {
            margin-top: 0;
          }
          .label {
            padding-top: 0;
          }
          .content {
            margin-top: 6px;
          }
        }
      }
    }
  }
  .section-header {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--text-color);
    &:before {
      content: '';
      margin-right: 6px;
      width: 3px;
      height: 14px;
      background: var(--theme-color);
      border-radius: 1px;
    }
  }
  /deep/ .empty-container {
    margin-top: 24px;
    img {
      width: 113px !important;
      height: 62px !important;
      margin-bottom: 6px !important;
    }
    div {
      font-size: 12px !important;
      color: #c1c1c1 !important;
    }
  }
}
</style>
