import { defineComponent, ref, PropType, nextTick } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import lodash from '@/utils/lodash/custom';
import { Message } from 'element-ui';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';
const { debounce } = lodash;

export default defineComponent({
  props: {
    save: {
      type: Function as PropType<(arg: any) => Promise<any>>,
    },
    cancel: {
      type: Function as PropType<(arg: any) => Promise<any>>,
    },
  },
  setup: function (props, ctx) {
    const formRef = ref<ElForm | null>(null);
    const title = ref('');
    const visible = ref(false);
    const currIdx = ref(0);
    const formData = ref<any>({});
    const months = ref<{ label: string; value: string }[]>([]);
    const resetForm = () => {
      formData.value = {};
    };

    const onCloseBtnClick = () => {
      currIdx.value = 0;
      ctx.emit('close');
      ctx.root.$nextTick(resetForm);
      visible.value = false;
    };

    const show = (_title: string, data?: any, current?: number) => {
      title.value = _title;
      formData.value = { images: data || [] };
      visible.value = true;
      nextTick(() => {
        new Swiper('.swiper-container', {
          loop: false,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            disabledClass: 'my-button-disabled',
          },
          on: {
            slideChangeTransitionEnd: function (el: any) {
              currIdx.value = el.realIndex;
            },
          },
        });
        if (current === undefined) return;
        const swp: any = ctx.refs.mySwiper;
        swp.swiper.slideTo(current, 0, false);
        currIdx.value = current;
      });
    };

    const prev = () => {
      const swp: any = ctx.refs.mySwiper;
      swp.swiper.slidePrev();
    };
    const next = () => {
      const swp: any = ctx.refs.mySwiper;
      swp.swiper.slideNext();
    };

    /** 点击保存 */
    const submit = () => {
      const save: any = props.save;
      save(formData.value)
        .then(() => {
          visible.value = false;
        })
        .catch((ex: any) => {
          Message.error(ex.message);
        });
    };
    /** 点击取消 */
    const onCancel = () => {
      const save: any = props.cancel;
      save(formData.value)
        .then(() => {
          visible.value = false;
        })
        .catch((ex: any) => {
          Message.error(ex.message);
        });
    };

    /** 保存 */
    const onSaveBtnClick = debounce(submit, 200);

    return {
      show,
      title,
      visible,
      formData,
      months,
      onCloseBtnClick,
      onCancel,
      onSaveBtnClick,
      formRef,
      currIdx,
      prev,
      next,
    };
  },
  render() {
    return (
      <el-dialog
        class="tg-dialog-classic"
        width="700px"
        visible={this.visible}
        append-to-body={true}
        close-on-click-modal={false}
        close-on-press-escape={false}
        wrapperClosable={false}
        onClose={this.onCloseBtnClick}
      >
        <fragments slot="title">{this.title}</fragments>
        <div class="dialog-content">
          <div class="swiper-container" ref="mySwiper">
            <div class="swiper-wrapper">
              {this.formData.images?.map((item: string, key: number) => {
                return (
                  <div class="swiper-slide" key={key}>
                    <tg-image class="img" src={item} />
                  </div>
                );
              })}
            </div>
            <div
              class={
                this.currIdx === 0 ? 'swiper-button-prev my-button-disabled' : 'swiper-button-prev'
              }
              onclick={this.prev}
            />
            <div
              class={
                this.currIdx === this.formData.images?.length - 1
                  ? 'swiper-button-next my-button-disabled'
                  : 'swiper-button-next'
              }
              onclick={this.next}
            />
          </div>
          <div class="pagenation">
            <span>
              {this.currIdx + 1} / {this.formData.images?.length}
            </span>
          </div>
        </div>
      </el-dialog>
    );
  },
});
