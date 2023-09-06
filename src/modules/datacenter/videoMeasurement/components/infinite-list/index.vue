<script src="./index.tsx"></script>
<style lang="less" scoped>
.total {
  font-weight: 400;
  font-size: 12px;
  color: var(--text-third-color);
  margin: 12px 0;
}
.name {
  font-weight: 400;
  font-size: 12px;
  color: var(--text-second-color);
  margin-right: 12px;
}
.tiem {
  font-weight: 400;
  font-size: 12px;
  color: var(--text-third-color);
}
.info {
  font-weight: 400;
  font-size: 12px;
  color: var(--text-color);
  margin-top: 2px;
}
.search-box {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: var(--text-second-color);
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 12px;
}
.infinite-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.infinite-list-box {
  flex: 1 1 0%;
  overflow-y: auto;
  /deep/ img {
    width: 155px !important;
    height: auto !important;
  }
}
</style>
