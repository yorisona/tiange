<script src="./View.tsx"></script>
<style lang="less" scoped>
.pdf-preview {
  svg {
    width: 100%;
    height: 100%;
  }
}

.ml-pagination {
  position: absolute;
  bottom: 34px;
  left: 50%;
  color: white;
  width: 100px;
  height: 30px;

  & > div {
    position: absolute;
    left: -50%;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 7px;
    letter-spacing: 6px;
  }
}
</style>
