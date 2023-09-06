<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-06-23 13:29:30
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.tg-daily-detail-list-container {
  width: 100%;
  .body {
    display: flex;
    border: 1px solid var(--border-line-div-color);
    background: url('../../../../../assets/images/calendar-bg.jpg') repeat;
    background-size: 11px 11px;
    .left {
      z-index: 2;
      width: 135px;
      flex-shrink: 0;
      // background: white;
      position: relative;
      .left-bg {
        height: calc(100% - 10px);
        width: 134px;
        position: absolute;
        background: white;
        z-index: -1;
      }
      .cell {
        text-align: left;
        &:last-of-type {
          border-bottom: none;
        }
      }
    }
    .center {
      margin-left: -135px;
      padding-left: 135px;
      display: flex;
      overflow: auto;
      background: white;
      &.mgRight {
        width: 100%;
        margin-right: -135px;
        padding-right: 134px;
        display: flex;
        background: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU0MTBENjMyQjg1MDExRUI5NjA5OEM1QTAyOEREQUM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU0MTBENjMzQjg1MDExRUI5NjA5OEM1QTAyOEREQUM4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTQxMEQ2MzBCODUwMTFFQjk2MDk4QzVBMDI4RERBQzgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTQxMEQ2MzFCODUwMTFFQjk2MDk4QzVBMDI4RERBQzgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAALAAsDAREAAhEBAxEB/8QAaAAAAwEAAAAAAAAAAAAAAAAAAAIECgEBAQEAAAAAAAAAAAAAAAAAAAEDEAAABAMHBQEAAAAAAAAAAAABESESMQIDAFFhIjITU0GRsTMEFBEBAAEFAAAAAAAAAAAAAAAAAAERMWECEv/aAAwDAQACEQMRAD8A3ozziAhSpAA1BA1005YPnIkRAjMOBiGzHEXJ+YOSoeo8rt7nc03khaWoRJZU5HzQqX7iu9zmyu3+jzgWVpEhWSaqO8cLvFor/9k=)
          repeat;
        background-size: 11px 11px;
      }
      .col {
        width: 135px;
        flex-shrink: 0;
        cursor: pointer;
        background: white;
        .cell:last-of-type {
          border-bottom: none;
        }
        &:hover {
          .cell {
            background: var(--table-current-row-bg-color);
          }
          .header {
            background: var(--table-current-row-bg-color);
          }
        }
        &[selected] {
          .cell {
            background: var(--table-focus-row-bg-color) !important;
          }
          .header {
            background: var(--table-focus-row-bg-color) !important;
          }
        }
      }
      &::-webkit-scrollbar {
        border-top: 1px solid var(--border-line-div-color);
        border-right: none;
        border-bottom: none;
        border-left: none;
        height: 10px !important;
        background-color: white;
      }
    }
    .right {
      z-index: 2;
      width: 135px;
      flex-shrink: 0;
      // background: white;
      position: relative;
      .right-bg {
        height: calc(100% - 10px);
        width: 134px;
        position: absolute;
        background: white;
        z-index: -1;
      }
      .header {
        border-left: 1px solid var(--border-line-div-color);
        border-right: 0px solid var(--border-line-div-color);
      }
      .cell {
        border-left: 1px solid var(--border-line-div-color);
        border-right: 0px solid var(--border-line-div-color);
        text-align: center;
        background: white;
        &:last-of-type {
          border-bottom: none;
        }
      }
    }
  }
  .header {
    font-size: 12px;
    padding: 8px 10px;
    border-right: 1px solid var(--border-line-div-color);
    border-bottom: 1px solid var(--border-line-div-color);
    background: rgba(164, 178, 194, 0.1);
    text-align: center;
    min-height: 32px;
    max-height: 32px;
    color: var(--text-color);
    > div {
      line-height: 17px;
    }
  }
  .cell {
    font-size: 12px;
    padding: 8px 10px;
    min-height: 32px;
    max-height: 32px;
    text-align: center;
    border-right: 1px solid var(--border-line-div-color);
    border-bottom: 1px solid var(--border-line-div-color);
    color: var(--text-color);
    > div {
      line-height: 17px;
    }
    position: relative;
    .inputCell {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      /deep/ .el-input__inner {
        height: 100%;
      }
    }
  }
}
</style>
