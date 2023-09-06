<script src="./index.tsx"></script>

<style lang="less" scoped>
.dailydata {
  margin: 0 18px 18px 18px;
  user-select: none;
}
</style>

<style lang="less" scoped>
.page-calendar {
  .approvalStatus {
    color: var(--error-color);
  }
  .operation {
    margin-top: 4px;
    height: 20px;
    line-height: 20px;
    display: flex;
    flex-direction: row;
    .titlediv {
      padding-left: 10px;
      position: relative;
      font-weight: 400;
      & > span {
        position: absolute;
        display: inline-block;
        width: 3px;
        height: 14px;
        background: rgba(var(--theme-rgb-color), 0.8);
        top: 3px;
        left: 0px;
        border-radius: 1px;
      }
    }
  }
  /deep/ .calendar-header-angle {
    color: var(--text-color);
  }
  /deep/ .calendar-header-side {
    color: var(--text-color);
  }
  /deep/ .tg-calendar-custom-side .calendar-header-top {
    padding-left: 0px;
    justify-content: center;
  }

  .total-target {
    display: grid;
    grid-template-columns: auto 200px auto 200px 1fr;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;
    & > div {
      &:nth-child(2n) {
        font-weight: 600;
      }
      &:nth-child(2) {
        margin-right: 24px;
      }
    }
  }
  .calendar-body {
    background-color: #ffffff;

    .calendar-day {
      position: relative;
      z-index: 10;
      width: 100%;
      height: 100%;
      border: solid 1px transparent;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: var(--text-color);
      transition: border-color ease-in 300ms, box-shadow ease-in 300ms;
      &.active {
        border-color: var(--theme-color);
      }

      &.disable {
        background: #f6f6f6;
        color: #a4b2c2;
      }

      .show-txt {
        width: 100%;
        pointer-events: none;
        padding: 0 12px;
        text-align: right;
      }

      .el-input {
        background-color: green;
        position: absolute;
        left: 1px;
        top: 2px;
        font-size: 12px;
        width: calc(100% - 3px);
        height: calc(100% - 4px);
        //height: 100%;
        /deep/ .el-input__inner {
          height: 100%;
          line-height: 100%;
          padding: 0 12px;
          font-size: 12px;
          text-align: right;
        }
        /deep/ .el-input__inner:focus {
          border: none;
        }
      }
      .el-input:focus {
        border: none;
      }

      &.calendar-current {
        border-color: var(--theme-color);
        box-shadow: 0px 0px 6px 0px rgba(var(--theme-rgb-color), 0.2);
      }

      &.empty {
        background: url('../../../../../../../src/assets/images/calendar-bg.jpg') repeat;
        background-size: 11px 11px;

        &:hover {
          border-color: transparent;
          box-shadow: none;
        }
      }

      &:hover {
        /*border-color: var(--theme-color);*/
        /*box-shadow: 0px 0px 6px 0px rgba(var(--theme-rgb-color), 0.2);*/

        /*.button {*/
        /*  display: block;*/
        /*  opacity: 0;*/
        /*  animation-name: button_fade_in;*/
        /*  animation-duration: 300ms;*/
        /*  animation-delay: 20ms;*/
        /*  animation-timing-function: ease-in;*/
        /*  animation-fill-mode: forwards;*/
        /*}*/
      }

      .status {
        font-weight: 400;
        font-size: 12px;
        height: 20px;
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        &:before {
          content: '';
          width: 2px;
          height: 100%;
          margin-right: 10px;
        }
      }

      .status-ok {
        background: rgba(16, 173, 87, 0.1);
        color: var(--text-color);

        &:before {
          background: #10ad57;
        }
      }

      .status-wait {
        color: #ff7a36;
        background: rgba(255, 122, 54, 0.1);

        &:before {
          background: #ff7a36;
        }
      }

      .button {
        display: none;
        font-size: 12px;
        color: var(--theme-color);
        cursor: pointer;
        opacity: 1;
        animation-name: button_fade_out;
        animation-duration: 300ms;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;

        svg {
          margin-left: 6px;
          margin-right: 7px;
        }
      }
    }
  }
}

@keyframes button_fade_in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes button_fade_out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
