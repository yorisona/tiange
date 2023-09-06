<!--
 * @Author: 肖槿
 * @Date: 2021-11-11 09:56:08
 * @Description: 查看模特
 * @LastEditors: 肖槿
 * @LastEditTime: 2021-11-16 11:34:03
 * @FilePath: \goumee-star-frontend\src\modules\supplier\components\showModel\index.vue
-->
<script src="./index.tsx"></script>
<style lang="less">
.show-model-dialog {
  & .show-main {
    padding: 20px 24px;
    & .info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 16px;
      margin-bottom: 24px;
      & span {
        color: var(--text-second-color);
      }
    }
    & .picture {
      display: flex;
      align-items: center;
      justify-content: space-between;
      & .cover {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      & .pagation-arrow {
        width: 45px;
        text-align: center;
        font-size: 68px;
        color: var(--theme-color);
        position: relative;
        cursor: pointer;
        transform: scale(0.9);
        &.left {
          right: 21px;
        }
        &:hover {
          color: var(--theme-color);
        }
      }
      & .el-carousel__arrow {
        display: none;
      }
    }
  }
}
</style>
