import { defineComponent, ref } from '@vue/composition-api';
import invoice from './invoice';
import { getToken } from '@/utils/token';

export default defineComponent({
  setup(props, ctx) {
    const visible = ref(false);
    const title = ref('');
    const formRef = ref(null);
    const list = ref([]);
    const type = ref(1);
    const secondTitle = ref('');
    const emitClose = (value = false) => {
      ctx.emit('close', value);
      visible.value = false;
    };
    const show = (info: any = {}) => {
      title.value = info.title;
      list.value = info.list;
      visible.value = true;
      type.value = info.type;
      secondTitle.value = info.secondTitle;
    };
    return {
      type,
      visible,
      list,
      formRef,
      emitClose,
      show,
      title,
      secondTitle,
    };
  },
  render() {
    const { visible } = this;
    return (
      <el-dialog
        class="customer-dialog"
        width="594px"
        visible={visible}
        title={this.title}
        close-on-click-modal={false}
        onClose={this.emitClose}
      >
        <div class="invoice_list_container">
          {this.type === 0 && (
            <div class="invoice_list">
              {this.list.map((item: any, key) => {
                return (
                  <div class="voucher" key={key}>
                    <div class="header">
                      {this.secondTitle}
                      {key + 1}
                    </div>
                    <div class="content">
                      <div class="invoice">
                        <img
                          src={item.pic_url + '?Authorization=' + getToken()}
                          onClick={() => {
                            invoice.showDetail(item.pic_url + '?Authorization=' + getToken());
                          }}
                        />
                      </div>
                      <div class="info">
                        {item.info &&
                          item.info.map((info: any, key: number) => {
                            return (
                              <fragments key={key}>
                                <div class="label">{info.label}：</div>
                                <div class="text">{info.value}</div>
                              </fragments>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {this.type === 1 && (
            <div class="voucher_list">
              {this.list.map((item, key) => {
                return (
                  <img
                    key={key}
                    src={item}
                    alt=""
                    on-click={() => {
                      invoice.showDetail(item);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </el-dialog>
    );
  },
});
