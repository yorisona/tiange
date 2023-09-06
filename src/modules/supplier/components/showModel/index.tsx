/*
 * @Author: 肖槿
 * @Date: 2021-11-11 09:56:24
 * @Description: 查看模特
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-16 14:41:31
 * @FilePath: \goumee-star-frontend\src\modules\supplier\components\showModel\index.tsx
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import { Model } from '@/types/tiange/supplier';
import { usePermission } from '@/use/permission';
import { deepClone } from '@/utils/tools';
const useVisiable = () => {
  const visible = ref(false);
  const updateVisiable = (flag: boolean) => (visible.value = flag);
  return {
    visible,
    updateVisiable,
  };
};
const useCurrentModel = () => {
  const currentModel = ref<Model>({
    real_name: '',
    flower_name: '',
    flag: 0,
    images: [],
    wechat: '',
    mobile: '',
    id: undefined,
  });
  const updateCurrentModel = (obj: Model) => (currentModel.value = obj);
  return {
    currentModel,
    updateCurrentModel,
  };
};
export default defineComponent({
  setup() {
    const current_index = ref<number>(0);
    const { visible, updateVisiable } = useVisiable();
    const { currentModel, updateCurrentModel } = useCurrentModel();
    const modelCarousel = ref<{
      prev: () => void;
      next: () => void;
      setActiveItem: (index: number) => void;
    }>();
    const permission = usePermission();
    const onCloseBtnClick = () => {
      updateVisiable(false);
    };

    const show = (item: Model) => {
      updateVisiable(true);
      updateCurrentModel(deepClone(item) as any);
    };
    watch(
      () => visible.value,
      newVal => {
        if (!newVal) {
          current_index.value = 0;
          currentModel.value.images = [];
          modelCarousel.value?.setActiveItem(0);
        }
      },
    );
    return {
      current_index,
      onCloseBtnClick,
      visible,
      currentModel,
      modelCarousel,
      show,
      permission,
    };
  },
  render() {
    return (
      <el-dialog
        class="tg-dialog-classic show-model-dialog"
        width="700px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <template slot="title">查看模特</template>
        <div class="show-main">
          <div class="info">
            <span>花名：{this.currentModel.flower_name}</span>
            <span>真名：{this.currentModel.real_name}</span>
            {this.permission.supplier_model_show_all && (
              <span>手机：{this.currentModel.mobile}</span>
            )}
            {this.permission.supplier_model_show_all && (
              <span>微信：{this.currentModel.wechat}</span>
            )}
          </div>
          <div class="picture">
            <span
              class="pagation-arrow left"
              onClick={() => {
                if (this.current_index === 0) {
                  return;
                }
                this.modelCarousel?.prev();
              }}
            >
              <tg-icon disabled={this.current_index === 0} name="ico-arrow-left"></tg-icon>
            </span>
            <el-carousel
              ref="modelCarousel"
              style="width: 562px"
              height="500px"
              width="562px"
              autoplay={false}
              indicator-position="none"
              initial-index={this.current_index}
              onChange={(index: number) => {
                this.current_index = index;
              }}
            >
              {this.currentModel.images.map((image: string) => {
                return (
                  <el-carousel-item>
                    <tg-image class="cover" src={image} alt={this.currentModel.flower_name} />
                  </el-carousel-item>
                );
              })}
            </el-carousel>
            <span
              class="pagation-arrow right"
              onClick={() => {
                if (this.current_index >= this.currentModel.images.length - 1) {
                  return;
                }
                this.modelCarousel?.next();
              }}
            >
              <tg-icon
                disabled={this.current_index >= this.currentModel.images.length - 1}
                name="ico-arrow-right"
              ></tg-icon>
            </span>
          </div>
          <div style="display: flex; justify-content: center; margin-top: 20px;">
            <span>{`${this.current_index + 1} / ${this.currentModel.images.length}`}</span>
          </div>
        </div>
      </el-dialog>
    );
  },
});
