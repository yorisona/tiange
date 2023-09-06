<script src="./index.tsx"></script>
<style lang="less">
.achievement-popover.el-popover {
  padding: 12px !important;
}
</style>
<style lang="less" scoped>
.point {
  cursor: pointer;
  .key1:hover {
    color: var(--theme-color);
    cursor: pointer;
  }
}

.status {
  font-size: var(--default-font-size);
  color: var(--text-color);
  line-height: 18px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-left: 5px;
  & > label {
    color: var(--text-third-color);
    width: 50px;
    text-align: right;
  }
  & > span {
    display: inline-block;
    // width: 60px;
    text-align: left;
  }
}
.writeoff-popover-content {
  width: 584px;
  color: var(--text-color);
  .label {
    color: var(--text-third-color);
    font-size: 12px;
  }
  table {
    width: 100%;
    table-layout: fixed;
  }
  th {
    color: var(--text-third-color);
    font-weight: normal;
  }
  th,
  td {
    padding: 5px 10px;
    &.project-div:hover {
      color: var(--theme-color);
      cursor: pointer;
    }
  }
  .table-body {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
