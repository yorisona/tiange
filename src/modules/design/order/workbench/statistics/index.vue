<script src="./index.tsx"></script>
<style lang="less" scoped>
@title: #0a0a0a;

@project: #3f8ef6;
@collaborative: #984dff;
@other: #09ce98;
@overtime: #fe365c;

.statistics-box {
  padding: 0 25px 24px;
  .header-box {
    height: 53px;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border: 1px solid #f4f8ff;
    border-radius: 5px;
    margin-bottom: 12px;
    flex-shrink: 0;
    .el-form .el-form-item--mini {
      margin-bottom: 0;
    }
  }
  .content_box {
    display: flex;
    width: 100%;
    height: 100%;
    &__left {
      margin-right: 12px;
      width: 362px;
      display: flex;
      flex-direction: column;
      &__top {
        flex: 1;
        margin-bottom: 12px;
        background-color: #fff;
        &__title {
          font-weight: 400;
          font-size: 14px;
          color: #0a0a0a;
          letter-spacing: 0;
          padding: 12px 15px;
          border-bottom: 1px solid #f4f8ff;
        }
        &__wrap {
          display: flex;
          flex-direction: column;
          padding: 12px;
          max-height: 348px;
          overflow-y: auto;
          &__item {
            width: 100%;
            padding: 0 15px 0 20px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f4f8ff;
            border-radius: 2px;
            font-weight: 400;
            font-size: 14px;
            color: #000000;
            letter-spacing: 0;
            position: relative;
            overflow: hidden;
            margin-bottom: 10px;
            cursor: pointer;
            transition: 0.3s;
            &:hover {
              background: #edf3fc;
            }
            &:last-child {
              margin-bottom: 0;
            }
            &::before {
              content: '';
              display: block;
              width: 6px;
              height: 45px;
              background: #3f8ef6;
              left: 0;
              position: absolute;
            }
            &.project::before {
              background: @project;
            }
            &.collaborative::before {
              background: @collaborative;
            }
            &.other::before {
              background: @other;
            }
            &.overtime::before {
              background: @overtime;
            }

            .cross {
              position: relative;
              width: 20px;
              height: 20px;
            }

            .cross::after,
            .cross::before {
              content: '';
              position: absolute;
              top: calc(50% - 2px);
              left: 0;
              right: 0;
              background-color: black;
            }

            .cross::after {
              height: 4px;
            }

            .cross::before {
              content: '';
              position: absolute;
              top: 0;
              bottom: 0;
              width: 4px;
              left: calc(50% - 2px);
            }
            .cross.project::before,
            .cross.project::after {
              background-color: @project;
            }
            .cross.collaborative::before,
            .cross.collaborative::after {
              background-color: @collaborative;
            }
            .cross.other::before,
            .cross.other::after {
              background-color: @other;
            }
            .cross.overtime::before,
            .cross.overtime::after {
              background-color: @overtime;
            }
          }
        }
      }
      &__bottom {
        flex: 1;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        &__title {
          font-weight: 400;
          font-size: 14px;
          color: #0a0a0a;
          letter-spacing: 0;
          padding: 12px 15px;
          border-bottom: 1px solid #f4f8ff;
        }
        &__wrap {
          padding: 12px;
          overflow-y: auto;
          flex: 1;
        }
      }
    }
    &__right {
      flex: 1;
      background-color: #fff;
      overflow-y: auto;
      &__title {
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
    }
  }
}
</style>
