<script src="./list.tsx"></script>
<style lang="less" scoped>
.calender-div {
  padding-bottom: 32px;
  &:last-child {
    padding-bottom: 12px;
  }
}
.operation {
  margin: 0px 20px;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;

    .calendar-date-range {
      font-size: 14px;
      color: var(--text-color);
      font-weight: 400;
    }

    .tips {
      font-size: 12px;
      color: var(--text-third-color);
      margin: 0 6px 0 12px;
    }
  }

  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .calendar-type-group {
      width: 92px;
      height: 32px;
      background: #ffffff;
      border: 1px solid var(--border-line-color);
      border-radius: 16px;
      display: flex;

      span {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: var(--text-second-color);
        font-weight: 400;
        cursor: pointer;

        &:first-child {
          border-right: solid 1px var(--border-line-color);
        }

        &.active {
          color: var(--theme-color);
          font-weight: 600;
        }
      }
    }
  }
}
.filter-form-item-btn {
  display: flex;
  justify-content: center;
}
.contract-checkbox-group {
  display: inline-block;

  margin-left: 20px;
}
</style>
