<script src="./typographyCalendar.tsx"></script>
<style lang="less" scoped>
@dayColor: #0a0a0a;
.typographyCalendar__box {
  .content_box__right__title {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 20px;
    font-weight: 400;
    font-size: 12px;
    color: #323233;
    .time {
      height: 21px;
      padding: 0 8px;
      background: #f4f8ff;
      border-radius: 2px;
      text-align: center;
      line-height: 21px;
      font-size: 12px;
      color: #0a0a0a;
    }
  }
  /deep/ .tg-calendar-custom {
    // --theme-color: red;
    --text-third-color-other: rgba(10, 10, 10, 0.3);
    --text-third-color: #0a0a0a;
    .tg-calendar-custom-td.other-month .tg-calendar-custom-day {
      color: var(--text-third-color-other);
    }
    .tg-calendar-custom-day {
      right: 6px;
      top: 6px;
      left: auto;
      font-size: 14px;
      // color: @dayColor;
    }
    .tg-calendar-custom-td {
      height: 119px;
    }
    .tg-calendar-custom-th {
      font-weight: 400;
      font-size: 14px;
      color: #0a0a0a;
      height: 50px;
      background: #f4f8ff;
      border-left: none;
    }
    .typographyCalendar__box {
      height: 100%;
      width: 100%;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      --backCol: #3f8ef6;
      padding-top: 30px;
      &__wrap {
        padding: 0 10px;
        height: 100%;
        overflow: auto;
        width: 100%;
        padding: 0 10px;
        padding-bottom: 4px;
      }
      &__active {
        background: rgba(0, 149, 255, 0.1);
        border: 0.5px solid #3f8ef6;
      }
      &__item {
        width: 100%;
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        color: #fff;
        background: var(--backCol);
        border-radius: 2px;
        margin-bottom: 4px;
        white-space: nowrap; /* 不换行 */
        overflow: hidden; /* 溢出隐藏 */
        text-overflow: ellipsis; /* 文本溢出省略号 */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
        user-select: none;
      }
    }
  }

  /* tip */
  /deep/.my_popover_box {
    padding: 0 !important;
  }
  .popover_box {
    width: 260px;
    &_title {
      font-weight: 600;
      font-size: 14px;
      color: #0a0a0a;
      letter-spacing: 0;
      padding: 12px 28px;
      border-bottom: 1px solid #eaeef5;
      --popoverCirColor: #3f8ef6;
      position: relative;
      &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        background: var(--popoverCirColor);
        border-radius: 50%;
        position: absolute;
        left: 12px;
        top: 18px;
      }
    }
    .popover_box_content {
      padding: 12px 15px;
      display: grid;
      grid-template-columns: 52px 1fr;
      gap: 10px;
      // align-items: center;
      span {
        font-weight: 400;
        font-size: 13px;
        letter-spacing: 0;
        color: #0a0a0a;
        // &:nth-child(even) {
        // }
        &:nth-child(odd) {
          color: rgba(10, 10, 10, 0.6);
          text-align: right;
        }
      }
    }
    .popover_box_footer {
      width: 100%;
      height: 52px;
      background: #f4f8ff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 10px;
      .btn {
        width: 60px;
        height: 28px;
        margin-right: 8px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  /deep/.my_project_popover_wrap {
    padding: 0;
  }
  .my_project_popover_wrap_box {
    max-height: 640px;
    overflow-y: auto;
    &_item {
      margin-bottom: 10px;
      padding: 0 10px 0;
      // &:last-child {
      //   margin-bottom: 10px;
      // }
      &:first-child {
        padding-top: 10px;
      }
    }
    &_footer {
      padding: 10px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 52px;
      background: #f4f8ff;
      .btn {
        width: 60px;
        height: 28px;
      }
    }
    &_title {
      font-weight: 400;
      font-size: 12px;
      color: rgba(10, 10, 10, 0.6);
      letter-spacing: 0;
      padding: 0 14px;
      --popoverCirColor: #3f8ef6;
      position: relative;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background: var(--popoverCirColor);
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 35%;
      }
    }
    &_content {
      background: #f4f8ff;
      border-radius: 2px;
      font-weight: 400;
      font-size: 11px;
      color: #0a0a0a;
      padding: 2px 5px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      cursor: pointer;
      span {
        &:first-child {
          width: 165px;
          white-space: nowrap; /* 不换行 */
          overflow: hidden; /* 溢出隐藏 */
          text-overflow: ellipsis; /* 文本溢出省略号 */
        }
      }
      &:last-child {
        margin-bottom: 0;
      }
      &_active {
        border: 1px solid #3f8ef6;
      }
    }
  }
}
</style>
