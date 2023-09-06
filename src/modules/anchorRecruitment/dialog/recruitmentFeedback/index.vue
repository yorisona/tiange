<script src="./index.tsx"></script>
<style lang="less" scoped>
.recruitment-dialog {
  .recruitment-dialog-content {
    padding: 20px 24px 48px;
  }
  .recruitment-info {
    margin-bottom: 24px;
  }
  .recruitment-result {
    margin-bottom: 24px;
  }
  .result-rating {
    .recruit-satisfaction-list {
      display: flex;
      .recruit-satisfaction-list-item {
        width: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 4px;
        &[checked] {
          .icon {
            color: #ffb703;
            &:hover {
              color: #ffb703;
            }
          }
        }
        cursor: pointer;
        // justify-content: center;
        .icon {
          width: 28px;
          height: 28px;
          color: #c1c1c1;
          &:hover {
            color: #c1c1c1;
          }
        }
        .desc {
          margin-top: 3px;
          color: var(--text-third-color);
          font-size: 12px;
        }
        &.readonly {
          cursor: auto;
          &:not([checked]) {
            .icon {
              color: #e5e5e5;
            }
          }
        }
      }
    }
  }
  .title {
    color: var(--text-color);
    font-size: 12px;
    font-weight: 600;
    position: relative;
    &:before {
      content: '';
      background-color: var(--theme-color);
      width: 3px;
      height: 12px;
      border-radius: 1px;
      position: absolute;
      left: 0;
      top: 2.5px;
    }
    span {
      margin-left: 7px;
    }
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 12px;
  }
  div[label] {
    font-size: 12px;
    color: var(--text-color);
    display: flex;
    &:before {
      content: attr(label) '\ff1a';
      color: var(--text-third-color);
      width: 60px;
      display: inline-block;
      flex-shrink: 0;
      text-align: right;
    }
  }
  .recruitment-dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f4f8ff;
    padding: 0 20px;
    height: 50px !important;
    line-height: 50px !important;
    text-align: center;
  }
}
</style>
