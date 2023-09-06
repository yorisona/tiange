import { defineComponent, ref, computed } from '@vue/composition-api';

export default defineComponent({
  props: {
    /** 图片地址列表 */
    'url-list': Array,
  },
  setup(props, ctx) {
    const list = ref<any[]>([]);
    const index = ref(0);
    /** 展示图片 */
    const show = (urls: string[], start: number) => {
      list.value = urls.map(url => {
        const hasPDF = /\.pdf\?.+$|\.pdf\??$/.test(url);
        return {
          hasPDF,
          url,
        };
      });
      index.value = start;
    };
    /** 当前图片地址 */
    const current = computed(() => {
      if (list.value.length === 0) return {};
      return list.value[index.value];
    });
    /** 上一张按钮事件处理 */
    const prevHandler = () => {
      if (index.value === 0) {
        index.value = list.value.length - 1;
      } else {
        index.value--;
      }
    };
    /** 下一张按钮事件处理 */
    const nextHandler = () => {
      if (index.value === list.value.length - 1) {
        index.value = 0;
      } else {
        index.value++;
      }
    };
    const close = () => {
      ctx.emit('close');
    };
    const stopEvent = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };
    return {
      show,
      list,
      current,
      index,
      nextHandler,
      close,
      stopEvent,
      prevHandler,
    };
  },
  render() {
    let currentShow: any;

    if (this.current.hasPDF) {
      const _url = this.list[this.index].url;
      const _name = _url.split('?')[0].split('/');
      currentShow = (
        <div class="pdf-preview" style="width:150px;height:150px;text-align:center">
          <tg-icon
            name="ico-pdf"
            style="position:relative;z-index:100;cursor:pointer"
            onClick={() => {
              window.open(_url);
            }}
          />
          <span style="color:white">{_name[_name.length - 1]}</span>
        </div>
      );
    } else {
      currentShow = (
        <tg-image
          src={this.current.url}
          onClick={this.stopEvent}
          class="el-image-viewer__img"
          style="transform: scale(1) rotate(0deg); margin-left: 0px; margin-top: 0px; max-height: 83%; max-width: 90%;"
        />
      );
    }
    return (
      <transition>
        <div tabindex="-1" class="el-image-viewer__wrapper" style="z-index: 20000;">
          <span
            class="el-image-viewer__btn el-image-viewer__close"
            style="z-index: 20000;"
            onClick={this.close}
          >
            <i class="el-icon-close" />
          </span>
          {this.list.length > 1 && (
            <div>
              <span
                style="z-index:102;"
                class="el-image-viewer__btn el-image-viewer__prev"
                onclick={this.prevHandler}
              >
                <i class="el-icon-arrow-left" />
              </span>
              <span
                style="z-index:102;"
                class="el-image-viewer__btn el-image-viewer__next"
                onclick={this.nextHandler}
              >
                <i class="el-icon-arrow-right" />
              </span>
            </div>
          )}
          <div
            class="el-image-viewer__canvas"
            style="position:relative;z-index:100;"
            onClick={this.close}
          >
            {currentShow}
            {this.list.length > 1 && (
              <div class="ml-pagination">
                <div>
                  {this.index + 1}/{this.list.length}
                </div>
              </div>
            )}
          </div>
          <div class="el-image-viewer__mask" />
        </div>
      </transition>
    );
  },
});
