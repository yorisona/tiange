/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-05-23 15:33:59
 */
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { defineComponent, ref } from '@vue/composition-api';
import { CtrListModel } from '@/types/tiange/datacenter';
import { SaveShopLiveScreenshot } from '@/services/datacenter';
import emptyGoods from '@/assets/img/goods-empty.png';
import { imgTokenUrl } from '@/utils/string';
export interface LiveScreenType {
  show: (listModel: CtrListModel) => void;
}

export default defineComponent({
  setup(props, ctx) {
    const visible = ref(false);
    const loading = ref(false);
    const liveModel = ref<CtrListModel | undefined>(undefined);
    const methods = {
      show(listModel: CtrListModel) {
        visible.value = true;
        liveModel.value = listModel;
      },
      onClose() {
        visible.value = false;
      },
      beforeUpload(config: any) {
        return ValidationFileUpload({ image: true, fileSize: 2 })(config);
      },
      successHandle(res: any) {
        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上传失败，稍后重试');
        } else {
          const url = res.data.source;
          // formData.value.duration_screenshot = url;
          methods.saveShopLiveScreenshot(url);
        }
      },
      async saveShopLiveScreenshot(url: string) {
        const res = await SaveShopLiveScreenshot(liveModel.value?.id, url);
        if (res.data.success) {
          if (liveModel.value) {
            liveModel.value.live_screenshot_url = url;
          }
          ctx.root.$message.success(res.data.message ?? '上传成功');
        } else {
          ctx.root.$message.error(res.data.message ?? '上传失败，稍后重试');
        }
      },
    };
    return {
      emptyGoods,
      liveModel,
      visible,
      loading,
      ...methods,
    };
  },
  render() {
    const { visible, loading } = this;
    return (
      <div class="live-screen-dialog-container">
        <el-dialog
          visible={visible}
          title="直播画面"
          width="318px"
          close-on-click-modal={false}
          onClose={this.onClose}
          close-on-press-escape={false}
          class="tg-dialog-classic workbench-use-seal-dialog tg-dialog-vcenter-new"
        >
          <div class="screen-body">
            {/* <div> */}
            <el-image
              src={imgTokenUrl(this.liveModel?.live_screenshot_url)}
              lazy
              class="screen-img"
            >
              <template slot="error">
                <el-image
                  // class="screen-img"
                  src={this.emptyGoods}
                  style="height: 120px; width: 120px; margin: 210px 0"
                ></el-image>
              </template>
            </el-image>
            {/* </div> */}
            <tg-upload
              action="/api/resources/upload_file"
              data={{ type: 'shop_live_live_screenshot' }}
              beforeUpload={this.beforeUpload}
              success={this.successHandle}
              show-file-list={false}
              class="screen-upload"
            >
              <tg-button icon="ico-btn-upload">上传新图</tg-button>
            </tg-upload>
          </div>
        </el-dialog>
        <tg-mask-loading visible={loading && visible} content="正在保存，请稍候..." />
      </div>
    );
  },
});
