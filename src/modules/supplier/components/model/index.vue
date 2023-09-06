<!--
 * @Author: 肖槿
 * @Date: 2021-11-09 11:14:41
 * @Description: 模特卡片
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-11-18 15:51:21
 * @FilePath: \goumee-star-frontend\src\modules\supplier\components\model\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less" scoped>
.model-picture {
  width: 160px;
  height: 184px;
  background: #fff;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.5s;
  overflow: hidden;
  & .name {
    background: #fff;
    position: absolute;
    height: 30px;
    line-height: 30px;
    padding-left: 6px;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 160px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    & span {
      display: inline-block;
      margin-right: 6px;
      &:last-child {
        margin-left: 8px;
      }
    }
    .point {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(60, 82, 105, 0.6);
      &.point-1 {
        background: rgba(var(--warning-rgb-color), 0.7);
      }
      &.point-2 {
        background: rgba(var(--success-rgb-color), 0.6);
      }
      &.point--1 {
        background: rgba(var(--error-rgb-color), 0.6);
      }
    }
  }
  & .cover {
    width: 148px;
    height: 148px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    overflow: hidden;
    & img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  & .action {
    width: 160px;
    height: 30px;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0 20px;
    background: rgba(0, 0, 0, 0.5);
    transition: all 0.5s;
    display: flex;
    font-size: 18px;
    justify-content: space-around;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    & .icon:hover {
      color: #fff !important;
    }
  }
  &:hover {
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16);
    & .action {
      bottom: 30px;
    }
  }
}
</style>
