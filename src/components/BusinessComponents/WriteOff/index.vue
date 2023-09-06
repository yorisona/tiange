<!--
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-12 14:59:57
-->
<script src="./index.tsx"></script>

<style lang="less" scoped>
.status {
  font-size: 14px;
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
    width: 60px;
    text-align: left;
  }
  .yellow {
    color: #ff7a36;
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
    padding: 10px;
  }
  .table-body {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>
